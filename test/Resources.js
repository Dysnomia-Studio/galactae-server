/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();

global.Resources    = require('../Resources').Resources;

describe('• Resources', () => {
	describe('# GetRatiosPerPlanet()', () => {
		it('0', () => {
			assert.deepEqual(
				Resources.GetRatiosPerPlanet(0),
				Resources.planetRatios[0]
			);
		});

		it('unknown (-1)', () => {
			assert.deepEqual(
				Resources.GetRatiosPerPlanet(-1),
				Resources.planetRatios[0]
			);
		});

		/**it('1', () => {
			assert.deepEqual(
				Resources.GetRatiosPerPlanet(
				-1),
				Resources.planetRatios[1]
			);
		});*/
	});
});