module.exports = class units {
	/**
	 * Get and send unit data to user
	 *
	 * @param      {object}  data    user data
	 * @return     {socket}  units   list of units types
	 */
	static refreshUnits(data) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER BEFORE !
		 */
		db.unit.findByOwner(data.id,function(units) {
			if(units==undefined) { units = []; }
			io.to(data.sid).emit("units-recieve-data", units);
		});
	}
	
	static refreshFleets(pid,sid) {
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
	static calcCost(shipType,parts) {
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
	static createType(data) {
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
			} else if(ship[i].value==undefined || ship[i].value.split(' ').join('') == "" || ship[i].type==undefined || ship[i].type.split(' ').join('') == "") {
				errors ++;
				message = "SHIP_HAS_EMPTY_FIELD";
				break;
			}
		}

		// Wrong type/shape
		if(shipShapesDetails[ship.type]==undefined || shipShapesDetails[ship.type][ship.shape]==undefined) {
			errors ++;
			message = "SHIP_HAS_WRONG_TYPE_OR_SHAPE";
		}

		if(errors==0) {
			var subprop = "";
			var supprop = "";

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

				// Prevent different subengines
				if(ship[i].type == "sub_propulsion") {
					if(subprop == "") {
						subprop = ship[i].value;
					} else if(subprop != ship[i].value) {
						valid = false;
					}
				}
				// Prevent different supbengines
				if(ship[i].type == "sup_propulsion") {
					if(supprop == "") {
						supprop = ship[i].value;
					} else if(supprop != ship[i].value) {
						valid = false;
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

					if(shipResearchDependencies[ship[i].value]!=undefined && research.getResearch(userReturned,shipResearchDependencies[ship[i].value]) !== -1) {
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

					shipToSave.cost = units.calcCost(ship.shape,shipToSave.parts);

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
								units.refreshUnits(data);
							});
						} else if(duplicate) {
							message = "SHIP_TYPE_ALREADY_EXISTS";
							log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
							websocket.SendMessageToClient({sid: data.sid, message: message});	
						} else {
							message = "SHIP_NAME_ALREADY_EXISTS";
							log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
							websocket.SendMessageToClient({sid: data.sid, message: message});	
						}
					});

				} else {
					// Notify client
					log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
					websocket.SendMessageToClient({sid: data.sid, message: message});
				}
			});
		} else {
			// Notify client
			log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
			websocket.SendMessageToClient({sid: data.sid, message: message});
		}
	}

	static deleteType(data) {
		db.unit.find(data.unit, function(unitReturned) {
			if(!isset(unitReturned) || !isset(unitReturned.ownerId) || unitReturned.ownerId != data.id) { return; }

			if(unitReturned.owned != 0) {
				log(data.username + " has failed to delete unit model named " + unitReturned.name + " because it's used by some units.","fail");
				websocket.SendMessageToClient({sid: data.sid, message: "MODEL_DELETE_USED_BY_UNITS"});
				return;
			}

			log(data.username + " has succed to delete unit model named " + unitReturned.name + ".","success");
			websocket.SendMessageToClient({sid: data.sid, message: "MODEL_DELETED"});

			db.unit.delete(data.unit, function() {
				units.refreshUnits(data);
			});			
		});
	}

	/**
	 * Builds an unit.
	 *
	 * @class      build (name)
	 * @param      string  planet    Where to build that ?
	 * @param      string  unitData  What need to build ?
	 */
	static build(inputData) {
		// Check if planet, unit & fleet belong to player
		planet.find(inputData,inputData.planet,0,function(planetReturned,userReturned,fleetList) {
			if(!isset(planetReturned.owner) || planetReturned.owner != inputData.id) { return; }

			var newPlanet = planet.update(planetReturned,userReturned,fleetList);

			// Check no fleet is currently building
			if(newPlanet.unitBuildingEndTime > Date.now()) {
				log(inputData.username +' failed to build units because another is already building.');
				websocket.SendMessageToClient({ sid: inputData.sid, message: "UNIT_ERROR_ALREADY" });
				return;
			}

			db.unit.find(inputData.unit, function(unitReturned) {
				if(inputData.unit.substr(0,8) == "WEP_MINE" && this.shipCost[inputData.unit] !== undefined) {
					unitReturned = {};
					unitReturned._id = inputData.unit;
					unitReturned.shipType = "SHIP_DEF";
					unitReturned.cost = this.shipCost[inputData.unit];
					unitReturned.ownerId = inputData.id;
				}
				if(!isset(unitReturned) || !isset(unitReturned.ownerId) || unitReturned.ownerId != inputData.id) { return; }
				// Check defence fleet
				if(inputData.fleet == -2 && unitReturned.shipType != "SHIP_DEF") { return; }
				if(unitReturned.shipType == "SHIP_DEF") { inputData.fleet = -2; }

				var choosenFleet = undefined;
				fleetList.forEach(function(fleet) {
					if(fleet._id == inputData.fleet || fleet.id == inputData.fleet) {
						choosenFleet = fleet;
					}

					if(inputData.fleet == -2 && fleet.name == "SHIP_DEF") {
						choosenFleet = fleet;
					}
				})
				
				// Auto create def fleet if not existing
				if(choosenFleet === undefined && inputData.fleet == -2) { 
					inputData.fleet = -1;
					inputData.fleetName = "SHIP_DEF";
				}

				if(unit)
				var totalCost = []; // [Al,Fe,Ti,Cu,Time,Population]

				// Check if planet have enough resources
				for(var i=0; i<unitReturned.cost.length; i++) {
					totalCost[i] = parseFloat(unitReturned.cost[i])*inputData.count;
				}

				if(totalCost[1] > newPlanet.resources[2] ||
					totalCost[0] > newPlanet.resources[3] ||
					totalCost[3] > newPlanet.resources[4] ||
					totalCost[2] > newPlanet.resources[5]) { // [Al,Fe,Ti,Cu,Time,Population]

					log(inputData.username +' failed to build units because of no enough resources.');
					websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_COST" });
					return;
				}

				planet.getPeople(newPlanet,fleetList, function(newPlanet, prod, cons) {
					// Check if planet have enough population
					if(prod < (cons + totalCost[5])) {
						log(inputData.username +' failed to build units because of no enough people.');
						websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_PEOPLE" });
						return;
					}

					// Check if you have required buildings

					// Check fleet
					function callBackAfterfleet(newPlanet,fleetReturned,userReturned,unitReturned,totalCost,inputData) {
						// Create entry in planet db for in-build unit
						newPlanet.unitBuildingID = inputData.unit;
						newPlanet.unitBuildingCount = inputData.count;
						newPlanet.unitBuildingEndTime = Date.now() + Math.round(totalCost[4] * (1-(buildLvlUnitBuildingSpeedBonus*newPlanet.Buildings[7])) * 3600 * 1000);
						newPlanet.unitBuildingFleetID = fleetReturned._id;

						// Withdraw costs
						newPlanet.resources[2] -= totalCost[1];
						newPlanet.resources[3] -= totalCost[0];
						newPlanet.resources[4] -= totalCost[3];
						newPlanet.resources[5] -= totalCost[2];

						// Update planet 
						db.planet.update(newPlanet);

						if(inputData.unit.substr(0,8) != "WEP_MINE") {
							// Update unit
							var newUnit = unitReturned.toJSON();
							newUnit.owned += inputData.count;

							db.unit.update(newUnit);
						}

						// Update fleet
						fleetReturned.population += totalCost[5];
						fleetReturned.inBuilding = true;

						db.fleet.update(fleetReturned);

						planet.sendPlanetDataToUser({data: newPlanet, id: inputData.id, sid: inputData.sid });

						log(inputData.username+' began building '+inputData.count+' new units ('+inputData.unit+') on planet ' + newPlanet.name + ' (' +inputData.planet+')',"success");
						websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_UNIT_OK" });
					}

					if(inputData.fleet == -1 && isset(inputData.fleetName)) {
						// Check if fleet max size is reached
						if(totalCost[5] > globalConst["maxFleetSize"]) { 
							log(inputData.username +' failed to build units because fleet will be too big.');
							websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_FLEET_SIZE" });
							return;
						}

						units.CreateFleet(inputData,newPlanet,function(fleetReturned) {
							callBackAfterfleet(newPlanet,fleetReturned,userReturned,unitReturned,totalCost,inputData);
						});
					} else if(inputData.fleet != -1 && choosenFleet !== undefined) {
						// Check if this fleet is in orbit and belong to this planet
						if(choosenFleet.position != newPlanet.address || choosenFleet.orbitPosition != 0) { 
							websocket.SendMessageToClient({ sid: inputData.sid, message: "FLEET_ISNT_IN_ORBIT" });
							return;
						}
						if(""+choosenFleet.motherPlanetId != ""+newPlanet._id) { return; }

						// Check if fleet max size is reached
						if((choosenFleet.population + totalCost[5]) > globalConst["maxFleetSize"]) { 
							log(inputData.username +' failed to build units because fleet will be too big.');
							websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_FLEET_SIZE" });
							return;
						}

						callBackAfterfleet(newPlanet,choosenFleet,userReturned,unitReturned,totalCost,inputData);
					}  else {
						log(inputData.username +' failed to build units because fleet isn\'t valid.');
						websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_INVALID_FLEET" });
					}
				});	
			});			
		});
	}

	static CreateFleet(data,planet,callback) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER AND PLANET BEFORE !
		 */
		db.fleet.findByMotherPlanet(data.planet, function(fleetReturned) {
			// Check max count
			if(fleetReturned.length >= hqFleetCount[planet.Buildings[6] - 1]) {
				websocket.SendMessageToClient({ sid: data.sid, message: "FLEET_MAX_REACHED" });
				return;
			}

			// Check name
			for(var i=0; i<fleetReturned.length; i++) {
				if(fleetReturned[i].name == data.fleetName) {
					websocket.SendMessageToClient({ sid: data.sid, message: "FLEET_NAME_ALREADY_EXISTS" });
					return;
				}
			}

			// Add it to db
			var newFleet = {
				name: data.fleetName,
				ownerId: data.id,
				motherPlanetId: data.planet,
				position: planet.address,
				orbitPosition: 0,
				points: 0,
				endMoveTime: -1,
				units: [],
				population: 0,
			};

			db.fleet.create(newFleet, function(newFleet) {
				// Send new list to client
				units.refreshFleets(data.planet,data.sid);

				if(callback) { callback(newFleet); }
			});
				
		});
	}

	static calcFuelCost(engines) {
		var cost = 0;

		for(var i in engines) {
			cost += fuelCost[i] * engines[i];
		}

		return cost;
	}

	static hasEnoughCarrier(fleet, unitList) {
		var fighterCount = 0;
		var fighterCap   = 0;

		for(var u in unitList) {
			for(var f in fleet.units) {
				if(fleet.units[f][0] != unitList[u]._id) { continue; }

				if(unitList[u].shipType == "SHIP_FIGHTER") {
					fighterCount += fighterWeight[unitList[u].shipShape] * fleet.units[f][1];
				} else if(unitList[u].shipType == "SHIP_CARRIER") {
					for(var p in unitList[u].parts) {
						if(unitList[u].parts[p].type.substr(0,6) == "hangar") {
							fighterCap += hangarSize[unitList[u].parts[p].type] * fleet.units[f][1];
						}
					}
				}
			}

		}

		return fighterCount <= fighterCap;
	}

	static calcUnitSubSpeed(parts) {
		var speed = [];
		var tech = "";
		var count = 0;

		for(var i in unit.parts) {
			if(unit.parts[i].type == "sub_propulsion") {
				if(speed[0] == -1) { // First sup propulsion part
					tech = unit.parts[i].tech;
					count++;

					if(shipPartsSpeed[unit.parts[i].tech] === undefined) { 
						log("Speed is not defined for part " + unit.parts[i].tech,"error");
						return [];
					}
					speed = shipPartsSpeed[unit.parts[i].tech];
				} else {
					for(var i=0; i<speed.length; i++) {
						speed[i] *= 1.5;
					}
				}
			}
		}

		return {speed: speed, tech: tech, count: count};
	}

	static getFleetMinSubSpeed(unitList) {
		var min = {
			speed: 0,
			engines: {}
		};

		for(var i=0; i<unitList.length; i++) {
			var curr = units.calcUnitSubSpeed(unitList[i]);
			var currSpeed = curr.speed;
			var speed = min.speed;
			if(currSpeed[0] === undefined) { return currSpeed; } // Just in case of bugs

			var testDist = 1000; // Total galaxy
			if((Math.pow(testDist, 2)*currSpeed[0] + testDist*currSpeed[1] + currSpeed[2]) > 
				(Math.pow(testDist, 2)*speed[0] + testDist*speed[1] + speed[2])) { // Compare polynoms, more time = slower
				min["speed"] = speed;
			}

			if(min["engines"][curr["tech"]] == undefined) {
				min["engines"][curr["tech"]] = 0;
			}
			min["engines"][curr["tech"]] += curr["count"];
		}

		return min;
	}

	static calcUnitSupraSpeed(unit) {
		var speed = [];
		var tech = "";
		var count = 0;

		for(var i in unit.parts) {
			if(unit.parts[i].type == "sup_propulsion") {
				tech = unit.parts[i].tech;
				count++;
				
				if(speed[0] == -1) { // First sup propulsion part
					if(shipPartsSpeed[unit.parts[i].tech] === undefined) { 
						log("Speed is not defined for part " + unit.parts[i].tech,"error");
						return [];
					}
					speed = shipPartsSpeed[unit.parts[i].tech];
				} else {
					for(var i=0; i<speed.length; i++) {
						speed[i] *= 1.5;
					}
				}
			}
		}

		return {speed: speed, tech: tech, count: count};
	}

	static getFleetMinSupraSpeed(unitList) {
		var min = {
			speed: 0,
			engines: {}
		};

		for(var i=0; i<unitList.length; i++) {
			if(unitList[i].shipType == "SHIP_FIGHTER") { continue; } // Don't care about fighter they are carried

			var curr = units.calcUnitSupraSpeed(unitList[i]);
			var currSpeed = curr.speed;
			var speed = min.speed;
			if(currSpeed[0] === undefined) { return currSpeed; } // If they can't move to another system, no need to calc it ...

			var testDist = 1000; // Total galaxy size
			if((Math.pow(testDist, 2)*currSpeed[0] + testDist*currSpeed[1] + currSpeed[2]) > 
				(Math.pow(testDist, 2)*speed[0] + testDist*speed[1] + speed[2])) { // Compare polynoms, more time = slower
				min["speed"] = speed;
			}

			if(min["engines"][curr["tech"]] == undefined) {
				min["engines"][curr["tech"]] = 0;
			}
			min["engines"][curr["tech"]] += curr["count"];
		}

		return min;
	}

	static getFleetUnits(unitIdList, callback, i=0, unitList=[]) {
		if(i>=unitIdList.length) {
			callback(unitList);
			return;
		}

		// Find next unit
		db.unit.find(unitIdList[i][0], function(unitReturned) {
			if(isset(unitReturned)) {
				unitList.push(unitReturned);
			}
			units.getFleetUnits(unitIdList, callback, i++, unitList);
		});
	}

	static fleetMoveTo(user, fleetId, destination) {
		var coordsArrivee = destination.split("-");
			coordsArrivee = [parseInt(coordsArrivee[0]), parseInt(coordsArrivee[1])];

		// Get Fleet data
		db.fleet.find(fleetId, function(fleetReturned) {
			if(!isset(fleetReturned)) { return; } // Does this fleet exists
			if(fleetReturned.name == "SHIP_DEF") { return; } // Is this fleet movable ? (not defense fleet)
			if(fleetReturned.inBuilding !== undefined && fleetReturned.inBuilding) { // Are units building in this fleet ?
				websocket.SendMessageToClient({ sid: user.sid, message: "IN_BUILDING_FLEET" }); 
				return; 
			} 
			if(fleetReturned.endMoveTime > 0) { // Is this fleet moving ?
				websocket.SendMessageToClient({ sid: user.sid, message: "ALREADY_MOVING_FLEET" }); 
				return;
			}

			if(fleetReturned.position == destination) { // Subluminique
				units.getFleetUnits(fleetReturned.units, function(unitList) {
					var minSpeed = units.getFleetMinSubSpeed(unitList);
					var speed = minSpeed.speed;
					var fuel = units.calcFuelCost(minSpeed.engines);

					if(speed[0] === undefined) { return; }

					var dist = 0; // @ADD Calc distance between current planet pos & previewed planet pos (Will be painful ...)

					var time = Math.pow(dist, 2)*speed[0] + dist*speed[1] + speed[2];

					units.fleetCompleteMove(user, fleetReturned, destination, time);
				});
			} else { // Supraluminique
				units.getFleetUnits(fleetReturned.units, function(unitList) {
					if(!units.hasEnoughCarrier(fleetReturned, unitList)) {
						websocket.SendMessageToClient({ sid: user.sid, message: "NO_ENOUGHT_CARRIER" });
						return;
					}

					var minSpeed = units.getFleetMinSupraSpeed(unitList);
					var speed = minSpeed.speed;
					var fuel = units.calcFuelCost(minSpeed.engines);

					if(speed[0] === undefined) {
						websocket.SendMessageToClient({ sid: user.sid, message: "CANT_MAKE_SUPRAMOVE" });
						return;
					}

					var coordsDepart = fleetReturned.position.split("-");
						coordsDepart = [parseInt(coordsDepart[0]), parseInt(coordsDepart[1])];
					
					var dist = Math.sqrt(
							Math.pow(coordsDepart[0] - coordsArrivee[0],2) + 
							Math.pow(coordsDepart[1] - coordsArrivee[1],2)
						);

					var time = Math.pow(dist, 2)*speed[0] + dist*speed[1] + speed[2];

					units.fleetCompleteMove(user, fleetReturned, destination, time);
				});
			}
		});
	}

	static fleetCompleteMove(user, fleet, destination, time) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO CHECK FLEET BEFORE !
		 */
		var instability = time * 0.001 * (Math.random() - 0.5);
		if(research.isSearched(user,"prop_suprastability")) {
			instability /= 2;
		}

		var newFleet = fleet.toJSON();
		newFleet.endMoveTime = Date.now() + ((time + instability) * 3600000);
		newFleet.position = destination
		newFleet.orbitPosition = -1;

		db.fleet.update(newFleet, function() {
			user.refreshFleets(newFleet.motherPlanetId, user.sid);
		});
	}
}