(function (exports) {
	exports._Conquest = class Conquest {
		/**
		 * Gets the max count of planets a player can have based on its points count
		 *
		 * @param      {number}  points    User points
		 * @return     {number}  Count of planets
		 */
		static getPlanetMaxCount(points) {
			let i = 1;

			while(points > 0.013*Math.pow(i, 3) - 1.85*Math.pow(i, 2) + 1520 * i - 750) {
				i++;
			}

			return i;
		}
	};
})(typeof exports === 'undefined'? window : exports);
