/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();
const Tutorials = require('../Tutorials').Tutorials;
global.Research = require('../research');

describe('• Tutorials', function() {
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

		it('Check research dependencies', function() {
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

		it('Check building objective', function() {
			assert.equal(
				Tutorials.hasCompletedTutorial(
					'energy',
					{ tutorials: { welcome: true } },
					{ Buildings: [1,1,1,1,2,1,1,1,1,1,0,0,0,0]}
				), true
			);
		});

		//@TODO: check building dependency

		//@TODO: check oneOfMany research dependency
		//
		//@TODO: check unique research dependency
	});
});