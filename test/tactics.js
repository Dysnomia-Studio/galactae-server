describe('• Tactics', () => {
	describe('# checkTactic()', () => {
		it('wrong name type', () => {
			assert(
				!Tactics.checkTactic({
					'name': undefined,
				})
			);

			assert(
				!Tactics.checkTactic({
					'name': {},
				})
			);

			assert(
				!Tactics.checkTactic({
					'name': [],
				})
			);

			assert(
				!Tactics.checkTactic({
					'name': 1,
				})
			);
		});

		it('wrong owner type', () => {
			assert(
				!Tactics.checkTactic({
					'owner': 1,
				})
			);
		});

		it('wrong id type', () => {
			assert(
				!Tactics.checkTactic({
					'id': 1,
				})
			);
		});

		it('wrong orders type', () => {
			assert(
				!Tactics.checkTactic({
					'orders': undefined,
				})
			);

			assert(
				!Tactics.checkTactic({
					'orders': {},
				})
			);

			assert(
				!Tactics.checkTactic({
					'orders': 1,
				})
			);
		});

		it('wrong entry', () => {
			assert(
				!Tactics.checkTactic({
					'sdf': 'fgfg',
				})
			);
		});

		it('too much orders in list', () => {
			const orders = [];
			for(let i=0; i<TACTIC_MAX_ORDERS*2; i++) {
				orders.push({ 'test': 'test' });
			}

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						// Do nothing here
					},
				};
			};

			assert(
				!Tactics.checkTactic({
					'orders': orders,
				}, {
					'username': 'moi',
				})
			);
		});

		it('empty orders list', () => {
			assert(
				!Tactics.checkTactic({
					'orders': [],
				}, {
					'username': 'moi',
				})
			);
		});

		it('order contain mine', () => {
			assert(
				!Tactics.checkTactic({
					'orders': [
						{ 'unit': 'blabla', 'target': 'target', 'priority': 1 },
						{ 'unit': 'SHIP_WEP_MINES' },
					],
				})
			);
		});

		it('order invalid unit', () => {
			assert(
				!Tactics.checkTactic({
					'orders': [
						{ 'unit': 'blabla', 'target': 'target', 'priority': 1 },
						{ 'unit': 1, 'target': 'target2', 'priority': 12 },
					],
				})
			);
		});

		it('order invalid target', () => {
			assert(
				!Tactics.checkTactic({
					'orders': [
						{ 'unit': 'blabla', 'target': 'target', 'priority': 1 },
						{ 'unit': 'blabla', 'target': 1, 'priority': 12 },
					],
				})
			);
		});

		it('order invalid priority', () => {
			assert(
				!Tactics.checkTactic({
					'orders': [
						{ 'unit': 'blabla', 'target': 'target', 'priority': 1 },
						{ 'unit': 'blabla', 'target': 'target2', 'priority': 'priority' },
					],
				})
			);
		});

		it('order ok', () => {
			assert(
				Tactics.checkTactic({
					'orders': [
						{ 'unit': 'blabla', 'target': 'target', 'priority': 1 },
						{ 'unit': 'blabla', 'target': 'target2', 'priority': 12 },
					],
				})
			);
		});
	});
});
