describe('• Trading (shared)', () => {
	describe('# getPlanetCapacity()', () => {
		it('lvl 1', () => {
			assert.deepEqual(
				Trading.getPlanetCapacity(1),
				900
			);
		});
		it('lvl 10', () => {
			assert.deepEqual(
				Trading.getPlanetCapacity(10),
				75600
			);
		});
		it('lvl 30', () => {
			assert.deepEqual(
				Trading.getPlanetCapacity(30),
				821600
			);
		});
	});
});
