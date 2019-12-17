describe('• Fleets', () => {
	/**
	 * Has enough carrier capacity ?
 	 */
	describe('# hasEnoughCarrier()', () => {
		it('Enought', () => {
			const fleetUnits = {
				'fighter': 1,
				'carrier': 1,
			};

			const unitList = [
				{
					id: 'fighter',
					shipType: 'SHIP_FIGHTER',
					shipShape: 'SHIP_FIGHTER_SMALL',
				},
				{
					id: 'carrier',
					shipType: 'SHIP_CARRIER',
					parts: [
						{ type: 'hangar', tech: 'hangarDouble' },
						{ type: 'sub_propulsion', tech: 'vsolaire' },
					],
				},
				{
					id: 'other',
					shipType: 'SHIP_OTHER',
				},
			];

			assert.equal(
				Fleets.hasEnoughCarrier(
					{ units: fleetUnits },
					unitList),
				true
			);
		});

		it('No Enought', () => {
			const fleetUnits = {
				'fighter': 80,
				'carrier': 1,
			};

			const unitList = [
				{
					id: 'fighter',
					shipType: 'SHIP_FIGHTER',
					shipShape: 'SHIP_FIGHTER_SMALL',
				},
				{
					id: 'carrier',
					shipType: 'SHIP_CARRIER',
					parts: [
						{ type: 'hangar', tech: 'hangarDouble' },
						{ type: 'sub_propulsion', tech: 'vsolaire' },
					],
				},
			];

			assert.equal(
				Fleets.hasEnoughCarrier(
					{ units: fleetUnits },
					unitList),
				false
			);
		});
	});

	/**
	 * extractPublicInfo()
	 */
	describe('extractPublicInfo()', () => {
		it('Should work with empty units', () => {
			assert.deepEqual(
				Fleets.extractPublicInfo({
					id: 'id',
					name: 'name',
					foo: 'bar',
					units: {},
				}, 'player', {}), {
					id: 'id',
					name: 'name',
					owner: 'player',
					units: [],
				}
			);
		});

		it('Should work with normal units', () => {
			assert.deepEqual(
				Fleets.extractPublicInfo({
					id: 'id',
					name: 'name',
					foo: 'bar',
					units: {
						'u1': 10,
						'u2': 20,
					},
				}, 'player', {
					'u1': {
						id: 'u1',
						name: 'unitName',
						shipType: 'shipType',
						shipShape: 'shipShape',
						foo: 'bar',
					},
					'u2': {
						id: 'u2',
						name: 'unitName2',
						shipType: 'shipType2',
						shipShape: 'shipShape2',
						foo: 'bar',
					},
				}), {
					id: 'id',
					name: 'name',
					owner: 'player',
					units: [{
						id: 'u1',
						name: 'unitName',
						shipType: 'shipType',
						shipShape: 'shipShape',
						count: 10,
					},
					{
						id: 'u2',
						name: 'unitName2',
						shipType: 'shipType2',
						shipShape: 'shipShape2',
						count: 20,
					}],
				}
			);
		});

		it('Should work with special units', () => {
			assert.deepEqual(
				Fleets.extractPublicInfo({
					id: 'id',
					name: 'name',
					foo: 'bar',
					units: {
						'SHIP_WEP_MINES': 10,
						'u2': 20,
					},
				}, 'player', {
					'00000000-0000-0000-0000-000000000001': {
						id: 'SHIP_WEP_MINES',
						name: 'unitName',
						shipType: 'shipType',
						shipShape: 'shipShape',
						foo: 'bar',
					},
					'u2': {
						id: 'u2',
						name: 'unitName2',
						shipType: 'shipType2',
						shipShape: 'shipShape2',
						foo: 'bar',
					},
				}), {
					id: 'id',
					name: 'name',
					owner: 'player',
					units: [{
						id: 'SHIP_WEP_MINES',
						name: 'unitName',
						shipType: 'shipType',
						shipShape: 'shipShape',
						count: 10,
					},
					{
						id: 'u2',
						name: 'unitName2',
						shipType: 'shipType2',
						shipShape: 'shipShape2',
						count: 20,
					}],
				}
			);
		});
	});

	/**
	 * extractOrbitPublicInfo()
	 */
	describe('extractOrbitPublicInfo()', () => {
		it('Works', () => {
			assert.deepEqual(
				Fleets.extractOrbitPublicInfo({
					id: 'id',
					name: 'name',
					bar: 'foo',
					position: 'position',
					endMoveTime: 'endMoveTime',
				}, 'playerName'), {
					id: 'id',
					name: 'name',
					owner: 'playerName',
					position: 'position',
					endMoveTime: 'endMoveTime',
					units: [], // @TODO
				}
			);
		});
	});
});
