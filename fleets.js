module.exports = class Fleets {
	/**
	 * Get and send unit data to user
	 *
	 * @param      {object}  pid     planet uid
	 * @param      {object}  sid     user socket id
	 * @return     {socket}  units   list of units types
	 */
	static refresh(pid,sid) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER AND PLANET BEFORE !
		 */
		db.fleet.findByMotherPlanet(pid, function(originalFList) {
			if(originalFList === undefined) { originalFList = []; }

			function sendtoPlayer(FleetList, newPlanet, sid) {
				if(newPlanet !== undefined) {
					db.planet.update({
						_id: newPlanet._id,
						resources: newPlanet.resources,
					});

					Planet.sendPlanetDataToUser({data: {name: newPlanet.name}, planet: newPlanet.address, id: newPlanet.owner, sid: sid });
				}

				io.to(sid).emit('fleet-recieve-data', FleetList);
			}

			Fleets.recalcFuel(originalFList, function(FleetList, newPlanet) {
				let haveToDone = 0;
				let done = 0;
				for(let i=0; i<FleetList.length; i++) {
					let id = i;

					if(FleetList[id].endMoveTime !== -1 && FleetList[id].endMoveTime <= Date.now()) {
						FleetList[id].endMoveTime = -1;
					}

					haveToDone++;

					let newFleet = {
						_id: FleetList[id]._id,
						endMoveTime: -1,
						fuel: FleetList[id].fuel,
					};

					db.fleet.update(newFleet, function() {
						if(++done === haveToDone) {
							sendtoPlayer(FleetList, newPlanet, sid);
						}
					});
				}

				if(haveToDone === 0) {
					sendtoPlayer(FleetList, newPlanet, sid);
				}
			});
		});
	}

	static recalcFuel(fleetList, callback) {
		let haveToUpdate = [];
		for(let i=0; i<fleetList.length; i++) {
			if(fleetList[i].fuel === undefined) { fleetList[i].fuel = 0; }
			if(fleetList[i].fuel < fleetList[i].maxFuel && fleetList[i].position === fleetList[i].motherPlanetAdress) {
				haveToUpdate.push(i);
			}
		}

		if(haveToUpdate.length === 0) { callback(fleetList); return; }
		db.planet.find(fleetList[0].motherPlanetAdress, function(planetData) {
			let newPlanet = planetData.toJSON();
			let addCount = 0;

			// Priority fleet
			if(newPlanet.highPriorityFleet !== undefined) {
				let prioId = fleetList.map(d => ''+d._id).indexOf(newPlanet.highPriorityFleet);

				if(prioId !== -1 && fleetList[prioId].position === newPlanet.address) {
					fleetList[prioId].fuel += newPlanet.resources[1];

					if(fleetList[prioId].fuel > fleetList[prioId].maxFuel) {
						newPlanet.resources[1] += fleetList[prioId].maxFuel - fleetList[prioId].fuel;
						fleetList[prioId].fuel = fleetList[prioId].maxFuel;
					} else {
						newPlanet.resources[1] = 0;
					}
				}
			}

			// Current planet fleets
			while(haveToUpdate.length > 0 && newPlanet.resources[1] > 0 && (addCount = Math.floor(newPlanet.resources[1]/haveToUpdate.length)) > 0) {
				for(let i=0; i<haveToUpdate.length; i++) {
					let id = haveToUpdate[i];

					fleetList[id].fuel += addCount;
					newPlanet.resources[1] -= addCount;

					if(fleetList[id].fuel > fleetList[id].maxFuel) {
						newPlanet.resources[1] += fleetList[id].maxFuel - fleetList[id].fuel;
						fleetList[id].fuel = fleetList[id].maxFuel;

						haveToUpdate[i] = -1;
					}
				}

				haveToUpdate = haveToUpdate.filter(d => d>0);
			}

			if(haveToUpdate.length > 0) { // No resources left
				callback(fleetList, newPlanet);
				return;
			}

			// Current in-orbit fleets
			db.fleet.findByPosition(fleetList[0].motherPlanetId, function(fleets) {
				// @TODO: Same owner, same ally, trade

				callback(fleetList, newPlanet);
			});


		});
	}

	static create(data,planetData,callback) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER AND PLANET BEFORE !
		 */
		db.fleet.findByMotherPlanet(planetData._id, function(fleetReturned) {
			// Check max count
			if(fleetReturned.length >= hqFleetCount[planetData.Buildings[6] - 1]) {
				log(data.username + ' failed to create a new fleet on ' + planetData.name + ' because it has maximal fleet count.');
				Websocket.SendMessageToClient({ sid: data.sid, message: 'FLEET_MAX_REACHED' });
				return;
			}

			// Check name
			for(let i=0; i<fleetReturned.length; i++) {
				if(fleetReturned[i].name === data.fleetName) {
					log(data.username + ' failed to create a new fleet on ' + planetData.name + ' because a fleet with this name already exists.');
					Websocket.SendMessageToClient({ sid: data.sid, message: 'FLEET_NAME_ALREADY_EXISTS' });
					return;
				}
			}

			// Add it to db
			let newFleet = {
				name: data.fleetName,
				ownerId: data.id,
				motherPlanetId: planetData._id,
				motherPlanetAdress: planetData.address,
				position: planetData.address,
				orbitPosition: 0,
				points: 0,
				endMoveTime: -1,
				units: [],
				population: 0,
				fuel: 0,
				maxFuel: 0,
			};

			db.fleet.create(newFleet, function(newFleet) {
				// Send new list to client
				Fleets.refresh(planetData.id,data.sid);

				if(callback) { callback(newFleet); }
			});
		});
	}

	static hasEnoughCarrier(fleet, unitList) {
		let fighterCount = 0;
		let fighterCap   = 0;

		for(let u in unitList) {
			for(let f in fleet.units) {
				if(fleet.units[f][0] !== unitList[u]._id) { continue; }

				if(unitList[u].shipType === 'SHIP_FIGHTER') {
					fighterCount += fighterWeight[unitList[u].shipShape] * fleet.units[f][1];
				} else if(unitList[u].shipType === 'SHIP_CARRIER') {
					for(let p in unitList[u].parts) {
						if(unitList[u].parts[p].type === 'hangar') {
							fighterCap += hangarSize[unitList[u].parts[p].tech] * fleet.units[f][1];
						}
					}
				}
			}

		}

		return fighterCount <= fighterCap;
	}

	static getUnitsList(unitIdList, callback, i=0, unitList=[]) {
		if(i>=unitIdList.length) {
			callback(unitList);
			return;
		}

		// Find next unit
		db.unit.find(unitIdList[i][0], function(unitReturned) {
			if(isset(unitReturned)) {
				unitList.push(unitReturned);
			}
			Fleets.getUnitsList(unitIdList, callback, i+1, unitList);
		});
	}

	static moveTo(user, fleetId, destination) {
		let now = Date.now();

		// Get Fleet data
		db.fleet.find(fleetId, function(fleetReturned) {
			if(!isset(fleetReturned)) { log('fleet not found'); return; } // Does this fleet exists
			if('' + fleetReturned.ownerId !== '' + user.id) { log('user doesn\'t own ths fleet'); return; }
			if(fleetReturned.name === 'SHIP_DEF') { return; } // Is this fleet movable ? (not defense fleet)
			if(fleetReturned.inBuilding !== undefined && fleetReturned.inBuilding) { // Are units building in this fleet ?
				log(user.username + ' failed to move fleet because units are building in this fleet.');
				Websocket.SendMessageToClient({ sid: user.sid, message: 'IN_BUILDING_FLEET' });
				return;
			}
			if(fleetReturned.endMoveTime > 0) { // Is this fleet moving ?
				log(user.username + ' failed to move fleet because fleet is already moving to a planet.');
				Websocket.SendMessageToClient({ sid: user.sid, message: 'ALREADY_MOVING_FLEET' });
				return;
			}

			if(fleetReturned.position === destination) { // Current planet
				log(user.username + ' failed to move fleet because fleet is already at destination.');
				Websocket.SendMessageToClient({ sid: user.sid, message: 'ALREADY_AT_DESTINATION' });
				return;
			}

			let systemeDepart = fleetReturned.position.split('-');
			systemeDepart.pop();
			systemeDepart = systemeDepart.join('-');

			let systemeArrivee = destination.split('-');
			systemeArrivee.pop();
			systemeArrivee = systemeArrivee.join('-');

			Fleets.getUnitsList(fleetReturned.units, function(unitList) {
				if(systemeDepart !== systemeArrivee && !Fleets.hasEnoughCarrier(fleetReturned, unitList)) {
					log(user.username + ' failed to move fleet because fleet hasn\'t enough carrier capacity.');
					Websocket.SendMessageToClient({ sid: user.sid, message: 'NO_ENOUGHT_CARRIER' });
					return;
				}

				let minSpeed;
				if(systemeDepart === systemeArrivee) {
					minSpeed = Fleet.getMinSubSpeed(unitList);
				} else {
					minSpeed = Fleet.getMinSupraSpeed(unitList);
				}

				if(minSpeed.speed[0] === undefined) {
					log(user.username + ' failed to move fleet because some units can\'t make supraspeed move.');
					Websocket.SendMessageToClient({ sid: user.sid, message: 'CANT_MAKE_SUPRAMOVE' });
					return;
				}

				db.planet.find(fleetReturned.position, function(planeteDepart) {
					db.planet.find(destination, function(planeteArrivee) {
						if(!isset(planeteArrivee)) {
							log(user.username + ' failed to move fleet because destination ('+destination+') does not exists.');
							Websocket.SendMessageToClient({ sid: user.sid, message: 'DESTINATION_NOT_EXISTS' });
							return;
						}

						let time;
						if(systemeDepart === systemeArrivee) {
							let baseDist = GameMap.getPlanetDistance(
								planeteDepart,
								planeteArrivee,
								now/1000);
							if(Number.isNaN(baseDist) || baseDist < 0) { return; }
							let baseTravelTime = Fleet.calcMoveTime(baseDist, minSpeed.speed);

							let previewDist = GameMap.getPlanetDistance(
								planeteDepart,
								planeteArrivee,
								now/1000 + Math.round(baseTravelTime*360000)/100);

							if(Number.isNaN(previewDist) || previewDist < 0) { return; }
							let previewTime = Fleet.calcMoveTime(previewDist, minSpeed.speed);

							/* Final travel time:
								Average of ...
								 Time to travel to planet where it's now
								and
								 Time to travel to planet where it'll be when we arrive to this previous position
							*/
							time = (baseTravelTime + previewTime)/2;
						} else {
							let dist = Math.sqrt(
									Math.pow(planeteDepart.galacticPos[0] - planeteArrivee.galacticPos[0],2) +
									Math.pow(planeteDepart.galacticPos[1] - planeteArrivee.galacticPos[1],2)
								);

							time = Fleet.calcMoveTime(dist, minSpeed.speed);
						}

						let fuel = Fleet.calcFuelCost(minSpeed.engines);
						if(!isset(fleetReturned.fuel) || fleetReturned.fuel < (fuel * time)) {
							log(user.username + ' failed to move fleet because fleet hasn\'t enough fuel.');
							Websocket.SendMessageToClient({ sid: user.sid, message: 'NO_ENOUGH_FUEL' });
							return;
						}

						fleetReturned.fuel -= fuel * time;

						db.player.searchById(user.id, function(foundUser) {
							let instability = time * 0.001 * (Math.random() - 0.5);
							if(Research.getResearch(foundUser, 'prop_suprastability') === -1) {
								instability /= 2;
							}

							let date = Date.now();

							let newFleet = fleetReturned.toJSON();

							newFleet.endMoveTime = date + Math.round((time + instability) * 3600000);
							newFleet.position = destination;
							newFleet.orbitPosition = 2;
							if(destination === newFleet.motherPlanetAdress) {
								newFleet.orbitPosition = 0;
							}

							log(user.username + ' began to move fleet ' + newFleet.name + ' to ' + planeteArrivee.name + ' (' + destination + ')' +
								'. ETA: ' + (new Date(newFleet.endMoveTime).toISOString()));

							db.fleet.update(newFleet, function() {
								Websocket.SendMessageToClient({ sid: user.sid, message: 'FLEET_MOVING' });
								Fleets.refresh(newFleet.motherPlanetId, user.sid);
							});
						});
					});
				});
			});
		});
	}
};