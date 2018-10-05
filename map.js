module.exports = class GameMap {
	static getPlanetCoords(angle, diameter) {
		return [
			0.5*diameter*Math.cos(angle),
			0.5*diameter*Math.sin(angle),
		]; // Aucun besoin de constantes (50% + ... ) étant donné qu'on les soustrait
	}

	static getPlanetDistance(from, to, when) {
		let angleDepart = (2* Math.PI) - (when%from.orbitDuration / from.orbitDuration) * (2* Math.PI);
		let anglArrivee = (2* Math.PI) - (when%to.orbitDuration / to.orbitDuration) * (2* Math.PI);

		let coordsDepart = GameMap.getPlanetCoords(angleDepart, from.orbitDist);
		let coordsArrivee = GameMap.getPlanetCoords(anglArrivee, to.orbitDist);

		return Math.sqrt(
			Math.pow(coordsDepart[0] - coordsArrivee[0],2) + 
			Math.pow(coordsDepart[1] - coordsArrivee[1],2)
		);
	}
};