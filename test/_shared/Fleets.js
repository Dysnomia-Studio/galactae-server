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
				expected[i] = Math.round(shipPartsSpeed['ion'][i] / 1.5 * 1000000)/1000000;
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
				expected[i] = Math.round(shipPartsSpeed['ion'][i] / 1.5 * 1000000)/1000000;
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
				expected[i] = Math.round(shipPartsSpeed['vsl'][i] / 1.5 * 1000000)/1000000;
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
	 * Get Min Subspeed
	 */
	describe('# getMinSubSpeed()', () => {
		it('No units', () => {
			assert.deepEqual(
				Fleets.getMinSubSpeed(
					[],
					{},
				),
				{
					speed: [],
					engines: {},
				}
			);
		});

		const unitList = [
			{
				id: 'u1',
				shipShape: 'SHIP_CARRIER_SMALL',
				parts: [
					{type: 'cannon', name: 'cannon_1', tech: 'railgun'},
					{type: 'rocketLauncher', name: 'rocket_1', tech: 'explosive'},
					{type: 'shield', name: 'shield_1', tech: 'none'},
					{type: 'sup_propulsion', name: 'prop_1', tech: 'vsl'},
					{type: 'sub_propulsion', name: 'prop_2', tech: 'ion'},
					{type: 'sub_propulsion', name: 'prop_3', tech: 'ion'},
				],
			},
			{
				id: 'u2',
				shipShape: 'SHIP_CARRIER_SMALL',
				parts: [
					{type: 'cannon', name: 'cannon_1', tech: 'railgun'},
					{type: 'rocketLauncher', name: 'rocket_1', tech: 'explosive'},
					{type: 'shield', name: 'shield_1', tech: 'none'},
					{type: 'sup_propulsion', name: 'prop_1', tech: 'vsl'},
					{type: 'sub_propulsion', name: 'prop_2', tech: 'pplasma'},
					{type: 'sub_propulsion', name: 'prop_3', tech: 'pplasma'},
				],
			},
			{
				id: 'u3',
				shipType: 'SHIP_FIGHTER',
				shipShape: 'SHIP_FIGHTER_MEDIUM',
				parts: [
					{type: 'cannon', name: 'cannon_1', tech: 'railgun'},
					{type: 'cannon', name: 'cannon_2', tech: 'railgun'},
					{type: 'sub_propulsion', name: 'prop_1', tech: 'ion'},
				],
			},
			{
				id: 'u4',
				shipType: 'SHIP_TEST',
				shipShape: 'SHIP_TEST',
				parts: [
					{type: 'sub_propulsion', name: 'prop_1', tech: 'unknown'},
				],
			},
		];

		it('One unit', () => {
			assert.deepEqual(
				Fleets.getMinSubSpeed(
					unitList,
					{ 'u1': 1 },
				),
				{
					speed: Fleets.calcSubSpeed(unitList[0]).speed,
					engines: { ion: 2 },
				}
			);
		});

		it('Multiple same unit', () => {
			assert.deepEqual(
				Fleets.getMinSubSpeed(
					unitList,
					{ 'u1': 1000 },
				),
				{
					speed: Fleets.calcSubSpeed(unitList[0]).speed,
					engines: { ion: 2000 },
				}
			);
		});

		it('Multiple units', () => {
			assert.deepEqual(
				Fleets.getMinSubSpeed(
					unitList,
					{ 'u1': 1000, 'u2': 100 },
				),
				{
					speed: Fleets.calcSubSpeed(unitList[1]).speed,
					engines: { ion: 2000, pplasma: 200 },
				}
			);
		});

		it('Multiple with fighter', () => {
			assert.deepEqual(
				Fleets.getMinSubSpeed(
					unitList,
					{ 'u1': 1000, 'u2': 100, 'u3': 10 },
				),
				{
					speed: Fleets.calcSubSpeed(unitList[2]).speed,
					engines: { ion: 2000 + 10 * fighterMult[unitList[2].shipShape], pplasma: 200 },
				}
			);
		});

		it('Catch invalid ship', () => {
			assert.deepEqual(
				Fleets.getMinSubSpeed(
					unitList,
					{ 'u4': 1 },
				),
				{
					speed: [],
				}
			);
		});
	});

	/**
	 * Get Min Supraspeed
	 */
	describe('# getMinSupraSpeed()', () => {
		it('No units', () => {
			assert.deepEqual(
				Fleets.getMinSupraSpeed(
					[],
					{},
				),
				{
					speed: [],
					engines: {},
				}
			);
		});

		const unitList = [
			{
				id: 'u1',
				shipShape: 'SHIP_CARRIER_SMALL',
				parts: [
					{type: 'cannon', name: 'cannon_1', tech: 'railgun'},
					{type: 'rocketLauncher', name: 'rocket_1', tech: 'explosive'},
					{type: 'shield', name: 'shield_1', tech: 'none'},
					{type: 'sup_propulsion', name: 'prop_1', tech: 'vsl'},
					{type: 'sub_propulsion', name: 'prop_2', tech: 'ion'},
					{type: 'sub_propulsion', name: 'prop_3', tech: 'ion'},
				],
			},
			{
				id: 'u2',
				shipShape: 'SHIP_CARRIER_SMALL',
				parts: [
					{type: 'cannon', name: 'cannon_1', tech: 'railgun'},
					{type: 'rocketLauncher', name: 'rocket_1', tech: 'explosive'},
					{type: 'shield', name: 'shield_1', tech: 'none'},
					{type: 'sup_propulsion', name: 'prop_1', tech: 'wd'},
					{type: 'sub_propulsion', name: 'prop_2', tech: 'pplasma'},
					{type: 'sub_propulsion', name: 'prop_3', tech: 'pplasma'},
				],
			},
			{
				id: 'u3',
				shipType: 'SHIP_FIGHTER',
				shipShape: 'SHIP_FIGHTER_MEDIUM',
				parts: [
					{type: 'cannon', name: 'cannon_1', tech: 'railgun'},
					{type: 'cannon', name: 'cannon_2', tech: 'railgun'},
					{type: 'sub_propulsion', name: 'prop_1', tech: 'ion'},
				],
			},
			{
				id: 'u4',
				shipType: 'SHIP_TEST',
				shipShape: 'SHIP_TEST',
				parts: [
					{type: 'sup_propulsion', name: 'prop_1', tech: 'unknown'},
				],
			},
			{
				id: 'u5',
				shipShape: 'SHIP_CARRIER_SMALL',
				parts: [
					{type: 'cannon', name: 'cannon_1', tech: 'railgun'},
					{type: 'rocketLauncher', name: 'rocket_1', tech: 'explosive'},
					{type: 'shield', name: 'shield_1', tech: 'none'},
					{type: 'sup_propulsion', name: 'prop_1', tech: 'vsl'},
					{type: 'sub_propulsion', name: 'prop_2', tech: 'ion'},
					{type: 'sub_propulsion', name: 'prop_3', tech: 'ion'},
				],
			},
		];

		it('One unit', () => {
			assert.deepEqual(
				Fleets.getMinSupraSpeed(
					unitList,
					{ 'u1': 1 },
				),
				{
					speed: Fleets.calcSupraSpeed(unitList[0]).speed,
					engines: { vsl: 1 },
				}
			);
		});

		it('Multiple same unit', () => {
			assert.deepEqual(
				Fleets.getMinSupraSpeed(
					unitList,
					{ 'u1': 1000 },
				),
				{
					speed: Fleets.calcSupraSpeed(unitList[0]).speed,
					engines: { vsl: 1000 },
				}
			);
		});

		it('Multiple units', () => {
			assert.deepEqual(
				Fleets.getMinSupraSpeed(
					unitList,
					{ 'u1': 1000, 'u2': 100, 'u5': 100 },
				),
				{
					speed: Fleets.calcSupraSpeed(unitList[0]).speed,
					engines: { vsl: 1100, wd: 100 },
				}
			);
		});

		it('Multiple with fighter', () => {
			assert.deepEqual(
				Fleets.getMinSupraSpeed(
					unitList,
					{ 'u1': 1000, 'u2': 100, 'u3': 10 },
				),
				{
					speed: Fleets.calcSupraSpeed(unitList[0]).speed,
					engines: { vsl: 1000, wd: 100 },
				}
			);
		});


		it('Catch invalid ship', () => {
			assert.deepEqual(
				Fleets.getMinSupraSpeed(
					unitList,
					{ 'u4': 1 },
				),
				{
					speed: [],
				}
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
		const ownerList = [
			{ id: 'u1', ally: null },
			{ id: 'u2', ally: 'a1' },
			{ id: 'u3', ally: 'a1' },
			{ id: 'u4', ally: 'a2' },
			{ id: 'u5', ally: null },
		];
		const planetCount = 10;

		it('Random tests (' + DISTRIBUTE_FUEL_RANDOMTESTS_COUNT + ')', () => {
			for(let currentTest=1; currentTest<=DISTRIBUTE_FUEL_RANDOMTESTS_COUNT; currentTest++) {
				// Prepare
				const fleetCount = Math.round(Math.random() * DISTRIBUTE_FUEL_RANDOMTESTS_MAXFLEETS);
				const fleetList = [];
				let totalFuel = 0;

				for(let currentFleet=0; currentFleet<fleetCount; currentFleet++) {
					const ownerRandom = Math.round(Math.random() * (ownerList.length - 1));

					fleetList[currentFleet] = {
						id: 'f' + currentFleet,
						maxFuel: Math.round(Math.random() * DISTRIBUTE_FUEL_RANDOMTESTS_MAXRANDOM_MAXFUEL),
						fuel: Math.round(Math.random() * DISTRIBUTE_FUEL_RANDOMTESTS_MAXRANDOM_FUEL),
						orbitPosition: Math.round(Math.random() * 4),
						endMoveTime: new Date(Math.round((Math.random() * (Date.now() * 2)) - Date.now())),
						ownerId: ownerList[ownerRandom].id,
						owner: ownerList[ownerRandom],
						position: 'p' + Math.round(Math.random() * planetCount),
						motherPlanetAddress: 'p' + Math.round(Math.random() * planetCount),
					};

					fleetList[currentFleet].fuel = Math.min(fleetList[currentFleet].fuel, fleetList[currentFleet].maxFuel);

					if(Math.random() < 0.01) {
						fleetList[currentFleet].fuel = undefined;
					}

					if(typeof fleetList[currentFleet].fuel !== 'undefined') {
						totalFuel += fleetList[currentFleet].fuel;
					}
				}

				const owner = ownerList[Math.round(Math.random() * (ownerList.length - 1))];
				const priorityFleet = Math.round(Math.random() * fleetCount * 2);
				const planet = {
					resources: [
						0,
						Math.round(Math.random() * DISTRIBUTE_FUEL_RANDOMTESTS_MAXRANDOM_PLANETFUEL),
						0,0,0,0,
					],
					highPriorityFleet: 'f' + priorityFleet,
					owner: owner.id,
					address: 'p0',
				};

				if(planet.highPriorityFleet === ('f' + fleetCount * 2)) {
					planet.highPriorityFleet = undefined;
				}

				if(fleetList[priorityFleet] && Math.random() < 0.5) {
					fleetList[priorityFleet].position = fleetList[priorityFleet].motherPlanetAddress = planet.address;
				}

				totalFuel += planet.resources[1];

				// Use
				const [
					newPlanet,
					newFleetList
				] = Fleets.distributeFuel(planet, fleetList, owner);

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

		it('Offensive unit (special)', () => {
			assert.equal(
				Fleets.hasOffensiveCapacity(
					{ units: { 'SHIP_WEP_MINES': 10 } },
					{ '00000000-0000-0000-0000-000000000001': { parts: specialUnitsParts['SHIP_WEP_MINES'] }}
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

	describe('# isImmobile()', () => {
		it('Mobile', () => {
			assert.equal(
				Fleets.isImmobile(
					{ endMoveTime: new Date(Date.now() + 10000) }
				), false
			);
		});

		it('Immobile', () => {
			assert.equal(
				Fleets.isImmobile(
					{ endMoveTime: null }
				), true
			);
		});
	});

	describe('# hasEndedMove()', () => {
		it('Mobile, arrived', () => {
			assert.equal(
				Fleets.hasEndedMove(
					{ endMoveTime: new Date(Date.now() - 10000) }
				), true
			);
		});

		it('Mobile, not arrived', () => {
			assert.equal(
				Fleets.hasEndedMove(
					{ endMoveTime: new Date(Date.now() + 10000) }
				), false
			);
		});

		it('Immobile', () => {
			assert.equal(
				Fleets.hasEndedMove(
					{ endMoveTime: null }
				), false
			);
		});
	});

	describe('# hasColonyShip', () => {
		it('Empty fleet', () => {
			assert.equal(
				Fleets.hasColonyShip({ units: {} }, []),
				false
			);
		});

		it('No colony ship', () => {
			assert.equal(
				Fleets.hasColonyShip({ units: {
					'test': 2,
					'test2': 10,
				} }, {
					test: { id: 'test', shipType: 'SHIP_FIGHTER' },
					test2: { id: 'test2', shipType: 'SHIP_FIGHTER' },
				}),
				false
			);
		});

		it('0 colony ship', () => {
			assert.equal(
				Fleets.hasColonyShip({ units: {
					'test': 2,
					'test2': 0,
					'SHIP_WEP_MINES': 3
				} }, {
					test: { id: 'test', shipType: 'SHIP_FIGHTER' },
					test2: { id: 'test2', shipType: 'SHIP_COLONY' },
					'00000000-0000-0000-0000-000000000001': { id: '00000000-0000-0000-0000-000000000001', shipType: 'SHIP_WEP_MINES' },
				}),
				false
			);
		});

		it('1 colony ship', () => {
			assert.equal(
				Fleets.hasColonyShip({ units: {
					'test': 2,
					'test2': 1,
				} }, {
					test: { id: 'test', shipType: 'SHIP_FIGHTER' },
					test2: { id: 'test2', shipType: 'SHIP_COLONY' },
				}),
				true
			);
		});

		it('10 colony ship', () => {
			assert.equal(
				Fleets.hasColonyShip({ units: {
					'test': 2,
					'test2': 10,
				} }, {
					test: { id: 'test', shipType: 'SHIP_FIGHTER' },
					test2: { id: 'test2', shipType: 'SHIP_COLONY' },
				}),
				true
			);
		});
	});
});
