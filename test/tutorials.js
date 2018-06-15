/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../../server-dev/calcConstants')();
require('../../server-dev/misc')();
let tutorials = require('../../server-dev/tutorials');

describe('• tutorials', function() {
	/**
	 * Has finished tutorials ?
 	 */
	describe('# hasFinishedTutorials()', function() {
		it('No tutorials done (undefined)', function() {
			assert.equal(
				tutorials.hasFinishedTutorials({}),
				false
			);
		});
		
		it('0 tutorials done', function() {
			assert.equal(
				tutorials.hasFinishedTutorials(
					{ currTutorial: 0                       }
				), false
			);
		});

		it('N-1 tutorials done', function() {
			assert.equal(
				tutorials.hasFinishedTutorials(
					{ currTutorial: tutorialsList.length - 1 }
				), false
			);
		});

		it('N tutorials done', function() {
			assert.equal(
				tutorials.hasFinishedTutorials(
					{ currTutorial: tutorialsList.length     }
				), true
			);
		});
	});
});