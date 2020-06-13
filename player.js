module.exports = class Player {
	/* Is Valid ? */
	static isValid(user,callback) {
		db.player.searchBySid(user.sid, async(playerData) => {
			if(isset(playerData, 'object') && playerData.name === user.username && playerData.id === user.id) {
				if(Player.canAct(playerData)) { // Don't spam

					await db.player.update({
						id: playerData.id,
						lastAction: new Date(),
					});

					callback(playerData);
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

		return ((Date.now()-user.lastAction.getTime())>minTime);
	}

	/* Get player ally */
	static async getAlly(data) {
		const player = await db.player.find(data.id);

		if(!isset(player, 'object')) {
			log('Error: ' + data.username + ' not found.');
			return;
		}

		data.ally = player.ally;

		return data;
	}

	/* Connect Player */
	static async connect(data) {
		const userGameIdObj = await db.userGameId.find(data.id);

		if(!isset(userGameIdObj, 'object') || !isset(userGameIdObj.game_id, 'string') || !isset(userGameIdObj.user_id, 'string')) {
			log('Error: Invalid user');
			// Kick that Hacker ...
			io.to(data.sid).emit('server-kick','INVALID_SESSION');
			return;
		}

		data.game_id = userGameIdObj.game_id;
		data.user_id = userGameIdObj.user_id;

		const banObj = await db.ban.find(data.game_id, 2);
		if(isset(banObj, 'object')) {
			const now = Date.now();
			for(let i=0; i<banObj.length; i++) {
				if(banObj[i].ban_end.getTime() > now) {
					log('Error: ' + data.username + ' is banned.');
					io.to(data.sid).emit('server-kick','ERR_BANNED');
					return;
				}
			}
		}

		if(maintenance) { // Check whitelist
			const userPrivileges = await db.privilege.find(data.user_id);

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
		} else { // Normal behavior
			db.player.searchByName(data.username,function(dataReturned) {
				if(!isset(dataReturned, 'object')) {
					console.error('User: ' + data.username + ' not found !');
					return;
				}

				Player.traitementsConnexion(data, dataReturned);
			});
		}
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

		if(playerData.ally !== null) {
			playerData.ally = await db.alliance.find(playerData.ally);
		}

		if(!isset(playerData.ally, 'object')) {
			playerData.ally = {
				name: null,
			};
		}

		playerData.sid = data.sid;

		// We need this to prevent next action being considered as "hacker" by validation system
		db.player.update({
			id: playerData.id,
			sid: playerData.sid,
		});

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

		playerData.lastConnected = new Date();

		io.to(data.sid).emit('player-recieve-data',{
			planetlist: playerData.planetlist,
			money: playerData.money,
			points: playerData.points,
			gvt: playerData.gvt,
			tutorials: playerData.tutorials,
		});

		Alliances.sendToPlayer(playerData);
		Combat.getAttacksAgainstPlayer(data.id, data.sid);
		Conquest.syncPlayer(data.id, data.sid);
		GameMap.syncPlayer(data.id, data.sid);
		Tactics.refresh(data.id, data.sid);
		Units.refresh(data);
		Player.refreshPoints(playerData, function(userNewPoints) {
			Research.refreshUserResearch(userNewPoints, function(userNewResearch) {
				db.player.update(userNewResearch, function() {
					if(data.pid === '' || userNewResearch.planetlist.indexOf(data.pid) === -1) {
						data.pid = userNewResearch.planetlist[0];
					}

					Reports.refresh(playerData.id, data.sid);

					db.planet.find(data.pid, function(planetReturned) {
						Research.sendResearchDataToUser(data, planetReturned, userNewResearch);

						Conquest.refresh(data.sid, data.id, data.pid); // THIS HAVE TO BE AFTER RESEARCHS, AND WILL LOAD PLANETS
					});
				});
			});
		});
	}

	/* Disconnect Player */
	static disconnect(userData) {
		userData.sid = '-1';
		db.player.update(userData);
	}
	static calcTotalPlanetPoints(user,callback,i,points) {
		db.planet.find(user.planetlist[i],function(planetReturned) {
			points += planetReturned.points;

			i++;

			if(i<user.planetlist.length) {
				Player.calcTotalPlanetPoints(user,callback,i,points);
			} else {
				points *= pointsCoef.planet;

				user.points = points;
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

			callback(newUserData);
		},0,0);
	}

	static async updateAfterConquest(playerName) {
		const playerData = await db.player.findByName(playerName);

		Player.refreshPoins(playerData, (newPlayerData) => {
			if(newPlayerData.sid === null || newPlayerData.sid === '-1') {
				return;
			}

			io.to(newPlayerData.sid).emit('player-recieve-data',{
				planetlist: newPlayerData.planetlist,
				money: newPlayerData.money,
				points: newPlayerData.points
			});
		});
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
			bonus.newPlayerData.lastBonus = new Date();

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
			Planet.find(inputData,inputData.pid,async function(planetReturned) {
				if(inputData.pid !== planetReturned.address) { // Stop if not belonging
					Websocket.SendMessageToClient({ sid: inputData.sid, message: 'ERROR_NOT_BELONGING' });
					log(inputData.username+' failed to get bonus on planet ' + planetReturned.name + ' ('+inputData.pid+') because he doesn\'t own it !','fail');
					return;
				}

				const newPlanetData = await Planet.update(planetReturned, data, []);

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
				points: newPlayerData.points,
			});
		}
	}
};
