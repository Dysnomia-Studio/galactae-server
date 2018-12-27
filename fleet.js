module.exports = class Fleet {
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
		db.fleet.findByMotherPlanet(pid, function(fleet) {
			if(fleet === undefined) { fleet = []; }

			let haveToDone = 0;
			let done = 0;
			for(let i=0; i<fleet.length; i++) {
				let id = i;

				if(fleet[id].endMoveTime !== -1 && fleet[id].endMoveTime <= Date.now()) {
					haveToDone++;
					fleet[id].endMoveTime = -1;

					db.fleet.update(fleet[id], function() {
						if(++done === haveToDone) {
							Fleet.refresh(fleet[id].motherPlanetId, sid);
						}
					});
				}
			}

			io.to(sid).emit('fleet-recieve-data', fleet);
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
				Fleet.refresh(planetData.id,data.sid);

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

	static slowerSpeed(curr, other) {
		let testDist = 1000; // Total galaxy
		if((Math.pow(testDist, 2)*curr[0] + testDist*curr[1] + curr[2]) >
			(Math.pow(testDist, 2)*other[0] + testDist*other[1] + other[2])) { // Compare polynoms, more time = slower
			return other;
		} else {
			return curr;
		}
	}

	static getMinSubSpeed(unitList) {
		let min = {
			speed: 0,
			engines: {},
		};

		for(let i=0; i<unitList.length; i++) {
			let curr = Units.calcSubSpeed(unitList[i]);

			if(curr.speed[0] === undefined) { return { speed: [] }; } // Just in case of bugs

			min.speed = Fleet.slowerSpeed(curr.speed, min.speed);

			if(min.engines[curr.tech] === undefined) {
				min.engines[curr.tech] = 0;
			}
			min.engines[curr.tech] += curr.count;
		}

		return min;
	}

	static getMinSupraSpeed(unitList) {
		let min = {
			speed: [],
			engines: {},
		};

		for(let i=0; i<unitList.length; i++) {
			if(unitList[i].shipType === 'SHIP_FIGHTER') { continue; } // Don't care about fighter they are carried

			let curr = Units.calcSupraSpeed(unitList[i]);

			if(curr.speed[0] === undefined) { return { speed: [] }; } // Just in case of bugs

			min.speed = Fleet.slowerSpeed(curr.speed, min.speed);

			if(min.engines[curr.tech] === undefined) {
				min.engines[curr.tech] = 0;
			}
			min.engines[curr.tech] += curr.count;
		}

		return min;
	}

	static calcMoveTime(dist, speed) {
		return Math.pow(dist, 2)*speed[0] + dist*speed[1] + speed[2];
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
			Fleet.getUnitsList(unitIdList, callback, i+1, unitList);
		});
	}

	static moveTo(user, fleetId, destination) {
		let now = Date.now();

		// Get Fleet data
		db.fleet.find(fleetId, function(fleetReturned) {
			if(!isset(fleetReturned)) { log('fleet not found'); return; } // Does this fleet exists
			if(fleetReturned.ownerId !== user.id) { log('user doesn\'t own ths fleet'); return; }
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

			Fleet.getUnitsList(fleetReturned.units, function(unitList) {
				if(systemeDepart !== systemeArrivee && !Fleet.hasEnoughCarrier(fleetReturned, unitList)) {
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
							Websocket.SendMessageToClient({ sid: user.sid, message: 'NO_ENOUGHT_FUEL' });
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
							newFleet.orbitPosition = -1;

							log(user.username + ' began to move fleet ' + newFleet.name + ' to ' + planeteArrivee.name + ' (' + destination + ')' +
								'. ETA: ' + (new Date(newFleet.endMoveTime).toISOString()));

							db.fleet.update(newFleet, function() {
								fleet.refresh(newFleet.motherPlanetId, user.sid);
							});
						});
					});
				});
			});
		});
	}
};