// Stars: 4.8 to 12 em
// in XML from 0 to 37
let STAR_SIZE_BASE = 4;
let STAR_SIZE_COEF = 2 / 37;
let STAR_ECART = 2.25;

// Planets: 4 to 15 em
let PLANET_SIZE_BASE = 3 / 2;
let PLANET_SIZE_COEF = 9 / 14;
let PLANET_ECART = 2.5;

let MAP_SIZE_HEIGHT = 40000;
let MAP_SIZE_WIDTH = 50000;

let MAP_STAR_SIZE_BASE = 5;
let MAP_STAR_SIZE_RATIO = 0.08;

let mapCache = [];

module.exports = class Map {
	static loadXML() {
		for(var x=0; x<10; x++) {
			for(var y=0; y<10; y++) {
				fs.readFile("map/" + x + "-" + y + ".xml", "utf8", function(err, data) {

				});
			}
		}
	}

	static getPlanetCoords(angle, radius) {
		return [
			0.5 + 0.5*radius*Math.cos(angle),
			0.5 + 0.5*radius*Math.sin(angle),
		];
	}

	static getFirstPlanetPosByStars(stars) {
		// Sort by size 
		stars.sort(function(a,b) {
			if(a.size == b.size) {
				return 0;
			} else if(a.size > b.size) {
				return -1;
			} 
			return 1;
		});

		// Calc star positions for ...
		if(stars.length == 1) { // one star
			return stars[0].size * STAR_ECART;
		} else if(stars.length == 2) { // two stars
			// Si c'est les memes gTypes (naine et naine OU geante et geante), et on exclue les supergeantes
			if(stars[0].type.substr(-5) === stars[1].type.substr(-5) && 
				stars[0].type.substr(-10) !== "SuperGiant" && 
				stars[1].type.substr(-10) !== "SuperGiant") {

				return ((stars[0].size + stars[1].size)/2 * STAR_ECART) + stars[1].size * STAR_ECART/2;
			} else {
				return (stars[0].size * STAR_ECART + stars[1].size * STAR_ECART/2) + stars[1].size * STAR_ECART/2;
			}			
		} else { // 3 stars
			if(stars[0].type.substr(-5) !== stars[1].type.substr(-5) && 
				stars[1].type.substr(-5) === stars[2].type.substr(-5) &&
				stars[1].type.substr(-10) !== "SuperGiant" && 
				stars[2].type.substr(-10) !== "SuperGiant") { // Same 2 lasts stars

				return  (stars[0].size * STAR_ECART + (stars[1].size + stars[2].size)/2 * STAR_ECART) + stars[1].size * STAR_ECART/2;
			} else { // Sort by size or same 2 first stars or same 3 stars
				if(stars[0].size - stars[1].size < 1) { // If 2 biggers are almost same size
					return  (2 * orbitSize[1] + stars[2].size/2 * STAR_ECART) + stars[1].size * STAR_ECART/2;
				} else { // If one is bigger than 2 others
					return (stars[0].size * STAR_ECART + (stars[1].size + stars[2].size)/2 * STAR_ECART) + stars[1].size * STAR_ECART/2;
				}
			}
		}
	}

	static getPlanetDistance(from, to, when) {
		let coordsDepart = [0,0];
		let coordsArrivee = [0,0];



		// Get stars & planets
		stars = [];
		planets = [];

		// Calc coordinates
		planetOrbitDist = Map.getFirstPlanetPosByStars(stars);

		for(let i=0; i<planets.length; i++) {
			let size = PLANET_SIZE_BASE + parseFloat(planets[i].size)*PLANET_SIZE_COEF;

			if(i==0) {
				planetOrbitDist += size * PLANET_ECART/2;
			} else {
				planetOrbitDist += (PLANET_SIZE_BASE + parseFloat(planets[i - 1].size)*PLANET_SIZE_COEF) * PLANET_ECART/2 + size * PLANET_ECART/2;
			}

			let periode = (2 + planetOrbitDist) * 100;
			let angle = (when%periode / periode) * (2* Math.PI);

			if(planets[i].id == from) {
				coordsDepart = Map.getPlanetCoords(angle, planetDist);
			} else if(planets[i].id == to) {
				coordsArrivee = Map.getPlanetCoords(angle, planetDist);
			}
		}
		
		if(coordsDepart[0] == 0 &&
			coordsDepart[1] == 0 &&
			coordsArrivee[0] == 0 &&
			coordsArrivee[1] == 0) {

			return -1;
		}

		return Math.sqrt(
			Math.pow(coordsDepart[0] - coordsArrivee[0],2) + 
			Math.pow(coordsDepart[1] - coordsArrivee[1],2)
		);
	}
};