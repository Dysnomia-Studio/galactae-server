/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
global.Planet    = require('../planet');

describe('• Planet', function() {
	describe('# GetMineralsRatio()', function() {
		it('0', function() {
			assert.deepEqual(
				Planet.GetMineralsRatio(
				0),
				planetRatios[0]
			);
		});

		it('unkown (-1)', function() {
			assert.deepEqual(
				Planet.GetMineralsRatio(
				-1),
				planetRatios[0]
			);
		});

		/**it('1', function() {
			assert.deepEqual(
				Planet.GetMineralsRatio(
				-1),
				planetRatios[1]
			);
		});*/
	});

	describe('# enoughtEnergy()', function() {
		it('enough', function() {
			let buildings = [1,1,1,1,1,1,1,1,1];
			assert.equal(
				Planet.enoughtEnergy(buildings),
				true
			);
		});

		it('no enough', function() {
			let buildings = [30,30,30,30,1,1,1,1,1];
			assert.equal(
				Planet.enoughtEnergy(buildings),
				false
			);
		});
	});

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

	describe('# GetBuildingCost()', function() {
		it('build < 0', function() {
			assert.equal(
				Planet.GetBuildingCost(-1),
				undefined
			);
		});

		/**it('build = 0, level = 1', function() {
			assert.deepEqual(
				Planet.GetBuildingCost(0, 1),
				{}
			);
		});

		it('build = max-1, level = 10', function() {
			assert.deepEqual(
				Planet.GetBuildingCost(globalConst.buildingNumber-1, 10),
				{}
			);
		});**/

		it('build >= max', function() {
			assert.equal(
				Planet.GetBuildingCost(globalConst.buildingNumber),
				undefined
			);
		});
	});
});