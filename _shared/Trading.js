(function (exports) {
	exports._Trading = class Trading {
		static getPlanetCapacity(lvl) {
			if(lvl === 0) {
				return 0;
			}

			return 1000 * Math.pow(lvl, 2) - 2700 * lvl + 2600;
		}

		static calcSubMoveTime(distance) {
			return -0.00004 * Math.pow(distance, 2) + 0.0096 * distance;
		}

		static calcSupMoveTime(distance) {
			return -0.024 * Math.pow(distance, 2) + 7.23 * distance + 0.001;
		}
	};
})(typeof exports === 'undefined'? window : exports);
