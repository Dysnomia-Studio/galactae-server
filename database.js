var mongoose = require('mongoose');

module.exports = function() {
	/* Vars */
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	var planetSchema = new Schema({
	  _id:  Schema.Types.ObjectId,
	  name: String,
	  owner: Schema.Types.ObjectId,
	  resources: Array,
	  groundBuilding: Array,
	  planetType: Number,
	  nextBuilding: Number
	 });

	var planets = mongoose.model('planets', planetSchema);

	var userSchema = new Schema({
	  _id:  Schema.Types.ObjectId,
	  name: String,
	  owner: String,
	  planetlist: Array
	 });

	var users = mongoose.model('users', userSchema);

	this.mongoose = mongoose;
	this.Schema = Schema;
	this.planetSchema = planetSchema;
	this.planets = planets;
	this.userSchema = userSchema;
	this.users = users;

	/* dbconnect
	Used to connect to database
	INPUT: -
	OUTPUT: - */
	this.dbconnect = function() {
		mongoURI = "***REMOVED***";
		MongoDB = mongoose.connect(mongoURI).connection;
		MongoDB.on('error', function(err) { log(err.message,"warn"); });
		MongoDB.once('open', function() {
			log('Connected correctly to database server.');
		});
	}

	/* getPlanetInfo
	Get all data about a planet
	INPUT: dataInput ( array )
	OUTPUT: io connection ( array ) */
	this.getPlanetInfo = function(dataInput) {
		if(dataInput.planet=="-1") {
			users.findById(dataInput.user, function (err, objReturned) {
				//if (err) return handleError(err);
				dataInput.planet = objReturned.planetlist[0];

				planets.findById(dataInput.planet, function (err, planetReturned) {
					io.emit("recieve-planet-info", {data: planetReturned, RandomToken: dataInput.RandomToken });
				});
			});	
		}
		else
		{
			planets.findById(dataInput.planet, function (err, planetReturned) {
				io.emit("recieve-planet-info", {data: planetReturned, RandomToken: dataInput.RandomToken });
			});
		}
	}

	/* 
	ServerRessourceUpdate
	Update ressources on database
	IN: -
	OUT: - */
	this.ServerRessourceUpdate = function() {
		log('Updating player ressources in database.');

		planets.find({},{},'',function(err,planetsData) {
			for(var i=0; i<planetsData.length; i++) {	
				var newResources = CalcNewResources(planetsData[i]);
				var conditions = { _id: planetsData[i].id }
				  , update = { $set: { resources: newResources} }
				  , options = { multi: true };

				planets.update(conditions, update, options,function(error){ if(error) { console.log(error);} });
			}
		});
	}

	/* TryBuilding
	Do we can upgrade a building ? And if yes build it !
	INPUT: data ( array )
	OUTPUT: io connection ( array ) */
	this.TryBuilding = function(data) {
		var belong = 0;

		log(data.user+' try to update his building ('+data.building+') on planet ('+data.planet+') to next level');

		/*  Does the Planet belong to the user ? */
		users.findById(data.user, function (err, objReturned) {
			for(var i=0; i<objReturned.planetlist.length; i++) {
				if(objReturned.planetlist[i]==data.planet) {
					belong = 1;
				}
			}
			if(belong) {
				planets.findById(data.planet, function (err, planetReturned) {
					var cost = GetBuildingCost(data.building,planetReturned.groundBuilding[data.building]);
					var newResources = planetReturned.resources;
					var BlockBuild = 0;

					if(planetReturned.nextBuilding>Date.now()) { BlockBuild = 1; }

					for(var i=0; i<4; i++) {
						if(cost[i]>planetReturned.resources[i]) {
							BlockBuild = 1; //We can't build
						}
					}

					if(BlockBuild==0) {
						console.log(cost);
						console.log(newResources);

						//We consume resources
						newResources[3] -= eval(cost.iron);
						newResources[4] -= eval(cost.aluminium);
						newResources[5] -= eval(cost.copper);
						newResources[6] -= eval(cost.titanium);

						console.log(newResources);

						var nextTime = Date.now()+Math.round(cost.time*3600);

						var conditions = { _id: planetReturned.id }
						  , update = { $set: { resources: newResources, nextBuilding: nextTime } }
						  , options = { multi: true };

						planets.update(conditions, update, options,function(error){ if(error) { console.log(error);} SendMessageToClient({ RandomToken: data.RandomToken, message: "OK"}); getPlanetInfo({planet: data.planet, RandomToken: data.RandomToken}); });
					} else {
						SendMessageToClient({ RandomToken: data.RandomToken, message: "ERROR_BUILD"})
					}		
				});
			} else {
				SendMessageToClient({ RandomToken: data.RandomToken, message: "ERROR_BUILD"})
			}
		});
	}
}