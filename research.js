module.exports = class Research {
	static refreshUserResearch(data,callback) {
		Research.recalc(data,data.research,function(user) {
			user.lastAction = Date.now();
			user.lastResearchUpdate = Date.now();
			callback(user);
		});
	}

	static isSearched(data,researchName) {
		return data.research[researchName] < 0;
	}

	static getResearchProduction(lvl) {
		return Math.round(researchProduction[0]*Math.pow(lvl,2) + researchProduction[1]*lvl + researchProduction[2]);
	}

	static researchedParent(user, planet, researchName, atleastOne=false) {
		if(researchList[researchName] === undefined) { return; }

		let count = 0;

		for(let i in researchList[researchName].parents) {
			let currentParent = researchList[researchName].parents[i];

			if(typeof currentParent === 'string') {
				if((!isset(currentParent) ||
					!Research.isSearched(user,currentParent)) &&
					currentParent !== 'researchCenter') { // Recherche

					if(!atleastOne) {
						return false;
					}
				} else {
					count++;
				}
			} else if(
				typeof currentParent === 'object' &&
				typeof currentParent[0] === 'number') { // Batiment

				if(!atleastOne && planet.Buildings[currentParent[0]] < currentParent[1]) {
					return false;
				}
			} else if(
				typeof currentParent === 'object' &&
				typeof currentParent[0] === 'string') { // Planete

				if(!atleastOne && currentParent[0] === 'planet' && user.planetlist.length < currentParent[1]) {
					return false;
				}
			}
		}

		if(count === 0 && researchList[researchName].parents.length > 0) {
			return false;
		}

		return true;
	}

	static recalc(user,researchData,callback,i=0) {
		let time = (Date.now() - user.lastResearchUpdate)/3600/1000;

		db.planet.find(user.planetlist[i],function(planetData) {
			if(isset(researchData[planetData.currResearch]) && isset(researchList[planetData.currResearch].cost) && researchData[planetData.currResearch] !== -1) {
				researchData[planetData.currResearch] += (Research.getResearchProduction(planetData.Buildings[8])*time);

				if(researchData[planetData.currResearch] >= researchList[planetData.currResearch].cost) {
					researchData[planetData.currResearch] = -1;
					db.planet.update(planetData);
					log(user.name + ' has unlocked research ' + planetData.currResearch,'success');
					Websocket.sendNotification(user.sid, 'research', { research: planetData.currResearch });
				}
			}

			// Next planet
			if(i+1<user.planetlist.length) {
				Research.recalc(user,researchData,callback,i+1);
			} else {
				user.research = researchData;

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

				if(researchedParent && researchList[researchName] !== undefined) { // Just check if it exists ...
					newData.currResearch = researchName;
				}

				if(!researchedParent) {
					log(data.username + ' wants to change research on ' + data.pid + ' to ' + data.research + ' but doesn\'t have all needed parents.','error');
					Websocket.SendMessageToClient({ sid: data.sid, message: 'MISSING_PARENTS'});
				}

				db.planet.update(newData);

				Planet.sendPlanetDataToUser({data: newData, id: data.id, sid: data.sid });

				Research.sendResearchDataToUser(data, planetReturned, userNewResearch);
			});
		});
	}

	static sync(data) {
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
		io.to(data.sid).emit('player-recieve-data', {
			research: user.research,
		});
	}
};