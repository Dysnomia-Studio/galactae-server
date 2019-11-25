module.exports = class Research extends require('./_shared/Research')._Research {
	static refreshUserResearch(data,callback) {
		Research.recalc(data, data.research, function(user) {
			user.lastAction = Date.now();
			user.lastResearchUpdate = Date.now();
			callback(user);
		});
	}

	static addChilds(user) {
		for(const researchName in researchList) {
			if(!isset(user.research[researchName], 'number') &&
				Research.researchedParent(user, { Buildings: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}, researchName, true)) {

				user.research[researchName] = 0;
			}
		}

		return user.research;
	}

	static recalc(user,researchData,callback,i=0) {
		const time = (Date.now() - user.lastResearchUpdate)/TIME.HOUR_TO_MS;

		db.planet.find(user.planetlist[i],function(planetData) {
			if(isset(planetData.currResearch, 'string') && planetData.currResearch !== 'researchCenter' && isset(researchList[planetData.currResearch].cost, 'number') && researchData[planetData.currResearch] !== -1) {
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

				user.research = Research.addChilds(user);

				callback(user);
			}
		});
	}

	static ChangePlanetResearch(data, researchName) {
		if(!isset(researchList[researchName], 'object')) { return; }

		Planet.find(data,data.pid,0,function(planetReturned,userReturned,fleetReturned) {
			if(!isset(planetReturned, 'object') || !isset(userReturned, 'object')) { return; }

			Research.refreshUserResearch(userReturned, function(userNewResearch) {
				db.player.update(userNewResearch);

				// Check if you have parent research
				const researchedParent = Research.researchedParent(userNewResearch, planetReturned, researchName);

				const newData = Planet.update(planetReturned,userReturned,fleetReturned);

				if(researchedParent) { // Just check if it exists ...
					newData.currResearch = researchName;
				} else {
					log(data.username + ' wants to change research on ' + data.pid + ' to ' + data.research + ' but doesn\'t have all needed parents.','warn');
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