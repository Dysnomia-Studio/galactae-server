/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
global.GameMap = require('../map');

describe('• GameMap', function() {
	/**
	 * getPlanetCoords
	 */
	describe('# getPlanetCoords()', function() {
		it('getPlanetCoords(90° (=1/2 Pi))', function() {
			var coords = GameMap.getPlanetCoords(0.5*Math.PI, 1);

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
});