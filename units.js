module.exports = class Units {
	/**
	 * Get and send unit data to user
	 *
	 * @param      {object}  data    user data
	 * @return     {socket}  units   list of units types
	 */
	static refresh(data) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER BEFORE !
		 */
		db.unit.findByOwner(data.id,function(unitList) {
			if(unitList===undefined) { unitList = []; }
			io.to(data.sid).emit('units-recieve-data', unitList);
		});
	}

	static checkShipParts(ship) {
		let subprop = '';
		let supprop = '';

		for(const i in ship) {
			if(i==='name' || i==='type' || i==='shape') { continue; }
			// Check if that kind of part exists in that kind of ship
			let valid = false;
			for(const type in shipShapesDetails[ship.type][ship.shape].content) {
				if(type===ship[i].type) {
					valid = true;
					break;
				}
			}

			// Check if that part exists in that kind of ship
			if(valid) {
				valid = false;
				for(let j=0; j<shipShapesDetails[ship.type][ship.shape]['svg'].length; j++) {
					if(isset(shipShapesDetails[ship.type][ship.shape]['svg'][j][6]) && shipShapesDetails[ship.type][ship.shape]['svg'][j][6]===i) {
						valid = true;
						break;
					}
				}
			}

			// Check if technology exists in that kind of ship
			if(valid) {
				valid = false;
				for(let j=0; j<shipShapesDetails[ship.type][ship.shape]['content'][ship[i].type].length; j++) {
					if(shipShapesDetails[ship.type][ship.shape]['content'][ship[i].type][j]===ship[i].value) {
						valid = true;
						break;
					}
				}
			}

			// Prevent different subengines
			if(valid && ship[i].type === 'sub_propulsion') {
				if(subprop === '') {
					subprop = ship[i].value;
				} else if(subprop !== ship[i].value) {
					valid = false;
				}
			}
			// Prevent different supengines
			if(valid && ship[i].type === 'sup_propulsion') {
				if(supprop === '') {
					supprop = ship[i].value;
				} else if(supprop !== ship[i].value) {
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

	/**
	 * Creates an unit type.
	 *
	 * @class      CreateUnitType (name)
	 * @param      {<type>}  data    Data given by client
	 */
	static createType(data) {
		let message = '';
		const ship = data.ship;

		// That block 90% of tries to crash
		if(ship.name===undefined || ship.shape===undefined || ship.type===undefined) { return; }

		// Filter name
		ship.name = filterUnwantedChars(ship.name );

		// Check entries valdity
		for(const i in ship) {
			// Empty fields
			if(i==='name' || i==='type' || i==='shape') { // In facts, the two last verifications won't display error, but they're here to simplify the else
				if(ship[i].split(' ').join('')==='') {
					message = 'SHIP_HAS_NO_NAME';
					break;
				}
			} else if(!isset(ship[i].value) || !isset(ship[i].type)) {
				message = 'SHIP_HAS_EMPTY_FIELD';
				break;
			}
		}

		// Wrong type/shape
		if(shipShapesDetails[ship.type]===undefined || shipShapesDetails[ship.type][ship.shape]===undefined) {
			message = 'SHIP_HAS_WRONG_TYPE_OR_SHAPE';
		}

		if(!isset(message) && !Units.checkShipParts(ship)) {
			message = 'SHIP_HAS_INVALID_PARTS';
		}

		// Last check
		if(!isset(message)) {
			db.player.searchByName(data.username,function(userReturned) {
				// Check research
				for(const i in ship) {
					if(i==='name' || i==='type' || i==='shape') { continue; }

					if(shipResearchDependencies[ship[i].value] !== undefined && !Research.isSearched(userReturned,shipResearchDependencies[ship[i].value])) {
						message = 'NEEDED_RESEARCH_MISSING';
						break;
					}
				}

				// Saving
				if(!isset(message)) {
					// Save to database
					const shipToSave = {
						name: ship.name,
						shipType: ship.type,
						shipShape: ship.shape,
						ownerId: data.id,
						cost: [],
						parts: [],
						armorType: 0, // None yet
						note: 0, // Not yet
						owned: 0,
					};

					for(const i in ship) {
						if(i==='name' || i==='type' || i==='shape') { continue; }

						shipToSave.parts.push({
							type: ship[i].type,
							name: i,
							tech: ship[i].value,
						});
					}

					shipToSave.cost = Unit.calcCost(ship.shape,shipToSave.parts);

					if(shipToSave.cost[0] === -1) { return; } // There's something wrong ... Security measure

					db.unit.findByOwner(data.id,function(unitList) {
						const [duplicate, duplicateName] = Unit.checkIfDuplicate(unitList, shipToSave);

						if(!duplicate && !duplicateName) {
							db.unit.create(shipToSave, function() {
								log(data.username + ' has succed to create new unit type named ' + ship.name,'success');
								Units.refresh(data);
							});
						} else if(duplicate) {
							message = 'SHIP_TYPE_ALREADY_EXISTS';
							log(data.username + ' has failed to create unit type named ' + ship.name + ' because ' + message,'fail');
							Websocket.SendMessageToClient({sid: data.sid, message: message});
						} else {
							message = 'SHIP_NAME_ALREADY_EXISTS';
							log(data.username + ' has failed to create unit type named ' + ship.name + ' because ' + message,'fail');
							Websocket.SendMessageToClient({sid: data.sid, message: message});
						}
					});

				} else {
					// Notify client
					log(data.username + ' has failed to create unit type named ' + ship.name + ' because ' + message,'fail');
					Websocket.SendMessageToClient({sid: data.sid, message: message});
				}
			});
		} else {
			// Notify client
			log(data.username + ' has failed to create unit type named ' + ship.name + ' because ' + message,'fail');
			Websocket.SendMessageToClient({sid: data.sid, message: message});
		}
	}

	static renameType(data) {
		db.unit.find(data.shipId, function(unitReturned) {
			if(!isset(unitReturned) || !isset(unitReturned.ownerId) || ''+unitReturned.ownerId !== ''+data.id) { return; }

			const newUnit = {
				id: unitReturned.id,
				name: data.shipNewName,
			};

			db.unit.update(newUnit, function() {
				log(data.username + ' has succed to rename unit type old:' + unitReturned.name + ', new: ' + data.shipNewName,'success');
				Units.refresh(data);
			});
		});
	}

	static deleteType(data) {
		db.unit.find(data.unit, function(unitReturned) {
			if(!isset(unitReturned) || !isset(unitReturned.ownerId) || ''+unitReturned.ownerId !== ''+data.id) { return; }

			if(unitReturned.owned !== 0) {
				log(data.username + ' has failed to delete unit model named ' + unitReturned.name + ' because it\'s used by some units.','fail');
				Websocket.SendMessageToClient({sid: data.sid, message: 'MODEL_DELETE_USED_BY_UNITS'});
				return;
			}

			log(data.username + ' has succed to delete unit model named ' + unitReturned.name + '.','success');
			Websocket.SendMessageToClient({sid: data.sid, message: 'MODEL_DELETED'});

			db.unit.delete(data.unit, function() {
				Units.refresh(data);
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
			if(!isset(planetReturned.owner) || ''+planetReturned.owner !== ''+inputData.id) { return; }

			const newPlanet = Planet.update(planetReturned,userReturned,fleetList);

			// Check no fleet is currently building
			if(newPlanet.unitBuildingEndTime > Date.now()) {
				log(inputData.username +' failed to build units because another is already building.');
				Websocket.SendMessageToClient({ sid: inputData.sid, message: 'UNIT_ERROR_ALREADY' });
				return;
			}
			const id = (inputData.unit.substr(0,'SHIP_WEP_MINES'.length) === 'SHIP_WEP_MINES')?'000000000000000000000000':inputData.unit;
			db.unit.find(id, function(unitReturned) {
				if(inputData.unit.substr(0,'SHIP_WEP_MINES'.length) === 'SHIP_WEP_MINES' && shipCosts[inputData.unit] !== undefined) {
					unitReturned = {};
					unitReturned.id = inputData.unit;
					unitReturned.shipType = 'SHIP_DEF';
					unitReturned.cost = shipCosts[inputData.unit];
					unitReturned.ownerId = inputData.id;
				}
				if(!isset(unitReturned) || !isset(unitReturned.ownerId) || ''+unitReturned.ownerId !== ''+inputData.id) { return; }
				// Check defence fleet
				if(inputData.fleet === -2 && unitReturned.shipType !== 'SHIP_DEF') { return; }
				if(unitReturned.shipType === 'SHIP_DEF') { inputData.fleet = -2; }

				let choosenFleet;
				fleetList.forEach(function(fleet) {
					if(fleet.id === inputData.fleet) {
						choosenFleet = fleet;
					}

					if(inputData.fleet === -2 && fleet.name === 'SHIP_DEF') {
						choosenFleet = fleet;
					}
				});

				// Auto create def fleet if not existing
				if(choosenFleet === undefined && inputData.fleet === -2) {
					inputData.fleet = -1;
					inputData.fleetName = 'SHIP_DEF';
				}

				const totalCost = []; // [Al,Fe,Ti,Cu,Time,Population]

				// Check if planet have enough resources
				for(let i=0; i<unitReturned.cost.length; i++) {
					totalCost[i] = parseFloat(unitReturned.cost[i])*inputData.count;
				}

				if(totalCost[1] > newPlanet.resources[2] ||
					totalCost[0] > newPlanet.resources[3] ||
					totalCost[3] > newPlanet.resources[4] ||
					totalCost[2] > newPlanet.resources[5]) { // [Al,Fe,Ti,Cu,Time,Population]

					log(inputData.username +' failed to build units because of no enough resources.');
					Websocket.SendMessageToClient({ sid: inputData.sid, message: 'BUILDING_ERROR_COST' });
					return;
				}

				Planet.getPeople(newPlanet,fleetList, function(newPlanet, prod, cons) {
					// Check if planet have enough population
					if(prod < (cons + totalCost[5])) {
						log(inputData.username +' failed to build units because of no enough people.');
						Websocket.SendMessageToClient({ sid: inputData.sid, message: 'BUILDING_ERROR_PEOPLE' });
						return;
					}

					// Check if you have required buildings

					// Check fleet
					function callBackAfterfleet(newPlanet,fleetReturned,userReturned,unitData,totalCost,inputData) {
						const currTime = Date.now();

						// Create entry in planet db for in-build unit
						newPlanet.unitBuildingID = inputData.unit;
						newPlanet.unitBuildingEndTime = currTime + Math.round(totalCost[4] * (1-(buildLvlUnitBuildingSpeedBonus*newPlanet.Buildings[7])) * TIME.HOUR_TO_MS);
						newPlanet.unitBuildingCount = inputData.count;
						newPlanet.unitBuildingFleetID = fleetReturned.id;

						newPlanet.lastUnitUpdate = currTime;

						// Withdraw costs
						newPlanet.resources[2] -= totalCost[1];
						newPlanet.resources[3] -= totalCost[0];
						newPlanet.resources[4] -= totalCost[3];
						newPlanet.resources[5] -= totalCost[2];

						// Update planet
						db.planet.update(newPlanet);

						if(inputData.unit.substr(0, 'SHIP_WEP_MINES'.length) !== 'SHIP_WEP_MINES') {
							// Update unit
							unitData.owned += inputData.count;

							db.unit.update(unitData);
						}

						// Update fleet
						fleetReturned.population += totalCost[5];
						fleetReturned.inBuilding = true;

						db.fleet.update(fleetReturned);

						Planet.sendPlanetDataToUser({data: newPlanet, id: inputData.id, sid: inputData.sid });

						log(inputData.username+' began building '+inputData.count+' new units ('+inputData.unit+') on planet ' + newPlanet.name + ' (' +inputData.planet+')','success');
						Websocket.SendMessageToClient({ sid: inputData.sid, message: 'BUILDING_UNIT_OK' });
					}

					if(inputData.fleet === -1 && isset(inputData.fleetName)) {
						// Check if fleet max size is reached
						if(totalCost[5] > globalConst.maxFleetSize) {
							log(inputData.username +' failed to build units because fleet will be too big.');
							Websocket.SendMessageToClient({ sid: inputData.sid, message: 'BUILDING_ERROR_FLEET_SIZE' });
							return;
						}

						Fleets.create(inputData,newPlanet,function(fleetReturned) {
							callBackAfterfleet(newPlanet,fleetReturned,userReturned,unitReturned,totalCost,inputData);
						});
					} else if(inputData.fleet !== -1 && choosenFleet !== undefined) {
						// Check if this fleet is in orbit and belong to this planet
						if(choosenFleet.position !== newPlanet.address || choosenFleet.orbitPosition !== 0) {
							Websocket.SendMessageToClient({ sid: inputData.sid, message: 'FLEET_ISNT_IN_ORBIT' });
							return;
						}
						if(''+choosenFleet.motherPlanetId !== ''+newPlanet.id) { return; }

						// Check if fleet max size is reached
						if((choosenFleet.population + totalCost[5]) > globalConst.maxFleetSize) {
							log(inputData.username +' failed to build units because fleet will be too big.');
							Websocket.SendMessageToClient({ sid: inputData.sid, message: 'BUILDING_ERROR_FLEET_SIZE' });
							return;
						}

						callBackAfterfleet(newPlanet,choosenFleet,userReturned,unitReturned,totalCost,inputData);
					}  else {
						log(inputData.username +' failed to build units because fleet isn\'t valid.');
						Websocket.SendMessageToClient({ sid: inputData.sid, message: 'BUILDING_ERROR_INVALID_FLEET' });
					}
				});
			});
		});
	}
};