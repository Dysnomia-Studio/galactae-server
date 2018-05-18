module.exports = class research {
	static refreshUserResearch(data,callback) {	
		// Checks if new research
		if(researchList.length!=data.research.length) {
			for(let name in researchList) {
				let key = -1;
				for(let j=0; j<data.research.length; j++) {
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

		let researchOut = {};

		for(let i=0; i<data.research.length; i++) {
			researchOut[data.research[i][0]] = data.research[i][1];
		}

		research.recalc(data,researchOut,function(user) {
			user.lastAction = Date.now();
			user.lastResearchUpdate = Date.now();
			callback(user);
		});
	}
	static getResearch(data,research) {
		for(let i=0; i<data.research.length; i++) {
			if(data.research[i][0]==research) {
				return data.research[i][1];
			}
		}
		return 0;
	}

	static getResearchProduction(lvl) {
		return Math.round(researchProduction[0]*Math.pow(lvl,2) + researchProduction[1]*lvl + researchProduction[2]);
	}

	static recalc(user,researchData,callback,i=0) {
		let time = (Date.now() - user.lastResearchUpdate)/3600/1000;

		db.planet.find(user.planetlist[i],function(planetReturned) {
			let newPlanet = planetReturned.toJSON();

			if(isset(researchData[planetReturned.currResearch]) && isset(researchList[planetReturned.currResearch].cost) && researchData[planetReturned.currResearch] != -1) {
				researchData[planetReturned.currResearch] += (research.getResearchProduction(planetReturned.Buildings[8])*time);

				if(researchData[planetReturned.currResearch] >= researchList[planetReturned.currResearch].cost) {
					researchData[planetReturned.currResearch] = -1;
					db.planet.update(newPlanet);
					log(user.name + " has unlocked research " + planetReturned.currResearch,"success");
				}
			}

			// Next planet
			if(i+1<user.planetlist.length) {
				research.recalc(user,researchData,callback,i+1);
			} else {
				user.research = [];

				for(let index in researchData) {
					user.research.push([index,researchData[index]]);
				}

				callback(user);	
			}
		});
	}

	static ChangePlanetResearch(data,pid,researchData) {
		if(!isset(researchList[researchData])) { return; }
		planet.find(data,data.pid,0,function(planetReturned,userReturned,fleetReturned) {
			if(!isset(planetReturned) || !isset(userReturned)) { return; }

			research.refreshUserResearch(userReturned, function(userNewResearch) {
				db.player.update(userNewResearch);

				// Check if you have parent research
				let researchedParent = true;
				for(let i in researchList[researchData].parents) {
					if((!isset(researchList[researchData].parents[i]) ||
						research.getResearch(userNewResearch,researchList[researchData].parents[i])!=-1) &&
						researchList[researchData].parents[i] != "researchCenter") {
						researchedParent = false;
						break;
					}
				}

				let newData = planet.update(planetReturned,userReturned,fleetReturned);
				
				if(researchedParent && researchList[researchData] != undefined) { // Just check if it exists ...
					newData.currResearch = researchData;
				}

				if(!researchedParent) {
					websocket.SendMessageToClient({ sid: data.sid, message: "MISSING_PARENTS"});
				}

				db.planet.update(newData);

				planet.sendPlanetDataToUser({data: newData, id: data.id, sid: data.sid });

				research.sendResearchDataToUser(data, userNewResearch.research);
			});
		});
	}

	static sync(data) {
		db.player.searchByName(data.username,function(userReturned) {
			research.refreshUserResearch(userReturned, function(userNewResearch) {
				db.player.update(userNewResearch);

				research.sendResearchDataToUser(data, userNewResearch.research);
			});
		});
	}

	static sendResearchDataToUser(data, userResearch) {
		// Send data to client
		var researchOut = {};

		for(let i=0; i<userResearch.length; i++) {
			// Check if you have parent research
			let researchedParent = false;
			let parentsList = researchList[userResearch[i][0]].parents;
			for(let j in parentsList) {
				if(parentsList[j] == "researchCenter" || research.getResearch({research: userResearch},parentsList[j]) ==-1) {
					researchedParent = true;
					break;
				}	
			}

			if(parentsList.length == 0 || researchedParent) {
				researchOut[userResearch[i][0]] = userResearch[i][1];
			}
		}

		io.to(data.sid).emit('player-recieve-data', {
			research: researchOut
		});
	}
}