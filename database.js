var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
	unitBuildingID: Schema.Types.ObjectId,
	unitBuildingCount: Number,
	unitBuildingEndTime: Number,
	unitBuildingFleetID: Schema.Types.ObjectId,
});
var planets = mongoose.model('planets', planetSchema);

var userSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	planetlist: Array,
	lvl: Number,
	ally: String,
	sid: String,
	gvt: Number,
	money: Number,
	points: Number,
	lastConnected: Number,
	dayBonusStreak: Number,
	dayBonusBest: Number,
	beginnerProtectEnd: Number,
	lastBonus: Number,
	lastAction: Number,
	lastResearchUpdate: Number,
	research: Array
});
var users = mongoose.model('users', userSchema);

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
var units = mongoose.model('units', unitsSchema);

var fleetsSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	ownerId: Schema.Types.ObjectId,
	motherPlanetId: Schema.Types.ObjectId,
	position: String,
	orbitPosition: Number,
	points: String,
	endMoveTime: Number,
	units: Array,
	population: Number,
});
var fleets = mongoose.model('fleets', fleetsSchema);

var statsSchema = new Schema({
	_id: Schema.Types.ObjectId,
	plCount: Number,
	time: Number,
});
var stats = mongoose.model('stats', statsSchema);

module.exports = {
	Schema: Schema,
	/**
	 * Used to connect to database
	 */
	connect: function(callback) {
		mongoose.connect(globalCfg["dbAdress"], { useMongoClient: true, auth: { authdb:"admin" } });
		MongoDB = mongoose.connection;
		MongoDB.on('error', function(err) { log(err.message,"warn"); callback(false); });
		MongoDB.once('open', function() {
			log('Successfuly connected to database server.');
			callback(true);
		});	
	},

	/**
	 * PLAYERS
	 */
	player: {
		searchByName: function(name,callback) {
			users.findOne({name: name}, function (err, objReturned) {
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
		update: function(user) {
			var conditions = { _id: user.id }
						  , update = { $set: user }
						  , options = { multi: true };

			users.update(conditions, update, options,function(error) {
				if(error) { log(error);} 
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
		update: function(data) {
			var conditions = { _id: data._id }
						  , update = { $set: data }
						  , options = { multi: true };

			units.update(conditions, update, options,function(err) {
				if(err) { log(err);} 
			});
		},
		delete: function(id) {
			units.findByIdAndRemove(id,function(err) {
				if(err) { log(err);} 
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
	}
}