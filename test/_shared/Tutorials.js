describe('• Tutorials (shared)', () => {
	/**
	 * Has finished tutorials ?
 	 */
	describe('# hasFinishedTutorials()', () => {
		it('0 tutorials done', () => {
			assert.equal(
				Tutorials.hasFinishedTutorials(
					{ tutorials: {} }
				), false
			);
		});

		it('1 tutorials done', () => {
			assert.equal(
				Tutorials.hasFinishedTutorials(
					{ tutorials: { welcome: true } }
				), false
			);
		});

		it('all tutorials done', () => {
			const user = { tutorials: {} };
			for(const tuto of tutorialsList) {
				user.tutorials[tuto] = true;
			}

			assert.equal(
				Tutorials.hasFinishedTutorials(user),
				true
			);
		});
	});

	/**
	 * Has all dependencies ?
 	 */
	describe('# hasAllDependancies()', () => {
		it('No dependency for tutorial', () => {
			assert.equal(
				Tutorials.hasAllDependancies(
					'foo',
					{},
					{}
				), true
			);
		});

		// Tutorial
		it('Hasn\'t all dependencies', () => {
			assert.equal(
				Tutorials.hasAllDependancies(
					'energy',
					{ tutorials: {} },
					{}
				), false
			);
		});

		it('Check tutorials dependencies', () => {
			assert.equal(
				Tutorials.hasAllDependancies(
					'energy',
					{ tutorials: { welcome: true} },
					{}
				), true
			);
		});

		// Research
		it('Check research dependencies: false', () => {
			assert.equal(
				Tutorials.hasAllDependancies(
					'unitsCreate',
					{ tutorials: { welcome: true}, research: { figther_light_interceptor: 0 } },
					{}
				), false
			);
		});

		it('Check research dependencies: true', () => {
			assert.equal(
				Tutorials.hasAllDependancies(
					'unitsCreate',
					{ tutorials: { welcome: true}, research: { figther_light_interceptor: -1 } },
					{}
				), true
			);
		});

		//@TODO: check building dependency

		//@TODO: check unique research dependency
	});

	/**
	 * Has completed tutorial ?
 	 */
	describe('# hasCompletedTutorial()', () => {
		it('Has already done it', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'foo',
					{ tutorials: { welcome: true } },
					{}
				), true
			);
		});

		it('Has already done it', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'welcome',
					{ tutorials: { welcome: true } },
					{}
				), true
			);
		});

		it('Hasn\'t all dependencies', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'energy',
					{ tutorials: {} },
					{}
				), false
			);
		});

		// Building
		it('Check building objective: true', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'energy',
					{ tutorials: { welcome: true } },
					{ Buildings: [1,1,1,1,2,1,1,1,1,1,0,0,0,0]}
				), true
			);
		});

		it('Check building objective: false', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'energy',
					{ tutorials: { welcome: true } },
					{ Buildings: [1,1,1,1,1,1,1,1,1,1,0,0,0,0]}
				), false
			);
		});

		// One of many research
		it('Check  One of many research objective: true', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'research',
					{
						tutorials: { welcome: true, energy: true, resources: true },
						research: {
							industrialistion: -1,
						},
					}
				), true
			);
		});

		it('Check  One of many research objective: false', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'research',
					{
						tutorials: { welcome: true, energy: true, resources: true },
						research: { industrialistion: 0 },
					}
				), false
			);
		});

		//@TODO: check unique research objective

		// unitModel
		it('Check unitModel objective: true', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'unitsCreate',
					{
						tutorials: {},
						research: { figther_light_interceptor: -1 },
					},
					{},
					[],
					[ { name: 'test'} ],
				), true
			);
		});

		it('Check unitModel objective: false', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'unitsCreate',
					{
						tutorials: {},
						research: { figther_light_interceptor: -1 },
					},
					{},
					[],
					[]
				), false
			);
		});

		// unitBuild
		it('Check unitBuild objective: true', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'unitsBuild',
					{
						tutorials: { unitsCreate: true },
					},
					{},
					[],
					[ { owned: 1}, { owned: 4} ],
				), true
			);

			assert.equal(
				Tutorials.hasCompletedTutorial(
					'unitsBuild',
					{
						tutorials: { unitsCreate: true },
					},
					{},
					[],
					[ { owned: 5}, { owned: 4} ],
				), true
			);

			assert.equal(
				Tutorials.hasCompletedTutorial(
					'unitsBuild',
					{
						tutorials: { unitsCreate: true },
					},
					{},
					[],
					[ { owned: 5} ],
				), true
			);
		});

		it('Check unitBuild objective: false', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'unitsBuild',
					{
						tutorials: { unitsCreate: true },
					},
					{},
					[],
					[ { owned: 1}, { owned: 2} ],
				), false
			);

			assert.equal(
				Tutorials.hasCompletedTutorial(
					'unitsBuild',
					{
						tutorials: { unitsCreate: true },
					},
					{},
					[],
					[ { owned: 2} ],
				), false
			);

			assert.equal(
				Tutorials.hasCompletedTutorial(
					'unitsBuild',
					{
						tutorials: { unitsCreate: true },
					},
					{},
					[],
					[],
				), false
			);
		});

		// Move
		it('Check move all objective: false', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'interplanetaryFlight',
					{
						tutorials: { unitsBuild: true },
						research: { prop_ions: -1 },
					},
					{},
					[],
					[]
				), false
			);
		});

		it('Check move all objective: true', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'interplanetaryFlight',
					{
						tutorials: { unitsBuild: true },
						research: { prop_ions: -1 },
					},
					{},
					[ { orbitPosition: FLEET_MOVE_TYPE.MOVE, endMoveTime: new Date() }],
					[]
				), true
			);
		});

		it('Check move outerSystem objective: false', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'interstellarFlight',
					{
						tutorials: { unitsBuild: true },
						research: { prop_vsl: -1 },
					},
					{},
					[ { orbitPosition: FLEET_MOVE_TYPE.MOVE, endMoveTime: null, motherPlanetAddress: '1-1-2-P3', position: '1-1-2-P1' }],
					[]
				), false
			);
		});

		it('Check move outerSystem objective: true', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'interstellarFlight',
					{
						tutorials: { unitsBuild: true },
						research: { prop_vsl: -1 },
					},
					{},
					[ { orbitPosition: FLEET_MOVE_TYPE.MOVE, endMoveTime: new Date(), motherPlanetAddress: '1-1-2-P3', position: '1-1-3-P1' }],
					[]
				), true
			);
		});

		it('Check move battle objective: false', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'battle',
					{
						tutorials: { interplanetaryFlight: true },
					},
					{},
					[ { orbitPosition: FLEET_MOVE_TYPE.MOVE, endMoveTime: new Date() }],
					[]
				), false
			);
		});

		it('Check move battle objective: true', () => {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'battle',
					{
						tutorials: { interplanetaryFlight: true },
					},
					{},
					[ { orbitPosition: FLEET_MOVE_TYPE.ATTACK, endMoveTime: new Date() }],
					[]
				), true
			);
		});
	});
});
