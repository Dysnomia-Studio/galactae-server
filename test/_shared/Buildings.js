/* eslint-disable no-magic-numbers */

describe('• Buildings (shared)', () => {
	/**
	 * GetCost
	 */
	describe('# GetCost()', () => {
		it('build < 0', () => {
			assert.deepEqual(
				Buildings.GetCost(-1),
				{}
			);
		});

		it('build = 0, level = 1', () => {
			assert(
				isset(Buildings.GetCost(0, 1), 'object')
			);
		});

		it('build = max-1, level = 10', () => {
			assert(
				isset(Buildings.GetCost(globalConst.buildingNumber-1, 10), 'object')
			);
		});

		it('build >= max', () => {
			assert.deepEqual(
				Buildings.GetCost(globalConst.buildingNumber),
				{}
			);
		});
	});


	/**
	 * GetRequirements/HasRequirements
	 */
	describe('# GetRequirements/HasRequirements()', () => {
		it('Building is already > 0', () => {
			assert(
				Buildings.HasRequirements({}, { Buildings: [1] }, 0),
			);
		});

		it('No parents', () => {
			assert(
				Buildings.HasRequirements({}, { Buildings: [0] }, 0),
			);
		});

		it('Parents not OK (all)', () => {
			assert(
				!Buildings.HasRequirements({ research: { } }, { Buildings: [0,0,0,0,0,0,0,0,0,0,0,0,0] }, 9),
			);
		});

		it('Parents not OK (building)', () => {
			assert(
				!Buildings.HasRequirements({ research: { misc_telemetrie: -1, misc_em: -1 } }, { Buildings: [0,0,0,0,0,0,0,0,0,0,0,0,0] }, 9),
			);
		});

		it('Parents not OK (research)', () => {
			assert(
				!Buildings.HasRequirements({ research: {} }, { Buildings: [0,0,0,0,0,0,0,3,0,0,0,0,0] }, 9),
			);
		});

		it('Parents OK', () => {
			assert(
				Buildings.HasRequirements({ research: { misc_telemetrie: -1, misc_em: -1 } }, { Buildings: [0,0,0,0,0,0,0,3,0,0,0,0,0] }, 9),
			);
		});
		
		it('[Translation failed] Parents not OK (building)', () => {
			global.translate = {};

			try {
				Buildings.HasRequirements({ research: { misc_telemetrie: -1, misc_em: -1 } }, { Buildings: [0,0,0,0,0,0,0,0,0,0,0,0,0] }, 9);
				assert(false);
			} catch(e) {
				assert(true);
			}

			delete translate;
		});

		it('[Translation failed] Parents not OK (research)', () => {
			global.translate = {};

			try {
				Buildings.HasRequirements({ research: {} }, { Buildings: [0,0,0,0,0,0,0,3,0,0,0,0,0] }, 9);
				assert(false);
			} catch(e) {
				assert(true);
			}

			delete translate;
		});
	});


	/**
	 * getEnergyProd
	 */
	describe('# getEnergyProd()', () => {
		it('level 1', () => {
			const buildings = [1,1,1,1,1,1,1,1,1];
			assert.equal(
				Buildings.getEnergyProd(buildings),
				2795000
			);
		});

		it('level 30', () => {
			const buildings = [1,1,1,1,30,1,1,1,1];
			assert.equal(
				Buildings.getEnergyProd(buildings),
				1877500000
			);
		});
	});

	/**
	 * getEnergyCons
	 */
	describe('# getEnergyCons()', () => {
		it('level 1', () => {
			const buildings = [1,1,1,1,1,1,1,1,1];
			assert.equal(
				Buildings.getEnergyCons(buildings),
				2761850
			);
		});

		it('level 5 total', () => {
			const buildings = [5,5,5,5,5,5,5,5,5];
			assert.equal(
				Buildings.getEnergyCons(buildings),
				53866650
			);
		});
	});

	/**
	 * enoughEnergy
	 */
	describe('# enoughEnergy()', () => {
		it('enough', () => {
			const buildings = [1,1,1,1,1,1,1,1,1];
			assert.equal(
				Buildings.enoughEnergy(buildings),
				true
			);
		});

		it('no enough', () => {
			const buildings = [30,30,30,30,1,1,1,1,1];
			assert.equal(
				Buildings.enoughEnergy(buildings),
				false
			);
		});
	});

	/**
	 * calcStorageCapacity
	 */
	describe('# calcStorageCapacity()', () => {
		const lvl1 = [
			1119,
			1048,
			404,
		];

		const lvl30 = [
			192864,
			191968,
			3556672,
		];

		it('lvl 1 - no molecular compression', () => {
			const results = Buildings.calcStorageCapacity(1,1,false);

			for(let i=0; i<results.length; i++) {
				if(Math.abs(results[i] - lvl1[i]) > 1) {
					console.log(i);
					console.log('results: ' + results[i]);
					console.log('expected: ' + lvl1[i]);
				}

				assert(
					Math.abs(results[i] - lvl1[i]) < 1
				);
			}
		});

		it('lvl 1 - with molecular compression', () => {
			const results = Buildings.calcStorageCapacity(1,1,true);
			const expected = lvl1.map((e) => e * researchBonus.cp_molecular_compression);

			for(let i=0; i<results.length; i++) {
				if(Math.abs(results[i] - expected[i]) > 1) {
					console.log(i);
					console.log('results: ' + results[i]);
					console.log('expected: ' + expected[i]);
				}

				assert(
					Math.abs(results[i] - expected[i]) < 1
				);
			}
		});

		it('lvl 30 - no molecular compression', () => {
			const results = Buildings.calcStorageCapacity(30,30,false);

			for(let i=0; i<results.length; i++) {
				if(Math.abs(results[i] - lvl30[i]) > 1) {
					console.log(i);
					console.log('results: ' + results[i]);
					console.log('expected: ' + lvl30[i]);
				}

				assert(
					Math.abs(results[i] - lvl30[i]) < 1
				);
			}
		});

		it('lvl 30 - with molecular compression', () => {
			const results = Buildings.calcStorageCapacity(30,30,true);
			const expected = lvl30.map((e) => e * researchBonus.cp_molecular_compression);

			for(let i=0; i<results.length; i++) {
				if(Math.abs(results[i] - expected[i]) > 1) {
					console.log(i);
					console.log('results: ' + results[i]);
					console.log('expected: ' + expected[i]);
				}

				assert(
					Math.abs(results[i] - expected[i]) < 1
				);
			}
		});

		it('Helium lvl 0', () => {
			const HeliumStorage = Buildings.calcStorageCapacity(0,0, false)[2];
			const HeliumStorageWithMolecularCompression = Buildings.calcStorageCapacity(0,0,true)[2];

			assert.equal(
				HeliumStorage,
				0
			);
			assert.equal(
				HeliumStorageWithMolecularCompression,
				0
			);
		});
	});


	/**
	 * hasEnoughtStorage
	 */
	describe('# hasEnoughtStorage()', () => {
		it('all lvl 1', () => {
			assert(
				Buildings.hasEnoughtStorage(
					{ Buildings: [1,1,1,1,1,1,1,1,1,1,1,1,1,1] },
					1,
					false
				)
			);
		});

		it('all lvl 10 except storage', () => {
			assert(
				!Buildings.hasEnoughtStorage(
					{ Buildings: [10,10,10,10,10,1,10,10,10,10,10,10,10,10] },
					1,
					false
				)
			);
		});
	});

	/**
	 * calcPlanetMorale
	 */
	describe('# calcPlanetMorale()', () => {
		it('same level', () => {
			for(let i = 1; i < 26; i++) {
				assert.equal(
					Buildings.calcPlanetMorale([0,0,i,i]),
					1
				);
			}
		});

		it('1 hab 2 food', () => {
			assert.equal(
				Buildings.calcPlanetMorale([0,0,1,2]),
				1.5
			);
		});

		it('1 hab 25 food', () => {
			assert.equal(
				Buildings.calcPlanetMorale([0,0,1,25]),
				2
			);
		});

		it('25 hab 1 food', () => {
			assert.equal(
				Buildings.calcPlanetMorale([0,0,25,1]),
				0.52
			);
		});

		it('9 hab 6 food', () => {
			assert.equal(
				Buildings.calcPlanetMorale([0,0,9,6]).toFixed(4),
				0.8333
			);
		});

		it('15 hab 10 food', () => {
			assert.equal(
				Buildings.calcPlanetMorale([0,0,15,10]).toFixed(4),
				0.8333
			);
		});

		it('17 hab 12 food', () => {
			assert.equal(
				Buildings.calcPlanetMorale([0,0,17,12]).toFixed(4),
				0.8529
			);
		});

		it('17 hab 19 food', () => {
			assert.equal(
				Buildings.calcPlanetMorale([0,0,17,19]).toFixed(4),
				1.0588
			);
		});

		it('23 hab 22 food', () => {
			assert.equal(
				Buildings.calcPlanetMorale([0,0,23,22]).toFixed(4),
				0.9783
			);
		});
	});

	/**
	 * getPeopleConsAndProd
	 */
	describe('# getPeopleConsAndProd()', () => {
		it('all lvl 1, no fleet', () => {
			assert.deepEqual(
				Buildings.getPeopleConsAndProd({ nextBuilding: -1, Buildings: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] }, []),
				[275357,232985]
			);
		});

		it('all lvl 1, no fleet, nextBuilding 1', () => {
			assert.deepEqual(
				Buildings.getPeopleConsAndProd({ nextBuilding: 0, Buildings: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] }, []),
				[275357,232985 - 30820 + 123040]
			);
		});

		it('all lvl 1, fleet', () => {
			assert.deepEqual(
				Buildings.getPeopleConsAndProd({ nextBuilding: -1, Buildings: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] }, [ { population: 1000.5 }]),
				[275357,233985.5]
			);
		});

		it('all lvl 35, no fleet', () => {
			assert.deepEqual(
				Buildings.getPeopleConsAndProd({ nextBuilding: -1, Buildings: [35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35] }, []),
				[45699425,38937630]
			);
		});

		it('all lvl 1, other player fleet', () => {
			assert.deepEqual(
				Buildings.getPeopleConsAndProd({ nextBuilding: -1, Buildings: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] }, [ { population: 1000.5, motherPlanetAddress: 'addr' }]),
				[275357,232985]
			);
		});
	});

	/**
	 * enoughPeople
	 */
	describe('# enoughPeople()', () => {
		it('all lvl 1, no fleet', () => {
			assert.deepEqual(
				Buildings.enoughPeople({ nextBuilding: -1, Buildings: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] }, []),
				true
			);
		});

		it('all lvl 1, no fleet, nextBuilding 1', () => {
			assert.deepEqual(
				Buildings.enoughPeople({ nextBuilding: 1, Buildings: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] }, []),
				false
			);
		});
	});

	/**
	 * enoughPeople
	 */
	describe('# checkIfCanBuild()', () => {
		it('all lvl 1 (except energy and people), no fleets, beginner, building 0 lvl 2', () => {
			const planetData = {
				nextBuildingTime: null,
				Buildings: [1, 1, 2, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0],
				resources: [10000,10000,10000,10000,10000,10000],
				planetType: 0,
			};

			assert.deepEqual(
				Buildings.checkIfCanBuild(
					planetData,
					[],
					{ research: [] },
					Buildings.GetCost(0,2),
					0,
					new Date()
				),
				''
			);

			assert.equal(planetData.Buildings[0], 1);
		});

		it('all lvl 1 (except energy), no fleets, beginner, building 0 lvl 2', () => {
			const planetData = {
				nextBuildingTime: null,
				Buildings: [1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0],
				resources: [10000,10000,10000,10000,10000,10000],
				planetType: 0,
			};

			assert.deepEqual(
				Buildings.checkIfCanBuild(
					planetData,
					[],
					{ research: [] },
					Buildings.GetCost(0,2),
					0,
					new Date()
				),
				'BUILDING_ERROR_PEOPLE'
			);

			assert.equal(planetData.Buildings[0], 1);
		});

		it('all lvl 1, no fleets, beginner, building 0 lvl 2', () => {
			const planetData = {
				nextBuildingTime: null,
				Buildings: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
				resources: [10000,10000,10000,10000,10000,10000],
				planetType: 0,
			};

			assert.deepEqual(
				Buildings.checkIfCanBuild(
					planetData,
					[],
					{ research: [] },
					Buildings.GetCost(0,2),
					0,
					new Date()
				),
				'BUILDING_ERROR_ENERGY'
			);

			assert.equal(planetData.Buildings[0], 1);
		});

		it('all lvl 1 (except energy and people), no fleets, beginner, building 0 lvl 2 - empty resources', () => {
			const planetData = {
				nextBuildingTime: null,
				Buildings: [1, 1, 2, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0],
				resources: [0,0,0,0,0,0],
				planetType: 0,
			};

			assert.deepEqual(
				Buildings.checkIfCanBuild(
					planetData,
					[],
					{ research: [] },
					Buildings.GetCost(12,2),
					0,
					new Date()
				),
				'BUILDING_ERROR_COST'
			);

			assert.equal(planetData.Buildings[0], 1);
		});

		// @TODO: specific tests for all resources

		it('all lvl 1 (except energy and people), no fleets, beginner, building 12 lvl 2', () => {
			const planetData = {
				nextBuildingTime: null,
				Buildings: [1, 1, 2, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0],
				resources: [10000,10000,10000,10000,10000,10000],
				planetType: 0,
			};

			assert.deepEqual(
				Buildings.checkIfCanBuild(
					planetData,
					[],
					{ research: [] },
					Buildings.GetCost(12,2),
					12,
					new Date()
				),
				'BUILDING_ERROR_DEPENDENCIES'
			);

			assert.equal(planetData.Buildings[0], 1);
		});

		it('all lvl 1 (except energy and people), no fleets, beginner, building 0 lvl 2 - currently building', () => {
			const planetData = {
				nextBuildingTime: new Date(Date.now() + 100000),
				Buildings: [1, 1, 2, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0],
				resources: [10000,10000,10000,10000,10000,10000],
				planetType: 0,
			};

			assert.deepEqual(
				Buildings.checkIfCanBuild(
					planetData,
					[],
					{ research: [] },
					Buildings.GetCost(0,2),
					0,
					new Date()
				),
				'BUILDING_ERROR_ALREADY'
			);

			assert.equal(planetData.Buildings[0], 1);
		});

		it('all lvl 35, no fleets, beginner, building 0 lvl 36', () => {
			const planetData = {
				nextBuildingTime: null,
				Buildings: [35, 35, 35, 35, 35, 35, 35, 35, 35, 0, 0, 0, 0, 0],
				resources: [1000000,1000000,1000000,1000000,1000000,1000000],
				planetType: 0,
			};

			assert.deepEqual(
				Buildings.checkIfCanBuild(
					planetData,
					[],
					{ research: [] },
					Buildings.GetCost(0,36),
					0,
					new Date()
				),
				'BUILDING_ERROR_MAXIMUM'
			);

			assert.equal(planetData.Buildings[0], 35);
		});
	});
});
