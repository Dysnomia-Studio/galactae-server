(function (exports) {
	exports._Units = class Units {
		/**
		 * Sort units by name
		 *
		 * @param      {object}  a       First unit
		 * @param      {object}  b       Second unit
		 * @return     {number}  Sort order
		 */
		static sortUnitParts(a, b) {
			if(a.name < b.name) {
				return -1;
			}
			return 1;
		}

		/**
		 * Check if two ships have the same parts
		 *
		 * @param      {<type>}   ship1   The ship 1
		 * @param      {<type>}   ship2   The ship 2
		 * @return     {boolean}  Are they the same ?
		 */
		static checkIfSameParts(ship1, ship2) {
			// Sort
			ship1.parts.sort(Units.sortUnitParts);
			ship2.parts.sort(Units.sortUnitParts);

			// Compare
			let duplicate = true;
			for(let i=0; i<ship2.parts.length; i++) {
				for(const id in ship2.parts[i]) {
					if(ship2.parts[i][id] !== ship1.parts[i][id]) {
						duplicate = false;
						break;
					}
				}
			}

			return duplicate;
		}

		/**
		 * Check if a specific ship exists in a unit list
		 *
		 * @param      {<type>}  unitList  The unit list
		 * @param      {<type>}  ship      The ship
		 * @return     {Array}   [is duplicated by parts ?, is duplicated by name ?]
		 */
		static checkIfDuplicate(unitList, ship) {
			let duplicate = false;
			let duplicateName = false;

			for(const currObj in unitList) {
				if(unitList[currObj].name === ship.name) {
					duplicateName = true;
					break;
				}

				if(unitList[currObj].shipType === ship.shipType &&
					unitList[currObj].shipShape === ship.shipShape &&
					unitList[currObj].parts.length === ship.parts.length) {

					duplicate = Units.checkIfSameParts(unitList[currObj], ship);
					if(duplicate) {
						break;
					}
				} // End check parts
			}

			return [duplicate, duplicateName];
		}

		/**
		 * Calculates the unit costs.
		 *
		 * @param      {<type>}  data    The data
		 * @return     {Array}   Unit total cost
		 */
		static calcCost(shipShape,parts) {
			const totalCost = shipCosts[shipShape].slice(); // ATTENTION: on clone, on ne garde pas l'array de config

			for(let id=0; id<parts.length; id++) {
				if(!isset(shipCosts[parts[id].tech])) { // If we do our work, this would never happend but that's a security measure ..
					log('Cost is not defined for part ' + parts[id].tech + ' in ship ' + shipShape,'error');
					return [-1];
				}

				const addCost = shipCosts[parts[id].tech].slice(); // ATTENTION: on clone, on ne garde pas l'array de config

				for(let i=0; i<6; i++) {
					if(shipShape.substr(0,'SHIP_FIGHTER'.length) === 'SHIP_FIGHTER') {
						addCost[i] *= fighterMult[shipShape];
					}

					totalCost[i] += addCost[i];
				}
			}

			// Round this
			for(let i=0; i<6; i++) {
				if(i !== 4) {
					totalCost[i] = Math.round(totalCost[i]);
				} else {
					totalCost[i] = Math.round(totalCost[i]*100)/100;
				}
			}

			return totalCost;
		}

		/**
		 * Get special unit list
		 *
		 * @type       {array}
		 */
		static get specialUnits() {
			const units = {};

			for(const name in specialUnitsUID) {
				units[specialUnitsUID[name]] = {
					id: specialUnitsUID[name],
					name: fleetTranslate[name],
					note: 0, // @TODO: Note
					owned: 0,
					cost: shipCosts[name],
					parts: specialUnitsParts[name],
					shipShape: name,
					shipType: 'SHIP_DEF',
					oneShot: true,
				};

				if(!units[specialUnitsUID[name]].name) {
					units[specialUnitsUID[name]].name = name;
				}
			}

			return units;
		}

		/**
		 * Gets the weapons list of a specific unit
		 *
		 * @param      {object}  unit    The unit
		 * @return     {array}  The weapons.
		 */
		static getWeapons(unit) {
			return unit.parts.filter((part) => part.type === 'cannon' || part.type === 'rocketLauncher');
		}

		/**
		 * Gets the shields list of a specific unit
		 *
		 * @param      {object}  unit    The unit
		 * @return     {array}  The shields.
		 */
		static getShields(unit) {
			return unit.parts.filter((part) => part.type === 'shield');
		}

		/**
		 * Returns the default cargo size of a ship by its shape
		 *
		 * @param      {string}  shipShape  The ship shape
		 * @return     {number}  The cargo size
		 */
		static cargoSize(shipShape) {
			const cargo = {
				SHIP_BATTLECRUISER_ATRIOS: 1250,

				SHIP_CUIRASSE_SMALL: 750,

				SHIP_CORVET_AEGIS: 400,

				SHIP_CARRIER_SMALL: 750,
				SHIP_CARRIER_MEDIUM: 1500,
			};

			if(cargo[shipShape]) {
				return cargo[shipShape];
			}

			return 0;
		}
	};
})(typeof exports === 'undefined'? window : exports);
