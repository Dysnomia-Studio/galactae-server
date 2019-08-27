/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
const Privileges = require('../privileges');

describe('• Units', () => {
	describe('# getChatRank()', () => {
		it('Member/Error return empty string', () => {
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

		it('Staff', () => {
			assert.equal(
				Privileges.getChatRank(2),
				'[STAFF] '
			);

			assert.equal(
				Privileges.getChatRank(3),
				'[STAFF] '
			);
		});

		it('Admin', () => {
			assert.equal(
				Privileges.getChatRank(4),
				'[ADMIN] '
			);
		});
	});
});