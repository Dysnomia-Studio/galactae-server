describe('• Reports', () => {
	describe('# getAllLostUnitsInFleets()', () => {
		it('Empty logs', () => {
			const report = {
				logs: [],
			};
			const expected = {};

			assert.deepEqual(
				Reports.getAllLostUnitsInFleets(report),
				expected
			);
		});

		it('1 Unit', () => {
			const report = {
				logs: [
					{
						fleetDestinationId: 'F1',
						unitDestinationId: 'U1',
						damage: 1,
					},
				],
			};
			const expected = {
				F1: {
					U1: 1,
				},
			};

			assert.deepEqual(
				Reports.getAllLostUnitsInFleets(report),
				expected
			);
		});

		it('2 Unit', () => {
			const report = {
				logs: [
					{
						fleetDestinationId: 'F1',
						unitDestinationId: 'U1',
						damage: 1,
					},
					{
						fleetDestinationId: 'F1',
						unitDestinationId: 'U2',
						damage: 1,
					},
				],
			};
			const expected = {
				F1: {
					U1: 1,
					U2: 1,
				},
			};

			assert.deepEqual(
				Reports.getAllLostUnitsInFleets(report),
				expected
			);
		});

		it('2 Same Units', () => {
			const report = {
				logs: [
					{
						fleetDestinationId: 'F1',
						unitDestinationId: 'U1',
						damage: 1,
					},
					{
						fleetDestinationId: 'F1',
						unitDestinationId: 'U1',
						damage: 1,
					},
				],
			};
			const expected = {
				F1: {
					U1: 2,
				},
			};

			assert.deepEqual(
				Reports.getAllLostUnitsInFleets(report),
				expected
			);
		});
	});
});