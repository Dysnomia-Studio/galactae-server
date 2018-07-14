module.exports = class GameMap {
	static getPlanetCoords(angle, radius) {
		return [
			0.5 + 0.5*radius*Math.cos(angle),
			0.5 + 0.5*radius*Math.sin(angle),
		];
	}

	static getPlanetDistance(from, to, when) {
		// @TODO: Get from db both planets
		// @TODO: Check if exists
		// @TODO: Calc coords

		/*
		let angle = (when%periode / periode) * (2* Math.PI);

		if(planets[i].id == from) {
			coordsDepart = GameMap.getPlanetCoords(angle, planetDist);
		} else if(planets[i].id == to) {
			coordsArrivee = GameMap.getPlanetCoords(angle, planetDist);
		}
		*/

		return Math.sqrt(
			Math.pow(coordsDepart[0] - coordsArrivee[0],2) + 
			Math.pow(coordsDepart[1] - coordsArrivee[1],2)
		);
	}
};