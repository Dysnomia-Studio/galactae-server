(function (exports) {
	exports._Resources = class Resources {
		/**
		 * Config planet ratio
		 */
		static get planetRatios() {
			return [
				{ironRatio: 0.35, aluRatio: 0.50, copperRatio: 0.04, titanRatio: 0.10}, // Earth type
			];
		}

		/**
		 * Gets the minerals ratio depending on a planet type
		 *
		 * @class      GetRatiosPerPlanet (name)
		 * @param      {<type>}  type    The type of planet
		 * @return     {Object}  The minerals ratio.
		 */
		static GetRatiosPerPlanet(type) {
			if(Resources.planetRatios[type] !== undefined) {
				return Resources.planetRatios[type];
			}

			return Resources.planetRatios[0];
		}
	};
})(typeof exports === 'undefined'? window : exports);