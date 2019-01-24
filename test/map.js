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
			assert.deepEqual(
				GameMap.getPlanetCoords(0.5*Math.PI, 1),
				[0.5, 1]
			);
		});
	});
});