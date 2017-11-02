var db = require('./database');

module.exports = function() {
	/* Is Valid ? */
	this.isValidUser = function(user,callback) {
		if(isset(user.username)&&isset(user.id)) {
			db.player.searchBySid(user.sid,function(searchSid) {
				if(isset(searchSid) && searchSid.name==user.username && searchSid.id == user.id) {
					if(canAct(searchSid)) { // Don't spam ^^
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
	}
	/* Does the player can act ? */
	this.canAct = function(user) {
		var minTime = 250; //time in ms

		return ((Date.now()-user.lastAction)>minTime);
	}
	/* Get the player lvl */
	this.getLvl = function(data,callback) {
		db.player.searchById(data.id,function(obj) {
			if(!isset(obj)) { return; }
			data.lvl = obj.lvl;
			callback(data);
		})
	}
	/* Get player ally */
	this.getAlly = function(data,callback) {
		db.player.searchById(data.id,function(obj) {
			if(!isset(obj)) { return; }
			data.ally = obj.ally;
			callback(data);
		})
	}
	/* Connect Player */
	this.connectPlayer = function(data) {	
		db.player.searchByName(data.username,function(dataReturned) {
			if(data.id!=dataReturned.id) {
				// Kick that Hacker ...
				io.to(data.sid).emit('server-kick',"INVALID_SESSION");
			}
			// Kick double accounts
			if(dataReturned.sid != "-1") {
				io.to(dataReturned.sid).emit('server-kick','DOUBLE_ACCOUNTS_CONNECTED');
				log(dataReturned.name +' ('+ dataReturned.id + ' | ' + dataReturned.sid +') was kicked because of double sessions.');
			}

			dataReturned.sid = data.sid;
			
			var jour = 24*60*60*1000;
			var minuit = Date.now() - (Date.now()%jour);
			var hierMinuit = minuit - jour;
			var dayStreak = dataReturned.dayBonusStreak+1; 

			if(data.lastBonus < hierMinuit) { dayStreak = 1; } // Pas pris le bonus hier ?

			if(dataReturned.lastBonus < minuit) { 
				io.to(dataReturned.sid).emit('day-bonus',{days: dayStreak, best: dataReturned.dayBonusBest}); 
			}

			dataReturned.lastConnected = Date.now();

			// Add to player list
			

			io.to(dataReturned.sid).emit('player-recieve-data',{
				money: dataReturned.money,
				gvt: dataReturned.gvt
			});

			refreshUserPlanet(data,0);
			refreshUserUnits(data);
			refreshUserPoints(dataReturned, function(userNewPoints) {
				refreshUserResearch(userNewPoints, function(userNewResearch) {
					db.player.update(userNewResearch);
					plCount++;

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
		});
	}
	/* Disconnect Player */
	this.disconnectPlayer = function(data) {
		if(!isset(data.sid)) { return; }
		db.player.searchBySid(data.sid,function(dataReturned) {
			if(!isset(dataReturned)) { return; }
			dataReturned.sid = "-1";
			db.player.update(dataReturned);
			plCount--;
		});
	}
	this.calcTotalPlanetPoints= function(user,callback,i=0,points=0) {
		db.planet.find(user.planetlist[i],function(planetReturned) {
			points += planetReturned.points;

			if(i+1<user.planetlist.length) {
				refreshUserPoints(user,callback,i+1,points);
			} else {
				points *= pointsCoef['planet'];
				user.points = points;
				callback(user);	
			}
		});		
	}
	this.calcResearchPoints = function(user) {
		var points = 0;

		for(var i=0; i<user.research.length; i++) {
			if(user.research[i][1]==-1 && isset(researchCost[user.research[i][0]])) {
				points+=researchCost[user.research[i][0]];
			}	
		}

		points*=pointsCoef['research'];

		return points;
	}
	this.refreshUserPoints = function(user,callback) {
		calcTotalPlanetPoints(user,function(newUserData) {
			// Recherches
			newUserData.points += calcResearchPoints(newUserData);

			// Money
			newUserData.points += (newUserData.money*pointsCoef['money']);

			newUserData.points = Math.round(newUserData.points);
			callback(newUserData);
		});	
	}
	/* dayBonus */
	this.dayBonus = function(data,userData,choice) {
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
				getPlanet(userData,userData.pid,0,function(planetReturned) {
					if(userData.pid!=planetReturned.id) { // Stop if not belonging
						SendMessageToClient({ id: data.id, message: "ERROR_NOT_BELONGING" })
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