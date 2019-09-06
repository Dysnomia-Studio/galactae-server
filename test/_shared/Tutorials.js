/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../../calcConstants')();
require('../../misc')();
const Tutorials = require('../../Tutorials');
global.Research = require('../../research');

describe('• Tutorials (shared)', function() {
	/**
	 * Has finished tutorials ?
 	 */
	describe('# hasFinishedTutorials()', function() {
		it('0 tutorials done', function() {
			assert.equal(
				Tutorials.hasFinishedTutorials(
					{ tutorials: {} }
				), false
			);
		});

		it('1 tutorials done', function() {
			assert.equal(
				Tutorials.hasFinishedTutorials(
					{ tutorials: { welcome: true } }
				), false
			);
		});

		it('all tutorials done', function() {
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
	describe('# hasAllDependancies()', function() {
		// Tutorial
		it('Hasn\'t all dependencies', function() {
			assert.equal(
				Tutorials.hasAllDependancies(
					'energy',
					{ tutorials: {} },
					{}
				), false
			);
		});

		it('Check tutorials dependencies', function() {
			assert.equal(
				Tutorials.hasAllDependancies(
					'energy',
					{ tutorials: { welcome: true} },
					{}
				), true
			);
		});

		// Research
		it('Check research dependencies: false', function() {
			assert.equal(
				Tutorials.hasAllDependancies(
					'unitsCreate',
					{ tutorials: { welcome: true}, research: { figther_light_interceptor: 0 } },
					{}
				), false
			);
		});

		it('Check research dependencies: true', function() {
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
	describe('# hasCompletedTutorial()', function() {
		it('Has already done it', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'welcome',
					{ tutorials: { welcome: true } },
					{}
				), true
			);
		});

		it('Hasn\'t all dependencies', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'energy',
					{ tutorials: {} },
					{}
				), false
			);
		});

		// Building
		it('Check building objective: true', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'energy',
					{ tutorials: { welcome: true } },
					{ Buildings: [1,1,1,1,2,1,1,1,1,1,0,0,0,0]}
				), true
			);
		});

		it('Check building objective: false', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'energy',
					{ tutorials: { welcome: true } },
					{ Buildings: [1,1,1,1,1,1,1,1,1,1,0,0,0,0]}
				), false
			);
		});

		// One of many research
		it('Check  One of many research objective: true', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'research',
					{
						tutorials: { welcome: true, energy: true, resources: true },
						research: {
							industrialistion: -1
						},
					}
				), true
			);
		});

		it('Check  One of many research objective: false', function() {
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
		it('Check unitModel objective: true', function() {
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

		it('Check unitModel objective: false', function() {
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
		it('Check unitBuild objective: true', function() {
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

		it('Check unitBuild objective: false', function() {
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
		it('Check move all objective: false', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'interplanetaryFlight',
					{
						tutorials: { unitsBuild: true },
						research: { prop_ions: -1 },
					},
					{},
					[ { orbitPosition: 2, endMoveTime: -1 }],
					[]
				), false
			);

			assert.equal(
				Tutorials.hasCompletedTutorial(
					'interplanetaryFlight',
					{
						tutorials: { unitsBuild: true },
						research: { prop_ions: -1 },
					},
					{},
					[ { orbitPosition: 1, endMoveTime: 1 }],
					[]
				), false
			);
		});

		it('Check move all objective: true', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'interplanetaryFlight',
					{
						tutorials: { unitsBuild: true },
						research: { prop_ions: -1 },
					},
					{},
					[ { orbitPosition: 2, endMoveTime: 1 }],
					[]
				), true
			);
		});

		it('Check move outerSystem objective: false', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'interstellarFlight',
					{
						tutorials: { unitsBuild: true },
						research: { prop_vsl: -1 },
					},
					{},
					[ { orbitPosition: 2, endMoveTime: -1, motherPlanetAddress: '1-2-P3', position: '1-2-P1' }],
					[]
				), false
			);

			assert.equal(
				Tutorials.hasCompletedTutorial(
					'interstellarFlight',
					{
						tutorials: { unitsBuild: true },
						research: { prop_vsl: -1 },
					},
					{},
					[ { orbitPosition: 1, endMoveTime: 1, motherPlanetAddress: '1-2-P3', position: '1-3-P1' }],
					[]
				), false
			);
		});

		it('Check move outerSystem objective: true', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'interstellarFlight',
					{
						tutorials: { unitsBuild: true },
						research: { prop_vsl: -1 },
					},
					{},
					[ { orbitPosition: 2, endMoveTime: 1, motherPlanetAddress: '1-2-P3', position: '1-3-P1' }],
					[]
				), true
			);
		});

		it('Check move battle objective: false', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'battle',
					{
						tutorials: { interplanetaryFlight: true }
					},
					{},
					[ { orbitPosition: 2, endMoveTime: 1 }],
					[]
				), false
			);
		});

		it('Check move battle objective: true', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'battle',
					{
						tutorials: { interplanetaryFlight: true }
					},
					{},
					[ { orbitPosition: 1, endMoveTime: 1 }],
					[]
				), true
			);
		});
	});
});