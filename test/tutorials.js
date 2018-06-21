/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();
let Tutorials = require('../tutorials');

describe('• Tutorials', function() {
	/**
	 * Has finished tutorials ?
 	 */
	describe('# hasFinishedTutorials()', function() {
		it('No tutorials done (undefined)', function() {
			assert.equal(
				Tutorials.hasFinishedTutorials({}),
				false
			);
		});
		
		it('0 tutorials done', function() {
			assert.equal(
				Tutorials.hasFinishedTutorials(
					{ currTutorial: 0                       }
				), false
			);
		});

		it('N-1 tutorials done', function() {
			assert.equal(
				Tutorials.hasFinishedTutorials(
					{ currTutorial: tutorialsList.length - 1 }
				), false
			);
		});

		it('N tutorials done', function() {
			assert.equal(
				Tutorials.hasFinishedTutorials(
					{ currTutorial: tutorialsList.length     }
				), true
			);
		});
	});
});