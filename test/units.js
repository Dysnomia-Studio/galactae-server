describe('• Units', () => {
	describe('# checkShipParts()', () => {
		let ship = {
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

		it('OK Ship', () => {
			assert.equal(
				Units.checkShipParts(ship),
				true
			);
		});

		it('Ship w/ invalid part type', () => {
			ship.hangar_4 = { value: 'hangarDouble', type: 'trucbizzard' };

			assert.equal(
				Units.checkShipParts(ship),
				false
			);

			ship.hangar_4 = { value: 'hangarDouble', type: 'hangar' };
		});

		it('Ship w/ invalid part', () => {
			ship.prop_3 = { value: 'vsl', type: 'sup_propulsion' };

			assert.equal(
				Units.checkShipParts(ship),
				false
			);

			delete ship.prop_3;
		});

		it('Ship w/ invalid part name', () => {
			delete ship.hangar_4;
			ship.hangar_5 = { value: 'hangarDouble', type: 'hangar' };

			assert.equal(
				Units.checkShipParts(ship),
				false
			);

			delete ship.hangar_5;
			ship.hangar_4 = { value: 'hangarDouble', type: 'hangar' };
		});

		it('Ship w/ invalid part tech', () => {
			ship.shield_1.value = 'projector';

			assert.equal(
				Units.checkShipParts(ship),
				false
			);

			ship.shield_1.value = 'magnetic';
		});

		it('Ship w/ same sub propulsion', () => {
			ship = {
				type: 'SHIP_CORVET',
				shape: 'SHIP_CORVET_AEGIS',
				prop_1: { value: 'ion', type: 'sub_propulsion' }, // Here's the problem
				prop_2: { value: 'ion', type: 'sub_propulsion' }, // Here's the problem
			};

			assert.equal(
				Units.checkShipParts(ship),
				true
			);
		});

		it('Ship w/ different sub propulsion', () => {
			ship.prop_2 = { value: 'vsolaire', type: 'sub_propulsion' }; // Here's the problem

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
