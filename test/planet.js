describe('• Planet', () => {
	describe('# calcPlanetPoints()', () => {
		it('all lvl 1', () => {
			const buildings = [1,1,1,1,1,1,1,1,1,0,0,0,0,0];
			assert.equal(
				Planet.calcPlanetPoints({Buildings: buildings}),
				47
			);
		});

		it('no all lvl max', () => {
			const buildings = buildingMaxLvl;
			assert.equal(
				Planet.calcPlanetPoints({Buildings: buildings}),
				1560
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