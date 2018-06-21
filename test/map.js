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


/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
global.Map = require('../map');

describe('• Map', function() {
	/**
	 * getPlanetCoords
	 */
	describe('# getPlanetCoords()', function() {
		it('getPlanetCoords(90° (=1/2 Pi))', function() {
			var coords = Map.getPlanetCoords(0.5*Math.PI, 1);

			assert.equal(
				coords[0],
				0.5
			);
			assert.equal(
				coords[1],
				1
			);
		});
	});

	/**
	 * getFirstPlanetPosByStars
	 */
	describe('# getFirstPlanetPosByStars()', function() {
		it('getFirstPlanetPosByStars(1 star)', function() {
			assert.equal(
				Map.getFirstPlanetPosByStars([{
						size: 10
					}]),
				10 * STAR_ECART
			);
		});
	});
});