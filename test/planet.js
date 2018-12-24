/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
global.Planet    = require('../planet');

describe('• Planet', function() {
	describe('# calcPlanetPoints()', function() {
		it('all lvl 1', function() {
			let buildings = [1,1,1,1,1,1,1,1,1,0,0,0,0,0];
			assert.equal(
				Planet.calcPlanetPoints({Buildings: buildings}),
				47
			);
		});

		it('no all lvl max', function() {
			let buildings = buildingMaxLvl;
			assert.equal(
				Planet.calcPlanetPoints({Buildings: buildings}),
				1560
			);
		});
	});

	describe('# calcFleetPoints()', function() {
		it('all lvl 1', function() {
			let fleets = [
				{ points: 2, },
				{ points: 12, },
				{ points: 15, },
			];
			assert.equal(
				Planet.calcFleetPoints(fleets),
				29
			);
		});
	});
});