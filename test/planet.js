describe('• Planet', () => {
	describe('# calcPlanetPoints()', () => {
		it('all lvl 1', () => {
			const buildings = [1,1,1,1,1,1,1,1,1,0,0,0,0,0];
			assert.equal(
				Planet.calcPlanetPoints({Buildings: buildings}),
				47
			);
		});

		it('no all lvl max planet 0', () => {
			const buildings = buildingMaxLvl[0];
			assert.equal(
				Planet.calcPlanetPoints({Buildings: buildings}),
				1560
			);
		});

		it('no all lvl max planet 101', () => {
			const buildings = buildingMaxLvl[101];
			assert.equal(
				Planet.calcPlanetPoints({Buildings: buildings}),
				1414
			);
		});

		it('no all lvl max planet 113', () => {
			const buildings = buildingMaxLvl[113];
			assert.equal(
				Planet.calcPlanetPoints({Buildings: buildings}),
				1535
			);
		});

		it('no all lvl max planet 103', () => {
			const buildings = buildingMaxLvl[103];
			assert.equal(
				Planet.calcPlanetPoints({Buildings: buildings}),
				1108
			);
		});
	});

	describe('# calcFleetPoints()', () => {
		it('all lvl 1', () => {
			const fleets = [
				{ points: 2, },
				{ points: 12, },
				{ points: 15, },
			];
			assert.equal(
				Planet.calcFleetPoints(fleets),
				29
			);
		});
	});
});
