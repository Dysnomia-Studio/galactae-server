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

global.db = require('../database');

global.Fleet = require('../Fleet').Fleet;

describe('• Fleet', function() {
	describe('# getSpeed()', function() {
		it('One Ion', function() {
			assert.deepEqual(Fleet.getSpeed([-1], 'ion'),
				shipPartsSpeed['ion']
			);
		});

		it('Two Ion', function() {
			const expected = [];
			for(const i in shipPartsSpeed['ion']) {
				expected[i] = shipPartsSpeed['ion'][i] * 1.5;
			}
			assert.deepEqual(Fleet.getSpeed(
				shipPartsSpeed['ion'],
				'ion'),
				expected
			);
		});

		it('Part not existing', function() {
			assert.deepEqual(Fleet.getSpeed([-1],'invalid'),
				[]
			);
		});
	});

	describe('# calcSubSpeed()', function() {
		it('One Ion', function() {
			assert.deepEqual(Fleet.calcSubSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'ion', type: 'sub_propulsion', name: 'prop_1' },
					],
				}).speed,
				shipPartsSpeed['ion']
			);
		});

		it('Two Ion', function() {
			const expected = [];
			for(const i in shipPartsSpeed['ion']) {
				expected[i] = shipPartsSpeed['ion'][i] * 1.5;
			}
			assert.deepEqual(Fleet.calcSubSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'ion', type: 'sub_propulsion', name: 'prop_1' },
						{ tech: 'ion', type: 'sub_propulsion', name: 'prop_2' },
					],
				}).speed,
				expected
			);
		});

		it('Part not existing', function() {
			assert.deepEqual(Fleet.calcSubSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'myFalsePropulsion', type: 'sub_propulsion', name: 'prop_1' },
					],
				}),
				{ speed: [] }
			);
		});
	});

	describe('# calcSupraSpeed()', function() {
		it('One vsl', function() {
			assert.deepEqual(Fleet.calcSupraSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'vsl', type: 'sup_propulsion', name: 'prop_1' },
					],
				}).speed,
				shipPartsSpeed['vsl']
			);
		});

		it('Two vsl', function() {
			const expected = [];
			for(const i in shipPartsSpeed['vsl']) {
				expected[i] = shipPartsSpeed['vsl'][i] * 1.5;
			}
			assert.deepEqual(Fleet.calcSupraSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'vsl', type: 'sup_propulsion', name: 'prop_1' },
						{ tech: 'vsl', type: 'sup_propulsion', name: 'prop_2' },
					],
				}).speed,
				expected
			);
		});

		it('Part not existing', function() {
			assert.deepEqual(Fleet.calcSupraSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'myFalsePropulsion', type: 'sup_propulsion', name: 'prop_1' },
					],
				}),
				{ speed: [] }
			);
		});
	});

	/**
	 * Calc fuel Cost ?
 	 */
	describe('# calcFuelCost()', function() {
		it('Sub', function() {
			const engines = {
				'vsolaire': 1, // 0
				'ion': 2, // 21364
				'pplasma': 3, // 21732
			};

			assert.equal(
				Fleet.calcFuelCost(engines),
				43096
			);
		});

		it('Supra', function() {
			const engines = {
				'vsl': 1, // 32761
				'wd': 2, // 58024
				'hyperespace': 3, // 76476
			};

			assert.equal(
				Fleet.calcFuelCost(engines),
				167261
			);
		});
	});

	/**
	 * Slower speed ?
 	 */
	describe('# slowerSpeed()', function() {
		it('A slower than B', function() {
			const a = [1,2,3];
			const b = [3,2,1];

			assert.equal(
				Fleet.slowerSpeed(a, b),
				a
			);
		});

		it('A equals to B', function() {
			const a = [1,2,3];
			const b = [1,2,3];

			assert.equal(
				Fleet.slowerSpeed(a, b),
				a
			);
		});

		it('A faster than B', function() {
			const a = [3,2,1];
			const b = [1,2,3];

			assert.equal(
				Fleet.slowerSpeed(a, b),
				b
			);
		});
	});

	/**
	 * Calc move time
	 */
	describe('# calcMoveTime()', function() {
		it('1, 0 0 0 = 0', function() {
			assert.equal(
				Fleet.calcMoveTime(1, [0,0,0]),
				0
			);
		});
		it('1, 1 2 3 = 6', function() {
			assert.equal(
				Fleet.calcMoveTime(1, [1,2,3]),
				6
			);
		});
		it('2, 3 2 1 = 17', function() { // 3*(2^2)* + 2*2 + 1 = 12 + 4 + 1
			assert.equal(
				Fleet.calcMoveTime(2, [3,2,1]),
				17
			);
		});
	});
});