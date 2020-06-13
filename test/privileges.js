describe('• Privileges', () => {
	describe('# isBannedFromChat', () => {
		const bans = [
			{ user_id: 'u1', ban_end: new Date(Date.now() + 100000) },
			{ user_id: 'u3', ban_end: new Date(Date.now() - 100000) },
			{ user_id: 'u4', ban_end: new Date(Date.now() - 100000) },
			{ user_id: 'u4', ban_end: new Date(Date.now() + 100000) },
		];

		db.ban.find = async(userId, type) => {
			return bans.filter((b) => b.user_id === userId);
		};

		it('Should be banned', async() => {
			assert.equal(await Privileges.isBannedFromChat('u1'), true);
		});

		it('Should not be banned (not existing ban)', async() => {
			assert.equal(await Privileges.isBannedFromChat('u2'), false);
		});

		it('Should not be banned (expired ban)', async() => {
			assert.equal(await Privileges.isBannedFromChat('u3'), false);
		});

		it('Should be banned (one expired, the other not)',  async() => {
			assert.equal(await Privileges.isBannedFromChat('u1'), true);
		});
	});

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
