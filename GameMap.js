(function (exports) {
	exports.GameMap = class GameMap {
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
			const angleDepart = (2* Math.PI) - (when%from.orbitDuration / from.orbitDuration) * (2* Math.PI);
			const angleArrivee = (2* Math.PI) - (when%to.orbitDuration / to.orbitDuration) * (2* Math.PI);

			const coordsDepart = GameMap.getPlanetCoords(angleDepart, from.orbitDist);
			const coordsArrivee = GameMap.getPlanetCoords(angleArrivee, to.orbitDist);

			return Math.sqrt(
				Math.pow(coordsDepart[0] - coordsArrivee[0],2) +
				Math.pow(coordsDepart[1] - coordsArrivee[1],2)
			);
		}
	};
})(typeof exports === 'undefined'? window : exports);