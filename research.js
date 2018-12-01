module.exports = class Research {
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

		Research.recalc(data,researchOut,function(user) {
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

	static researchedParent(user, planet, researchName, allowBuildings=false) {
		if(researchList[researchName] === undefined) { return; }

		for(let i in researchList[researchName].parents) {
			let currentParent = researchList[researchName].parents[i];

			if(typeof currentParent === 'string') {
				if((!isset(currentParent) ||
					Research.getResearch(user,currentParent)!=-1) &&
					currentParent != "researchCenter") { // Recherche

					return false;
				}
			} else if(
				typeof currentParent === 'object' &&
				typeof currentParent[0] === 'number') { // Batiment

				if(!allowBuildings && planet.Buildings[currentParent[0]] < currentParent[1]) {
					return false;
				}
			} else if(
				typeof currentParent === 'object' &&
				typeof currentParent[0] === 'string') { // Planete

				if(!allowBuildings && currentParent[0] === 'planet' && user.planetlist.length < currentParent[1]) {
					return false;
				}
			}
		}

		return true;
	}

	static recalc(user,researchData,callback,i=0) {
		let time = (Date.now() - user.lastResearchUpdate)/3600/1000;

		db.planet.find(user.planetlist[i],function(planetReturned) {
			let newPlanet = planetReturned.toJSON();

			if(isset(researchData[planetReturned.currResearch]) && isset(researchList[planetReturned.currResearch].cost) && researchData[planetReturned.currResearch] != -1) {
				researchData[planetReturned.currResearch] += (Research.getResearchProduction(planetReturned.Buildings[8])*time);

				if(researchData[planetReturned.currResearch] >= researchList[planetReturned.currResearch].cost) {
					researchData[planetReturned.currResearch] = -1;
					db.planet.update(newPlanet);
					log(user.name + " has unlocked research " + planetReturned.currResearch,"success");
					Websocket.sendNotification(user.sid, 'research', { research: planetReturned.currResearch });
				}
			}

			// Next planet
			if(i+1<user.planetlist.length) {
				Research.recalc(user,researchData,callback,i+1);
			} else {
				user.research = [];

				for(let index in researchData) {
					user.research.push([index,researchData[index]]);
				}

				callback(user);	
			}
		});
	}

	static ChangePlanetResearch(data, researchName) {
		if(!isset(researchList[researchName])) { return; }

		Planet.find(data,data.pid,0,function(planetReturned,userReturned,fleetReturned) {
			if(!isset(planetReturned) || !isset(userReturned)) { return; }

			Research.refreshUserResearch(userReturned, function(userNewResearch) {
				db.player.update(userNewResearch);

				// Check if you have parent research
				let researchedParent = Research.researchedParent(userNewResearch, planetReturned, researchName);

				let newData = Planet.update(planetReturned,userReturned,fleetReturned);
				
				if(researchedParent && researchList[researchName] != undefined) { // Just check if it exists ...
					newData.currResearch = researchName;
				}

				if(!researchedParent) {
					log(data.username + " wants to change research on " + data.pid + " to " + data.research + " but don't have all needed parents.","error");
					Websocket.SendMessageToClient({ sid: data.sid, message: "MISSING_PARENTS"});
				}

				db.planet.update(newData);

				Planet.sendPlanetDataToUser({data: newData, id: data.id, sid: data.sid });

				Research.sendResearchDataToUser(data, planetReturned, userNewResearch);
			});
		}); 
	}

	static sync(data) {
		console.info(data); // pid
		db.player.searchByName(data.username,function(userReturned) {
			Research.refreshUserResearch(userReturned, function(userNewResearch) {
				db.planet.find(data.pid, function(planetReturned) {
					db.player.update(userNewResearch);

					Research.sendResearchDataToUser(data, planetReturned, userNewResearch);
				});
			});
		});
	}

	static sendResearchDataToUser(data, planet, user) {
		// Send data to client
		let researched = [];
		let userResearch = user.research;

		for(let i=0; i<userResearch.length; i++) {
			// Check if you have parent research
			let researchedParent = Research.researchedParent(user, planet, userResearch[i][0], true);
			let parentsList = researchList[userResearch[i][0]].parents;

			if(userResearch[i][0] === "researchCenter" || researchedParent) {
				for(let j in parentsList) {
					if(researched.indexOf(parentsList[j]) === -1) {
						researched.push(parentsList[j]);
					}
				}

				if(researched.indexOf(userResearch[i][0]) === -1) {
					researched.push(userResearch[i][0]);
				}
			}
		}

		let researchOut = {};
		for(let i=0; i<userResearch.length; i++) {
			if(researched.indexOf(userResearch[i][0]) !== -1) {
				researchOut[userResearch[i][0]] = userResearch[i][1];
			}
		}

		io.to(data.sid).emit('player-recieve-data', {
			research: researchOut
		});
	}
};