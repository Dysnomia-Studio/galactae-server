(function (exports) {
	exports._GameMap = class GameMap {
		/**
		 * Gets the planet coordinates depending on angle & circle diameter
		 *
		 * @param      {number}  angle     The angle
		 * @param      {number}  diameter  The diameter
		 * @return     {Array}   The planet coordinates.
		 */
		static getPlanetCoords(angle, diameter) {
			const radius = diameter/2;

			return [
				radius * Math.cos(angle),
				radius * Math.sin(angle),
			]; // Aucun besoin de constantes (50% + ... ) étant donné qu'on les soustrait
		}

		/**
		 * Get the distance between two planets/stars
		 *
		 * @param      {object}  from    Origin
		 * @param      {object}  to      Destination
		 * @param      {number}  when    When we go
		 * @return     {number}  Distance between planets
		 */
		static getPlanetDistance(from, to, when) {
			if(!from.orbitDuration) { from.orbitDuration = 0; }
			if(!to.orbitDuration) { to.orbitDuration = 0; }

			if(!from.orbitDist) { from.orbitDist = 0; }
			if(!to.orbitDist) { to.orbitDist = 0; }

			let angleDepart = (2* Math.PI) - (when%parseFloat(from.orbitDuration) / parseFloat(from.orbitDuration)) * (2* Math.PI);
			let angleArrivee = (2* Math.PI) - (when%parseFloat(to.orbitDuration) / parseFloat(to.orbitDuration)) * (2* Math.PI);

			if(Number.isNaN(angleDepart)) { angleDepart = 0; }
			if(Number.isNaN(angleArrivee)) { angleArrivee = 0; }

			const coordsDepart = GameMap.getPlanetCoords(angleDepart, parseFloat(from.orbitDist));
			const coordsArrivee = GameMap.getPlanetCoords(angleArrivee, parseFloat(to.orbitDist));

			return Math.sqrt(
				Math.pow(coordsDepart[0] - coordsArrivee[0],2) +
				Math.pow(coordsDepart[1] - coordsArrivee[1],2)
			);
		}

		static getSystemFromAdress(address) {
			const system = address.split('-');

			return [system[0],system[1],system[2]].join('-');
		}

		static getSectorFromAdress(address) {
			const sectorAddress = address.split('-');

			return [sectorAddress[0],sectorAddress[1]].join('-');
		}
	};
})(typeof exports === 'undefined'? window : exports);