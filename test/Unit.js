/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();

let Unit = require('../Unit').Unit;

describe('• Unit', function() {
	describe('# calcCost()', function() {
		it('Fighter', function() {
			let shipShape = "SHIP_FIGHTER_SMALL"; // [45,25,40,20,0.35,5]
			let parts = [
				{ tech: "railgun", type: "cannon", name: "cannon_1" }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
				{ tech: "vsolaire", type: "sub_propulsion", name: "prop_1" }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
			];

			assert.deepEqual(
				Unit.calcCost(shipShape, parts),
				[64,32,46,23,0.41,5]
			);
		});

		it('Not a Fighter', function() {
			let shipShape = "SHIP_CARRIER_MEDIUM"; //                            [500,420,190, 95,1.65,1200]
			let parts = [
				{ tech: "none", type: "hangar", name: "hangar_1" }, //           [  0,  0,  0,  0,   0,   0]
				{ tech: "hangarSimple", type: "hangar", name: "hangar_2" }, //   [  5, 30, 18,  5,0.50,   5]
				{ tech: "hangarSimple", type: "hangar", name: "hangar_3" }, //   [  5, 30, 18,  5,0.50,   5]
				{ tech: "hangarDouble", type: "hangar", name: "hangar_4" }, //   [ 12, 45, 25,  7,0.80,  10]
				{ tech: "ion", type: "sub_propulsion", name: "prop_1" }, //      [ 80, 60, 40,  5,0.25,   0]
				{ tech: "vsl", type: "sup_propulsion", name: "prop_2" }, //      [ 65,120, 60, 20,0.55,  80]
				{ tech: "magnetic", type: "shield", name: "shield_1" }, //       [ 20, 50,  5, 15,0.20,   1]
			];

			assert.deepEqual(
				Unit.calcCost(shipShape, parts),
				[687,755,356,152,4.45,1301]
			);
		});

		it('Part not existing', function() {
			let shipShape = "SHIP_FIGHTER_SMALL";
			let parts = [
				{ tech: "Not Existing" },
			];

			assert.deepEqual(
				Unit.calcCost(shipShape, parts),
				[-1]
			);
		});
	});

	describe('# checkIfSameParts()', function() {
		it('Same Ships', function() {
			let ship1 = { 
				parts:  [
					{ tech: "railgun", type: "cannon", name: "cannon_1" }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
					{ tech: "vsolaire", type: "sub_propulsion", name: "prop_1" }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
				]
			};
			let ship2 = { 
				parts:  [
					{ tech: "vsolaire", type: "sub_propulsion", name: "prop_1" }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
					{ tech: "railgun", type: "cannon", name: "cannon_1" }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
				]
			};

			assert.deepEqual(
				Unit.checkIfSameParts(ship1, ship2),
				true
			);
		});

		it('Same Ships (reverse order)', function() {
			let ship1 = { 
				parts:  [
					{ tech: "vsolaire", type: "sub_propulsion", name: "prop_1" }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
					{ tech: "railgun", type: "cannon", name: "cannon_1" }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
				]
			};
			let ship2 = { 
				parts:  [
					{ tech: "railgun", type: "cannon", name: "cannon_1" }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
					{ tech: "vsolaire", type: "sub_propulsion", name: "prop_1" }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
				]
			};

			assert.deepEqual(
				Unit.checkIfSameParts(ship1, ship2),
				true
			);
		});

		it('Differents Ships', function() {
			let ship1 = { 
				parts:  [
					{ tech: "railgun", type: "cannon", name: "cannon_1" }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
					{ tech: "vsolaire", type: "sub_propulsion", name: "prop_1" }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
				]
			};
			let ship2 = { 
				parts:  [
					{ tech: "ion", type: "sub_propulsion", name: "prop_1" }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
					{ tech: "railgun", type: "cannon", name: "cannon_1" }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
				]
			};

			assert.deepEqual(
				Unit.checkIfSameParts(ship1, ship2),
				false
			);
		});
	});
});