/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../../calcConstants')();
require('../../config')();
require('../../misc')();

global.Resources    = require('../../Resources');

describe('• Resources (shared)', function() {
	describe('# GetRatiosPerPlanet()', function() {
		it('0', function() {
			assert.deepEqual(
				Resources.GetRatiosPerPlanet(0),
				Resources.planetRatios[0]
			);
		});

		it('unknown (-1)', function() {
			assert.deepEqual(
				Resources.GetRatiosPerPlanet(-1),
				Resources.planetRatios[0]
			);
		});

		/**it('1', function() {
			assert.deepEqual(
				Resources.GetRatiosPerPlanet(
				-1),
				Resources.planetRatios[1]
			);
		});*/
	});
});