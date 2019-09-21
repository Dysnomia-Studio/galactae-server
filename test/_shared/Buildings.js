/* eslint-disable no-magic-numbers */

/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../../calcConstants')();
require('../../misc')();

global.Buildings    = require('../../Buildings');

describe('• Buildings (shared)', () => {
	/**
	 * GetCost
	 */
	describe('# GetCost()', () => {
		it('build < 0', () => {
			assert.equal(
				Buildings.GetCost(-1),
				undefined
			);
		});

		it('build = 0, level = 1', () => {
			assert(
				isset(Buildings.GetCost(0, 1), 'object')
			);
		});

		it('build = max-1, level = 10', () => {
			assert(
				isset(Buildings.GetCost(globalConst.buildingNumber-1, 10), 'object')
			);
		});

		it('build >= max', () => {
			assert.equal(
				Buildings.GetCost(globalConst.buildingNumber),
				undefined
			);
		});
	});


	/**
	 * GetRequirements/HasRequirements
	 */
	describe('# GetRequirements/HasRequirements()', () => {
		it('Building is already > 0', () => {
			assert(
				Buildings.HasRequirements({}, { Buildings: [1] }, 0),
			);
		});

		it('No parents', () => {
			assert(
				Buildings.HasRequirements({}, { Buildings: [0] }, 0),
			);
		});

		it('Parents not OK (all)', () => {
			assert(
				!Buildings.HasRequirements({ research: { } }, { Buildings: [0,0,0,0,0,0,0,0,0,0,0,0,0] }, 9),
			);
		});

		it('Parents not OK (building)', () => {
			assert(
				!Buildings.HasRequirements({ research: { misc_telemetrie: -1, misc_em: -1 } }, { Buildings: [0,0,0,0,0,0,0,0,0,0,0,0,0] }, 9),
			);
		});

		it('Parents not OK (research)', () => {
			assert(
				!Buildings.HasRequirements({ research: {} }, { Buildings: [0,0,0,0,0,0,0,3,0,0,0,0,0] }, 9),
			);
		});

		it('Parents OK', () => {
			assert(
				Buildings.HasRequirements({ research: { misc_telemetrie: -1, misc_em: -1 } }, { Buildings: [0,0,0,0,0,0,0,3,0,0,0,0,0] }, 9),
			);
		});

		global.translate = {};

		it('[Translation failed] Parents not OK (building)', () => {
			try {
				Buildings.HasRequirements({ research: { misc_telemetrie: -1, misc_em: -1 } }, { Buildings: [0,0,0,0,0,0,0,0,0,0,0,0,0] }, 9);
				assert(false);
			} catch(e) {
				assert(true);
			}
		});

		it('[Translation failed] Parents not OK (research)', () => {
			try {
				Buildings.HasRequirements({ research: {} }, { Buildings: [0,0,0,0,0,0,0,3,0,0,0,0,0] }, 9);
				assert(false);
			} catch(e) {
				assert(true);
			}
		});

		delete translate;
	});


	/**
	 * getEnergyProd
	 */
	describe('# getEnergyProd()', () => {
		it('level 1', () => {
			const buildings = [1,1,1,1,1,1,1,1,1];
			assert.equal(
				Buildings.getEnergyProd(buildings),
				2795000
			);
		});

		it('level 30', () => {
			const buildings = [1,1,1,1,30,1,1,1,1];
			assert.equal(
				Buildings.getEnergyProd(buildings),
				1877500000
			);
		});
	});

	/**
	 * getEnergyCons
	 */
	describe('# getEnergyCons()', () => {
		it('level 1', () => {
			const buildings = [1,1,1,1,1,1,1,1,1];
			assert.equal(
				Buildings.getEnergyCons(buildings),
				2761850
			);
		});

		it('level 5 total', () => {
			const buildings = [5,5,5,5,5,5,5,5,5];
			assert.equal(
				Buildings.getEnergyCons(buildings),
				53866650
			);
		});
	});

	/**
	 * enoughEnergy
	 */
	describe('# enoughEnergy()', () => {
		it('enough', () => {
			const buildings = [1,1,1,1,1,1,1,1,1];
			assert.equal(
				Buildings.enoughEnergy(buildings),
				true
			);
		});

		it('no enough', () => {
			const buildings = [30,30,30,30,1,1,1,1,1];
			assert.equal(
				Buildings.enoughEnergy(buildings),
				false
			);
		});
	});

	/**
	 * calcStorageCapacity
	 */
	describe('# calcStorageCapacity()', () => {
		const lvl1 = [
			1119,
			1048,
			404,
		];

		const lvl30 = [
			192864,
			191968,
			3556672,
		];

		it('lvl 1 - no molecular compression', () => {
			const results = Buildings.calcStorageCapacity(1,1,false);

			for(let i=0; i<results.length; i++) {
				if(Math.abs(results[i] - lvl1[i]) > 1) {
					console.log(i);
					console.log('results: ' + results[i]);
					console.log('expected: ' + lvl1[i]);
				}

				assert(
					Math.abs(results[i] - lvl1[i]) < 1
				);
			}
		});

		it('lvl 1 - with molecular compression', () => {
			const results = Buildings.calcStorageCapacity(1,1,true);
			const expected = lvl1.map((e) => e * researchBonus.cp_molecular_compression);

			for(let i=0; i<results.length; i++) {
				if(Math.abs(results[i] - expected[i]) > 1) {
					console.log(i);
					console.log('results: ' + results[i]);
					console.log('expected: ' + expected[i]);
				}

				assert(
					Math.abs(results[i] - expected[i]) < 1
				);
			}
		});

		it('lvl 30 - no molecular compression', () => {
			const results = Buildings.calcStorageCapacity(30,30,false);

			for(let i=0; i<results.length; i++) {
				if(Math.abs(results[i] - lvl30[i]) > 1) {
					console.log(i);
					console.log('results: ' + results[i]);
					console.log('expected: ' + lvl30[i]);
				}

				assert(
					Math.abs(results[i] - lvl30[i]) < 1
				);
			}
		});

		it('lvl 30 - with molecular compression', () => {
			const results = Buildings.calcStorageCapacity(30,30,true);
			const expected = lvl30.map((e) => e * researchBonus.cp_molecular_compression);

			for(let i=0; i<results.length; i++) {
				if(Math.abs(results[i] - expected[i]) > 1) {
					console.log(i);
					console.log('results: ' + results[i]);
					console.log('expected: ' + expected[i]);
				}

				assert(
					Math.abs(results[i] - expected[i]) < 1
				);
			}
		});

		it('Helium lvl 0', () => {
			const HeliumStorage = Buildings.calcStorageCapacity(0,0, false)[2];
			const HeliumStorageWithMolecularCompression = Buildings.calcStorageCapacity(0,0,true)[2];

			assert.equal(
				HeliumStorage,
				0
			);
			assert.equal(
				HeliumStorageWithMolecularCompression,
				0
			);
		});
	});


	/**
	 * hasEnoughtStorage
	 */
	describe('# hasEnoughtStorage()', () => {
		it('all lvl 1', () => {
			assert(
				Buildings.hasEnoughtStorage(
					{ Buildings: [1,1,1,1,1,1,1,1,1,1,1,1,1,1] },
					1,
					false
				)
			);
		});

		it('all lvl 10 except storage', () => {
			assert(
				!Buildings.hasEnoughtStorage(
					{ Buildings: [10,10,10,10,10,1,10,10,10,10,10,10,10,10] },
					1,
					false
				)
			);
		});
	});
});