/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
global.GameMap   = require('../GameMap').GameMap;

describe('• GameMap', function() {
	/**
	 * getPlanetCoords
	 */
	describe('# getPlanetCoords()', function() {
		it('getPlanetCoords(90° (=1/2 Pi))', function() {
			const coords = GameMap.getPlanetCoords(0.5*Math.PI, 1);

			assert.equal(Math.round(coords[0]), 0);
			assert.equal(Math.round(coords[1]), 1);
		});
	});
});