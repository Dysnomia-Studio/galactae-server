/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../../calcConstants')();
require('../../misc')();

const Units = require('../../_shared/Units').Units;

describe('• Units (shared)', () => {
	describe('# checkIfSameParts()', () => {
		it('Same Ships', () => {
			const ship1 = {
				parts:  [
					{ tech: 'railgun', type: 'cannon', name: 'cannon_1' }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
					{ tech: 'vsolaire', type: 'sub_propulsion', name: 'prop_1' }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
				]
			};
			const ship2 = {
				parts:  [
					{ tech: 'vsolaire', type: 'sub_propulsion', name: 'prop_1' }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
					{ tech: 'railgun', type: 'cannon', name: 'cannon_1' }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
				]
			};

			assert.deepEqual(
				Units.checkIfSameParts(ship1, ship2),
				true
			);
		});

		it('Same Ships (reverse order)', () => {
			const ship1 = {
				parts:  [
					{ tech: 'vsolaire', type: 'sub_propulsion', name: 'prop_1' }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
					{ tech: 'railgun', type: 'cannon', name: 'cannon_1' }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
				]
			};
			const ship2 = {
				parts:  [
					{ tech: 'railgun', type: 'cannon', name: 'cannon_1' }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
					{ tech: 'vsolaire', type: 'sub_propulsion', name: 'prop_1' }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
				]
			};

			assert.deepEqual(
				Units.checkIfSameParts(ship1, ship2),
				true
			);
		});

		it('Differents Ships', () => {
			const ship1 = {
				parts:  [
					{ tech: 'railgun', type: 'cannon', name: 'cannon_1' }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
					{ tech: 'vsolaire', type: 'sub_propulsion', name: 'prop_1' }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
				]
			};
			const ship2 = {
				parts:  [
					{ tech: 'ion', type: 'sub_propulsion', name: 'prop_1' }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
					{ tech: 'railgun', type: 'cannon', name: 'cannon_1' }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
				]
			};

			assert.deepEqual(
				Units.checkIfSameParts(ship1, ship2),
				false
			);
		});
	});

	describe('# checkIfDuplicate()', () => {
		const ship1 = {
			name: 'ship1',
			parts:  [
				{ tech: 'railgun', type: 'cannon', name: 'cannon_1' }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
				{ tech: 'vsolaire', type: 'sub_propulsion', name: 'prop_1' }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
			],
		};
		const ship2 = {
			name: 'ship2',
			parts:  [
				{ tech: 'ion', type: 'sub_propulsion', name: 'prop_1' }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
				{ tech: 'railgun', type: 'cannon', name: 'cannon_1' }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
			]
		};

		it('different parts', () => {
			assert.deepEqual(
				Units.checkIfDuplicate([	ship1 ], ship2),
				[false, false]
			);
		});

		it('different type', () => {
			const ship3 = JSON.parse(JSON.stringify(ship1));
			const ship4 = JSON.parse(JSON.stringify(ship1));
			ship3.shipType = '1';
			ship3.name = '1';
			ship4.shipType = '2';
			ship4.name = '2';

			assert.deepEqual(
				Units.checkIfDuplicate([	ship4 ], ship3),
				[false, false]
			);
		});

		it('different shape', () => {
			const ship3 = JSON.parse(JSON.stringify(ship1));
			const ship4 = JSON.parse(JSON.stringify(ship1));
			ship3.shipShape = '1';
			ship3.name = '1';
			ship4.shipShape = '2';
			ship4.name = '2';

			assert.deepEqual(
				Units.checkIfDuplicate([	ship4 ], ship3),
				[false, false]
			);
		});

		it('different parts length', () => {
			const ship3 = JSON.parse(JSON.stringify(ship1));
			ship3.parts = [];
			ship3.name = '1';

			assert.deepEqual(
				Units.checkIfDuplicate([	ship1 ], ship3),
				[false, false]
			);
		});


		it('diff name same parts', () => {
			const ship3 = {
				name: 'ship3',
				parts: ship1.parts,
			};

			assert.deepEqual(
				Units.checkIfDuplicate([	ship1, ship2 ], ship3),
				[true, false]
			);
		});

		it('same name same parts', () => {
			assert.deepEqual(
				Units.checkIfDuplicate([	ship1, ship2 ], ship1),
				[false, true]
			);
		});
	});

	describe('# calcCost()', () => {
		it('Fighter', () => {
			const shipShape = 'SHIP_FIGHTER_SMALL'; // [45,25,40,20,0.35,5]
			const parts = [
				{ tech: 'railgun', type: 'cannon', name: 'cannon_1' }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
				{ tech: 'vsolaire', type: 'sub_propulsion', name: 'prop_1' }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
			];

			assert.deepEqual(
				Units.calcCost(shipShape, parts),
				[64,32,46,23,0.41,5]
			);
		});

		it('Not a Fighter', () => {
			const shipShape = 'SHIP_CARRIER_MEDIUM'; //                            [500,420,190, 95,1.65,1200]
			const parts = [
				{ tech: 'none', type: 'hangar', name: 'hangar_1' }, //           [  0,  0,  0,  0,   0,   0]
				{ tech: 'hangarSimple', type: 'hangar', name: 'hangar_2' }, //   [  5, 30, 18,  5,0.50,   5]
				{ tech: 'hangarSimple', type: 'hangar', name: 'hangar_3' }, //   [  5, 30, 18,  5,0.50,   5]
				{ tech: 'hangarDouble', type: 'hangar', name: 'hangar_4' }, //   [ 12, 45, 25,  7,0.80,  10]
				{ tech: 'ion', type: 'sub_propulsion', name: 'prop_1' }, //      [ 80, 60, 40,  5,0.25,   0]
				{ tech: 'vsl', type: 'sup_propulsion', name: 'prop_2' }, //      [ 65,120, 60, 20,0.55,  80]
				{ tech: 'magnetic', type: 'shield', name: 'shield_1' }, //       [ 20, 50,  5, 15,0.20,   1]
			];

			assert.deepEqual(
				Units.calcCost(shipShape, parts),
				[687,755,356,152,4.45,1301]
			);
		});

		it('Part not existing', () => {
			const shipShape = 'SHIP_FIGHTER_SMALL';
			const parts = [
				{ tech: 'Not Existing' },
			];

			assert.deepEqual(
				Units.calcCost(shipShape, parts),
				[-1]
			);
		});
	});
});