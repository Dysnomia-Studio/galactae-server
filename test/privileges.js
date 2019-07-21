/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
const Privileges = require('../privileges');

describe('• Units', function() {
	describe('# getChatRank()', function() {
		it('Member/Error return empty string', function() {
			assert.equal(
				Privileges.getChatRank(0),
				''
			);

			assert.equal(
				Privileges.getChatRank(1),
				''
			);

			assert.equal(
				Privileges.getChatRank(1000),
				''
			);
		});

		it('Staff', function() {
			assert.equal(
				Privileges.getChatRank(2),
				'[STAFF] '
			);

			assert.equal(
				Privileges.getChatRank(3),
				'[STAFF] '
			);
		});

		it('Admin', function() {
			assert.equal(
				Privileges.getChatRank(4),
				'[ADMIN] '
			);
		});
	});
});