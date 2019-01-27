(function (exports) {
	exports.Unit = class Unit {
		/**
		 * Check if two ships have the same parts
		 *
		 * @param      {<type>}   ship1   The ship 1
		 * @param      {<type>}   ship2   The ship 2
		 * @return     {boolean}  Are they the same ?
		 */
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

					duplicate = Unit.checkIfSameParts(unitList[currObj], ship);
					if(duplicate) {
						break;
					}
				} // End check parts
			}

			return [duplicate, duplicateName];
		}
	};
})(typeof exports === 'undefined'? window : exports);