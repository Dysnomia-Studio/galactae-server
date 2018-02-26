module.exports = class player {
	/* Is Valid ? */
	static isValid(user,callback) {
		db.player.searchBySid(user.sid,function(searchSid) {
			if(isset(searchSid) && searchSid.name==user.username && searchSid.id == user.id) {
				if(player.canAct(searchSid)) { // Don't spam
					callback(user);

					var newData = searchSid;
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
		var minTime = 100; //time in ms

		return ((Date.now()-user.lastAction)>minTime);
	}
	/* Get player ally */
	static getAlly(data,callback) {
		db.player.searchById(data.id,function(obj) {
			if(!isset(obj)) { return; }
			data.ally = obj.ally;
			callback(data);
		})
	}
	/* Connect Player */
	static connect(data) {
		db.userGameId.find(data.id, function(userGameIdObj) {
			data.user_id = userGameIdObj[0].user_id;
			db.ban.find(data.user_id, 2, function(banObj) {
				if(isset(banObj)) {
					var now = Date.now();
					for(var i=0; banObj.length; banObj++) {
						if(banObj[i].ban_end < now) {
							// @ADD: Message
							return;
						}
					}
				}

				db.player.searchByName(data.username,function(dataReturned) {
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
						return;
					}

					var playerData = dataReturned.toJSON();
					playerData.sid = data.sid;
					
					var jour = 24*60*60*1000;
					var minuit = Date.now() - (Date.now()%jour);
					var hierMinuit = minuit - jour;
					var dayStreak = playerData.dayBonusStreak+1; 
					var bonusBest = playerData.dayBonusBest;

					if(data.lastBonus < hierMinuit) { dayStreak = 1; } // Pas pris le bonus hier ?

					if(dayStreak > bonusBest) { bonusBest = dayStreak; }

					if(playerData.lastBonus < minuit) { 
						io.to(data.sid).emit('day-bonus',{days: dayStreak, best: bonusBest}); 
					}

					playerData.lastConnected = Date.now();		

					io.to(data.sid).emit('player-recieve-data',{
						money: playerData.money,
						gvt: playerData.gvt
					});

					units.refreshUnits(data);
					player.refreshPoints(playerData, function(userNewPoints) {
						research.refreshUserResearch(userNewPoints, function(userNewResearch) {
							db.player.update(userNewResearch);
							plCount++;

							console.info(playerData);

							// Send data to client
							var researchOut = {};

							for(var i=0; i<userNewResearch.research.length; i++) {
								researchOut[userNewResearch.research[i][0]] = userNewResearch.research[i][1];
							}

							io.to(data.sid).emit('player-recieve-data',{
								research: researchOut
							});

							planet.refresh(data,0); // THIS HAVE TO BE AFTER RESEARCHS
						});
					});
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
	static calcTotalPlanetPoints(user,callback,i,points) {
		db.planet.find(user.planetlist[i],function(planetReturned) {
			points += planetReturned.points;

			i++;
			
			if(i<user.planetlist.length) {
				player.calcTotalPlanetPoints(user,callback,i,points);
			} else { 
				points *= pointsCoef['planet'];
				user.points = points;
				callback(user);	
			}
		});		
	}
	static calcResearchPoints(user) {
		var points = 0;

		for(var i=0; i<user.research.length; i++) {
			if(user.research[i][1]==-1 && isset(researchList[user.research[i][0]].cost)) {
				points+=researchList[user.research[i][0]].cost;
			}	
		}

		points*=pointsCoef['research'];

		return points;
	}
	static refreshPoints(user,callback) {
		player.calcTotalPlanetPoints(user,function(newUserData) {
			// Recherches
			newUserData.points += player.calcResearchPoints(newUserData);

			// Money
			newUserData.points += (newUserData.money*pointsCoef['money']);

			newUserData.points = Math.round(newUserData.points);
			callback(newUserData);
		},0,0);	
	}
	/* dayBonus */
	static dayBonus(data,userData,choice) {
		var jour = 24*60*60*1000;
		var minuit = Date.now() - (Date.now()%jour);
		var hierMinuit = minuit - jour;

		if(data.lastBonus < minuit) {
			// Update player
			var newPlayerData = data;
			newPlayerData.dayBonusStreak = data.dayBonusStreak+1;

			if(data.lastBonus < hierMinuit) { // Si pas hier
				newPlayerData.dayBonusStreak = 1;
			}

			// Best score :p
			if(newPlayerData.dayBonusStreak > newPlayerData.dayBonusBest) {
				newPlayerData.dayBonusBest = newPlayerData.dayBonusStreak;
			}

			var credits = 15;
			var helium = 0;
			var streak = newPlayerData.dayBonusStreak%30; // Bonus is periodic

			if(streak==1) { credits = 15; }
			else if(streak==2) { credits = 25; }
			else if(streak==3) { credits = 50; }
			else if(streak==4) { credits = 80; }
			else if(streak<10) { credits = 100; }
			else if(streak<20) { credits = 150; helium = 500; }
			else if(streak<30) { credits = 200; helium = 2000; }
			else { credits = 500; } // @ADD: generate random special bonus

			if(choice==2 && helium!=0) {
				planet.find(userData,userData.pid,0,function(planetReturned) {
					if(userData.pid!=planetReturned.id) { // Stop if not belonging
						websocket.SendMessageToClient({ id: data.id, message: "ERROR_NOT_BELONGING" })
						log(userData.username+' failed to get bonus on planet ' + planetReturned.name + ' ('+userData.pid+') because he doesn\'t own it !',"fail");
						return;
					}

					var newPlanetData = UpdatePlanet(planetReturned);

					newPlanetData.resources[1]+=helium;

					db.planet.update(newPlanetData);

					log(userData.username + " takes its Daily Bonus ! " + helium + "t of helium 3");

					newPlayerData.lastBonus = Date.now();

					db.player.update(newPlayerData);
					io.to(userData.sid).emit('player-recieve-data',{
						money: newPlayerData.money,
						gvt: newPlayerData.gvt
					});
				}); 
			} else {
				newPlayerData.money += credits;
				log(userData.username + " takes its Daily Bonus ! " + credits + " credits");

				newPlayerData.lastBonus = Date.now();

				db.player.update(newPlayerData);
				io.to(userData.sid).emit('player-recieve-data',{
					money: newPlayerData.money,
					gvt: newPlayerData.gvt
				});
			}
		}
	}
}