var db = require('./database');

module.exports = function() {
	/**
	 * Get and send unit data to user
	 *
	 * @param      {object}  data    user data
	 * @return     {socket}  units   list of units types
	 */
	this.refreshUserUnits = function(data) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER BEFORE !
		 */
		db.unit.findByOwner(data.id,function(units) {
			if(units==undefined) { units = []; }
			io.to(data.sid).emit("units-recieve-data", units);
		});
	},

	this.refreshUserFleets = function(pid,sid) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER AND PLANET BEFORE !
		 */
		db.fleet.findByMotherPlanet(pid,function(fleet) {
			if(fleet==undefined) { fleet = []; }
			io.to(sid).emit("fleet-recieve-data", fleet);
		});
	}

	/**
	 * Calculates the unit costs.
	 *
	 * @param      {<type>}  data    The data
	 * @return     {Array}   Unit total cost
	 */
	this.calcUnitCosts = function(shipType,parts) {
		var totalCost = shipCosts[shipType];

		for(var id in parts) {
			if(!isset(shipCosts[parts[id].tech])) { // If we do our work, this would never happend but that's a security measure ..
				log("Cost is not defined for part " + parts[id].tech + " in ship " + shipType,"error");
				return [-1];
			}

			var addCost = shipCosts[parts[id].tech];

			for(var i=0; i<6; i++) {
				totalCost[i] += addCost[i];
			}
		}

		return totalCost;
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
					// Save to database
					var shipToSave = {
						name: ship.name,
						shipType: ship.type,
						shipShape: ship.shape,
						ownerId: data.id,
						inBuilding: [],
						cost: [],
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

					shipToSave.cost = calcUnitCosts(ship.shape,shipToSave.parts);

					if(shipToSave.cost[0] == -1) { return; } // There's something wrong ... Security measure
				
					db.unit.findByOwner(data.id,function(unitList) {
						var duplicate = false;
						var duplicateName = false;

						for(var currObj in unitList) {
							if(unitList[currObj].name == shipToSave.name) {
								duplicateName = true;
								break;
							}

							if(unitList[currObj].shipType == shipToSave.shipType && 
								unitList[currObj].shipShape == shipToSave.shipShape &&
								unitList[currObj].parts.length == shipToSave.parts.length) {

								// Sort
								unitList[currObj].parts.sort(function(a,b) {
									if(a.name < b.name) {
										return -1;
									}
									if(a.name > b.name) {
										return 1;
									}

									return 0;
								});

								shipToSave.parts.sort(function(a,b) {
									if(a.name < b.name) {
										return -1;
									}
									if(a.name > b.name) {
										return 1;
									}

									return 0;
								});

								// Compare
								for(var i=0; i<shipToSave.parts.length; i++) {
									for(var id in shipToSave.parts[i]) {
										if(shipToSave.parts[i][id] !== unitList[currObj].parts[i][id]) {
											duplicate = true;
											break;
										}
									}

									if(duplicate) {
										break;
									}
								}
							} // End check parts
						}


						if(!duplicate && !duplicateName) {
							db.unit.create(shipToSave, function(newData) {
								// Notify client
								log(data.username + " has succed to create new unit type named " + ship.name,"success");
								refreshUserUnits(data);
							});
						} else if(duplicate) {
							message = "SHIP_TYPE_ALREADY_EXISTS";
							log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
							SendMessageToClient({sid: data.sid, message: message});	
						} else {
							message = "SHIP_NAME_ALREADY_EXISTS";
							log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
							SendMessageToClient({sid: data.sid, message: message});	
						}
					});

				} else {
					// Notify client
					log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
					SendMessageToClient({sid: data.sid, message: message});
				}
			});
		} else {
			// Notify client
			log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
			SendMessageToClient({sid: data.sid, message: message});
		}
	}

	this.DeleteUnitType = function(data) {
		db.unit.find(data.unit, function(unitReturned) {
			if(!isset(unitReturned) || !isset(unitReturned.ownerId) || unitReturned.ownerId != inputData.id) { return; }

			//@ADD: count

			db.unit.delete(data.unit);
		});
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
		getPlanet(inputData,inputData.planet,0,function(planetReturned,userReturned) {
			if(!isset(planetReturned.owner) || planetReturned.owner != inputData.id) { return; }

			// Check no fleet is currently building
			if(planetReturned.unitBuildingEndTime > Date.now()) { return; }

			db.unit.find(inputData.unit, function(unitReturned) {
				if(!isset(unitReturned) || !isset(unitReturned.ownerId) || unitReturned.ownerId != inputData.id) { return; }
				var totalCost = []; // [Al,Fe,Ti,Cu,Time,Population]

				// Check if planet have enough resources
				for(var i=0; i<unitReturned.cost.length; i++) {
					totalCost[i] = parseInt(unitReturned.cost[i])*inputData.count;
				}

				if(totalCost[1] > planetReturned.resources[2] ||
					totalCost[0] > planetReturned.resources[3] ||
					totalCost[3] > planetReturned.resources[4] ||
					totalCost[2] > planetReturned.resources[5]) { // [Al,Fe,Ti,Cu,Time,Population]

					log(inputData.name +' ('+ inputData.id + ' | ' + inputData.sid +') failed to build units because of no enough resources.');
					SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_COST" });
					return;
				}

				getPeople(planetReturned, function(planetReturned, prod, cons) {
					// Check if planet have enough population
					if(prod < (cons + totalCost[5])) {
						log(inputData.name +' ('+ inputData.id + ' | ' + inputData.sid +') failed to build units because of no enough people.');
						SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_PEOPLE" });
						return;
					}

					// Check if you have required buildings

					// Check fleet
					function callBackAfterfleet(planetReturned,fleetReturned,userReturned,totalCost,inputData) {
						console.info(totalCost);

						// Create entry in planet db for in-build unit
						var newPlanet = UpdatePlanet(planetReturned,userReturned);
						newPlanet.unitBuildingID = inputData.unit;
						newPlanet.unitBuildingCount = inputData.count;
						newPlanet.unitBuildingEndTime = Date.now() + totalCost[4];
						newPlanet.unitBuildingFleetID = fleetReturned._id;

						// Withdraw costs

						// Update database 
						db.planet.update(newPlanet);

						sendPlanetDataToUser({data: newPlanet, id: inputData.id, sid: inputData.sid });

						log(inputData.name+' began building '+inputData.count+' new units ('+inputData.unit+') on planet ' + planetReturned.name + ' (' +inputData.planet+')',"success");
					}

					if(inputData.fleet == -1 && isset(inputData.fleetName)) {
						// Check if fleet max size is reached
						if(totalCost[5] > globalConst["maxFleetSize"]) { 
							log(inputData.name +' ('+ inputData.id + ' | ' + inputData.sid +') failed to build units because fleet will be too big.');
							SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_FLEET_SIZE" });
							return;
						}

						CreateFleet(inputData,planetReturned,function(fleetReturned) {
							callBackAfterfleet(planetReturned,fleetReturned,userReturned,totalCost,inputData);
						});
					} else if(inputData.fleet != -1) {
						db.fleet.find(inputData.fleet, function(fleetReturned) {
							if(!isset(fleetReturned.ownerId) || fleetReturned.ownerId != inputData.id) { return; }

							// Check if this fleet is in orbit and belong to this planet
							if(fleetReturned.position != planetReturned.address || fleetReturned.motherPlanetId != planetReturned.id) { return; }

							// Check if fleet max size is reached
							if((fleetReturned.population + totalCost[5]) > globalConst["maxFleetSize"]) { 
								log(inputData.name +' ('+ inputData.id + ' | ' + inputData.sid +') failed to build units because fleet will be too big.');
								SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_FLEET_SIZE" });
								return;
							}

							callBackAfterfleet(planetReturned,fleetReturned,userReturned,totalCost,inputData);
						});
					}
				});	
			});			
		});
	}

	this.CreateFleet = function(data,planetReturned,callback) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER AND PLANET BEFORE !
		 */
		db.fleet.findByMotherPlanet(data.planet, function(fleetReturned) {
			// Check max count
			if(fleetReturned.length >= hqFleetCount[planetReturned.Buildings[6] - 1]) {
				SendMessageToClient({ sid: inputData.sid, message: "FLEET_MAX_REACHED" });
				return;
			}

			// Check name
			for(var i in fleetReturned) {
				if(fleetReturned.name == data.fleetName) {
					SendMessageToClient({ sid: inputData.sid, message: "FLEET_NAME_ALREADY_EXISTS" });
					return;
				}
			}

			// Add it to db
			var newFleet = {
				name: data.fleetName,
				ownerId: data.id,
				motherPlanetId: data.planet,
				position: planetReturned.address,
				orbitPosition: 0,
				points: 0,
				endMoveTime: -1,
				units: [],
				population: 0,
			};

			db.fleet.create(newFleet, function(newFleet) {
				// Send new list to client
				refreshUserFleets(data.planet,data.sid);

				if(callback) { callback(newFleet); }
			});
				
		});
	}	
}