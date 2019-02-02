(function (exports) {
	exports.Fleet = class Fleet {
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
					speed[i] *= 1.5;
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

			if(unit === undefined) { console.error('Error: undefined unit in Fleet.calcSpeed()'); return { speed: [] }; }

			for(const i in unit.parts) {
				if(unit.parts[i].type === type) {
					tech = unit.parts[i].tech;
					count++;

					speed = Fleet.getSpeed(speed, tech);
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
			return Fleet.calcSpeed(unit, 'sub_propulsion');
		}

		/**
		 * Calculates the supraspeed of an unit
		 *
		 * @param      {Object}  unit    Unit description
		 * @return     {Object}  Supraspeed
		 */
		static calcSupraSpeed(unit) {
			return Fleet.calcSpeed(unit, 'sup_propulsion');
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
			if((Math.pow(testDist, 2)*curr[0] + testDist*curr[1] + curr[2]) >
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
				speed: 0,
				engines: {},
			};

			const unitListId = unitList.map((unit) => '' + unit._id);

			for(let i=0; i<fleetUnits.length; i++) {
				const currUnit = unitList[unitListId.indexOf(fleetUnits[i][0])];

				const curr = Fleet.calcSubSpeed(currUnit);

				if(curr.speed[0] === undefined) { return { speed: [] }; } // Just in case of bugs

				min.speed = Fleet.slowerSpeed(curr.speed, min.speed);

				if(min.engines[curr.tech] === undefined) {
					min.engines[curr.tech] = 0;
				}

				let count = curr.count;
				if(currUnit.shipShape.substr(0,'SHIP_FIGHTER'.length) === 'SHIP_FIGHTER') {
					count *= fighterMult[currUnit.shipShape];
				}
				min.engines[curr.tech] += count * fleetUnits[i][1];
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

			const unitListId = unitList.map((unit) => unit._id);

			for(let i=0; i<fleetUnits.length; i++) {
				const currUnit = unitList[unitListId.indexOf(fleetUnits[i][0])];

				if(currUnit.shipType === 'SHIP_FIGHTER') { continue; } // Don't care about fighter they are carried

				const curr = Fleet.calcSupraSpeed(currUnit);

				if(curr.speed[0] === undefined) { return { speed: [] }; } // Just in case of bugs

				min.speed = Fleet.slowerSpeed(curr.speed, min.speed);

				if(min.engines[curr.tech] === undefined) {
					min.engines[curr.tech] = 0;
				}

				let count = curr.count;
				if(currUnit.shipShape.substr(0,'SHIP_FIGHTER'.length) === 'SHIP_FIGHTER') {
					count *= fighterMult[currUnit.shipShape];
				}
				min.engines[curr.tech] += count * fleetUnits[i][1];
			}

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

		/**
		 * Distribute planet helium 3 to all fleets
		 *
		 * @param      {<type>}  planet     Old planet data
		 * @param      {<type>}  fleetList  Old fleet list
		 * @return     {<type>}  [New planet data, New fleet list]
		 */
		static distributeFuel(planet, fleetList) {
			let haveToUpdate = [];
			for(let i=0; i<fleetList.length; i++) {
				if(fleetList[i].fuel === undefined) { fleetList[i].fuel = 0; }
				if(fleetList[i].fuel < fleetList[i].maxFuel && fleetList[i].position === fleetList[i].motherPlanetAdress) {
					haveToUpdate.push(i);
				}
			}

			let addCount = 0;

			// Priority fleet
			if(planet.highPriorityFleet !== undefined) {
				const prioId = fleetList.map(d => ''+d._id).indexOf(planet.highPriorityFleet);

				if(prioId !== -1 && fleetList[prioId].position === planet.address) {
					fleetList[prioId].fuel += planet.resources[1];

					if(fleetList[prioId].fuel > fleetList[prioId].maxFuel) {
						planet.resources[1] += fleetList[prioId].maxFuel - fleetList[prioId].fuel;
						fleetList[prioId].fuel = fleetList[prioId].maxFuel;
					} else {
						planet.resources[1] = 0;
					}
				}
			}

			// Current planet fleets
			while(haveToUpdate.length > 0 && planet.resources[1] > 0 && (addCount = Math.floor(planet.resources[1]/haveToUpdate.length)) > 0) {
				for(let i=0; i<haveToUpdate.length; i++) {
					const id = haveToUpdate[i];

					fleetList[id].fuel += addCount;
					planet.resources[1] -= addCount;

					if(fleetList[id].fuel > fleetList[id].maxFuel) {
						planet.resources[1] += fleetList[id].maxFuel - fleetList[id].fuel;
						fleetList[id].fuel = fleetList[id].maxFuel;

						haveToUpdate[i] = -1;
					}
				}

				haveToUpdate = haveToUpdate.filter(d => d>0);
			}

			return [
				planet,
				fleetList,
				haveToUpdate.length === 0, // No resources left
			];
		}
	};
})(typeof exports === 'undefined'? window : exports);