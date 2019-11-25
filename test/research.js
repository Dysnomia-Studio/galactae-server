describe('• Research', () => {
	/**
	 * addChilds
	 */
	describe('# addChilds()', () => {
		it('empty research & idempotence', () => {
			const newUser1 = Research.addChilds({
				research: {
					researchCenter: 0,
				},
			});

			const newUser2 = Research.addChilds({ research: newUser1 });

			assert.deepEqual(
				newUser1, {
					researchCenter: 0,
					industrialistion: 0,
					phyContemporaine: 0,
					thermodynamique: 0,
				}
			);

			assert.deepEqual(
				newUser1,
				newUser2
			);
		});
	});

	/**
	 * sendResearchDataToUser
	 */
	describe('# sendResearchDataToUser', () => {
		it('sendResearchDataToUser(_, _, _)', (done) => {
			const user = {
				research: {
					researchCenter: -1,
					phyContemporaine: -1,
				},
			};

			const data = {
				sid: '0123456789',
			};

			const stepEnd = (sid, event, content) => {
				assert.equal(event, 'player-recieve-data');
				assert.deepEqual(content, { research: user.research });
				assert.equal(sid, data.sid);

				done();
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						stepEnd(sid, event, content);
					},
				};
			};

			Research.sendResearchDataToUser(data, {}, user);
		});
	});
});