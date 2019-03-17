/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();
let Research = require('../research');

describe('• Research', function() {
	/**
	 * getResearch
	 */
	describe('# getResearch()', function() {

		it('Get research (not found)', function() {
			assert.equal(
				Research.getResearch({ research: [ ["test", 1]] }, "test1"),
				0
			);
		});
		it('Get research (found)', function() {
			assert.equal(
				Research.getResearch({ research: [ ["test", 1]] }, "test"),
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
				Research.getResearchProduction(1),
				4
			);
		});
		it('Get research production (lvl 30)', function() {
			assert.equal(
				Research.getResearchProduction(30),
				307
			);
		});
	});
});