/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../../server-dev/misc')();

let Player = require('../player');

describe('• Player', function() {
	/**
	 * isset
	 */
	describe('# canAct()', function() {
		it('canAct(now)', function() {
			assert.equal(
				Player.canAct({ lastAction: Date.now() }),
				false
			);
		});
		it('canAct(now - 1000)', function() {
			assert.equal(
				Player.canAct({ lastAction: Date.now() - 1000 }),
				true
			);
		});
	});
});