/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();
const Fleet = require('../fleets');
const Units = require('../units');

describe('• Units', () => {
	describe('# checkShipParts()', () => {
		it('OK Ship', () => {
			const ship = {
				type: 'SHIP_CARRIER',
				shape: 'SHIP_CARRIER_MEDIUM',
				hangar_1: { value: 'none', type: 'hangar' },
				hangar_2: { value: 'hangarSimple', type: 'hangar' },
				hangar_3: { value: 'hangarSimple', type: 'hangar' },
				hangar_4: { value: 'hangarDouble', type: 'hangar' },
				prop_1: { value: 'ion', type: 'sub_propulsion' },
				prop_2: { value: 'vsl', type: 'sup_propulsion' },
				shield_1: { value: 'magnetic', type: 'shield' },
			};

			assert.equal(
				Units.checkShipParts(ship),
				true
			);
		});

		it('Ship w/ invalid part type', () => {
			const ship = {
				type: 'SHIP_CARRIER',
				shape: 'SHIP_CARRIER_MEDIUM',
				hangar_1: { value: 'none', type: 'hangar' },
				hangar_2: { value: 'hangarSimple', type: 'hangar' },
				hangar_3: { value: 'hangarSimple', type: 'hangar' },
				hangar_4: { value: 'hangarDouble', type: 'trucbizzard' },
				prop_1: { value: 'ion', type: 'sub_propulsion' },
				prop_2: { value: 'vsl', type: 'sup_propulsion' },
				shield_1: { value: 'magnetic', type: 'shield' },
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});

		it('Ship w/ invalid part', () => {
			const ship = {
				type: 'SHIP_CARRIER',
				shape: 'SHIP_CARRIER_MEDIUM',
				hangar_1: { value: 'none', type: 'hangar' },
				hangar_2: { value: 'hangarSimple', type: 'hangar' },
				hangar_3: { value: 'hangarSimple', type: 'hangar' },
				hangar_4: { value: 'hangarDouble', type: 'hangar' },
				prop_1: { value: 'ion', type: 'sub_propulsion' },
				prop_2: { value: 'vsl', type: 'sup_propulsion' },
				prop_3: { value: 'vsl', type: 'sup_propulsion' }, // Here's the problem
				shield_1: { value: 'magnetic', type: 'shield' },
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});

		it('Ship w/ invalid part name', () => {
			const ship = {
				type: 'SHIP_CARRIER',
				shape: 'SHIP_CARRIER_MEDIUM',
				hangar_1: { value: 'none', type: 'hangar' },
				hangar_2: { value: 'hangarSimple', type: 'hangar' },
				hangar_3: { value: 'hangarSimple', type: 'hangar' },
				hangar_5: { value: 'hangarDouble', type: 'hangar' },  // Here's the problem
				prop_1: { value: 'ion', type: 'sub_propulsion' },
				prop_2: { value: 'vsl', type: 'sup_propulsion' },
				shield_1: { value: 'magnetic', type: 'shield' },
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});

		it('Ship w/ invalid part tech', () => {
			const ship = {
				type: 'SHIP_CARRIER',
				shape: 'SHIP_CARRIER_MEDIUM',
				hangar_1: { value: 'none', type: 'hangar' },
				hangar_2: { value: 'hangarSimple', type: 'hangar' },
				hangar_3: { value: 'hangarSimple', type: 'hangar' },
				hangar_4: { value: 'hangarDouble', type: 'hangar' },
				prop_1: { value: 'ion', type: 'sub_propulsion' },
				prop_2: { value: 'vsl', type: 'sup_propulsion' },
				shield_1: { value: 'projector', type: 'shield' }, // Here's the problem
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});

		it('Ship w/ same sub propulsion', () => {
			const ship = {
				type: 'SHIP_CORVET',
				shape: 'SHIP_CORVET_SMALL',
				prop_1: { value: 'ion', type: 'sub_propulsion' }, // Here's the problem
				prop_2: { value: 'ion', type: 'sub_propulsion' }, // Here's the problem
			};

			assert.equal(
				Units.checkShipParts(ship),
				true
			);
		});

		it('Ship w/ different sub propulsion', () => {
			const ship = {
				type: 'SHIP_CORVET',
				shape: 'SHIP_CORVET_SMALL',
				prop_1: { value: 'ion', type: 'sub_propulsion' }, // Here's the problem
				prop_2: { value: 'vsolaire', type: 'sub_propulsion' }, // Here's the problem
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});

		/** @TODO: When a ship have multiple sup propulsions
		it('Ship w/ same sup propulsion', () => {
			const ship = { 
				
			};

			assert.equal(
				Units.checkShipParts(ship),
				true
			);
		});

		it('Ship w/ different sub propulsion', () => {
			const ship = { 
			};

			assert.equal(
				Units.checkShipParts(ship),
				false
			);
		});*/
	});
});