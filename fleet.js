(function (exports) {
	exports.Fleet = class Fleet {
		/**
		 * Gets an unit speed depending on a specific tech & speed created by other
		 * parts.
		 *
		 * @param      {array}   speed   Current speed, [-1] if no speed yet
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
		 * Calculates the subspeed of an unit
		 *
		 * @param      {Object}  unit    Unit description
		 * @return     {Object}  Subspeed
		 */
		static calcSubSpeed(unit) {
			let speed = [-1];
			let tech = '';
			let count = 0;

			for(let i in unit.parts) {
				if(unit.parts[i].type === 'sub_propulsion') {
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
		 * Calculates the supraspeed of an unit
		 *
		 * @param      {Object}  unit    Unit description
		 * @return     {Object}  Supraspeed
		 */
		static calcSupraSpeed(unit) {
			let speed = [-1];
			let tech = '';
			let count = 0;

			for(let i in unit.parts) {
				if(unit.parts[i].type === 'sup_propulsion') {
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
		 * Calculates the fuel cost of moving with specific engines, pattern: { type: count, type2: count2 }
		 *
		 * @param      {Object}  engines  The engines
		 * @return     {number}  The fuel cost.
		 */
		static calcFuelCost(engines) {
			let cost = 0;

			for(let i in engines) { // @TODO: use fighterMult
				cost += fuelCost[i] * engines[i];
			}

			return cost;
		}

		/**
		 * Get the slower speed between two polynomial speed
		 *
		 * @param      {number}  curr    Current speed
		 * @param      {number}  other   Other speed to compare with
		 * @return     {number}  Slower speed
		 */
		static slowerSpeed(curr, other) {
			let testDist = 1000; // Total galaxy
			if((Math.pow(testDist, 2)*curr[0] + testDist*curr[1] + curr[2]) >
				(Math.pow(testDist, 2)*other[0] + testDist*other[1] + other[2])) { // Compare polynoms, more time = slower
				return other;
			} else {
				return curr;
			}
		}

		/**
		 * Get the slowest subspeed in a fleet
		 *
		 * @param      {<type>}  unitList  Fleet units list
		 * @return     {Object}  The minimum sub speed.
		 */
		static getMinSubSpeed(unitList) {
			let min = {
				speed: 0,
				engines: {},
			};

			for(let i=0; i<unitList.length; i++) {
				let curr = Fleet.calcSubSpeed(unitList[i]);

				if(curr.speed[0] === undefined) { return { speed: [] }; } // Just in case of bugs

				min.speed = Fleet.slowerSpeed(curr.speed, min.speed);

				if(min.engines[curr.tech] === undefined) {
					min.engines[curr.tech] = 0;
				}
				min.engines[curr.tech] += curr.count;
			}

			return min;
		}

		/**
		 * Get the slowest supraspeed in a fleet
		 *
		 * @param      {<type>}  unitList  Fleet units list
		 * @return     {Object}  The minimum supra speed.
		 */
		static getMinSupraSpeed(unitList) {
			let min = {
				speed: [],
				engines: {},
			};

			for(let i=0; i<unitList.length; i++) {
				if(unitList[i].shipType === 'SHIP_FIGHTER') { continue; } // Don't care about fighter they are carried

				let curr = Fleet.calcSupraSpeed(unitList[i]);

				if(curr.speed[0] === undefined) { return { speed: [] }; } // Just in case of bugs

				min.speed = Fleet.slowerSpeed(curr.speed, min.speed);

				if(min.engines[curr.tech] === undefined) {
					min.engines[curr.tech] = 0;
				}
				min.engines[curr.tech] += curr.count;
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
	};
})(typeof exports === 'undefined'? window : exports);