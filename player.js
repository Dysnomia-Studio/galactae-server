module.exports = class Player {
	/* Is Valid ? */
	static isValid(user,callback) {
		db.player.searchBySid(user.sid, (playerData) => {
			if(isset(playerData, 'object') && playerData.name === user.username && playerData.id === user.id) {
				if(Player.canAct(playerData)) { // Don't spam
					callback(user);

					playerData.lastAction = Date.now();
					db.player.update(playerData);
				}
			} else {
				// Kick that Hacker ...
				io.to(user.sid).emit('server-kick','INVALID_SESSION');
			}
		});
	}
	/* Does the player can act ? */
	static canAct(user) {
		const minTime = 100; //time in ms

		return ((Date.now()-user.lastAction)>minTime);
	}
	/* Get player ally */
	static getAlly(data,callback) {
		db.player.searchById(data.id,function(obj) {
			if(!isset(obj, 'object')) {
				log('Error: ' + data.username + ' not found.');
				return;
			}

			data.ally = obj.ally;
			callback(data);
		});
	}
	/* Connect Player */
	static connect(data) {
		db.userGameId.find(data.id, function(userGameIdObj) {
			if(!isset(userGameIdObj, 'object') || !isset(userGameIdObj.game_id, 'string') || !isset(userGameIdObj.user_id, 'string')) {
				log('Error: Invalid user');
				// Kick that Hacker ...
				io.to(data.sid).emit('server-kick','INVALID_SESSION');
				return;
			}

			data.game_id = userGameIdObj.game_id;
			data.user_id = userGameIdObj.user_id;

			db.ban.find(data.game_id, 2, function(banObj) {
				if(isset(banObj, 'object')) {
					const now = Date.now();
					for(let i=0; i<banObj.length; i++) {
						if(banObj[i].ban_end > now) {
							log('Error: ' + data.username + ' is banned.');
							io.to(data.sid).emit('server-kick','ERR_BANNED');
							return;
						}
					}
				}

				if(maintenance) { // Check whitelist
					db.privilege.find(data.user_id, function(userPrivileges) {
						if(!isset(userPrivileges, 'array') || !isset(userPrivileges[0], 'object') ||
							!isset(userPrivileges[0].user_whitelist) || userPrivileges[0].user_whitelist !== true) {

							log('Error: ' + data.username + ' isn\'t whitelisted.');
							io.to(data.sid).emit('server-kick','ERR_WHITELIST');
							return;
						}

						db.player.searchByName(data.username,function(dataReturned) {
							if(!isset(dataReturned, 'object')) {
								console.error('User: ' + data.username + ' not found !');
								return;
							}

							Player.traitementsConnexion(data, dataReturned);
						});
					}); // Privileges db query
				} else { // Normal behavior
					db.player.searchByName(data.username,function(dataReturned) {
						if(!isset(dataReturned, 'object')) {
							console.error('User: ' + data.username + ' not found !');
							return;
						}

						Player.traitementsConnexion(data, dataReturned);
					});
				}

			}); // Ban db query
		}); // Gamedata db query
	}

	static async traitementsConnexion(data, playerData) {
		if(data.id !== playerData.id) {
			// Kick that Hacker ...
			io.to(data.sid).emit('server-kick','INVALID_SESSION');
			return;
		}

		// Kick double accounts
		const oldSid = playerData.sid;
		if(oldSid !== '-1') {
			io.to(oldSid).emit('server-kick','DOUBLE_ACCOUNTS_CONNECTED');
			//log(playerData.name +' ('+ playerData.sid +') was kicked because of double sessions.');
		}

		playerData.sid = data.sid;

		const jour = TIME.DAY_TO_MS;
		const minuit = Date.now() - (Date.now()%jour);
		const hierMinuit = minuit - jour;
		let dayStreak = 0 + playerData.dayBonusStreak + 1;
		let bonusBest = 0 + playerData.dayBonusBest;

		if(playerData.lastBonus < hierMinuit) { // Pas pris le bonus hier ?
			dayStreak = 1;
		}

		if(dayStreak > bonusBest) {
			bonusBest = dayStreak;
		}

		if(playerData.lastBonus < minuit) {
			io.to(data.sid).emit('day-bonus',{days: dayStreak, best: bonusBest});
		}

		playerData.lastConnected = Date.now();

		io.to(data.sid).emit('player-recieve-data',{
			planetlist: playerData.planetlist,
			money: playerData.money,
			gvt: playerData.gvt,
			tutorials: playerData.tutorials,
		});

		Units.refresh(data);
		Combat.getAttacksAgainstPlayer(data.id, data.sid);
		Tactics.refresh(data.id, data.sid);
		Player.refreshPoints(playerData, function(userNewPoints) {
			Research.refreshUserResearch(userNewPoints, function(userNewResearch) {
				db.player.update(userNewResearch, function() {
					if(data.pid === '' || userNewResearch.planetlist.indexOf(data.pid) === -1) {
						data.pid = userNewResearch.planetlist[0];
					}

					Reports.refresh(playerData.id, data.sid);

					db.planet.find(data.pid, function(planetReturned) {
						Research.sendResearchDataToUser(data, planetReturned, userNewResearch);

						Planet.refresh(data, 0); // THIS HAVE TO BE AFTER RESEARCHS
					});
				});
			});
		});
	}

	/* Disconnect Player */
	static disconnect(data) {
		if(!isset(data.sid, 'string')) {
			return;
		}

		db.player.searchBySid(data.sid,function(dataReturned) {
			if(!isset(dataReturned, 'string')) {
				return;
			}

			dataReturned.sid = '-1';
			db.player.update(dataReturned);
		});
	}
	static calcTotalPlanetPoints(user,callback,i,points,sector) {
		if(i===0) {
			sector = {
				'points': {},
				'pcount': {},
			};
		}

		db.planet.find(user.planetlist[i],function(planetReturned) {
			points += planetReturned.points;

			i++;

			const sectorAddress = GameMap.getSectorFromAdress(planetReturned.address);

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

				const newSector = {
					address: [],
					points: [],
					pcount: [],
				};
				for(const j in sector.points) {
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

		for(const research in user.research) {
			if(user.research[research] === -1 && isset(researchList[research].cost, 'number')) {
				points += researchList[research].cost;
			}
		}

		points *= pointsCoef.research;

		return points;
	}
	static refreshPoints(user,callback) {
		Player.calcTotalPlanetPoints(user,function(newUserData) {
			// Recherches
			newUserData.points += Player.calcResearchPoints(newUserData);

			// Money
			if(newUserData.money === undefined || Number.isNaN(newUserData.money)) {
				newUserData.money = 0;
			}

			newUserData.points += (newUserData.money*pointsCoef.money);

			newUserData.points = Math.round(newUserData.points);

			// MaJ des BDD Globales
			db.globalRank.update(user.id, newUserData.points, newUserData.planetlist.length, newUserData.name);

			for(let sector = 0; sector<newUserData.sectorPointsAddresses.length; sector++) {
				db.sectorRank.update(
					user.id,
					newUserData.sectorPointsAddresses[sector],
					newUserData.sectorPointsValue[sector],
					newUserData.sectorPointsPcount[sector],
					newUserData.name
				);
			}

			callback(newUserData);
		},0,0);
	}

	static getDayBonus(userData, choice) {
		const jour = 24*60*60*1000;
		const minuit = Date.now() - (Date.now()%jour);
		const hierMinuit = minuit - jour;

		const bonus = {
			credits: 0,
			helium: 0,
			newPlayerData: {},
		};

		if(userData.lastBonus < minuit) {
			// Update player
			bonus.newPlayerData.id = userData.id;
			bonus.newPlayerData.dayBonusStreak = userData.dayBonusStreak+1;
			bonus.newPlayerData.dayBonusBest = userData.dayBonusBest;
			bonus.newPlayerData.lastBonus = Date.now();

			if(userData.lastBonus < hierMinuit) { // Si pas hier
				bonus.newPlayerData.dayBonusStreak = 1;
			}

			// Best score
			if(bonus.newPlayerData.dayBonusStreak > bonus.newPlayerData.dayBonusBest) {
				bonus.newPlayerData.dayBonusBest = bonus.newPlayerData.dayBonusStreak;
			}

			const streak = bonus.newPlayerData.dayBonusStreak%30; // Bonus is periodic

			if(streak===1) {
				bonus.credits = 15;
			} else if(streak===2) {
				bonus.credits = 25;
			} else if(streak===3) {
				bonus.credits = 50;
			} else if(streak===4) {
				bonus.credits = 80;
			} else if(streak<10) {
				bonus.credits = 100;
			} else if(streak<20) {
				bonus.credits = 10*(streak + 1); // 110 to 200
				bonus.helium = 1750 * streak; // 15000 is about 45 min of ion propulsion for 1 vessel - 15000 to 33250
			} else if(streak<30) {
				bonus.credits = 15*streak; // 300 to 435
				bonus.helium = 2000 * streak; // 40000 to 58000
			} else {
				bonus.credits = 1000;
			} // @TODO: generate random special bonus
		}

		return bonus;
	}

	/* dayBonus */
	static dayBonus(data,inputData,choice) {
		const {
			credits,
			helium,
			newPlayerData,
		} = Player.getDayBonus(data, choice);

		if(choice===2 && helium!==0) {
			Planet.find(inputData,inputData.pid,0,function(planetReturned) {
				if(inputData.pid !== planetReturned.address) { // Stop if not belonging
					Websocket.SendMessageToClient({ sid: inputData.sid, message: 'ERROR_NOT_BELONGING' });
					log(inputData.username+' failed to get bonus on planet ' + planetReturned.name + ' ('+inputData.pid+') because he doesn\'t own it !','fail');
					return;
				}

				const newPlanetData = Planet.update(planetReturned, data, []);

				newPlanetData.resources[1]+=helium;

				db.planet.update(newPlanetData);

				log(inputData.username + ' takes its Daily Bonus ! ' + helium + 't of helium 3');

				db.player.update(newPlayerData);

				Planet.sendPlanetDataToUser({data: newPlanetData, planet: inputData.pid, id: inputData.id, sid: inputData.sid });
			});
		} else {
			newPlayerData.money = data.money + credits;
			log(inputData.username + ' takes its Daily Bonus ! ' + credits + ' credits');

			db.player.update(newPlayerData);
			io.to(inputData.sid).emit('player-recieve-data',{
				money: newPlayerData.money,
			});
		}
	}
};
