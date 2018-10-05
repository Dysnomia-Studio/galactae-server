module.exports = class Player {
	/* Is Valid ? */
	static isValid(user,callback) {
		db.player.searchBySid(user.sid,function(searchSid) {
			if(isset(searchSid) && searchSid.name==user.username && searchSid.id == user.id) {
				if(Player.canAct(searchSid)) { // Don't spam
					callback(user);

					let newData = searchSid;
					newData.lastAction = Date.now();
					db.player.update(newData);	
				}
			} else {
				// Kick that Hacker ...
				io.to(user.sid).emit('server-kick',"INVALID_SESSION");
			}
		});	
	}
	/* Does the player can act ? */
	static canAct(user) {
		let minTime = 100; //time in ms

		return ((Date.now()-user.lastAction)>minTime);
	}
	/* Get player ally */
	static getAlly(data,callback) {
		db.player.searchById(data.id,function(obj) {
			if(!isset(obj)) { log("Error: " + data.username + " not found."); return; }
			data.ally = obj.ally;
			callback(data);
		});
	}
	/* Connect Player */
	static connect(data) {
		db.userGameId.find(data.id, function(userGameIdObj) {
			/*if(!isset(userGameIdObj) || !isset(userGameIdObj[0]) || !isset(userGameIdObj).user_id) {
				// Kick that Hacker ...
				io.to(data.sid).emit('server-kick',"INVALID_SESSION");
				return;
			}*/

			data.game_id = userGameIdObj[0].game_id;
			data.user_id = userGameIdObj[0].user_id;
			
			db.ban.find(data.game_id, 2, function(banObj) {
				if(isset(banObj)) {
					let now = Date.now();
					for(let i=0; banObj.length; banObj++) {
						if(banObj[i].ban_end > now) {
							log("Error: " + data.username + " is banned.");
							// @ADD: Kick & Message
							return;
						}
					}
				}

				if(maintenance) { // Check whitelist
					db.privilege.find(data.user_id, function(userPrivileges) {
						if(!isset(userPrivileges) || !isset(userPrivileges[0]) || 
							!isset(userPrivileges[0].user_whitelist) || userPrivileges[0].user_whitelist != 1) {
							
							log("Error: " + data.username + " isn't whitelisted.");
							// @ADD: Kick & Message
							return;
						}

						db.player.searchByName(data.username,function(dataReturned) {
							Player.traitementsConnexion(data, dataReturned);
						});
					}); // Privileges db query
				} else { // Normal behavior
					db.player.searchByName(data.username,function(dataReturned) {
						Player.traitementsConnexion(data, dataReturned);
					});
				}

			}); // Ban db query
		}); // Gamedata db query
	}

	static traitementsConnexion(data, dataReturned) {
		if(data.id!=dataReturned.id) {
			// Kick that Hacker ...
			io.to(data.sid).emit('server-kick',"INVALID_SESSION");
			return;
		}

		// Kick double accounts
		let oldSid = dataReturned.sid;
		if(oldSid != "-1") {
			io.to(oldSid).emit('server-kick','DOUBLE_ACCOUNTS_CONNECTED');
			log(dataReturned.name +' ('+ dataReturned.sid +') was kicked because of double sessions.');
		}

		let playerData = dataReturned.toJSON();
		playerData.sid = data.sid;
		
		let jour = 24*60*60*1000;
		let minuit = Date.now() - (Date.now()%jour);
		let hierMinuit = minuit - jour;
		let dayStreak = 0 + playerData.dayBonusStreak +1; 
		let bonusBest = 0 + playerData.dayBonusBest;

		if(data.lastBonus < hierMinuit) { dayStreak = 1; } // Pas pris le bonus hier ?

		if(dayStreak > bonusBest) { bonusBest = dayStreak; }

		if(playerData.lastBonus < minuit) { 
			io.to(data.sid).emit('day-bonus',{days: dayStreak, best: bonusBest}); 
		}

		playerData.lastConnected = Date.now();		

		// Tutorials
		if(!isset(playerData.currTutorial)) {
			playerData.currTutorial = 0;
		}
		if(!Tutorials.hasFinishedTutorials(playerData)) {
			// @ADD: Do stuff
		}

		io.to(data.sid).emit('player-recieve-data',{
			money: playerData.money,
			gvt: playerData.gvt,
			currTutorial: playerData.currTutorial,
		});

		Units.refresh(data);
		Player.refreshPoints(playerData, function(userNewPoints) {
			Research.refreshUserResearch(userNewPoints, function(userNewResearch) {
				userNewResearch.id = userNewResearch._id;
					db.player.update(userNewResearch, function() {
					plCount++;

					Research.sendResearchDataToUser(data, userNewResearch.research);

					Planet.refresh(data,0); // THIS HAVE TO BE AFTER RESEARCHS
				});
			});
		});
	}

	/* Disconnect Player */
	static disconnect(data) {
		if(!isset(data.sid)) { return; }
		db.player.searchBySid(data.sid,function(dataReturned) {
			if(!isset(dataReturned)) { return; }
			dataReturned.sid = "-1";
			db.player.update(dataReturned);
			plCount--;
		});
	}
	static calcTotalPlanetPoints(user,callback,i,points,sector) {
		if(i==0) {
			sector = {
				"points": {},
				"pcount": {},
			};
		}

		db.planet.find(user.planetlist[i],function(planetReturned) {
			points += planetReturned.points;
			
			i++;

			let sectorAddress = planetReturned.address.split("-");
			sectorAddress = [sectorAddress[0],sectorAddress[1]].join("-");
			if(sector.points[sectorAddress] === undefined) {
				sector.points[sectorAddress] = 0;
			}
			if(sector.pcount[sectorAddress] === undefined) {
				sector.pcount[sectorAddress] = 0;
			}
			sector.points[sectorAddress] += planetReturned.points;
			sector.pcount[sectorAddress]++;
			
			if(i<user.planetlist.length) {
				Player.calcTotalPlanetPoints(user,callback,i,points,sector);
			} else { 
				points *= pointsCoef.planet;

				let newSector = {
					address: [],
					points: [],
					pcount: [],
				};
				for(let j in sector.points) {
					newSector.address.push(j);
					newSector.points.push(sector.points[j] * pointsCoef.planet);
					newSector.pcount.push(sector.pcount[j]);
				}

				user.points = points;
				user.sectorPointsAddresses  = newSector.address;
				user.sectorPointsValue = newSector.points;
				user.sectorPointsPcount = newSector.pcount;
				callback(user);	
			}
		});		
	}
	static calcResearchPoints(user) {
		let points = 0;

		for(let i=0; i<user.research.length; i++) {
			if(user.research[i][1]==-1 && isset(researchList[user.research[i][0]].cost)) {
				points+=researchList[user.research[i][0]].cost;
			}	
		}

		points*=pointsCoef.research;

		return points;
	}
	static refreshPoints(user,callback) {
		Player.calcTotalPlanetPoints(user,function(newUserData) {
			// Recherches
			newUserData.points += Player.calcResearchPoints(newUserData);

			// Money
			if(newUserData.money === undefined || Number.isNaN(newUserData.money)) { newUserData.money = 0; }
			newUserData.points += (newUserData.money*pointsCoef.money);

			newUserData.points = Math.round(newUserData.points);

			// MaJ des BDD Globales
			db.globalRank.reSortRanks(user._id, newUserData.points, newUserData.planetlist.length, newUserData.name);

			for(let sector = 0; sector<newUserData.sectorPointsAddresses.length; sector++) {
				db.sectorRank.reSortRanks(
					user._id,
					newUserData.sectorPointsAddresses[sector],
					newUserData.sectorPointsValue[sector],
					newUserData.sectorPointsPcount[sector],
					newUserData.name
				);
			}

			callback(newUserData);
		},0,0);	
	}
	/* dayBonus */
	static dayBonus(data,userData,choice) {
		let jour = 24*60*60*1000;
		let minuit = Date.now() - (Date.now()%jour);
		let hierMinuit = minuit - jour;

		if(data.lastBonus < minuit) {
			// Update player
			let newPlayerData = data;
			newPlayerData.dayBonusStreak = data.dayBonusStreak+1;

			if(data.lastBonus < hierMinuit) { // Si pas hier
				newPlayerData.dayBonusStreak = 1;
			}

			// Best score :p
			if(newPlayerData.dayBonusStreak > newPlayerData.dayBonusBest) {
				newPlayerData.dayBonusBest = newPlayerData.dayBonusStreak;
			}

			let credits;
			let helium = 0;
			let streak = newPlayerData.dayBonusStreak%30; // Bonus is periodic

			if(streak==1) { credits = 15; }
			else if(streak==2) { credits = 25; }
			else if(streak==3) { credits = 50; }
			else if(streak==4) { credits = 80; }
			else if(streak<10) { credits = 100; }
			else if(streak<20) { 
				credits = 10*(streak + 1); // 110 to 200
				helium = 1750 * streak; // 15000 is about 45 min of ion propulsion for 1 vessel - 15000 to 33250
			} else if(streak<30) { 
				credits = 15*streak; // 300 to 435
				helium = 2000 * streak; // 40000 to 58000
			} else { 
				credits = 1000;
			} // @ADD: generate random special bonus

			if(choice==2 && helium!=0) {
				Planet.find(userData,userData.pid,0,function(planetReturned) {
					if(userData.pid!=planetReturned.id) { // Stop if not belonging
						Websocket.SendMessageToClient({ sid: userData.sid, message: "ERROR_NOT_BELONGING" });
						log(userData.username+' failed to get bonus on planet ' + planetReturned.name + ' ('+userData.pid+') because he doesn\'t own it !',"fail");
						return;
					}

					let newPlanetData = Planet.update(planetReturned);

					newPlanetData.resources[1]+=helium;

					db.planet.update(newPlanetData);

					log(userData.username + " takes its Daily Bonus ! " + helium + "t of helium 3");

					newPlayerData.lastBonus = Date.now();

					db.player.update(newPlayerData);

					Planet.sendPlanetDataToUser({data: newPlanetData, planet: userData.pid, id: userData.id, sid: userData.sid });
				}); 
			} else {
				newPlayerData.money += credits;
				log(userData.username + " takes its Daily Bonus ! " + credits + " credits");

				newPlayerData.lastBonus = Date.now();

				db.player.update(newPlayerData);
				io.to(userData.sid).emit('player-recieve-data',{
					money: newPlayerData.money
				});
			}
		}
	}
};