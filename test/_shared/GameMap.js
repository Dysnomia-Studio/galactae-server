/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
global.GameMap   = require('../../_shared/GameMap').GameMap;

describe('• GameMap (shared)', () => {
	/**
	 * getPlanetCoords
	 */
	describe('# getPlanetCoords()', () => {
		it('getPlanetCoords(90° (=1/2 Pi))', () => {
			const coords = GameMap.getPlanetCoords(0.5*Math.PI, 1);

			assert.equal(Math.round(coords[0]), 0);
			assert.equal(Math.round(coords[1]), 1);
		});

		it('getPlanetCoords(450° (=5/2 Pi))', () => {
			const coords = GameMap.getPlanetCoords(2.5*Math.PI, 1);

			assert.equal(Math.round(coords[0]), 0);
			assert.equal(Math.round(coords[1]), 1);
		});
	});

	/**
	 * getPlanetDistance
	 */
	describe('# getPlanetDistance()', () => {
		// TODO
	});
});