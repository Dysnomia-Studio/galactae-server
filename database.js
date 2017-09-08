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
	points: Number,
	currResearch: String
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
	inBuilding: Array, // [[planet,count,end],[planet,count,end]]
	shipType: Number,
	shipShape: Number,
	parts: Array,
	armorType: Number,
});
var units = mongoose.model('units', unitsSchema);

var fleetsSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	ownerId: Schema.Types.ObjectId,
	position: String,
	endMoveTime: Number,
	units: Array,
});
var fleets = mongoose.model('fleets', fleetsSchema);

module.exports = {
	/**
	 * Used to connect to database
	 */
	connect: function(callback) {
		MongoDB = mongoose.connect(globalCfg["dbAdress"]).connection;
		MongoDB.on('error', function(err) { log(err.message,"warn"); });
		MongoDB.once('open', function() {
			log('Successfuly connected to database server.');
			callback();
		});	
	},

	/**
	 * PLAYERS
	 */
	player: {
		searchByName: function(name,callback) {
			users.findOne({name: name}, function (err, objReturned) {
				callback(objReturned)
			});
		},
		searchById: function(id,callback) {
			users.findById(id, function (err, objReturned) {
				callback(objReturned);
			});
		},
		searchBySid: function(sid,callback) {
			users.findOne({sid: sid}, function (err, objReturned) {
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
				if(error) { log(error);} 
			});
		}
	},

	/**
	 * UNITS
	 */
	unit: {
		create: function(data) {
			units.create(data, function(err) {
				if (err) return handleError(err);
			});
		}
		find: function(id,callback) {
			units.findById(id, function (err, obj) {
				if(isset(obj)) {
					callback(obj);
				}
			});
		},
		findByOwner: function(id,callback) {
			units.find({ownerId: id}, function (err, obj) {
				callback(obj);
			});
		},
		update: function(data) {
			var conditions = { _id: data._id }
						  , update = { $set: data }
						  , options = { multi: true };

			units.update(conditions, update, options,function(error) {
				if(error) { log(error);} 
			});
		}
	},

	/**
	 * FLEETS
	 */
	fleets: {
		find: function(id,callback) {
			fleets.findById(id, function (err, obj) {
				if(isset(obj)) {
					callback(obj);
				}
			});
		},
		findByOwner: function(id,callback) {
			fleets.find({ownerId: id}, function (err, obj) {
				callback(obj);
			});
		},
		update: function(data) {
			var conditions = { _id: data._id }
						  , update = { $set: data }
						  , options = { multi: true };

			fleets.update(conditions, update, options,function(error) {
				if(error) { log(error);} 
			});
		}
	},
}