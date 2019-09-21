module.exports = class Fleets extends require('./_shared/Fleets').Fleets {
	/**
	 * Get and send unit data to user
	 *
	 * @param      {object}  pid     planet uid
	 * @param      {object}  sid     user socket id
	 * @return     {socket}  units   list of units types
	 */
	static refresh(pid,sid) {
		if(globalCfg.dev) {
			log('Refresh fleets');
		}

		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER AND PLANET BEFORE !
		 */
		db.fleet.findByMotherPlanet(pid, function(originalFList) {
			if(originalFList === undefined) { originalFList = []; }

			function sendtoPlayer(FleetList, newPlanet, sid, pid) {
				if(newPlanet !== undefined) {
					db.planet.update({
						id: newPlanet.id,
						resources: newPlanet.resources,
					});

					if(newPlanet.address === pid) {
						Planet.sendPlanetDataToUser({data: {resources: newPlanet.resources}, planet: newPlanet.address, id: newPlanet.owner, sid: sid });
					}
				}

				if(globalCfg.dev) {
					log('Sending fleet');
				}

				io.to(sid).emit('fleet-recieve-data', { FleetList, pid });
			}

			Fleets.recalcFuel(originalFList, function(FleetList, newPlanet) {
				if(!newPlanet) {
					sendtoPlayer(FleetList, newPlanet, sid, pid);
					return;
				}

				let haveToDone = 0;
				let done = 0;
				for(let i=0; i<FleetList.length; i++) {
					const id = i;

					// Autoremove fleet if needed
					if(FleetList[id].units.length === 0 && newPlanet.unitBuildingFleetID !== FleetList[id].id) {
						db.fleet.remove(FleetList[id].id);
						continue;
					}

					FleetList[id].endMoveTime = parseInt(FleetList[id].endMoveTime);
					if(FleetList[id].endMoveTime !== -1 && FleetList[id].endMoveTime <= Date.now()) {
						FleetList[id].endMoveTime = -1;

						if(FleetList[id].orbitPosition === 1) {
							Combat.beginFight(data, pid, atkUser, defUser, atkFleetId);
							continue;
						}

						Websocket.sendNotification(sid, 'fleetMove', { fleetName: FleetList[id].name, destination: FleetList[id].position });
					}

					haveToDone++;

					const newFleet = {
						id: FleetList[id].id,
						endMoveTime: FleetList[id].endMoveTime,
						fuel: FleetList[id].fuel,
					};

					db.fleet.update(newFleet, function() {
						if(++done === haveToDone) {
							sendtoPlayer(FleetList, newPlanet, sid, pid);
						}
					});
				}

				if(haveToDone === 0) {
					sendtoPlayer(FleetList, newPlanet, sid, pid);
				}
			});
		});
	}

	static checkOwner(uid, fleetId, callback) {
		if(fleetId === '-1') {
			callback();
			return;
		}

		db.fleet.find(fleetId, (obj) => {
			if(obj.ownerId === uid) {
				callback();
			}
		});
	}

	static recalcFuel(fleetList, callback) {
		let haveToUpdate = false;
		for(let i=0; i<fleetList.length; i++) {
			if(fleetList[i].fuel === undefined) { fleetList[i].fuel = 0; }
			if(fleetList[i].fuel < fleetList[i].maxFuel && fleetList[i].position === fleetList[i].motherPlanetAddress) {
				haveToUpdate = true;
			}
		}

		if(fleetList.length === 0) { callback(fleetList); return; }

		db.planet.find(fleetList[0].motherPlanetAddress, function(planetData) {
			if(!haveToUpdate) { callback(fleetList, planetData); return; }

			let newPlanet, empty;
			[newPlanet, fleetList, empty] = Fleets.distributeFuel(planetData, fleetList.slice(0));

			if(empty) { callback(fleetList, planetData); return; }

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
		db.fleet.findByMotherPlanet(planetData.id, function(fleetReturned) {
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
				motherPlanetId: planetData.id,
				motherPlanetAddress: planetData.address,
				position: planetData.address,
				orbitPosition: 0,
				points: 0,
				endMoveTime: -1,
				units: [],
				population: 0,
				fuel: 0,
				maxFuel: 0,
				inBuilding: false,
			};

			db.fleet.create(newFleet, function(newFleet) {
				// Send new list to client
				Fleets.refresh(planetData.id,data.sid);

				if(callback) {
					db.fleet.findByMotherPlanet(planetData.id, (fleetList) => {
						const outFleet = fleetList.filter((f) => f.name === data.fleetName)[0];

						callback(outFleet);
					});
				}
			});
		});
	}

	static hasEnoughCarrier(currFleet, unitList) {
		let fighterCount = 0;
		let fighterCap   = 0;

		for(const u in unitList) {
			for(const f in currFleet.units) {
				if(f !== unitList[u].id) { continue; }

				if(unitList[u].shipType === 'SHIP_FIGHTER') {
					fighterCount += fighterWeight[unitList[u].shipShape] * currFleet.units[f];
				} else if(unitList[u].shipType === 'SHIP_CARRIER') {
					for(const p in unitList[u].parts) {
						if(unitList[u].parts[p].type === 'hangar') {
							fighterCap += hangarSize[unitList[u].parts[p].tech] * currFleet.units[f];
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
		db.unit.find(unitIdList[i], function(unitReturned) {
			if(isset(unitReturned, 'object')) {
				unitList.push(unitReturned);
			}
			Fleets.getUnitsList(unitIdList, callback, i+1, unitList);
		});
	}

	static moveTo(user, fleetId, destination, moveType) {
		const now = Date.now();

		moveType = Math.round(moveType);
		if(moveType < 0 || moveType > 3) { return; }
		if(moveType === 3) { return; } // @TODO: remove this when adding spying

		// Get Fleet data
		db.fleet.find(fleetId, function(fleetReturned) {
			if(!isset(fleetReturned, 'object')) { log('fleet not found'); return; } // Does this fleet exists
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

			Fleets.getUnitsList(Object.keys(fleetReturned.units), function(unitList) {
				if(systemeDepart !== systemeArrivee && !Fleets.hasEnoughCarrier(fleetReturned, unitList)) {
					log(user.username + ' failed to move fleet because fleet hasn\'t enough carrier capacity.');
					Websocket.SendMessageToClient({ sid: user.sid, message: 'NO_ENOUGHT_CARRIER' });
					return;
				}

				let minSpeed;
				if(systemeDepart === systemeArrivee) {
					minSpeed = Fleets.getMinSubSpeed(unitList, fleetReturned.units);
				} else {
					minSpeed = Fleets.getMinSupraSpeed(unitList, fleetReturned.units);
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
						if(!isset(planeteArrivee, 'object')) {
							log(user.username + ' failed to move fleet because destination ('+destination+') does not exists.');
							Websocket.SendMessageToClient({ sid: user.sid, message: 'DESTINATION_NOT_EXISTS' });
							return;
						}

						// TODO: Check beginner protection end
						// if(defUser.beginnerProtectEnd > Date.Now()) ...

						let time;
						if(systemeDepart === systemeArrivee) {
							const baseDist = GameMap.getPlanetDistance(
								planeteDepart,
								planeteArrivee,
								now/1000);
							if(Number.isNaN(baseDist) || baseDist < 0) { return; }
							const baseTravelTime = Fleets.calcMoveTime(baseDist, minSpeed.speed);

							const previewDist = GameMap.getPlanetDistance(
								planeteDepart,
								planeteArrivee,
								now/1000 + Math.round(baseTravelTime*360000)/100);

							if(Number.isNaN(previewDist) || previewDist < 0) { return; }
							const previewTime = Fleets.calcMoveTime(previewDist, minSpeed.speed);

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

							time = Fleets.calcMoveTime(dist, minSpeed.speed);
						}

						const fuel = Fleets.calcFuelCost(minSpeed.engines);
						if(!isset(fleetReturned.fuel, 'number') || fleetReturned.fuel < (fuel * time)) {
							log(user.username + ' failed to move fleet because fleet hasn\'t enough fuel.');
							Websocket.SendMessageToClient({ sid: user.sid, message: 'NO_ENOUGH_FUEL' });
							return;
						}

						fleetReturned.fuel -= fuel * time;

						db.player.searchById(user.id, function(foundUser) {
							let instability = time * 0.001 * (Math.random() - 0.5);
							if(Research.isSearched(foundUser, 'prop_suprastability')) {
								instability /= 2;
							}

							fleetReturned.endMoveTime = Date.now() + Math.round((time + instability) * TIME.HOUR_TO_MS);
							fleetReturned.position = destination;
							fleetReturned.orbitPosition = moveType;
							if(destination === fleetReturned.motherPlanetAddress) {
								fleetReturned.orbitPosition = 0;
							}

							let textDestination = destination;
							if(planeteArrivee.name !== undefined) {
								textDestination = planeteArrivee.name + ' (' + destination + ')';
							}

							const endTime = new Date(fleetReturned.endMoveTime);

							log(user.username + ' began to move fleet ' + fleetReturned.name + ' to ' + textDestination +
								'. ETA: ' + getDateTime(endTime));

							db.fleet.update(fleetReturned, function() {
								Websocket.SendMessageToClient({ sid: user.sid, message: 'FLEET_MOVING' });
								Fleets.refresh(fleetReturned.motherPlanetId, user.sid);
							});
						});
					});
				});
			});
		});
	}

	static renameFleet(data) {
		db.fleet.find(data.fleetId, function(fleetReturned) {
			if(!isset(fleetReturned, 'object') || !isset(fleetReturned.ownerId, 'string') || ''+fleetReturned.ownerId !== ''+data.id) { return; }
			if(fleetReturned.name === 'SHIP_DEF') { return; }

			const newFleet = {
				id: fleetReturned.id,
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
		if(from.units[unitId] < count) {
			log('Failed to move units from fleet ' + from.name + ' to ' + to.name + ' because the unit count was incorrect.', 'fail');
			return [-1];
		}

		if(!to.units[unitId]) {
			to.units[unitId] = 0;
		}
		to.units[unitId] += count;

		return [from, to];
	}

	static transferSomeUnits(from, to, data) {
		data.unitCount = parseInt(data.unitCount);
		if(Number.isNaN(data.unitCount)) { return; }

		if(typeof(from) === 'string') {
			db.fleet.find(from, function(fleetData) {
				if(!isset(fleetData, 'object') || !isset(fleetData.name, 'string') || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) { return; }
				Fleets.transferSomeUnits(fleetData, to, data);
			});
			return;
		}
		if(typeof(to) === 'string') {
			db.fleet.find(to, function(fleetData) {
				if(!isset(fleetData, 'object') || !isset(fleetData.name, 'string') || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) { return; }
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
			if(!isset(unit, 'object') || !isset(unit.shipShape, 'string')) { return; }

			// Transfer fuel
			const transferMaxFuel = fuelStorage[unit.shipShape] * data.unitCount;
			const transferFuel = Math.round(transferMaxFuel/from.maxFuel * from.fuel);

			from.maxFuel -= transferMaxFuel;
			to.maxFuel += transferMaxFuel;

			from.fuel -= transferFuel;
			to.fuel += transferFuel;

			// TODO: move cargo

			Fleets.removeEmptyUnits(from);

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
		if(typeof(from) === 'string') {
			db.fleet.find(from, function(fleetData) {
				if(!isset(fleetData, 'object') || !isset(fleetData.name, 'string') || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) { return; }
				Fleets.mergeFleet(fleetData, to, data);
			});
			return;
		}
		if(typeof(to) === 'string') {
			db.fleet.find(to, function(fleetData) {
				if(!isset(fleetData, 'object') || !isset(fleetData.name, 'string') || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) { return; }
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

		for(const key in from.units) {
			[from, to] = Fleets.moveUnits(key, from.units[key], from, to);
			if(from === -1) { return; }
		}

		from.units = [];

		// Move fuel
		to.fuel += from.fuel;
		to.maxFuel += from.maxFuel;

		// TODO: move cargo

		db.fleet.update(from, function() {
			db.fleet.update(to, function() {
				log(data.username + ' has merged fleet ' + from.name + ' to ' + to.name + ' orbiting planet ' + from.position);
				Websocket.SendMessageToClient( { sid: data.sid, message: 'FLEET_MERGE_SUCCESSFUL' });
				Fleets.refresh(from.motherPlanetId, data.sid);
			});
		});
	}

	static transferFuelBetweenFleets(from, to, data) {
		if(typeof(from) === 'string') {
			db.fleet.find(from, function(fleetData) {
				if(!isset(fleetData, 'object') || !isset(fleetData.name, 'string') || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) { return; }
				Fleets.transferFuelBetweenFleets(fleetData, to, data);
			});
			return;
		}
		if(typeof(to) === 'string') {
			db.fleet.find(to, function(fleetData) {
				if(!isset(fleetData, 'object') || !isset(fleetData.name, 'string') || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) { return; }
				Fleets.transferFuelBetweenFleets(from, fleetData, data);
			});
			return;
		}

		if(from.position !== to.position || from.endMoveTime > 0 || to.endMoveTime > 0) {
			log(data.username + ' has failed tranfering fuel from fleet ' + from.name + ' to ' + to.name + ' because wasn\'t at the same position.', 'fail');
			Websocket.SendMessageToClient( { sid: data.sid, message: 'FLEET_AT_DIFFERENT_POSITIONS' });
			return;
		}

		data.fuelCount = parseInt(data.fuelCount);
		if(Number.isNaN(data.fuelCount) || data.fuelCount <= 0) { return; }
		if(from.fuel <= data.fuelCount) { return; }

		from.fuel -= data.fuelCount;
		to.fuel += data.fuelCount;

		if(to.fuel > to.maxFuel) {
			from.fuel += (to.fuel - to.maxFuel);
			to.fuel = to.maxFuel;
		}

		db.fleet.update(from, function() {
			db.fleet.update(to, function() {
				log(data.username + ' has tranfered fuel from fleet ' + from.name + ' to ' + to.name + ' orbiting planet ' + from.position);
				Websocket.SendMessageToClient( { sid: data.sid, message: 'FUEL_TRANSFER_SUCCESSFUL' });
				Fleets.refresh(from.motherPlanetId, data.sid);
			});
		});
	}
};