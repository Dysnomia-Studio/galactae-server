/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../misc')();

let Player = require('../player');

describe('• Player', () => {
	/**
	 * canAct
	 */
	describe('# canAct()', () => {
		it('canAct(now)', () => {
			assert.equal(
				Player.canAct({ lastAction: Date.now() }),
				false
			);
		});
		it('canAct(now - 1000)', () => {
			assert.equal(
				Player.canAct({ lastAction: Date.now() - 1000 }),
				true
			);
		});
	});
});