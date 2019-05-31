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