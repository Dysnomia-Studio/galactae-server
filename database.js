var Schema = mongoose.Schema;

/**
 * Server schemas
 */
var planetSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	address: String,
	owner: Schema.Types.ObjectId,
	resources: Array,
	Buildings: Array,
	planetType: Number,
	nextBuilding: Number,
	nextBuildingTime: Number,
	lastResourcesUpdate: Number,
	lastUnitUpdate: Number,
	points: Number,
	currResearch: String,
	unitBuildingID: String,
	unitBuildingCount: Number,
	unitBuildingEndTime: Number,
	unitBuildingFleetID: Schema.Types.ObjectId,
});

var userSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	planetlist: Array,
	ally: String,
	sid: String,
	gvt: Number,
	money: Number,
	points: Number,
	sectorPointsAddresses: Array,
	sectorPointsValue: Array,
	sectorPointsPcount: Array,
	lastConnected: Number,
	dayBonusStreak: Number,
	dayBonusBest: Number,
	beginnerProtectEnd: Number,
	lastBonus: Number,
	lastAction: Number,
	lastResearchUpdate: Number,
	research: Array
});

var unitsSchema = new Schema({
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

var fleetsSchema = new Schema({
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
});

var statsSchema = new Schema({
	_id: Schema.Types.ObjectId,
	plCount: Number,
	time: Number,
});

var planets;
var users;
var units;
var fleets;
var stats;

/**
 * General schemas
 */
var userPrivilegesSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: String,
	server_name: String,
	user_privilege_lvl: Number,
	user_whitelist: Number
});

var serverSchema = new Schema({
	_id: Schema.Types.ObjectId,
	server_name: String,
	server_maintenance: Boolean
});

var userGameIdSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: String,
	game_id: String,
	server_name: String
});

var userBanSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: String,
	server_name: String,
	ban_type: Number, // 1 = Chat, 2 = Game
	ban_begin: Number,
	ban_end: Number,
	ban_reason: String,
	admin: String
});

var globalRanksSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: String,
	server_name: String,
	rank: Number,
	points: Number,
	planets: Number
});

var sectorRanksSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: Schema.Types.ObjectId,
	server_name: String,
	sector: String,
	rank: Number,
	points: Number,
	planets: Number
});

var privileges;
var servers;
var userGameIds;
var bans;

module.exports = {
	Schema: Schema,
	/**
	 * Used to connect to database
	 */
	connect: function(callback) {
		var mongoSrv = mongoose.createConnection(globalCfg["dbAdress"]);
		var mongoGen = mongoose.createConnection('***REMOVED***');

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
			callback(true);
		});	


		mongoGen.on('error', function(err) { log(err.message,"warn"); callback(false); });
		mongoGen.once('open', function() {
			log('Successfuly connected to general database.');
			callback(true,true);
		});	
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
			var conditions = { _id: user.id }
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
			var conditions = { }
						  , update = { $set: { sid: "-1" } }
						  , options = { multi: true };

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
		find: function(pid,callback) {
			planets.findById(pid, function (err, planetReturned) {
				if(err) { log(err); }
				if(isset(planetReturned)) {
					callback(planetReturned);
				}
			});
		},
		update: function(data) {
			var conditions = { _id: data._id }
						  , update = { $set: data }
						  , options = { multi: true };

			planets.update(conditions, update, options,function(error) {
				if(error) { log(error); } 
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
		update: function(data, callback) {
			var conditions = { _id: data._id }
						  , update = { $set: data }
						  , options = { multi: true };

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
			var conditions = { _id: data._id }
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
			data = {};
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
			privileges.find({user_id: id, server_name: globalCfg['serverGlobalName']}, function (err, obj) {
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
			servers.find({server_name: globalCfg['serverGlobalName']}, function (err, obj) {
				if(err) { log(err); }
				if(isset(obj) && isset(obj[0])) {
					callback(obj[0]);
				} else if(isset(obj)) {
					callback(obj);
				}
			});
		},
		update: function(data, callback) {
			var conditions = {server_name: globalCfg['serverGlobalName']}
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
				server_name: globalCfg['serverGlobalName'],
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
				server_name: globalCfg['serverGlobalName'],
				user_id: data.user_id
			}, function(error, obj) {
				if(error) { log(error); }
				if(!isset(obj)) { // Si oui update
					data._id = new mongoose.Types.ObjectId();
					data.server_name = globalCfg['serverGlobalName'];
					
					globalRanks.create(data, function(error) {
						if(error) { log(error); } 
					})
				} else { // Sinon creer
					var conditions = {
						server_name: globalCfg['serverGlobalName'],
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
	},

	sectorRank: {
		update: function(data) {
			data.user_id = ""+data.user_id; // Used as string in php scripts

			// Chercher si l'utilisateur existe
			sectorRanks.find({
				server_name: globalCfg['serverGlobalName'],
				user_id: data.user_id,
				sector: data.sector
			}, function(error, obj) {
				if(error) { log(error); }
				if(!isset(obj)) { // Si oui update
					data._id = new mongoose.Types.ObjectId();
					data.server_name = globalCfg['serverGlobalName'];

					sectorRanks.create(data, function(error) {
						if(error) { log(error); } 
					})
				} else { // Sinon creer
					var conditions = {
							server_name: globalCfg['serverGlobalName'],
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
	},
}