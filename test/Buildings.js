/* eslint-disable no-magic-numbers */

/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../config')();
require('../misc')();

global.Buildings    = require('../Buildings').Buildings;

describe('• Buildings', function() {
	describe('# GetCost()', function() {
		it('build < 0', function() {
			assert.equal(
				Buildings.GetCost(-1),
				undefined
			);
		});

		/**it('build = 0, level = 1', function() {
			assert.deepEqual(
				Buildings.GetCost(0, 1),
				{}
			);
		});

		it('build = max-1, level = 10', function() {
			assert.deepEqual(
				Buildings.GetCost(globalConst.buildingNumber-1, 10),
				{}
			);
		});**/

		it('build >= max', function() {
			assert.equal(
				Buildings.GetCost(globalConst.buildingNumber),
				undefined
			);
		});
	});

	describe('# getEnergyProd()', function() {
		it('level 1', function() {
			const buildings = [1,1,1,1,1,1,1,1,1];
			assert.equal(
				Buildings.getEnergyProd(buildings),
				2795000
			);
		});

		it('level 30', function() {
			const buildings = [1,1,1,1,30,1,1,1,1];
			assert.equal(
				Buildings.getEnergyProd(buildings),
				1877500000
			);
		});
	});

	describe('# getEnergyCons()', function() {
		it('level 1', function() {
			const buildings = [1,1,1,1,1,1,1,1,1];
			assert.equal(
				Buildings.getEnergyCons(buildings),
				2761850
			);
		});

		it('level 5 total', function() {
			const buildings = [5,5,5,5,5,5,5,5,5];
			assert.equal(
				Buildings.getEnergyCons(buildings),
				53866650
			);
		});
	});

	describe('# enoughEnergy()', function() {
		it('enough', function() {
			const buildings = [1,1,1,1,1,1,1,1,1];
			assert.equal(
				Buildings.enoughEnergy(buildings),
				true
			);
		});

		it('no enough', function() {
			const buildings = [30,30,30,30,1,1,1,1,1];
			assert.equal(
				Buildings.enoughEnergy(buildings),
				false
			);
		});
	});
});