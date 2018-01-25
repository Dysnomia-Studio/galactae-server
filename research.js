module.exports = class research {
	static refreshUserResearch(data,callback) {	
		// Checks if new research
		if(researchList.length!=data.research.length) {
			for(var name in researchList) {
				var key = -1;
				for(var j=0; j<data.research.length; j++) {
					if(name==data.research[j][0]) {
						key = j;
						break;
					}
				}
				if(key == -1) {
					data.research.push([name,0]);
				}
			}
		}

		var researchOut = {};

		for(var i=0; i<data.research.length; i++) {
			researchOut[data.research[i][0]] = data.research[i][1];
		}

		research.recalc(data,researchOut,function(user) {
			user.lastAction = Date.now();
			user.lastResearchUpdate = Date.now();
			callback(user);
		});
	}
	static getResearch(data,research) {
		for(var i=0; i<data.research.length; i++) {
			if(data.research[i][0]==research) {
				return data.research[i][1];
			}
		}
		return 0;
	}

	static getResearchProduction(lvl) {
		return Math.round(researchProduction[0]*Math.pow(lvl,2) + researchProduction[1]*lvl + researchProduction[2]);
	}

	static recalc(user,research,callback,i=0) {
		var time = (Date.now() - user.lastResearchUpdate)/3600/1000;

		db.planet.find(user.planetlist[i],function(planetReturned) {
			if(isset(research[planetReturned.currResearch]) && isset(researchList[planetReturned.currResearch].cost) && research[planetReturned.currResearch] != -1) {
				research[planetReturned.currResearch] += (getResearchProduction(planetReturned.Buildings[8])*time);

				if(research[planetReturned.currResearch] >= researchList[planetReturned.currResearch].cost) {
					research[planetReturned.currResearch] = -1;
					log(user.name + " has unlocked research " + planetReturned.currResearch,"success");
				}
			}

			// Next planet
			if(i+1<user.planetlist.length) {
				researchRecalc(user,research,callback,i+1);
			} else {
				user.research = [];

				for(var index in research) {
					user.research.push([index,research[index],]);
				}

				callback(user);	
			}
		});
	}

	static ChangePlanetResearch(data,pid,research) {
		if(!isset(researchList[research])) { return; }
		planet.find(data,data.pid,0,function(planetReturned,userReturned) {
			if(!isset(planetReturned) || !isset(userReturned)) { return; }
			refreshUserResearch(userReturned, function(userNewResearch) {
				db.player.update(userNewResearch);

				// Check if you have parent research
				var researchedParent = true;
				for(var i in researchList[research].parents) {
					if((!isset(researchList[research].parents[i]) ||
						getResearch(userNewResearch,researchList[research].parents[i])!=-1) &&
						researchList[research].parents[i] != "researchCenter") {
						researchedParent = false;
						break;
					}
				}
				
				// Send data to client
				var researchOut = {};

				for(var i=0; i<userNewResearch.research.length; i++) {
					researchOut[userNewResearch.research[i][0]] = userNewResearch.research[i][1];
				}

				var newData = UpdatePlanet(planetReturned,userReturned);
				
				if(researchedParent && researchList[research] != undefined) { // Just check if it exists ...
					newData.currResearch = research;
				}

				if(!researchedParent) {
					SendMessageToClient({ sid: data.sid, message: "MISSING_PARENTS"});
				}

				db.planet.update(newData);

				sendPlanetDataToUser({data: newData, id: data.id, sid: data.sid });

				io.to(data.sid).emit('player-recieve-data',{
					research: researchOut,
				});
			});
		});
	}

	static ResearchSync(data) {
		db.player.searchByName(data.username,function(dataReturned) {
			refreshUserResearch(dataReturned, function(userNewResearch) {
				db.player.update(userNewResearch);

				// Send data to client
				var researchOut = {};

				for(var i=0; i<userNewResearch.research.length; i++) {
					researchOut[userNewResearch.research[i][0]] = userNewResearch.research[i][1];
				}

				io.to(data.sid).emit('player-recieve-data',{
					research: researchOut
				});
			});
		});
	}
}