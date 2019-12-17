describe('• GameMap (shared)', () => {
	/**
	 * getPlanetCoords
	 */
	describe('# getPlanetCoords()', () => {
		it('getPlanetCoords(90° (=1/2 Pi))', () => {
			const coords = GameMap.getPlanetCoords(0.5*Math.PI, 1);

			assert.equal(Math.round(coords[0]), 0);
			assert.equal(Math.round(coords[1]), 1);
		});

		it('getPlanetCoords(450° (=5/2 Pi))', () => {
			const coords = GameMap.getPlanetCoords(2.5*Math.PI, 1);

			assert.equal(Math.round(coords[0]), 0);
			assert.equal(Math.round(coords[1]), 1);
		});
	});

	/**
	 * getPlanetDistance
	 */
	describe('# getPlanetDistance()', () => {
		it('getPlanetDistance(undefined orbitDist/orbitDuration)', () => {
			const from = {};
			const to = {};

			assert.equal(from.orbitDist, undefined);
			assert.equal(from.orbitDuration, undefined);
			assert.equal(to.orbitDist, undefined);
			assert.equal(to.orbitDuration, undefined);

			GameMap.getPlanetDistance(from, to, 1);

			assert.equal(from.orbitDist, 0);
			assert.equal(from.orbitDuration, 0);
			assert.equal(to.orbitDist, 0);
			assert.equal(to.orbitDuration, 0);
		});

		it('getPlanetDistance(defined orbitDist/orbitDuration)', () => {
			const from = { orbitDist: 1, orbitDuration: 1 };
			const to = { orbitDist: 1, orbitDuration: 1 };

			assert.equal(from.orbitDist, 1);
			assert.equal(from.orbitDuration, 1);
			assert.equal(to.orbitDist, 1);
			assert.equal(to.orbitDuration, 1);

			GameMap.getPlanetDistance(from, to, 1);

			assert.equal(from.orbitDist, 1);
			assert.equal(from.orbitDuration, 1);
			assert.equal(to.orbitDist, 1);
			assert.equal(to.orbitDuration, 1);
		});

		//  @TODO
	});

	/**
	 * getSystemFromAdress
	 */
	describe('# getSystemFromAdress()', () => {
		it('Should work', () => {
			assert.equal(
				GameMap.getSystemFromAdress('01-01-01-P1'),
				'01-01-01'
			);

			assert.equal(
				GameMap.getSystemFromAdress('12-01-2-S1'),
				'12-01-2'
			);
		});
	});

	/**
	 * getSectorFromAdress
	 */
	describe('# getSectorFromAdress()', () => {
		it('Should work', () => {
			assert.equal(
				GameMap.getSectorFromAdress('01-01-01-P1'),
				'01-01'
			);

			assert.equal(
				GameMap.getSectorFromAdress('12-01-2-S1'),
				'12-01'
			);
		});
	});
});
