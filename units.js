var db = require('./database');

module.exports = function() {
	/**
	 * Get and send unit data to user
	 *
	 * @param      {object}  data    user data
	 * @return     {socket}  units   list of units types
	 */
	this.refreshUserUnits = function(data) {
		db.unit.findByOwner(data.id,function(units) {
			if(units==undefined) { units = []; }
			io.to(data.sid).emit("units-recieve-data", units);
		});
	},

	this.calcUnitCosts = function(data) {
		// @ADD: Calc unit cost
		return [0,0,0,0,0,0];
	}

	/**
	 * Creates an unit type.
	 *
	 * @class      CreateUnitType (name)
	 * @param      {<type>}  data    Data given by client
	 */
	this.CreateUnitType = function(data) {
		var errors = 0;
		var errorMessage = "";
		var ship = data.ship;

		// That block 90% of tries to crash :p
		if(ship.name==undefined || ship.shape==undefined || ship.type==undefined) { return; }

		// Filter name
		var replace = [
			['<',''],
			['>',''],
			['( . ) ( . )',''],
			['(.)(.)',''],
		];

		for(var i=0; i<replace.length; i++) {
			ship.name = ship.name.split(replace[i][0]).join(replace[i][1])
		}

		// Check entries valdity
		for(var i in ship) {
			// Empty fields
			if(i=="name" || i=="type" || i=="shape") { // In facts, the two last verifications won't display error, but they're here to simplify the else
				if(ship[i].split(' ').join('')=="") {
					errors ++;
					message = "SHIP_HAS_NO_NAME";
					break;
				} 
			} else {
				if(ship[i].value==undefined || ship[i].value.split(' ').join('')=="" || ship[i].type==undefined || ship[i].type.split(' ').join('')=="") {
					errors ++;
					message = "SHIP_HAS_EMPTY_FIELD";
					break;
				} 
			}
		}

		// Wrong type/shape
		if(shipShapesDetails[ship.type]==undefined || shipShapesDetails[ship.type][ship.shape]==undefined) {
			errors ++;
			message = "SHIP_HAS_WRONG_TYPE_OR_SHAPE";
		}

		if(errors==0) {
			for(var i in ship) {
				if(i=="name" || i=="type" || i=="shape") { continue; }
				// Check if that kind of part exists in that kind of ship
				var valid = false;
				for(var type in shipShapesDetails[ship.type][ship.shape]['content']) {
					if(type==ship[i].type) {
						valid = true;
						break;
					}
				}

				// Check if that part exists in that kind of ship
				if(valid) {
					valid = false;
					for(var j=0; shipShapesDetails[ship.type][ship.shape]['svg'].length; j++) {
						if(shipShapesDetails[ship.type][ship.shape]['svg'][j][6]==i) {
							valid = true;
							break;
						}
					}
				}

				// Check if technology exists in that kind of ship
				if(valid) {
					valid = false;
					for(var j=0; shipShapesDetails[ship.type][ship.shape]['content'][ship[i].type].length; j++) {
						if(shipShapesDetails[ship.type][ship.shape]['content'][ship[i].type][j]==ship[i].value) {
							valid = true;
							break;
						}
					}
				}

				if(!valid) {
					errors++;
					message = "SHIP_HAS_INVALID_PARTS";
					break;
				}
			}
		}

		// Last check
		if(errors==0) {
			db.player.searchByName(data.username,function(userReturned) {
				// Check research
				for(var i in ship) {
					if(i=="name" || i=="type" || i=="shape") { continue; }

					if(shipResearchDependencies[ship[i].value]!=undefined && getResearch(userReturned,shipResearchDependencies[ship[i].value]) !== -1) {
						errors++;
						message = "NEEDED_RESEARCH_MISSING";
						break;
					}
				}

				// Saving
				if(errors==0) {
					cost = calcUnitCosts();

					// Save to database
					var shipToSave = {
						name: ship.name,
						shipType: ship.type,
						shipShape: ship.shape,
						ownerId: data.id,
						inBuilding: [],
						cost: cost,
						parts: [],
						armorType: 0, // None yet
						note: 0, // Not yet
						owned: 0,
					};

					for(var i in ship) {
						if(i=="name" || i=="type" || i=="shape") { continue; }
						
						shipToSave.parts.push({
							type: ship[i].type,
							name: i,
							tech: ship[i].value
						});
					}
				

					db.unit.create(shipToSave, function(newData) {
						// Notify client
						log(data.username + " has succed to create new unit type named " + ship.name,"success");
						refreshUserUnits(data);
					});
				} else {
					// Notify client
					log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
					SendMessageToClient({sid: data.sid, message: errorMessage});
				}
			});
		} else {
			// Notify client
			log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
			SendMessageToClient({sid: data.sid, message: errorMessage});
		}
	}

	/**
	 * Builds an unit.
	 *
	 * @class      BuildUnit (name)
	 * @param      string  planet    Where to build that ?
	 * @param      string  unitData  What need to build ?
	 */
	this.BuildUnit = function(inputData) {
		// Check if planet, unit & fleet belong to player
		getPlanet(data,data.planet,0,function(planetReturned,userReturned) {
			if(!isset(planetReturned.owner) || planetReturned.owner != inputData.id) { return; }

			// Check no fleet is currently building
			if(planetReturned.unitBuildingEndTime > Date.now()) { return; }

			db.unit.find(data.unit, function(unitReturned) {
				if(!isset(unitReturned.ownerId) || unitReturned.ownerId != inputData.id) { return; }
				var totalCost = [];

				// Check if planet have enough resources
				for(var i in unitReturned.cost) {
					totalCost = unitReturned.cost[i]*inputData.count;
				}

				if(totalCost[0] > planetReturned.resources[2] ||
					totalCost[1] > planetReturned.resources[3] ||
					totalCost[2] > planetReturned.resources[4] ||
					totalCost[3] > planetReturned.resources[5]) {

					log(inputData.name +' ('+ inputData.id + ' | ' + inputData.sid +') failed to build units because of no enough resources.');
					SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_COST" });
					return;
				}

				getPeople(newData, function(planetReturned,enoughtPeople) {
					// Check if planet have enough population
					if(prod < (cons + totalCost[4])) {
						log(inputData.name +' ('+ inputData.id + ' | ' + inputData.sid +') failed to build units because of no enough people.');
						SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_PEOPLE" });
						return;
					}

					// Check if you have required buildings

					db.fleet.find(data.fleet, function(fleetReturned) {
						if(!isset(fleetReturned.ownerId) || fleetReturned.ownerId != inputData.id) { return; }

						// Check if this fleet is in orbit and belong to this planet
						if(fleetReturned.position != planetReturned.address || fleetReturned.motherPlanetId != planetReturned.id) { return; }

						// Check if fleet max size is reached
						if((fleetReturned.population + totalCost[4]) > globalCost[maxFleetSize]) { 
							log(inputData.name +' ('+ inputData.id + ' | ' + inputData.sid +') failed to build units because fleet will be too big.');
							SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_FLEET_SIZE" });
							return;
						}

						// Create entry in planet db for in-build unit
						var newPlanet = planetReturned.toJSON();
						newPlanet.unitBuildingID = data.unit;
						newPlanet.unitBuildingCount = data.count;
						newPlanet.unitBuildingEndTime = Date.now() + totalCost[5];
						newPlanet.unitBuildingFleetID = data.fleet;

						db.planet.update(newPlanet);
						
					});
				});
			});			
		});
	}	
}