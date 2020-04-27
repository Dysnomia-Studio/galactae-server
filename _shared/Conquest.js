(function (exports) {
	exports._Conquest = class Conquest {
		static minPointForPlanetCount(count) {
			return Math.ceil(0.013*Math.pow(count, 3) - 1.85*Math.pow(count, 2) + 1520 * count - 750);
		}

		/**
		 * Gets the max count of planets a player can have based on its points count
		 *
		 * @param      {number}  points    User points
		 * @return     {number}  Count of planets
		 */
		static getPlanetMaxCount(points) {
			let i = 1;

			while(points > Conquest.minPointForPlanetCount(i)) {
				i++;
			}

			return i;
		}
	};
})(typeof exports === 'undefined'? window : exports);
