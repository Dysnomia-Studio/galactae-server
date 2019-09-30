describe('• Fleets (shared)', () => {
	describe('# getSpeed()', () => {
		it('One Ion', () => {
			assert.deepEqual(Fleets.getSpeed([-1], 'ion'),
				shipPartsSpeed['ion']
			);
		});

		it('Two Ion', () => {
			const expected = [];
			for(const i in shipPartsSpeed['ion']) {
				expected[i] = shipPartsSpeed['ion'][i] * 1.5;
			}
			assert.deepEqual(
				Fleets.getSpeed(
					shipPartsSpeed['ion'],
					'ion'
				),
				expected
			);
		});

		it('Part not existing', () => {
			assert.deepEqual(Fleets.getSpeed([-1],'invalid'),
				[]
			);
		});
	});

	describe('# calcSubSpeed()', () => {
		it('Undefined unit', () => {
			assert.deepEqual(
				Fleets.calcSubSpeed(undefined),
				{ speed: [] }
			);
		});

		it('One Ion', () => {
			assert.deepEqual(Fleets.calcSubSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'ion', type: 'sub_propulsion', name: 'prop_1' },
					],
				}).speed,
				shipPartsSpeed['ion']
			);
		});

		it('Two Ion', () => {
			const expected = [];
			for(const i in shipPartsSpeed['ion']) {
				expected[i] = shipPartsSpeed['ion'][i] * 1.5;
			}
			assert.deepEqual(Fleets.calcSubSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'ion', type: 'sub_propulsion', name: 'prop_1' },
						{ tech: 'ion', type: 'sub_propulsion', name: 'prop_2' },
					],
				}).speed,
				expected
			);
		});

		it('Part not existing', () => {
			assert.deepEqual(Fleets.calcSubSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'myFalsePropulsion', type: 'sub_propulsion', name: 'prop_1' },
					],
				}),
				{ speed: [] }
			);
		});
	});

	describe('# calcSupraSpeed()', () => {
		it('Undefined unit', () => {
			assert.deepEqual(
				Fleets.calcSupraSpeed(undefined),
				{ speed: [] }
			);
		});

		it('One vsl', () => {
			assert.deepEqual(Fleets.calcSupraSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'vsl', type: 'sup_propulsion', name: 'prop_1' },
					],
				}).speed,
				shipPartsSpeed['vsl']
			);
		});

		it('Two vsl', () => {
			const expected = [];
			for(const i in shipPartsSpeed['vsl']) {
				expected[i] = shipPartsSpeed['vsl'][i] * 1.5;
			}
			assert.deepEqual(Fleets.calcSupraSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'vsl', type: 'sup_propulsion', name: 'prop_1' },
						{ tech: 'vsl', type: 'sup_propulsion', name: 'prop_2' },
					],
				}).speed,
				expected
			);
		});

		it('Part not existing', () => {
			assert.deepEqual(Fleets.calcSupraSpeed({
					parts: [
						{ tech: 'railgun', type: 'cannon', name: 'cannon_1' },
						{ tech: 'myFalsePropulsion', type: 'sup_propulsion', name: 'prop_1' },
					],
				}),
				{ speed: [] }
			);
		});
	});

	/**
	 * Calc fuel Cost ?
 	 */
	describe('# calcFuelCost()', () => {
		it('Sub', () => {
			const engines = {
				'vsolaire': 1, // 0
				'ion': 2, // 21364
				'pplasma': 3, // 21732
			};

			assert.equal(
				Fleets.calcFuelCost(engines),
				43096
			);
		});

		it('Supra', () => {
			const engines = {
				'vsl': 1, // 32761
				'wd': 2, // 58024
				'hyperespace': 3, // 76476
			};

			assert.equal(
				Fleets.calcFuelCost(engines),
				167261
			);
		});
	});

	/**
	 * Slower speed ?
 	 */
	describe('# slowerSpeed()', () => {
		it('A slower than B', () => {
			const a = [1,2,3];
			const b = [3,2,1];

			assert.equal(
				Fleets.slowerSpeed(a, b),
				a
			);
		});

		it('A equals to B', () => {
			const a = [1,2,3];
			const b = [1,2,3];

			assert.equal(
				Fleets.slowerSpeed(a, b),
				a
			);
		});

		it('A faster than B', () => {
			const a = [3,2,1];
			const b = [1,2,3];

			assert.equal(
				Fleets.slowerSpeed(a, b),
				b
			);
		});
	});

	/**
	 * Calc move time
	 */
	describe('# calcMoveTime()', () => {
		it('1, 0 0 0 = 0', () => {
			assert.equal(
				Fleets.calcMoveTime(1, [0,0,0]),
				0
			);
		});
		it('1, 1 2 3 = 6', () => {
			assert.equal(
				Fleets.calcMoveTime(1, [1,2,3]),
				6
			);
		});
		it('2, 3 2 1 = 17', () => { // 3*(2^2)* + 2*2 + 1 = 12 + 4 + 1
			assert.equal(
				Fleets.calcMoveTime(2, [3,2,1]),
				17
			);
		});
	});

	/**
	 * Distribute fuel
	 */
	describe('# distributeFuel()', () => {
		const DISTRIBUTE_FUEL_RANDOMTESTS_COUNT = 10000;
		const DISTRIBUTE_FUEL_RANDOMTESTS_MAXFLEETS = 5;
		const DISTRIBUTE_FUEL_RANDOMTESTS_MAXRANDOM_MAXFUEL = 10000000;
		const DISTRIBUTE_FUEL_RANDOMTESTS_MAXRANDOM_FUEL = 5000000;
		const DISTRIBUTE_FUEL_RANDOMTESTS_MAXRANDOM_PLANETFUEL = 5000000;

		it('Random tests (' + DISTRIBUTE_FUEL_RANDOMTESTS_COUNT + ')', () => {
			for(let currentTest=1; currentTest<=DISTRIBUTE_FUEL_RANDOMTESTS_COUNT; currentTest++) {
				// Prepare
				const fleetCount = Math.round(Math.random() * DISTRIBUTE_FUEL_RANDOMTESTS_MAXFLEETS);
				const fleetList = [];
				let totalFuel = 0;

				for(let currentFleet=0; currentFleet<fleetCount; currentFleet++) {
					fleetList[currentFleet] = {
						id: 'f' + currentFleet,
						maxFuel: Math.round(Math.random() * DISTRIBUTE_FUEL_RANDOMTESTS_MAXRANDOM_MAXFUEL),
						fuel: Math.round(Math.random() * DISTRIBUTE_FUEL_RANDOMTESTS_MAXRANDOM_FUEL),
					};

					fleetList[currentFleet].fuel = Math.min(fleetList[currentFleet].fuel, fleetList[currentFleet].maxFuel);

					if(Math.random() < 0.01) {
						fleetList[currentFleet].fuel = undefined;
					}

					if(typeof fleetList[currentFleet].fuel !== 'undefined') {
						totalFuel += fleetList[currentFleet].fuel;
					}
				}

				const planet = {
					resources: [
						0,
						Math.round(Math.random() * DISTRIBUTE_FUEL_RANDOMTESTS_MAXRANDOM_PLANETFUEL),
						0,0,0,0,
					],
					highPriorityFleet: 'f' + Math.round(Math.random() * fleetCount * 2),
				};

				if(planet.highPriorityFleet === ('f' + fleetCount * 2)) {
					planet.highPriorityFleet = undefined;
				}

				totalFuel += planet.resources[1];

				// Use
				const [
					newPlanet,
					newFleetList
				] = Fleets.distributeFuel(planet, fleetList);

				// Check
				let newTotalFuel = 0 + newPlanet.resources[1];
				for(let i=0; i<newFleetList.length; i++) {

					newTotalFuel += newFleetList[i].fuel;

					if(newPlanet.highPriorityFleet === newFleetList[i]) {
						assert(newFleetList[i].fuel === newFleetList[i].maxFuel || newPlanet.resources[1] === 0, 'Priority fleet');
					}

					assert(newFleetList[i].fuel >= 0, 'Positive or null fuel ' + fleetList[i].fuel + ' ' + newFleetList[i].fuel);
					assert(newFleetList[i].fuel <= newFleetList[i].maxFuel, 'Fuel is less or equal than max');
				}

				assert.equal(totalFuel, newTotalFuel);
			}
		});
	});

	/**
	 * removeEmptyUnits
	 */
	describe('# removeEmptyUnits()', () => {
		it('Empty fleet', () => {
			const fleet = { units: {} };

			assert.deepEqual(
				Fleets.removeEmptyUnits(fleet),
				fleet
			);
		});

		it('No remove', () => {
			const fleet = { units: { test: 1, fdfd: 5, fgfggf: 12 } };

			assert.deepEqual(
				Fleets.removeEmptyUnits(fleet),
				fleet
			);
		});

		it('Some remove', () => {
			assert.deepEqual(
				Fleets.removeEmptyUnits({ units: { test: 0, fdfd: 5, fgfggf: 12 } }),
				{ units: { fdfd: 5, fgfggf: 12 } }
			);
		});
	});

	/**
	 * hasOffensiveCapacity
	 */
	describe('# hasOffensiveCapacity()', () => {
		it('Empty fleet', () => {
			assert.equal(
				Fleets.hasOffensiveCapacity(
					{ units: {} },
					{}
				), false
			);
		});

		it('No offensive unit', () => {
			assert.equal(
				Fleets.hasOffensiveCapacity(
					{ units: { 'u1': 10 } },
					{ u1: { parts: [] }}
				), false
			);
		});

		it('No offensive unit (multiple units)', () => {
			assert.equal(
				Fleets.hasOffensiveCapacity(
					{ units: { 'u1': 10, 'u2': 100 } },
					{
						u1: { parts: [{ type: 'hangar' }] },
						u2: { parts: [{ type: 'shield' }] },
					}
				), false
			);
		});

		it('Offensive unit', () => {
			assert.equal(
				Fleets.hasOffensiveCapacity(
					{ units: { 'u1': 10 } },
					{ u1: { parts: [{ type: 'cannon'}] }}
				), true
			);
		});

		it('Offensive unit (multiple units)', () => {
			assert.equal(
				Fleets.hasOffensiveCapacity(
					{ units: { 'u1': 10, 'u2': 100 } },
					{
						u1: { parts: [{ type: 'cannon' }] },
						u2: { parts: [{ type: 'shield' }] },
					}
				), true
			);
		});
	});

	describe('# groupHasOffensiveCapacity()', () => {
		it('Empty fleet', () => {
			assert.equal(
				Fleets.groupHasOffensiveCapacity(
					[{ units: {} }],
					{}
				), false
			);
		});

		it('Empty fleet (multiple fleets)', () => {
			assert.equal(
				Fleets.groupHasOffensiveCapacity(
					[{ units: {} }, { units: {} }],
					{}
				), false
			);
		});

		it('No offensive unit', () => {
			assert.equal(
				Fleets.groupHasOffensiveCapacity(
					[{ units: { 'u1': 10 } }],
					{ u1: { parts: [] }}
				), false
			);
		});

		it('No offensive unit (multiple units)', () => {
			assert.equal(
				Fleets.groupHasOffensiveCapacity(
					[{ units: { 'u1': 10, 'u2': 100 } },
						{ units: { 'u2': 100 } }],
					{
						u1: { parts: [{ type: 'hangar' }] },
						u2: { parts: [{ type: 'shield' }] },
					}
				), false
			);
		});

		it('Offensive unit', () => {
			assert.equal(
				Fleets.groupHasOffensiveCapacity(
					[{ units: { 'u1': 10 } }, { units: {} }],
					{ u1: { parts: [{ type: 'cannon'}] }}
				), true
			);
		});

		it('Offensive unit (multiple units)', () => {
			assert.equal(
				Fleets.groupHasOffensiveCapacity(
					[{ units: { 'u1': 10, 'u2': 100 } },
						{ units: { 'u2': 100 } }],
					{
						u1: { parts: [{ type: 'cannon' }] },
						u2: { parts: [{ type: 'shield' }] },
					}
				), true
			);
		});
	});
});