/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();
let Fleet = require('../fleet');
let Units = require('../units');

describe('• Units', function() {
	describe('# calcCost()', function() {
		it('Fighter', function() {
			let shipShape = "SHIP_FIGHTER_SMALL"; // [45,25,40,20,0.35,5]
			let parts = [
				{ tech: "railgun", type: "cannon", name: "cannon_1" }, // [4,1,8,5,0.10,1]  * fighterMult[shipShape] (=0.15)
				{ tech: "vsolaire", type: "sub_propulsion", name: "prop_1" }, // [120,45,35,15,0.30,0]  * fighterMult[shipShape] (=0.15)
			];

			assert.deepEqual(
				Units.calcCost(shipShape, parts),
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
				Units.calcCost(shipShape, parts),
				[687,755,356,152,4.45,1301]
			);
		});

		it('Part not existing', function() {
			let shipShape = "SHIP_FIGHTER_SMALL";
			let parts = [
				{ tech: "Not Existing" },
			];

			assert.deepEqual(
				Units.calcCost(shipShape, parts),
				[-1]
			);
		});
	});

	describe('# checkShipParts()', function() {
		it('OK Ship', function() {
			let ship = { 
				type: "SHIP_CARRIER", 
				shape: "SHIP_CARRIER_MEDIUM", 
				hangar_1: { value: "none", type: "hangar" },
				hangar_2: { value: "hangarSimple", type: "hangar" },
				hangar_3: { value: "hangarSimple", type: "hangar" },
				hangar_4: { value: "hangarDouble", type: "hangar" },
				prop_1: { value: "ion", type: "sub_propulsion" },
				prop_2: { value: "vsl", type: "sup_propulsion" },
				shield_1: { value: "magnetic", type: "shield" },
			};

			assert.equal(
				Units.checkShipParts(ship),
				true
			);
		});

		it('Ship w/ invalid part type', function() {
			let ship = { 
				type: "SHIP_CARRIER", 
				shape: "SHIP_CARRIER_MEDIUM", 
				hangar_1: { value: "none", type: "hangar" },
				hangar_2: { value: "hangarSimple", type: "hangar" },
				hangar_3: { value: "hangarSimple", type: "hangar" },
				hangar_4: { value: "hangarDouble", type: "trucbizzard" },
				prop_1: { value: "ion", type: "sub_propulsion" },
				prop_2: { value: "vsl", type: "sup_propulsion" },
				shield_1: { value: "magnetic", type: "shield" },
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});
			

		it('Ship w/ invalid part', function() {
			let ship = { 
				type: "SHIP_CARRIER", 
				shape: "SHIP_CARRIER_MEDIUM", 
				hangar_1: { value: "none", type: "hangar" },
				hangar_2: { value: "hangarSimple", type: "hangar" },
				hangar_3: { value: "hangarSimple", type: "hangar" },
				hangar_4: { value: "hangarDouble", type: "hangar" },
				prop_1: { value: "ion", type: "sub_propulsion" },
				prop_2: { value: "vsl", type: "sup_propulsion" },
				prop_3: { value: "vsl", type: "sup_propulsion" }, // Here's the problem
				shield_1: { value: "magnetic", type: "shield" },
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});

		it('Ship w/ invalid part name', function() {
			let ship = { 
				type: "SHIP_CARRIER", 
				shape: "SHIP_CARRIER_MEDIUM", 
				hangar_1: { value: "none", type: "hangar" },
				hangar_2: { value: "hangarSimple", type: "hangar" },
				hangar_3: { value: "hangarSimple", type: "hangar" },
				hangar_5: { value: "hangarDouble", type: "hangar" },  // Here's the problem
				prop_1: { value: "ion", type: "sub_propulsion" },
				prop_2: { value: "vsl", type: "sup_propulsion" },
				shield_1: { value: "magnetic", type: "shield" },
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});

		it('Ship w/ invalid part tech', function() {
			let ship = { 
				type: "SHIP_CARRIER", 
				shape: "SHIP_CARRIER_MEDIUM", 
				hangar_1: { value: "none", type: "hangar" },
				hangar_2: { value: "hangarSimple", type: "hangar" },
				hangar_3: { value: "hangarSimple", type: "hangar" },
				hangar_4: { value: "hangarDouble", type: "hangar" }, 
				prop_1: { value: "ion", type: "sub_propulsion" },
				prop_2: { value: "vsl", type: "sup_propulsion" },
				shield_1: { value: "projector", type: "shield" }, // Here's the problem
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});

		it('Ship w/ same sub propulsion', function() {
			let ship = { 
				type: "SHIP_CORVET", 
				shape: "SHIP_CORVET_SMALL", 
				prop_1: { value: "ion", type: "sub_propulsion" }, // Here's the problem
				prop_2: { value: "ion", type: "sub_propulsion" }, // Here's the problem
			};

			assert.equal(
				Units.checkShipParts(ship),
				true
			);
		});

		it('Ship w/ different sub propulsion', function() {
			let ship = { 
				type: "SHIP_CORVET", 
				shape: "SHIP_CORVET_SMALL", 
				prop_1: { value: "ion", type: "sub_propulsion" }, // Here's the problem
				prop_2: { value: "vsolaire", type: "sub_propulsion" }, // Here's the problem
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});

		/** @TODO: When a ship have multiple sup propulsions
		it('Ship w/ same sup propulsion', function() {
			let ship = { 
				
			};

			assert.equal(
				Units.checkShipParts(ship),
				true
			);
		});

		it('Ship w/ different sub propulsion', function() {
			let ship = { 
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});*/
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
				Units.checkIfSameParts(ship1, ship2),
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
				Units.checkIfSameParts(ship1, ship2),
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
				Units.checkIfSameParts(ship1, ship2),
				false
			);
		});
	});

	describe('# getSpeed()', function() {
		it('One Ion', function() {
			assert.deepEqual(Units.getSpeed([-1], "ion"),
				shipPartsSpeed['ion']
			);
		});

		it('Two Ion', function() {
			let expected = [];
			for(var i in shipPartsSpeed['ion']) {
				expected[i] = shipPartsSpeed['ion'][i] * 1.5;
			}
			assert.deepEqual(Units.getSpeed(
				shipPartsSpeed['ion'],
				"ion"),
				expected
			);
		});

		it('Part not existing', function() {
			assert.deepEqual(Units.getSpeed([-1],"invalid"),
				[]
			);
		});
	});

	describe('# calcSubSpeed()', function() {
		it('One Ion', function() {
			assert.deepEqual(Units.calcSubSpeed({
					parts: [
						{ tech: "railgun", type: "cannon", name: "cannon_1" },
						{ tech: "ion", type: "sub_propulsion", name: "prop_1" },
					],
				}).speed,
				shipPartsSpeed['ion']
			);
		});

		it('Two Ion', function() {
			let expected = [];
			for(var i in shipPartsSpeed['ion']) {
				expected[i] = shipPartsSpeed['ion'][i] * 1.5;
			}
			assert.deepEqual(Units.calcSubSpeed({
					parts: [
						{ tech: "railgun", type: "cannon", name: "cannon_1" },
						{ tech: "ion", type: "sub_propulsion", name: "prop_1" },
						{ tech: "ion", type: "sub_propulsion", name: "prop_2" },
					],
				}).speed,
				expected
			);
		});

		it('Part not existing', function() {
			assert.deepEqual(Units.calcSubSpeed({
					parts: [
						{ tech: "railgun", type: "cannon", name: "cannon_1" },
						{ tech: "myFalsePropulsion", type: "sub_propulsion", name: "prop_1" },
					],
				}),
				{ speed: [] }
			);
		});
	});

	describe('# calcSupraSpeed()', function() {
		it('One vsl', function() {
			assert.deepEqual(Units.calcSupraSpeed({
					parts: [
						{ tech: "railgun", type: "cannon", name: "cannon_1" },
						{ tech: "vsl", type: "sup_propulsion", name: "prop_1" },
					],
				}).speed,
				shipPartsSpeed['vsl']
			);
		});

		it('Two vsl', function() {
			let expected = [];
			for(var i in shipPartsSpeed['vsl']) {
				expected[i] = shipPartsSpeed['vsl'][i] * 1.5;
			}
			assert.deepEqual(Units.calcSupraSpeed({
					parts: [
						{ tech: "railgun", type: "cannon", name: "cannon_1" },
						{ tech: "vsl", type: "sup_propulsion", name: "prop_1" },
						{ tech: "vsl", type: "sup_propulsion", name: "prop_2" },
					],
				}).speed,
				expected
			);
		});

		it('Part not existing', function() {
			assert.deepEqual(Units.calcSupraSpeed({
					parts: [
						{ tech: "railgun", type: "cannon", name: "cannon_1" },
						{ tech: "myFalsePropulsion", type: "sup_propulsion", name: "prop_1" },
					],
				}),
				{ speed: [] }
			);
		});
	});
});