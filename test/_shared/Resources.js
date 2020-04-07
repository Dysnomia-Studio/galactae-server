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

	describe('# CalcNewResources()', () => {
		it('No currently building, no resources, planet lvl 1, 1h, no research', () => {
			const resources = Resources.CalcNewResources([0,0,0,0,0,0], [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0], 0, TIME.HOUR_TO_MS, { research: {} }, -1);
			const expected = [9,0,48,68,5,13];

			for(let i=0; i<expected.length; i++) {
				assert.equal(
					Math.floor(resources[i]),
					Math.floor(expected[i]),
					'Invalid resource: ' + i
				);
			}
		});

		it('No currently building, full mineral, planet lvl 1, 1h, no research', () => {
			const resources = Resources.CalcNewResources([10000,0,0,0,0,0], [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 0, TIME.HOUR_TO_MS, { research: {} }, -1);
			const expected = [1119,266,48,68,5,13];

			for(let i=0; i<expected.length; i++) {
				assert.equal(
					Math.floor(resources[i]),
					Math.floor(expected[i]),
					'Invalid resource: ' + i
				);
			}
		});

		it('No currently building, full metal, planet lvl 1, 1h, no research', () => {
			const resources = Resources.CalcNewResources([ 0, 0, 366.681, 523.83, 41.906, 104.766 ], [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 0, TIME.HOUR_TO_MS, { research: {} }, -1);
			const expected = [147,266,366,523,41,104];

			for(let i=0; i<expected.length; i++) {
				assert.equal(
					Math.floor(resources[i]),
					Math.floor(expected[i]),
					'Invalid resource: ' + i
				);
			}
		});

		it('No currently building, full resources, planet lvl 1, 1h, no research', () => {
			const resources = Resources.CalcNewResources([ 1119, 0, 366.681, 523.83, 41.906, 104.766 ], [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 0, TIME.HOUR_TO_MS, { research: {} }, -1);
			const expected = Resources.CalcNewResources(resources, [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 0, TIME.HOUR_TO_MS, { research: {} }, -1);

			for(let i=0; i<expected.length; i++) {
				assert.equal(
					Math.floor(resources[i]),
					Math.floor(expected[i]),
					'Invalid resource: ' + i
				);
			}
		});

		it('Minerals building, no resources, planet lvl 1, 1h, no research', () => {
			const resources = Resources.CalcNewResources([0,0,0,0,0,0], [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 0, TIME.HOUR_TO_MS, { research: {} }, 0);
			const mineralProd = 147 *  buildingSlowDown;
			const expected = [
				0,
				266,
				mineralProd * 0.35,
				mineralProd * 0.5,
				mineralProd * 0.04,
				mineralProd * 0.1
			];

			for(let i=0; i<expected.length; i++) {
				assert.equal(
					Math.floor(resources[i]),
					Math.floor(expected[i]),
					'Invalid resource: ' + i
				);
			}
		});

		it('Metal building, no resources, planet lvl 1, 1h, no research', () => {
			const resources = Resources.CalcNewResources([0,0,0,0,0,0], [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 0, TIME.HOUR_TO_MS, { research: {} }, 1);
			const metalProd = 138 *  buildingSlowDown;
			const expected = [
				147 - metalProd,
				266,
				metalProd * 0.35,
				metalProd * 0.5,
				metalProd * 0.04,
				metalProd * 0.1
			];

			for(let i=0; i<expected.length; i++) {
				assert.equal(
					Math.floor(resources[i]),
					Math.floor(expected[i]),
					'Invalid resource: ' + i
				);
			}
		});

		it('Helium building, no resources, planet lvl 1, 1h, no research', () => {
			const resources = Resources.CalcNewResources([0,0,0,0,0,0], [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 0, TIME.HOUR_TO_MS, { research: {} }, 13);
			const expected = [9,266 * buildingSlowDown,48,68,5,13];

			for(let i=0; i<expected.length; i++) {
				assert.equal(
					Math.floor(resources[i]),
					Math.floor(expected[i]),
					'Invalid resource: ' + i
				);
			}
		});

	});
});
