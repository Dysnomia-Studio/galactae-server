let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Server schemas
 */
let planetSchema = new Schema({
	// General informations
	_id: Schema.Types.ObjectId,
	name: String,
	address: String,
	owner: Schema.Types.ObjectId,
	points: Number,

	// Geographic informations
	orbitDist: Number,
	orbitDuration: Number,
	galacticPos: Array,
	planetType: Number,

	// Buildings
	Buildings: Array,
	nextBuilding: Number,
	nextBuildingTime: Number,
	
	// Resources	
	resources: Array,
	lastResourcesUpdate: Number,

	// Units
	unitBuildingID: String,
	unitBuildingCount: Number,
	unitBuildingEndTime: Number,
	unitBuildingFleetID: Schema.Types.ObjectId,
	lastUnitUpdate: Number,

	// Misc
	currResearch: String,
});

let userSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	gvt: Number,
	ally: String,
	sid: String,

	planetlist: Array,

	currTutorial: Number,

	beginnerProtectEnd: Number,

	lastConnected: Number,
	lastAction: Number,

	points: Number,
	money: Number,
	// Research
	lastResearchUpdate: Number,
	research: Array,
	// Bonus journalier
	lastBonus: Number,
	dayBonusStreak: Number,	
	dayBonusBest: Number,
});

let unitsSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	ownerId: Schema.Types.ObjectId,
	cost: Array, // [Al,Fe,Ti,Cu,Time,Population]
	shipType: String,
	shipShape: String,
	parts: Array,
	armorType: String,
	owned: Number,
	note: Number,
});

let fleetsSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	ownerId: Schema.Types.ObjectId,
	motherPlanetId: Schema.Types.ObjectId,
	position: String,
	orbitPosition: Number, // -1 = Moving to, 0 = Low Orbit - Defense or siege, 1 = Mid Orbit - Attacking, 2 = High orbit - Just around the planet
	points: String,
	endMoveTime: Number,
	units: Array,
	population: Number,
	inBuilding: Boolean,
	fuel: Number,
});

let statsSchema = new Schema({
	_id: Schema.Types.ObjectId,
	plCount: Number,
	time: Number,
});

let planets;
let users;
let units;
let fleets;
let stats;

/**
 * General schemas
 */
let userPrivilegesSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: Schema.Types.ObjectId,
	server_name: String,
	user_privilege_lvl: Number,
	user_whitelist: Number
});

let serverSchema = new Schema({
	_id: Schema.Types.ObjectId,
	server_name: String,
	server_maintenance: Boolean
});

let userGameIdSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: String,
	game_id: String,
	server_name: String
});

let userBanSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: String,
	server_name: String,
	ban_type: Number, // 1 = Chat, 2 = Game
	ban_begin: Number,
	ban_end: Number,
	ban_reason: String,
	admin: String
});

let globalRanksSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: String,
	name: String,
	server_name: String,
	rank: Number,
	points: Number,
	planets: Number
});

let sectorRanksSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: String,
	name: String,
	server_name: String,
	sector: String,
	rank: Number,
	points: Number,
	planets: Number
});

let privileges;
let servers;
let userGameIds;
let bans;
let globalRanks;
let sectorRanks;

let mongoSrv;
let mongoGen;

module.exports = {
	Schema: Schema,
	/**
	 * Used to connect to database
	 */
	connect: function(callback) {
		mongoSrv = mongoose.createConnection(globalCfg["dbAdress"]);
		mongoGen = mongoose.createConnection('***REMOVED***');

		/**
		 * Server schemas
		 */
		planets = mongoSrv.model('planets', planetSchema);
		users = mongoSrv.model('users', userSchema);
		units = mongoSrv.model('units', unitsSchema);
		fleets = mongoSrv.model('fleets', fleetsSchema);
		stats = mongoSrv.model('stats', statsSchema);

		/**
		 * General schemas
		 */
		privileges = mongoGen.model('privileges', userPrivilegesSchema);
		servers = mongoGen.model('servers', serverSchema);
		userGameIds = mongoGen.model('game_ids', userGameIdSchema);
		bans = mongoGen.model('bans', userBanSchema);
		globalRanks = mongoGen.model('globalRanks', globalRanksSchema);
		sectorRanks = mongoGen.model('sectorRanks', sectorRanksSchema);

		/**
		 * Events
		 */
		mongoSrv.on('error', function(err) { log(err.message,"warn"); callback(false); });
		mongoSrv.once('open', function() {
			log('Successfuly connected to server database.');
			callback(true,false,mongoSrv);
		});	


		mongoGen.on('error', function(err) { log(err.message,"warn"); callback(false); });
		mongoGen.once('open', function() {
			log('Successfuly connected to general database.');
			callback(true,true,mongoGen);
		});	
	},

	closeConnections: function(callback) {
		mongoSrv.close();
		mongoSrv.close();

		callback();
	},

	/**
	 * PLAYERS
	 */
	player: {
		findAll: function(callback) {
			users.find({ }, function (err, objReturned) {
				if(err) { log(err); }
				callback(objReturned)
			});
		},
		searchByName: function(name,callback) {
			users.findOne({ name: { $regex: new RegExp("^" + name.toLowerCase(), "i") } }, function (err, objReturned) {
				if(err) { log(err); }
				callback(objReturned)
			});
		},
		searchById: function(id,callback) {
			users.findById(id, function (err, objReturned) {
				if(err) { log(err); }
				callback(objReturned);
			});
		},
		searchBySid: function(sid,callback) {
			users.findOne({sid: sid}, function (err, objReturned) {
				if(err) { log(err); }
				callback(objReturned)
			});
		},
		update: function(user, callback) {
			let conditions = { _id: user.id }
						  , update = { $set: user }
						  , options = { multi: true };

			users.update(conditions, update, options,function(error) {
				if(error) { log(error);} 
				if(callback !== undefined) {
					callback();
				}
			});
		},
		clearList: function() {
			log("Clearing player list ...");
			let conditions = { },
				update = { $set: { sid: "-1" } },
				options = { multi: true };

			users.update(conditions, update, options,function(error) {
				if(error) { log(error);}
				log("List cleared !") ;
			});
		}
	},

	/**
	 * PLANET
	 */
	planet: {
		find: function(addr,callback) {
			planets.findOne({address: addr}, function (err, planetReturned) {
				if(err) { log(err); }
				if(isset(planetReturned)) {
					callback(planetReturned);
				}
			});
		},
		update: function(data) {
			let conditions = { _id: data._id },
							update = { $set: data },
							options = { multi: true };

			planets.update(conditions, update, options,function(error) {
				if(error) { log(error); } 
			});
		},
		findBySystemWithOwners: function(systemAddr, callback) {
			planets.find({ "address": new RegExp("^" + systemAddr + "-", "i") }, function(err, planetList) {
				if(err) { log(err); return; }

				let pList = [];

				let ended = 0;
				for(let i=0; i<planetList.length; i++) {
					let id = i;

					pList[id] = planetList[id].toJSON();

					db.player.searchById(planetList[id].owner, function(user) {
						if(isset(user)) {
							pList[id].ownerName = user.name;
							pList[id].ally = user.ally;
						} else {
							pList[id].ownerName = null;
							pList[id].ally = null;
						}

						ended++;

						if(ended == planetList.length) {
							callback(pList);
						}
					});
				}

				if(planetList.length == 0) {
					callback(planetList);
				}
			});
		}
	},

	/**
	 * UNITS
	 */
	unit: {
		create: function(data,callback) {
			data._id = new mongoose.Types.ObjectId();
			
			units.create(data, function(error) {
				if(error) { log(error); }
				if(callback) { callback(data); } 
			});
		},
		find: function(id,callback) {
			units.findById(id, function (err, obj) {
				if(err) { log(err); }
				if(callback) {
					callback(obj);
				}
			});
		},
		findByOwner: function(id,callback) {
			units.find({ownerId: id}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		findAll: function(callback) {
			units.find({ }, function (err, objReturned) {
				if(err) { log(err); }
				callback(objReturned);
			});
		},
		update: function(data, callback) {
			let conditions = { _id: data._id },
					update = { $set: data },
				   options = { multi: true };

			units.update(conditions, update, options,function(err) {
				if(err) { log(err); }
				else if(callback) {
					callback();
				} 
			});
		},
		delete: function(id,callback) {
			units.findByIdAndRemove(id,function(err) {
				if(err) { log(err);} 
				if(callback) { callback(); }
			});
		}

	},

	/**
	 * FLEETS
	 */
	fleet: {
		find: function(id,callback) {
			fleets.findById(id, function (err, obj) {
				if(err) { log(err); }
				if(isset(obj)) {
					callback(obj);
				}
			});
		},
		findByOwner: function(id,callback) {
			fleets.find({ownerId: id}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		findByMotherPlanet: function(planetId,callback) {
			fleets.find({motherPlanetId: planetId}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		update: function(data,callback) {
			let conditions = { _id: data._id }
						  , update = { $set: data }
						  , options = { multi: true };

			fleets.update(conditions, update, options,function(error) {
				if(error) { log(error);} 

				if(callback) {
					callback();
				}
			});
		},
		create: function(data,callback) {
			data._id = new mongoose.Types.ObjectId();
			
			fleets.create(data, function(error) {
				if(error) { log(error); }
				if(callback) { callback(data); } 
			});
		},
	},

	stat: {
		submit: function(currTime) {
			let data = {};
			data._id = new mongoose.Types.ObjectId();
			data.plCount = plCount;
			data.time = currTime;
			
			stats.create(data, function(error) {
				if(error) { log(error); }
			});
		},
	},

	privilege: {
		find: function(id,callback) {
			if(typeof id === "string") {
				id = mongoose.Types.ObjectId(id);
			}

			privileges.find({user_id: id, server_name: globalCfg.serverGlobalName}, function (err, obj) {
				if(err) { log(err); }
				// DO NOT CHECK IF WE HAVE OBJECT, NOT EVERYONE IS REGISTERED IN THIS DATABASE
				callback(obj);
			});
		},
	},

	userGameId: {
		find: function(id,callback) {
			userGameIds.find({game_id: id}, function (err, obj) {
				if(err) { log(err); }
				if(isset(obj)) {
					callback(obj);
				}
			});
		},
	},

	server: {
		find: function(callback) {
			servers.find({server_name: globalCfg.serverGlobalName}, function (err, obj) {
				if(err) { log(err); }
				if(isset(obj) && isset(obj[0])) {
					callback(obj[0]);
				} else if(isset(obj)) {
					callback(obj);
				}
			});
		},
		update: function(data, callback) {
			let conditions = {server_name: globalCfg.serverGlobalName}
						  , update = { $set: data }
						  , options = { multi: true };

			console.info(conditions);
			console.info(data);

			servers.update(conditions, update, options,function(error) {
				if(error) { log(error);} 

				if(callback) {
					callback();
				}
			});
		},
	},

	ban: {
		find: function(uid,type,callback) {
			bans.find({
				user_id: uid,
				server_name: globalCfg.serverGlobalName,
				ban_type: type
			}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		create: function(data) {
			data._id = new mongoose.Types.ObjectId();
			
			bans.create(data, function(error) {
				if(error) { log(error); } 
			});
		},
	},
	globalRank: {
		update: function(data) {
			// Chercher si l'utilisateur existe
			globalRanks.find({
				server_name: globalCfg.serverGlobalName,
				user_id: data.user_id
			}, function(error, obj) {
				if(error) { log(error); }
				
				if(!isset(obj) || obj.length === 0) { // Si non creer
					data._id = new mongoose.Types.ObjectId();
					data.server_name = globalCfg.serverGlobalName;
					
					globalRanks.create(data, function(error) {
						if(error) { log(error); } 
					});
				} else { // Sinon update
					let conditions = {
						server_name: globalCfg.serverGlobalName,
						user_id: data.user_id
						},
						update = { $set: data },
						options = { multi: false };

					globalRanks.update(conditions, update, options,function(error) {
						if(error) { log(error);} 
					});
				}
			});
		},
		findByUserId: function(uid, callback) {
			globalRanks.find({
				server_name: globalCfg.serverGlobalName,
				user_id: uid
			}, function (err, obj) {
				if(err) { log(err); }
				if(isset(obj) && isset(obj[0])) { obj = obj[0]; }
				callback(obj);
			});
		},
		findBetweenPointsAndRanks: function(points, rank, callback) {
			globalRanks.find({
				points: { $lt: points },
				rank: { $lt: rank },
				server_name: globalCfg.serverGlobalName,
			}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		incrementInRange: function(min, max) {
			let conditions = {
				server_name: globalCfg.serverGlobalName,
				rank: { $gte: min,  $lte: max },
				},
				update = { $inc: {'rank': 1 } },
				options = { multi: true };

			globalRanks.update(conditions, update, options,function(error) {
				if(error) { log(error);} 
			});
		},
		count: function(callback) {
			globalRanks.count({
				server_name: globalCfg.serverGlobalName
			} , function(err, c) {
				if(err) { log(err); } 
				callback(c);
			});
		},
		reSortRanks: function(user_id, points, pcount, name) {
			db.globalRank.findByUserId(user_id, function(user) {
				db.globalRank.count(function(MaxRank) {
					MaxRank++;
					let rank = MaxRank;

					if(isset(user) && isset(user.rank)) { rank = user.rank; }

					db.globalRank.findBetweenPointsAndRanks(points, rank, function(userList) {
						let min = rank;

						if(isset(userList) && isset(userList[0])) { // Changement(s) de rang à faire ?
							min = userList[0].rank;

							for(let i=1; i<userList.length; i++) {
								if(min > userList[i].rank) {
									min = userList[i].rank;
								}
							}
						}

						if(min < rank) {
							db.globalRank.incrementInRange(min, rank-1);
						}
						
						db.globalRank.update({
							user_id,
							rank: min,
							points,
							planets: pcount,
							name
						});
					});
				});
			});
		}
	},

	sectorRank: {
		update: function(data) {
			// Chercher si l'utilisateur existe
			sectorRanks.find({
				server_name: globalCfg.serverGlobalName,
				user_id: data.user_id,
				sector: data.sector
			}, function(error, obj) {
				if(error) { log(error); }

				if(!isset(obj) || obj.length === 0) { // Si non creer
					data._id = new mongoose.Types.ObjectId();
					data.server_name = globalCfg.serverGlobalName;

					sectorRanks.create(data, function(error) {
						if(error) { log(error); } 
					});
				} else { // Sinon update
					let conditions = {
							server_name: globalCfg.serverGlobalName,
							user_id: data.user_id,
							sector: data.sector
						},
						update = { $set: data },
						options = { multi: false };

					sectorRanks.update(conditions, update, options,function(error) {
						if(error) { log(error);} 
					});
				}
			});
		},
		findByUserId: function(uid, sector, callback) {
			sectorRanks.find({
				sector: sector,
				server_name: globalCfg.serverGlobalName,
				user_id: uid
			}, function (err, obj) {
				if(err) { log(err); }
				if(isset(obj) && isset(obj[0])) { obj = obj[0]; }
				callback(obj);
			});
		},
		findBetweenPointsAndRanks: function(sector, points, rank, callback) {
			sectorRanks.find({
				sector: sector,
				points: { $lt: points },
				rank: { $lt: rank },
				server_name: globalCfg.serverGlobalName,
			}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		incrementInRange: function(sector, min, max) {
			let conditions = {
				sector: sector,
				server_name: globalCfg.serverGlobalName,
				rank: { $gte: min,  $lte: max },
				},
				update = { $inc: {'rank': 1 } },
				options = { multi: true };

			sectorRanks.update(conditions, update, options,function(error) {
				if(error) { log(error);} 
			});
		},
		count: function(sector, callback) {
			sectorRanks.count({
				server_name: globalCfg.serverGlobalName,
				sector: sector
				} , function(err, c) {
				if(err) { log(err); } 
				callback(c);
			});
		},
		reSortRanks: function(user_id, sector, points, pcount, name) {
			db.sectorRank.findByUserId(user_id, sector, function(user) {
				db.sectorRank.count(sector, function(MaxRank) {
					MaxRank++;

					let rank = MaxRank;

					if(isset(user) && isset(user.rank)) { rank = user.rank; }
					db.sectorRank.findBetweenPointsAndRanks(sector, points, rank, function(userList) {
						let min = rank;

						if(isset(userList) && isset(userList[0])) { // Changement(s) de rang à faire ?
							min = userList[0].rank;

							for(let i=1; i<userList.length; i++) {
								if(min > userList[i].rank) {
									min = userList[i].rank;
								}
							}
						}

						if(min < rank) {
							db.sectorRank.incrementInRange(sector, min, rank-1);
						}

						db.sectorRank.update({
							user_id,
							sector: sector,
							rank: min,
							points,
							planets: pcount,
							name
						});
					});
				});
			});
		}
	},
};