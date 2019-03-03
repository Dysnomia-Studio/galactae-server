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
					const id = i;

					// Autoremove fleet if needed
					if(FleetList[id].units.length === 0 && ''+newPlanet.unitBuildingFleetID !== ''+FleetList[id]._id) {
						db.fleet.remove(FleetList[id]);
						continue;
					}

					if(FleetList[id].endMoveTime !== -1 && FleetList[id].endMoveTime <= Date.now()) {
						FleetList[id].endMoveTime = -1;
						Websocket.sendNotification(sid, 'fleetMove', { fleetName: FleetList[id].name, destination: FleetList[id].position });
					}

					haveToDone++;

					const newFleet = {
						_id: FleetList[id]._id,
						endMoveTime: FleetList[id].endMoveTime,
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
		let haveToUpdate = false;
		for(let i=0; i<fleetList.length; i++) {
			if(fleetList[i].fuel === undefined) { fleetList[i].fuel = 0; }
			if(fleetList[i].fuel < fleetList[i].maxFuel && fleetList[i].position === fleetList[i].motherPlanetAdress) {
				haveToUpdate = true;
			}
		}

		if(!haveToUpdate) { callback(fleetList); return; }

		db.planet.find(fleetList[0].motherPlanetAdress, function(planetData) {
			let newPlanet, empty;
			[newPlanet, fleetList, empty] = Fleet.distributeFuel(planetData.toJSON(), fleetList);

			if(empty) { callback(fleetList); return; }

			// Current in-orbit fleets
			db.fleet.findByPosition(fleetList[0].motherPlanetId, function(FleetList) {
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
			const newFleet = {
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

	static hasEnoughCarrier(currFleet, unitList) {
		let fighterCount = 0;
		let fighterCap   = 0;

		for(const u in unitList) {
			for(const f in currFleet.units) {
				if(currFleet.units[f][0] !== unitList[u]._id) { continue; }

				if(unitList[u].shipType === 'SHIP_FIGHTER') {
					fighterCount += fighterWeight[unitList[u].shipShape] * currFleet.units[f][1];
				} else if(unitList[u].shipType === 'SHIP_CARRIER') {
					for(const p in unitList[u].parts) {
						if(unitList[u].parts[p].type === 'hangar') {
							fighterCap += hangarSize[unitList[u].parts[p].tech] * currFleet.units[f][1];
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
		const now = Date.now();

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
					minSpeed = Fleet.getMinSubSpeed(unitList, fleetReturned.units);
				} else {
					minSpeed = Fleet.getMinSupraSpeed(unitList, fleetReturned.units);
				}

				if(systemeDepart !== systemeArrivee && minSpeed.speed[0] === undefined) {
					log(user.username + ' failed to move fleet because some units can\'t make supraspeed move.');
					Websocket.SendMessageToClient({ sid: user.sid, message: 'CANT_MAKE_SUPRAMOVE' });
					return;
				} else if(minSpeed.speed[0] === undefined) {
					log(user.username + ' failed to move fleet because some units haven\'t speed data.');
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
							const baseDist = GameMap.getPlanetDistance(
								planeteDepart,
								planeteArrivee,
								now/1000);
							if(Number.isNaN(baseDist) || baseDist < 0) { return; }
							const baseTravelTime = Fleet.calcMoveTime(baseDist, minSpeed.speed);

							const previewDist = GameMap.getPlanetDistance(
								planeteDepart,
								planeteArrivee,
								now/1000 + Math.round(baseTravelTime*360000)/100);

							if(Number.isNaN(previewDist) || previewDist < 0) { return; }
							const previewTime = Fleet.calcMoveTime(previewDist, minSpeed.speed);

							/* Final travel time:
								Average of ...
								 Time to travel to planet where it's now
								and
								 Time to travel to planet where it'll be when we arrive to this previous position
							*/
							time = (baseTravelTime + previewTime)/2;
						} else {
							const dist = Math.sqrt(
								Math.pow(planeteDepart.galacticPos[0] - planeteArrivee.galacticPos[0],2) +
								Math.pow(planeteDepart.galacticPos[1] - planeteArrivee.galacticPos[1],2)
							);

							time = Fleet.calcMoveTime(dist, minSpeed.speed);
						}

						const fuel = Fleet.calcFuelCost(minSpeed.engines);
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

							const newFleet = fleetReturned.toJSON();

							newFleet.endMoveTime = Date.now() + Math.round((time + instability) * TIME.HOUR_TO_MS);
							newFleet.position = destination;
							newFleet.orbitPosition = 2;
							if(destination === newFleet.motherPlanetAdress) {
								newFleet.orbitPosition = 0;
							}

							let textDestination = destination;
							if(planeteArrivee.name !== undefined) {
								textDestination = planeteArrivee.name + ' (' + destination + ')';
							}

							const endTime = new Date(newFleet.endMoveTime);

							log(user.username + ' began to move fleet ' + newFleet.name + ' to ' + textDestination +
								'. ETA: ' + getDateTime(endTime));

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

	static renameFleet(data) {
		db.fleet.find(data.fleetId, function(fleetReturned) {
			if(!isset(fleetReturned) || !isset(fleetReturned.ownerId) || ''+fleetReturned.ownerId !== ''+data.id) { return; }
			if(fleetReturned.name === 'SHIP_DEF') { return; }

			const newFleet = {
				_id: fleetReturned._id,
				name: data.fleetNewName,
			};

			db.fleet.update(newFleet, function() {
				log(data.username + ' has succed to rename fleet type old:' + fleetReturned.name + ', new: ' + data.fleetNewName,'success');
				Fleets.refresh(fleetReturned.motherPlanetId, data.sid);
			});
		});
	}

	static moveUnits(unitId, count, from, to) {
		if(count <= 0) { return [-1]; }

		const units = to.units;
		let index = -1;
		for(let i=0; i<units.length; i++) {
			if(units[i][0] === unitId && count <= units[i][1]) {
				index = i;
				break;
			} else if(units[i][0] === unitId) {
				log('Failed to move units from fleet ' + from.name + ' to ' + to.name + ' because the unit count was incorrect.', 'fail');
				return [-1];
			}
		}

		if(index < 0) {
			to.units.push([unitId, count]);
		} else {
			to.units[index][1] += count;
		}

		return [from, to];
	}

	static transferSomeUnits(from, to, data) {
		data.unitCount = parseInt(data.unitCount);
		if(Number.isNaN(data.unitCount)) { return; }

		if(typeof(from) === 'string') {
			db.fleet.find(from, function(fleetData) {
				if(!isset(fleetData) || !isset(fleetData.name) || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) { return; }
				Fleets.transferSomeUnits(fleetData, to, data);
			});
			return;
		}
		if(typeof(to) === 'string') {
			db.fleet.find(to, function(fleetData) {
				if(!isset(fleetData) || !isset(fleetData.name) || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) { return; }
				Fleets.transferSomeUnits(from, fleetData, data);
			});
			return;
		}

		if(from.position !== to.position || from.endMoveTime > 0 || to.endMoveTime > 0) {
			log(data.username + ' has failed to tranfer units from fleet ' + from.name + ' to ' + to.name + ' because wasn\'t at the same position.', 'fail');
			Websocket.SendMessageToClient( { sid: data.sid, message: 'FLEET_AT_DIFFERENT_POSITIONS' });
			return;
		}

		// TODO: check people limit for fleet & planet

		[from, to] = Fleets.moveUnits(data.unitId, data.unitCount, from, to);

		if(from === -1) { return; }

		db.unit.find(data.unitId, function(unit) {
			if(!isset(unit) || !isset(unit.shipShape)) { return; }

			for(let i=0; i<from.units.length; i++) {
				if(from.units[i][0] === data.unitId) {
					from.units[i][1] -= data.unitCount;
				}
			}

			// Tranfer fuel
			const transferMaxFuel = fuelStorage[unit.shipShape] * data.unitCount;
			const transferFuel = Math.round(transferMaxFuel/from.maxFuel * from.fuel);

			from.maxFuel -= transferMaxFuel;
			to.maxFuel += transferMaxFuel;

			from.fuel -= transferFuel;
			to.fuel += transferFuel;

			Fleet.removeEmptyUnits(from);

			db.fleet.update(from, function() {
				db.fleet.update(to, function() {
					log(data.username + ' has tranfered units from fleet ' + from.name + ' to ' + to.name + ' orbiting planet ' + from.position);
					Websocket.SendMessageToClient( { sid: data.sid, message: 'FLEET_UNIT_TRANSFER_SUCCESSFUL' });
					Fleets.refresh(from.motherPlanetId, data.sid);
				});
			});
		});

	}

	static mergeFleet(from, to, data) {
		console.log('From: ' + from);
		console.log('To: ' + to);

		if(typeof(from) === 'string') {
			db.fleet.find(from, function(fleetData) {
				if(!isset(fleetData) || !isset(fleetData.name) || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) { return; }
				Fleets.mergeFleet(fleetData, to, data);
			});
			return;
		}
		if(typeof(to) === 'string') {
			db.fleet.find(to, function(fleetData) {
				if(!isset(fleetData) || !isset(fleetData.name) || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) { return; }
				Fleets.mergeFleet(from, fleetData, data);
			});
			return;
		}

		if(from.position !== to.position || from.endMoveTime > 0 || to.endMoveTime > 0) {
			log(data.username + ' has failed merging fleet ' + from.name + ' to ' + to.name + ' because wasn\'t at the same position.', 'fail');
			Websocket.SendMessageToClient( { sid: data.sid, message: 'FLEET_AT_DIFFERENT_POSITIONS' });
			return;
		}

		// TODO: check people limit for fleet & planet

		const units = from.units;
		for(let i=0; i<units.length; i++) {
			[from, to] = Fleets.moveUnits(units[i][0], units[i][1], from, to);
			if(from === -1) { return; }
		}

		from.units = [];

		// Move fuel
		to.fuel += from.fuel;
		to.maxFuel += from.maxFuel;

		db.fleet.update(from, function() {
			db.fleet.update(to, function() {
				log(data.username + ' has merged fleet ' + from.name + ' to ' + to.name + ' orbiting planet ' + from.position);
				Websocket.SendMessageToClient( { sid: data.sid, message: 'FLEET_MERGE_SUCCESSFUL' });
				Fleets.refresh(from.motherPlanetId, data.sid);
			});
		});
	}
};