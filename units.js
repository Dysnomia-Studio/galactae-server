module.exports = class Units {
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
		db.unit.findByOwner(data.id,function(unitList) {
			if(unitList==undefined) { unitList = []; }
			io.to(data.sid).emit("units-recieve-data", unitList);
		});
	}
	
	static refreshFleets(pid,sid) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER AND PLANET BEFORE !
		 */
		//@ADD: Recalc fleet positions
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
	static calcCost(shipShape,parts) {
		let totalCost = shipCosts[shipShape];

		for(let id=0; id<parts.length; id++) {
			if(!isset(shipCosts[parts[id].tech])) { // If we do our work, this would never happend but that's a security measure ..
				log("Cost is not defined for part " + parts[id].tech + " in ship " + shipShape,"error");
				return [-1];
			}

			let addCost = shipCosts[parts[id].tech];

			for(let i=0; i<6; i++) {
				if(shipShape.substr(0,12) == "SHIP_FIGHTER") {
					addCost[i] *= fighterMult[shipShape];
				}
				
				totalCost[i] += addCost[i];
			}
		}

		// Round this
		for(let i=0; i<6; i++) {
			if(i != 4) {
				totalCost[i] = Math.round(totalCost[i]);
			} else {
				totalCost[i] = Math.round(totalCost[i]*100)/100;
			}
		}

		return totalCost;
	}

	static checkShipParts(ship) {
		let subprop = "";
		let supprop = "";

		for(let i in ship) {
			if(i=="name" || i=="type" || i=="shape") { continue; }
			// Check if that kind of part exists in that kind of ship
			let valid = false;
			for(let type in shipShapesDetails[ship.type][ship.shape].content) {
				if(type==ship[i].type) {
					valid = true;
					break;
				}
			}

			// Check if that part exists in that kind of ship
			if(valid) {
				valid = false;
				for(let j=0; j<shipShapesDetails[ship.type][ship.shape]['svg'].length; j++) {
					if(isset(shipShapesDetails[ship.type][ship.shape]['svg'][j][6]) && shipShapesDetails[ship.type][ship.shape]['svg'][j][6]==i) {
						valid = true;
						break;
					}
				}
			}

			// Check if technology exists in that kind of ship
			if(valid) {
				valid = false;
				for(let j=0; j<shipShapesDetails[ship.type][ship.shape]['content'][ship[i].type].length; j++) {
					if(shipShapesDetails[ship.type][ship.shape]['content'][ship[i].type][j]==ship[i].value) {
						valid = true;
						break;
					}
				}
			}

			// Prevent different subengines
			if(valid && ship[i].type == "sub_propulsion") {
				if(subprop == "") {
					subprop = ship[i].value;
				} else if(subprop != ship[i].value) {
					valid = false;
				}
			}
			// Prevent different supengines
			if(valid && ship[i].type == "sup_propulsion") {
				if(supprop == "") {
					supprop = ship[i].value;
				} else if(supprop != ship[i].value) {
					valid = false;
				}
			}

			// Stop check if not valid
			if(!valid) {
				return false;
			}
		}

		return true;
	}

	static checkIfSameParts(ship1, ship2) {
		// Sort
		ship1.parts.sort(function(a,b) {
			if(a.name < b.name) {
				return -1;
			}
			return 1;
		});

		ship2.parts.sort(function(a,b) {
			if(a.name < b.name) {
				return -1;
			}
			return 1;
		});

		// Compare
		let duplicate = true;
		for(let i=0; i<ship2.parts.length; i++) {
			for(let id in ship2.parts[i]) {
				if(ship2.parts[i][id] !== ship1.parts[i][id]) {
					duplicate = false;
					break;
				}
			}
		}

		return duplicate;
	}

	/**
	 * Creates an unit type.
	 *
	 * @class      CreateUnitType (name)
	 * @param      {<type>}  data    Data given by client
	 */
	static createType(data) {
		let message = "";
		let ship = data.ship;

		// That block 90% of tries to crash
		if(ship.name==undefined || ship.shape==undefined || ship.type==undefined) { return; }

		// Filter name
		ship.name = filterUnwantedChars(ship.name );

		// Check entries valdity
		for(let i in ship) {
			// Empty fields
			if(i=="name" || i=="type" || i=="shape") { // In facts, the two last verifications won't display error, but they're here to simplify the else
				if(ship[i].split(' ').join('')=="") {
					message = "SHIP_HAS_NO_NAME";
					break;
				} 
			} else if(!isset(ship[i].value) || !isset(ship[i].type)) {
				message = "SHIP_HAS_EMPTY_FIELD";
				break;
			}
		}

		// Wrong type/shape
		if(shipShapesDetails[ship.type]==undefined || shipShapesDetails[ship.type][ship.shape]==undefined) {
			message = "SHIP_HAS_WRONG_TYPE_OR_SHAPE";
		}

		if(!isset(message) && !checkShipParts(ship)) {
			message = "SHIP_HAS_INVALID_PARTS";
		}

		// Last check
		if(!isset(message)) {
			db.player.searchByName(data.username,function(userReturned) {
				// Check research
				for(let i in ship) {
					if(i=="name" || i=="type" || i=="shape") { continue; }

					if(shipResearchDependencies[ship[i].value]!=undefined && Research.getResearch(userReturned,shipResearchDependencies[ship[i].value]) !== -1) {
						message = "NEEDED_RESEARCH_MISSING";
						break;
					}
				}

				// Saving
				if(!isset(message)) {
					// Save to database
					let shipToSave = {
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

					for(let i in ship) {
						if(i=="name" || i=="type" || i=="shape") { continue; }
						
						shipToSave.parts.push({
							type: ship[i].type,
							name: i,
							tech: ship[i].value
						});
					}

					shipToSave.cost = Units.calcCost(ship.shape,shipToSave.parts);

					if(shipToSave.cost[0] == -1) { return; } // There's something wrong ... Security measure

					db.unit.findByOwner(data.id,function(unitList) {
						let duplicate = false;
						let duplicateName = false;

						for(let currObj in unitList) {
							if(unitList[currObj].name == shipToSave.name) {
								duplicateName = true;
								break;
							}

							if(unitList[currObj].shipType == shipToSave.shipType && 
								unitList[currObj].shipShape == shipToSave.shipShape &&
								unitList[currObj].parts.length == shipToSave.parts.length) {

								duplicate = checkIfSameParts(unitList[currObj], shipToSave);
								if(duplicate) {
									break;
								}
							} // End check parts
						}

						if(!duplicate && !duplicateName) {
							db.unit.create(shipToSave, function() {
								// Notify client
								log(data.username + " has succed to create new unit type named " + ship.name,"success");
								Units.refresh(data);
							});
						} else if(duplicate) {
							message = "SHIP_TYPE_ALREADY_EXISTS";
							log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
							Websocket.SendMessageToClient({sid: data.sid, message: message});	
						} else {
							message = "SHIP_NAME_ALREADY_EXISTS";
							log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
							Websocket.SendMessageToClient({sid: data.sid, message: message});	
						}
					});

				} else {
					// Notify client
					log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
					Websocket.SendMessageToClient({sid: data.sid, message: message});
				}
			});
		} else {
			// Notify client
			log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
			Websocket.SendMessageToClient({sid: data.sid, message: message});
		}
	}

	static renameType(data) {
		db.unit.find(data.shipId, function(unitReturned) {
			if(!isset(unitReturned) || !isset(unitReturned.ownerId) || unitReturned.ownerId != data.id) { return; }

			unitReturned.name = data.shipNewName;

			db.unit.update(unitReturned, function() {
				log(data.username + " has succed to rename unit type old:" + unitReturned.name + ", new: " + data.shipNewName,"success");
				Units.refreshUnits(data);
			});
		});
	}

	static deleteType(data) {
		db.unit.find(data.unit, function(unitReturned) {
			if(!isset(unitReturned) || !isset(unitReturned.ownerId) || unitReturned.ownerId != data.id) { return; }

			if(unitReturned.owned != 0) {
				log(data.username + " has failed to delete unit model named " + unitReturned.name + " because it's used by some units.","fail");
				Websocket.SendMessageToClient({sid: data.sid, message: "MODEL_DELETE_USED_BY_UNITS"});
				return;
			}

			log(data.username + " has succed to delete unit model named " + unitReturned.name + ".","success");
			Websocket.SendMessageToClient({sid: data.sid, message: "MODEL_DELETED"});

			db.unit.delete(data.unit, function() {
				Units.refreshUnits(data);
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
		Planet.find(inputData,inputData.planet,0,function(planetReturned,userReturned,fleetList) {
			if(!isset(planetReturned.owner) || planetReturned.owner != inputData.id) { return; }

			let newPlanet = Planet.update(planetReturned,userReturned,fleetList);

			// Check no fleet is currently building
			if(newPlanet.unitBuildingEndTime > Date.now()) {
				log(inputData.username +' failed to build units because another is already building.');
				Websocket.SendMessageToClient({ sid: inputData.sid, message: "UNIT_ERROR_ALREADY" });
				return;
			}
			let id = (inputData.unit.substr(0,14) == "SHIP_WEP_MINES")?"000000000000000000000000":inputData.unit;
			db.unit.find(id, function(unitReturned) {
				if(inputData.unit.substr(0,14) == "SHIP_WEP_MINES" && shipCosts[inputData.unit] !== undefined) {
					unitReturned = {};
					unitReturned._id = inputData.unit;
					unitReturned.shipType = "SHIP_DEF";
					unitReturned.cost = shipCosts[inputData.unit];
					unitReturned.ownerId = inputData.id;
				}
				if(!isset(unitReturned) || !isset(unitReturned.ownerId) || unitReturned.ownerId != inputData.id) { return; }
				// Check defence fleet
				if(inputData.fleet == -2 && unitReturned.shipType != "SHIP_DEF") { return; }
				if(unitReturned.shipType == "SHIP_DEF") { inputData.fleet = -2; }

				let choosenFleet;
				fleetList.forEach(function(fleet) {
					if(fleet._id == inputData.fleet || fleet.id == inputData.fleet) {
						choosenFleet = fleet;
					}

					if(inputData.fleet == -2 && fleet.name == "SHIP_DEF") {
						choosenFleet = fleet;
					}
				});
				
				// Auto create def fleet if not existing
				if(choosenFleet === undefined && inputData.fleet == -2) { 
					inputData.fleet = -1;
					inputData.fleetName = "SHIP_DEF";
				}

				let totalCost = []; // [Al,Fe,Ti,Cu,Time,Population]

				// Check if planet have enough resources
				for(let i=0; i<unitReturned.cost.length; i++) {
					totalCost[i] = parseFloat(unitReturned.cost[i])*inputData.count;
				}

				if(totalCost[1] > newPlanet.resources[2] ||
					totalCost[0] > newPlanet.resources[3] ||
					totalCost[3] > newPlanet.resources[4] ||
					totalCost[2] > newPlanet.resources[5]) { // [Al,Fe,Ti,Cu,Time,Population]

					log(inputData.username +' failed to build units because of no enough resources.');
					Websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_COST" });
					return;
				}

				Planet.getPeople(newPlanet,fleetList, function(newPlanet, prod, cons) {
					// Check if planet have enough population
					if(prod < (cons + totalCost[5])) {
						log(inputData.username +' failed to build units because of no enough people.');
						Websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_PEOPLE" });
						return;
					}

					// Check if you have required buildings

					// Check fleet
					function callBackAfterfleet(newPlanet,fleetReturned,userReturned,unitReturned,totalCost,inputData) {
						var currTime = Date.now();

						// Create entry in planet db for in-build unit
						newPlanet.unitBuildingID = inputData.unit;
						newPlanet.unitBuildingEndTime = currTime + Math.round(totalCost[4] * (1-(buildLvlUnitBuildingSpeedBonus*newPlanet.Buildings[7])) * 3600 * 1000);
						newPlanet.unitBuildingCount = inputData.count;
						newPlanet.unitBuildingFleetID = fleetReturned._id;

						newPlanet.lastUnitUpdate = currTime;

						// Withdraw costs
						newPlanet.resources[2] -= totalCost[1];
						newPlanet.resources[3] -= totalCost[0];
						newPlanet.resources[4] -= totalCost[3];
						newPlanet.resources[5] -= totalCost[2];

						// Update planet 
						db.planet.update(newPlanet);

						if(inputData.unit.substr(0,14) != "SHIP_WEP_MINES") {
							// Update unit
							let newUnit = unitReturned.toJSON();
							newUnit.owned += inputData.count;

							db.unit.update(newUnit);
						}

						// Update fleet
						fleetReturned.population += totalCost[5];
						fleetReturned.inBuilding = true;

						db.fleet.update(fleetReturned);

						Planet.sendPlanetDataToUser({data: newPlanet, id: inputData.id, sid: inputData.sid });

						log(inputData.username+' began building '+inputData.count+' new units ('+inputData.unit+') on planet ' + newPlanet.name + ' (' +inputData.planet+')',"success");
						Websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_UNIT_OK" });
					}

					if(inputData.fleet == -1 && isset(inputData.fleetName)) {
						// Check if fleet max size is reached
						if(totalCost[5] > globalConst.maxFleetSize) { 
							log(inputData.username +' failed to build units because fleet will be too big.');
							Websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_FLEET_SIZE" });
							return;
						}

						Units.CreateFleet(inputData,newPlanet,function(fleetReturned) {
							callBackAfterfleet(newPlanet,fleetReturned,userReturned,unitReturned,totalCost,inputData);
						});
					} else if(inputData.fleet != -1 && choosenFleet !== undefined) {
						// Check if this fleet is in orbit and belong to this planet
						if(choosenFleet.position != newPlanet.address || choosenFleet.orbitPosition != 0) { 
							Websocket.SendMessageToClient({ sid: inputData.sid, message: "FLEET_ISNT_IN_ORBIT" });
							return;
						}
						if(""+choosenFleet.motherPlanetId != ""+newPlanet._id) { return; }

						// Check if fleet max size is reached
						if((choosenFleet.population + totalCost[5]) > globalConst.maxFleetSize) { 
							log(inputData.username +' failed to build units because fleet will be too big.');
							Websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_FLEET_SIZE" });
							return;
						}

						callBackAfterfleet(newPlanet,choosenFleet,userReturned,unitReturned,totalCost,inputData);
					}  else {
						log(inputData.username +' failed to build units because fleet isn\'t valid.');
						Websocket.SendMessageToClient({ sid: inputData.sid, message: "BUILDING_ERROR_INVALID_FLEET" });
					}
				});	
			});			
		});
	}

	static CreateFleet(data,planetData,callback) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER AND PLANET BEFORE !
		 */
		db.fleet.findByMotherPlanet(data.planet, function(fleetReturned) {
			// Check max count
			if(fleetReturned.length >= hqFleetCount[planetData.Buildings[6] - 1]) {
				Websocket.SendMessageToClient({ sid: data.sid, message: "FLEET_MAX_REACHED" });
				return;
			}

			// Check name
			for(let i=0; i<fleetReturned.length; i++) {
				if(fleetReturned[i].name == data.fleetName) {
					Websocket.SendMessageToClient({ sid: data.sid, message: "FLEET_NAME_ALREADY_EXISTS" });
					return;
				}
			}

			// Add it to db
			let newFleet = {
				name: data.fleetName,
				ownerId: data.id,
				motherPlanetId: data.planet,
				position: planetData.address,
				orbitPosition: 0,
				points: 0,
				endMoveTime: -1,
				units: [],
				population: 0,
			};

			db.fleet.create(newFleet, function(newFleet) {
				// Send new list to client
				Units.refreshFleets(data.planet,data.sid);

				if(callback) { callback(newFleet); }
			});
				
		});
	}

	static calcFuelCost(engines) {
		let cost = 0;

		for(let i in engines) {
			cost += fuelCost[i] * engines[i];
		}

		return cost;
	}

	static hasEnoughCarrier(fleet, unitList) {
		let fighterCount = 0;
		let fighterCap   = 0;

		for(let u in unitList) {
			for(let f in fleet.units) {
				if(fleet.units[f][0] != unitList[u]._id) { continue; }

				if(unitList[u].shipType == "SHIP_FIGHTER") {
					fighterCount += fighterWeight[unitList[u].shipShape] * fleet.units[f][1];
				} else if(unitList[u].shipType == "SHIP_CARRIER") {
					for(let p in unitList[u].parts) {
						if(unitList[u].parts[p].type == "hangar") {
							fighterCap += hangarSize[unitList[u].parts[p].tech] * fleet.units[f][1];
						}
					}
				}
			}

		}

		return fighterCount <= fighterCap;
	}

	static slowerSpeed(curr, other) {
		let testDist = 1000; // Total galaxy
		if((Math.pow(testDist, 2)*curr[0] + testDist*curr[1] + curr[2]) > 
			(Math.pow(testDist, 2)*other[0] + testDist*other[1] + other[2])) { // Compare polynoms, more time = slower
			return other;
		} else {
			return curr;
		}
	}

	static calcUnitSubSpeed(unit) {
		let speed = [];
		let tech = "";
		let count = 0;

		for(let i in unit.parts) {
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
					for(let i=0; i<speed.length; i++) {
						speed[i] *= 1.5;
					}
				}
			}
		}

		return {speed: speed, tech: tech, count: count};
	}

	static getFleetMinSubSpeed(unitList) {
		let min = {
			speed: 0,
			engines: {}
		};

		for(let i=0; i<unitList.length; i++) {
			let curr = Units.calcUnitSubSpeed(unitList[i]);

			if(curr.speed[0] === undefined) { return curr.speed; } // Just in case of bugs

			min.speed = slowerSpeed(curr.speed, min.speed);

			if(min.engines[curr.tech] == undefined) {
				min.engines[curr.tech] = 0;
			}
			min.engines[curr.tech] += curr.count;
		}

		return min;
	}

	static calcUnitSupraSpeed(unit) {
		let speed = [];
		let tech = "";
		let count = 0;

		for(let i in unit.parts) {
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
					for(let i=0; i<speed.length; i++) {
						speed[i] *= 1.5;
					}
				}
			}
		}

		return {speed: speed, tech: tech, count: count};
	}

	static getFleetMinSupraSpeed(unitList) {
		let min = {
			speed: 0,
			engines: {}
		};

		for(let i=0; i<unitList.length; i++) {
			if(unitList[i].shipType == "SHIP_FIGHTER") { continue; } // Don't care about fighter they are carried

			if(curr.speed[0] === undefined) { return curr.speed; } // Just in case of bugs

			min.speed = slowerSpeed(curr.speed, min.speed);

			if(min.engines[curr.tech] == undefined) {
				min.engines[curr.tech] = 0;
			}
			min.engines[curr.tech] += curr.count;
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
			Units.getFleetUnits(unitIdList, callback, i++, unitList);
		});
	}

	static calcMoveTime(dist, speed) {
		return Math.pow(dist, 2)*speed[0] + dist*speed[1] + speed[2];
	}

	static fleetMoveTo(user, fleetId, destination) {
		let coordsArrivee = destination.split("-");
			coordsArrivee = [parseInt(coordsArrivee[0]), parseInt(coordsArrivee[1])];

		let now = Date.now();

		// Get Fleet data
		db.fleet.find(fleetId, function(fleetReturned) {
			if(!isset(fleetReturned)) { return; } // Does this fleet exists
			if(fleetReturned.name == "SHIP_DEF") { return; } // Is this fleet movable ? (not defense fleet)
			if(fleetReturned.inBuilding !== undefined && fleetReturned.inBuilding) { // Are units building in this fleet ?
				Websocket.SendMessageToClient({ sid: user.sid, message: "IN_BUILDING_FLEET" }); 
				return; 
			} 
			if(fleetReturned.endMoveTime > 0) { // Is this fleet moving ?
				Websocket.SendMessageToClient({ sid: user.sid, message: "ALREADY_MOVING_FLEET" }); 
				return;
			}

			if(fleetReturned.position == destination) { // Current planet
				Websocket.SendMessageToClient({ sid: user.sid, message: "ALREADY_AT_DESTINATION" }); 
				return;
			}

			if(fleetReturned.position.substr(0,5) == destination.substr(0,5) ) { // Subluminique
				Units.getFleetUnits(fleetReturned.units, function(unitList) {
					let minSpeed = Units.getFleetMinSubSpeed(unitList);
					let speed = minSpeed.speed;
					let fuel = Units.calcFuelCost(minSpeed.engines);

					if(speed[0] === undefined) { return; }
					if(fuel < fleetReturned.fuel) {
						Websocket.SendMessageToClient({ sid: user.sid, message: "NO_ENOUGHT_FUEL" }); 
						return;
					}

					let baseDist = GameMap.getPlanetDistance(
						fleetReturned.position,
						destination,
						now);
					if(baseDist < 0) { return; }
					let baseTravelTime = Units.calcMoveTime(baseDist, speed);

					let previewDist = GameMap.getPlanetDistance(
						fleetReturned.position,
						destination,
						now + baseTravelTime);
					if(previewDist < 0) { return; }
					let previewTime = Units.calcMoveTime(previewDist, speed);

					/* Final travel time:
						Average of ...
						 Time to travel to planet where it's now
						and
						 Time to travel to planet where it'll be when we arrive to this previous position
				    */
					let time = (baseTravelTime + previewTime)/2;


					fleetReturned.fuel -= fuel;
					Units.fleetCompleteMove(user, fleetReturned, destination, time);
				});
			} else { // Supraluminique
				Units.getFleetUnits(fleetReturned.units, function(unitList) {
					if(!Units.hasEnoughCarrier(fleetReturned, unitList)) {
						Websocket.SendMessageToClient({ sid: user.sid, message: "NO_ENOUGHT_CARRIER" });
						return;
					}

					let minSpeed = Units.getFleetMinSupraSpeed(unitList);
					let speed = minSpeed.speed;
					let fuel = Units.calcFuelCost(minSpeed.engines);

					if(speed[0] === undefined) {
						Websocket.SendMessageToClient({ sid: user.sid, message: "CANT_MAKE_SUPRAMOVE" });
						return;
					}

					if(fuel < fleetReturned.fuel) {
						Websocket.SendMessageToClient({ sid: user.sid, message: "NO_ENOUGHT_FUEL" }); 
						return;
					}

					let coordsDepart = fleetReturned.position.split("-");
						coordsDepart = [parseInt(coordsDepart[0]), parseInt(coordsDepart[1])];
					
					let dist = Math.sqrt(
							Math.pow(coordsDepart[0] - coordsArrivee[0],2) + 
							Math.pow(coordsDepart[1] - coordsArrivee[1],2)
						);

					let time = Units.calcMoveTime(dist, speed);

					fleetReturned.fuel -= fuel;
					Units.fleetCompleteMove(user, fleetReturned, destination, time);
				});
			}
		});
	}

	static fleetCompleteMove(user, fleet, destination, time) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO CHECK FLEET BEFORE !
		 */
		let instability = time * 0.001 * (Math.random() - 0.5);
		if(Research.isSearched(user,"prop_suprastability")) {
			instability /= 2;
		}

		let newFleet = fleet.toJSON();
		newFleet.endMoveTime = Date.now() + ((time + instability) * 3600000);
		newFleet.position = destination;
		newFleet.orbitPosition = -1;

		db.fleet.update(newFleet, function() {
			user.refreshFleets(newFleet.motherPlanetId, user.sid);
		});
	}
};