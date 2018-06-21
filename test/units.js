/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();
let Units = require('../units');

describe('• Units', function() {
	/**
	 * Has finished tutorials ?
 	 */
	describe('# slowerSpeed()', function() {
		it('A slower than B', function() {
			let a = [1,2,3];
			let b = [3,2,1];

			assert.equal(
				Units.slowerSpeed(a, b),
				a
			);
		});

		it('A equals to B', function() {
			let a = [1,2,3];
			let b = [1,2,3];

			assert.equal(
				Units.slowerSpeed(a, b),
				a
			);
		});

		it('A faster than B', function() {
			let a = [3,2,1];
			let b = [1,2,3];
			
			assert.equal(
				Units.slowerSpeed(a, b),
				b
			);
		});
	});
});