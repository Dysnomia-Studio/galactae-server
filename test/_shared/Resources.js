describe('• Resources (shared)', () => {
	describe('# GetRatiosPerPlanet()', () => {
		it('0', () => {
			assert.deepEqual(
				Resources.GetRatiosPerPlanet(0),
				Resources.planetRatios[0]
			);
		});

		it('unknown (-1)', () => {
			assert.deepEqual(
				Resources.GetRatiosPerPlanet(-1),
				Resources.planetRatios[0]
			);
		});

		/**it('1', () => {
			assert.deepEqual(
				Resources.GetRatiosPerPlanet(
				-1),
				Resources.planetRatios[1]
			);
		});*/
	});
});
