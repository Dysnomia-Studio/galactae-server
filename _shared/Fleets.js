(function (exports) {
	exports._Fleets = class Fleets {
		/**
		 * Gets an unit speed depending on a specific tech & speed created by other
		 * parts.
		 *
		 * @param      {Array}   speed   Current speed, [-1] if no speed yet
		 * @param      {string}  tech    Engines tech
		 * @return     {Array}   New current speed
		 */
		static getSpeed(speed, tech) {
			if(speed[0] === -1) { // First sup propulsion part
				if(shipPartsSpeed[tech] === undefined) {
					console.error('Speed is not defined for part ' + tech,'error');
					return [];
				}
				speed = shipPartsSpeed[tech].slice(0);
			} else {
				for(let i=0; i<speed.length; i++) {
					speed[i] /= 1.5;

					speed[i] = Math.round(speed[i] * 1000000)/1000000;
				}
			}

			return speed;
		}

		/**
		 * Calculates the speed.
		 *
		 * @param      {<type>}  unit    The unit
		 * @param      {<type>}  type    The type
		 * @return     {Object}  The speed.
		 */
		static calcSpeed(unit, type) {
			let speed = [-1];
			let tech = '';
			let count = 0;

			if(unit === undefined) {
				console.error('Error: undefined unit in Fleets.calcSpeed()');
				return { speed: [] };
			}

			for(const i in unit.parts) {
				if (!unit.parts.hasOwnProperty(i)) {
					continue;
				}

				if(unit.parts[i].type === type) {
					tech = unit.parts[i].tech;
					count++;

					speed = Fleets.getSpeed(speed, tech);
					if(speed[0] === undefined) {
						return { speed: [] };
					}
				}
			}

			return {speed: speed, tech: tech, count: count};
		}

		/**
		 * Calculates the subspeed of an unit
		 *
		 * @param      {Object}  unit    Unit description
		 * @return     {Object}  Subspeed
		 */
		static calcSubSpeed(unit) {
			return Fleets.calcSpeed(unit, 'sub_propulsion');
		}

		/**
		 * Calculates the supraspeed of an unit
		 *
		 * @param      {Object}  unit    Unit description
		 * @return     {Object}  Supraspeed
		 */
		static calcSupraSpeed(unit) {
			return Fleets.calcSpeed(unit, 'sup_propulsion');
		}

		/**
		 * Calculates the fuel cost of moving with specific engines, pattern: { type: count, type2: count2 }
		 *
		 * @param      {Object: type => count}  engines  The engines
		 * @return     {number}  The fuel cost.
		 */
		static calcFuelCost(engines) {
			let cost = 0;

			for(const i in engines) {
				if (!engines.hasOwnProperty(i)) {
					continue;
				}

				cost += fuelCost[i] * engines[i];
			}

			return cost;
		}

		/**
		 * Get the slower speed between two polynomial speed
		 *
		 * @param      {polynom}  curr    Current speed
		 * @param      {polynom}  other   Other speed to compare with
		 * @return     {polynom}  Slower speed
		 */
		static slowerSpeed(curr, other) {
			const testDist = 1000; // Total galaxy
			if(!curr ||
				(Math.pow(testDist, 2)*curr[0] + testDist*curr[1] + curr[2]) >
				(Math.pow(testDist, 2)*other[0] + testDist*other[1] + other[2])) { // Compare polynoms, more time = slower

				return other;
			}

			return curr;
		}

		/**
		 * Get the slowest subspeed in a fleet
		 *
		 * @param      {Array}   unitList  Fleet units list
		 * @return     {Object}  The minimum sub speed.
		 */
		static getMinSubSpeed(unitList, fleetUnits) {
			const min = {
				speed: [],
				engines: {},
			};

			const unitListId = unitList.map((unit) => unit.id);

			for(const key in fleetUnits) {
				if (!fleetUnits.hasOwnProperty(key)) {
					continue;
				}

				const currUnit = unitList[unitListId.indexOf(key)];

				const curr = Fleets.calcSubSpeed(currUnit);

				if(curr.speed[0] === undefined) { // Just in case of bugs
					return { speed: [] };
				}

				min.speed = Fleets.slowerSpeed(curr.speed, min.speed);

				if(min.engines[curr.tech] === undefined) {
					min.engines[curr.tech] = 0;
				}

				let count = curr.count;
				if(currUnit.shipType === 'SHIP_FIGHTER') {
					count *= fighterMult[currUnit.shipShape];
				}
				min.engines[curr.tech] += count * fleetUnits[key];
			}

			return min;
		}

		/**
		 * Get the slowest supraspeed in a fleet
		 *
		 * @param      {Array}   unitList  Fleet units list
		 * @return     {Object}  The minimum supra speed.
		 */
		static getMinSupraSpeed(unitList, fleetUnits) {
			const min = {
				speed: [],
				engines: {},
			};

			const unitListId = unitList.map((unit) => unit.id);

			for(const key in fleetUnits) {
				if (!fleetUnits.hasOwnProperty(key)) {
					continue;
				}

				const currUnit = unitList[unitListId.indexOf(key)];

				if(currUnit.shipType === 'SHIP_FIGHTER') { // Don't care about fighter they are carried
					continue;
				}

				const curr = Fleets.calcSupraSpeed(currUnit);

				if(curr.speed[0] === undefined) { // Just in case of bugs
					return { speed: [] };
				}

				min.speed = Fleets.slowerSpeed(curr.speed, min.speed);

				if(min.engines[curr.tech] === undefined) {
					min.engines[curr.tech] = 0;
				}

				min.engines[curr.tech] += curr.count * fleetUnits[key];
			}

			delete min.engines['']; // Moteurs vides, on les compte pas

			return min;
		}

		/**
		 * Calculates the move time depending on a distance and a speed
		 *
		 * @param      {polynom}  dist    The distance
		 * @param      {polynom}  speed   The speed
		 * @return     {number}  The move time.
		 */
		static calcMoveTime(dist, speed) {
			return Math.pow(dist, 2)*speed[0] + dist*speed[1] + speed[2];
		}

		static distributeToSomeFleets(planet, fleetList, haveToUpdate) {
			let addCount = 0;
			while(haveToUpdate.length > 0 && Math.floor(planet.resources[1]) > 0 && (addCount = Math.floor(planet.resources[1]/haveToUpdate.length)) > 0) {
				for(let i=0; i<haveToUpdate.length; i++) {
					const id = fleetList.map((f) => f.id).indexOf(haveToUpdate[i]);

					if(fleetList[id].orbitPosition === FLEET_MOVE_TYPE.ATTACK || fleetList[id].endMoveTime !== null) {
						haveToUpdate[i] = -1;
						continue;
					}

					fleetList[id].fuel += addCount;
					planet.resources[1] -= addCount;
					if(fleetList[id].fuel > fleetList[id].maxFuel) {
						planet.resources[1] += (fleetList[id].fuel - fleetList[id].maxFuel);
						fleetList[id].fuel = 0 + fleetList[id].maxFuel;

						haveToUpdate[i] = -1;
					}
				}

				haveToUpdate = haveToUpdate.filter((d) => d !== -1);
			}

			return [ planet, fleetList, haveToUpdate ];
		}

		/**
		 * Distribute planet helium 3 to all fleets
		 *
		 * @param      {<type>}  planet     Old planet data
		 * @param      {<type>}  fleetList  Old fleet list
		 * @return     {<type>}  [New planet data, New fleet list]
		 */
		static distributeFuel(planet, fleetList, user) {
			let planetFleets = [];
			let ownerFleets = [];
			let allyFleets = [];
			for(let i=0; i<fleetList.length; i++) {
				if(typeof fleetList[i].fuel === 'undefined') {
					fleetList[i].fuel = 0;
				}

				fleetList[i].fuel = parseInt(fleetList[i].fuel, 10);
				fleetList[i].maxFuel = parseInt(fleetList[i].maxFuel, 10);

				if(fleetList[i].fuel < fleetList[i].maxFuel) {
					if(fleetList[i].position === fleetList[i].motherPlanetAddress) {
						planetFleets.push(fleetList[i].id);
					} else if(fleetList[i].ownerId === planet.owner) {
						ownerFleets.push(fleetList[i].id);
					} else if(fleetList[i].owner.ally !== null && fleetList[i].owner.ally === user.ally) {
						allyFleets.push(fleetList[i].id);
					}
				}
			}

			// Priority fleet
			if(typeof planet.highPriorityFleet === 'string') {
				const prioId = fleetList.map((d) => d.id).indexOf(planet.highPriorityFleet);

				if(prioId !== -1 && fleetList[prioId].position === planet.address && fleetList[prioId].endMoveTime !== null) {
					fleetList[prioId].fuel += planet.resources[1];

					if(fleetList[prioId].fuel > fleetList[prioId].maxFuel) {
						planet.resources[1] = (fleetList[prioId].fuel - fleetList[prioId].maxFuel);
						fleetList[prioId].fuel = 0 + fleetList[prioId].maxFuel;
					} else {
						planet.resources[1] = 0;
					}
				}
			}

			if(planetFleets.length !== 0) {
				// Current planet fleets
				[planet, fleetList, planetFleets] = Fleets.distributeToSomeFleets(planet, fleetList, planetFleets);
			}

			if(planetFleets.length === 0) {
				if(ownerFleets.length !== 0) {
					// Same owner fleets
					[planet, fleetList, ownerFleets] = Fleets.distributeToSomeFleets(planet, fleetList, ownerFleets);
				}

				if(ownerFleets.length === 0 && allyFleets.length !== 0) {
					// Same ally fleets
					[planet, fleetList, allyFleets] = Fleets.distributeToSomeFleets(planet, fleetList, allyFleets);
				}
			}

			return [
				planet,
				fleetList,
				[...planetFleets, ...ownerFleets, ...allyFleets].length === 0, // No resources left
			];
		}

		static updateFleetFuel(fleets, units) {
			for(const fleet of fleets) {
				fleet.maxFuel = 0;

				for(const unitId in fleet.units) {
					if (!fleet.units.hasOwnProperty(unitId)) {
						continue;
					}

					fleet.maxFuel += fleet.units[unitId] * fuelStorage[units[unitId].shipShape];
				}

				if(fleet.fuel > fleet.maxFuel) {
					fleet.fuel = fleet.maxFuel;
				}
			}

			return fleets;
		}

		static removeEmptyUnits(fleet) {
			for(const unit in fleet.units) {
				if (!fleet.units.hasOwnProperty(unit)) {
					continue;
				}

				if(fleet.units[unit] <= 0) {
					delete fleet.units[unit];
				}
			}

			return fleet;
		}

		static hasOffensiveCapacity(currFleet, unitCache) {
			for(const currUnit in currFleet.units) {
				if (!currFleet.units.hasOwnProperty(currUnit)) {
					continue;
				}

				let realUnitId = currUnit;
				if(typeof specialUnitsUID[realUnitId] !== 'undefined') {
					realUnitId = specialUnitsUID[realUnitId];
				}

				if(Units.getWeapons(unitCache[realUnitId]).length > 0) {
					return true;
				}
			}

			return false;
		}

		static groupHasOffensiveCapacity(fleetList, unitCache) {
			for(const currFleet of fleetList) {
				if(Fleets.hasOffensiveCapacity(currFleet, unitCache)) {
					return true;
				}
			}

			return false;
		}

		static isImmobile(fleet) {
			return fleet.endMoveTime === null;
		}

		static hasEndedMove(fleet) {
			return !Fleets.isImmobile(fleet) && fleet.endMoveTime.getTime() <= new Date();
		}

		static hasColonyShip(currFleet, unitCache) {
			for(const currUnit in currFleet.units) {
				if (!currFleet.units.hasOwnProperty(currUnit)) {
					continue;
				}

				let realUnitId = currUnit;
				if(typeof specialUnitsUID[realUnitId] !== 'undefined') {
					realUnitId = specialUnitsUID[realUnitId];
				}

				if(unitCache[realUnitId].shipType === 'SHIP_COLONY' && currFleet.units[currUnit] > 0) {
					return true;
				}
			}

			return false;
		}

		static removeColonyShip(currFleet, unitCache) {
			for(const currUnit in currFleet.units) {
				if (!currFleet.units.hasOwnProperty(currUnit)) {
					continue;
				}

				let realUnitId = currUnit;
				if(typeof specialUnitsUID[realUnitId] !== 'undefined') {
					realUnitId = specialUnitsUID[realUnitId];
				}

				if(unitCache[realUnitId].shipType === 'SHIP_COLONY' && currFleet.units[currUnit] > 0) {
					currFleet.units[currUnit]--;
					currFleet.population -= unitCache[realUnitId].cost[5];

					if(currFleet.units[currUnit] === 0) {
						delete currFleet.units[currUnit];
					}

					unitCache[realUnitId].owned--;
					break;
				}
			}

			return [ currFleet, unitCache ];
		}

		static cargoSize(currFleet, unitCache) {
			let total = 0;

			for(const currUnit in currFleet.units) {
				if (!currFleet.units.hasOwnProperty(currUnit)) {
					continue;
				}
				
				total += Units.cargoSize(
					unitCache[currUnit].shipShape
				) * currFleet.units[currUnit];
			}

			return total;
		}
	};
})(typeof exports === 'undefined'? window : exports);
