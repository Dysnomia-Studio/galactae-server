/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
global.GameMap   = require('../../GameMap');

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
		describe('getPlanetDistance(undefined orbitDist/orbitDuration)', () => {
			const from = {};
			const to = {};

			assert.equal(from.orbitDist, undefined);
			assert.equal(from.orbitDuration, undefined);
			assert.equal(to.orbitDist, undefined);
			assert.equal(to.orbitDuration, undefined);

			GameMap.getPlanetDistance(from, to, 1);

			assert.equal(from.orbitDist, 0);
			assert.equal(from.orbitDuration, 0);
			assert.equal(to.orbitDist, 0);
			assert.equal(to.orbitDuration, 0);
		});

		//  @TODO
	});
});