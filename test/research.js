/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../../server-dev/calcConstants')();
require('../../server-dev/misc')();
let research = require('../../server-dev/research');

describe('• research', function() {
	/**
	 * getResearch
	 */
	describe('# getResearch()', function() {

		it('Get research (not found)', function() {
			assert.equal(
				research.getResearch({ research: [ ["test", 1]] }, "test1"),
				0
			);
		});
		it('Get research (found)', function() {
			assert.equal(
				research.getResearch({ research: [ ["test", 1]] }, "test"),
				1
			);
		});


	});

	/**
	 * getResearchProduction
	 */
	describe('# getResearchProduction()', function() {
		it('Get research production (lvl 1)', function() {
			assert.equal(
				research.getResearchProduction(1),
				4
			);
		});
		it('Get research production (lvl 30)', function() {
			assert.equal(
				research.getResearchProduction(30),
				307
			);
		});
	});
});