/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
global.Planet    = require('../planet');

describe('• Planet', () => {
	describe('# calcPlanetPoints()', () => {
		it('all lvl 1', () => {
			let buildings = [1,1,1,1,1,1,1,1,1,0,0,0,0,0];
			assert.equal(
				Planet.calcPlanetPoints({Buildings: buildings}),
				47
			);
		});

		it('no all lvl max', () => {
			let buildings = buildingMaxLvl;
			assert.equal(
				Planet.calcPlanetPoints({Buildings: buildings}),
				1560
			);
		});
	});

	describe('# calcFleetPoints()', () => {
		it('all lvl 1', () => {
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