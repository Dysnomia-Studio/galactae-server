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
	  nextBuilding: Number,
	  nextBuildingTime: Number,
	  lastResourcesUpdate: Number
	 });

	var planets = mongoose.model('planets', planetSchema);

	var userSchema = new Schema({
	  _id:  Schema.Types.ObjectId,
	  name: String,
	  planetlist: Array,
	  lvl: Number
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
		if(dataInput.planet=="-1" || !isset(dataInput.planet)) {
			users.findById(dataInput.id, function (err, objReturned) {
				//if (err) return handleError(err);
				dataInput.planet = objReturned.planetlist[0];

				getPlanetInfoB(dataInput);
			});	
		}
		else
		{
			getPlanetInfoB(dataInput);
		}
	}

	this.getPlanetInfoB = function(dataInput) {
		planets.findById(dataInput.planet, function (err, planetReturned) {
			var newResources = CalcNewResources(planetReturned);
			var ground = planetReturned.groundBuilding;

			if(Date.now()>planetReturned.nextBuildingTime && planetReturned.nextBuilding != -1) {
				ground[planetReturned.nextBuilding]++;
				nextBuilding = -1;
				nextBuildingTime = -1;
			} else {
				nextBuilding = planetReturned.nextBuilding;
				nextBuildingTime = planetReturned.nextBuildingTime;		
			}

			var conditions = { _id: planetReturned.id }
			  , update = { $set: {  resources: newResources,
									lastResourcesUpdate: Date.now(),
									groundBuilding: ground,
									nextBuilding: nextBuilding,
									nextBuildingTime: nextBuildingTime
								} 
						}
			  , options = { multi: true };

			planets.update(conditions, update, options,function(error){ if(error) { log(error); } });

			planetData = {
				_id:  planetReturned.id,
				name: planetReturned.name,
				owner: planetReturned.owner,
				resources: newResources,
				groundBuilding: planetReturned.groundBuilding,
				planetType: planetReturned.planetType,
				nextBuilding: nextBuilding,
				nextBuildingTime: nextBuildingTime,
				lastResourcesUpdate: planetReturned.lastResourcesUpdate
			};

			sendPlanetData({data: planetData, id: dataInput.id });
		});
	}


	/* sendPlanetData
	Send planet data to user
	INPUT: data ( array )
	OUTPUT: io connection ( array ) */
	this.sendPlanetData = function(data) {
		io.emit("recieve-planet-info", data );
	}

	/* TryBuilding
	Do we can upgrade a building ? And if yes build it !
	INPUT: data ( array )
	OUTPUT: io connection ( array ) */
	this.TryBuilding = function(data) {
		var belong = 0;

		var maxLevels = [
			20,  // Carriere
			25,  // Metallurgie
			25,  // Habitations
			25,  // Serres
			30,  // Centrales Solaires
			25,  // Entrepôts
			25,  // Reservoir
			35,  // Centre de lancement
			30   // Centre de recherches
		];

		/*  Does the Planet belong to the user ? */
		users.findById(data.id, function (err, objReturned) {
			var belong = 0;
			if(isset(objReturned)&&isset(objReturned.planetlist)) {
				for(var i=0; i<objReturned.planetlist.length; i++) {
					if(objReturned.planetlist[i]==data.planet) {
						belong = 1;
					}
				}
			}
			if(belong) {

				planets.findById(data.planet, function (err, planetReturned) {
					/* Calc New Ressources */
					var newResources = CalcNewResources(planetReturned);
					var lastResourcesUpdate = Date.now();
					var ground = planetReturned.groundBuilding;
					var cost = GetBuildingCost(data.building,planetReturned.groundBuilding[data.building]);
					var BlockBuild = 0;
					var nextTime = planetReturned.nextBuildingTime;
					var nextBuilding = planetReturned.nextBuilding;
					var errormsg = "";

					// Mauvais n° de batiment
					if(data.building>9||data.building<0) {
						return; // Stop Executing, it may create bugs
					}
					// Verif Batiments précédents
					if(Date.now()>planetReturned.nextBuildingTime && planetReturned.nextBuilding != -1) {
						ground[planetReturned.nextBuilding]++;
						nextTime = -1;
						nextBuilding = -1;
					}
					// Un  bâtiment est déja en construction ?
					if(planetReturned.nextBuildingTime>Date.now()) { 
						BlockBuild = 1; 
						errormsg += "- already building";
					}
					// Niveau maximum ?
					if(ground[data.building]>maxLevels[data.building]) {
						BlockBuild = 1;
						errormsg += "- maximum level";
					}
					// Cost verif
					if(cost.iron>newResources[2] || cost.aluminium>newResources[3] || 
						cost.copper>newResources[4] || cost.titanium>newResources[5] ) {
						BlockBuild = 1;
						errormsg += "- cost";
					}

					if(BlockBuild==0) {
						//We consume resources
						newResources[2] -= eval(cost.iron);
						newResources[3] -= eval(cost.aluminium);
						newResources[4] -= eval(cost.copper);
						newResources[5] -= eval(cost.titanium);

						nextTime = Date.now()+Math.round(cost.time*3600*1000);	
						nextBuilding = data.building;

						SendMessageToClient({ id: data.id, message: "OK"});
						log(data.username+' succed to update his building ('+data.building+') on planet ('+data.planet+') to next level',"success");

					} else { //We just update ressources
						SendMessageToClient({ id: data.id, message: "ERROR_BUILD "  + errormsg })
						log(data.username+' failed to update his building ('+data.building+') on planet ('+data.planet+') to next level'  + errormsg,"fail");
					}

					var conditions = { _id: planetReturned.id }
					  , update = { $set: { resources: newResources,
					  					   nextBuildingTime: nextTime,
					  					   nextBuilding: nextBuilding,
					  					   lastResourcesUpdate: lastResourcesUpdate,
					  					   groundBuilding: ground
					  					 } 
					  			}
					  , options = { multi: true };

					var planetData = {
						_id:  planetReturned.id,
						name: planetReturned.name,
						owner: planetReturned.owner,
						resources: newResources,
						groundBuilding: ground,
						planetType: planetReturned.planetType,
						nextBuilding: nextBuilding,
						nextBuildingTime: nextTime,
						lastResourcesUpdate: lastResourcesUpdate
					};

					planets.update(conditions, update, options,function(error){ if(error) { log(error);} sendPlanetData({data: planetData, planet: data.planet, id: data.id}); });
		
				});
			} else {
				SendMessageToClient({ id: data.id, message: "NO_BELONG" })
				log(data.username+' failed to update his building ('+data.building+') on planet ('+data.planet+') to next level because he doesn\'nt own it !',"fail");
			}
		});
	}

	/* Get the player lvl */
	this.getLvl = function(data,callback) {
		users.findById(data.id, function (err, objReturned) {
			data.lvl = objReturned.lvl;
			callback(data);
		});
	}

	/* Change the name */
	this.ChangePlanetName = function(data) {
		users.findById(data.id, function (err, objReturned) {
			for(var i=0; i<objReturned.planetlist.length; i++) {
				if(objReturned.planetlist[i]==data.planet) {
					belong = 1;
				}
			}
			if(belong) {
				planets.findById(data.planet, function (err, planetReturned) {

					data.name = data.name.replace('<','');
					data.name = data.name.replace('>','');
					data.name = data.name.replace('/','');

					var conditions = { _id: planetReturned.id }
					  , update = { $set: { name: data.name } }
					  , options = { multi: true };

					var planetData = planetReturned;
					planetData.name = data.name;

					planets.update(conditions, update, options,function(error) {
						log(data.username + ' changed name of planet ('+data.planet+'), new name: '+data.name,"fail") 
						if(error) { log(error);} 
						sendPlanetData({data: planetData, planet: data.planet, id: data.id});
					});
				});
			}
		});
	}
}