describe('• Research', () => {
	/**
	 * researchedParent
	 */
	describe('# researchedParent((_,_,_,false)', () => {
		it('Invalid research', () => {
			assert.equal(
				Research.researchedParent({}, {}, 'foo'),
				false
			);
		});

		it('0 parents', () => {
			assert.equal(
				Research.researchedParent({}, {}, 'researchCenter'),
				true
			);
		});

		it('0 researched', () => {
			assert.equal(
				Research.researchedParent({ research: {} }, {}, 'prop_main'),
				false
			);
		});

		it('research parent', () => {
			assert.equal(
				Research.researchedParent({ research: { prop_manoeuvre: -1 } }, {}, 'prop_advManoeuvre'),
				true
			);
		});

		it('partial research parent', () => {
			assert.equal(
				Research.researchedParent({ research: { prop_main: -1 } }, {}, 'prop_vSolaire'), // Missing misc_phySolaire
				false
			);
		});

		it('building not ok', () => {
			const planet = { Buildings: [] };
			planet.Buildings[7] = 2;

			assert.equal(
				Research.researchedParent({ research: { thermodynamique: -1, misc_mecStellaire: -1 } }, planet, 'prop_main'), // Missing 1 level on building 7
				false
			);
		});

		it('building ok', () => {
			const planet = { Buildings: [] };
			planet.Buildings[7] = 3;

			assert.equal(
				Research.researchedParent({ research: { thermodynamique: -1, misc_mecStellaire: -1 } }, planet, 'prop_main'),
				true
			);
		});

		it('building ok but not all research', () => {
			const planet = { Buildings: [] };
			planet.Buildings[7] = 3;

			assert.equal(
				Research.researchedParent({ research: { thermodynamique: -1 } }, planet, 'prop_main'), // Missing misc_mecStellaire
				false
			);
		});

		it('planets count not ok', () => {
			const planet = { Buildings: [] };
			planet.Buildings[11] = 10;

			assert.equal(
				Research.researchedParent({ planetlist: ['1-2-3-4'], research: { prop_vsl: -1 } }, planet, 'prop_wd'),
				false
			);
		});

		it('planets count ok', () => {
			const planet = { Buildings: [] };
			planet.Buildings[11] = 10;

			assert.equal(
				Research.researchedParent({ planetlist: ['1-2-3-4','1-2-3-4'], research: { prop_vsl: -1 } }, planet, 'prop_wd'),
				true
			);
		});

		it('planets count ok + 1', () => {
			const planet = { Buildings: [] };
			planet.Buildings[11] = 10;

			assert.equal(
				Research.researchedParent({ planetlist: ['1-2-3-4','1-2-3-4','1-2-3-4'], research: { prop_vsl: -1 } }, planet, 'prop_wd'),
				true
			);
		});
	});

	describe('# researchedParent(_,_,_, true)', () => {
		it('Invalid research', () => {
			assert.equal(
				Research.researchedParent({}, {}, 'foo', true),
				false
			);
		});

		it('0 parents', () => {
			assert.equal(
				Research.researchedParent({}, {}, 'researchCenter', true),
				true
			);
		});

		it('0 researched', () => {
			assert.equal(
				Research.researchedParent({ research: {} }, {}, 'prop_main', true),
				false
			);
		});

		it('research parent', () => {
			assert.equal(
				Research.researchedParent({ research: { prop_manoeuvre: -1 } }, {}, 'prop_advManoeuvre', true),
				true
			);
		});

		it('partial research parent', () => {
			assert.equal(
				Research.researchedParent({ research: { prop_main: -1 } }, {}, 'prop_vSolaire', true), // Missing misc_phySolaire
				true
			);
		});

		it('building not ok', () => {
			const planet = { Buildings: [] };
			planet.Buildings[7] = 2;

			assert.equal(
				Research.researchedParent({ research: { thermodynamique: -1, misc_mecStellaire: -1 } }, planet, 'prop_main', true), // Missing 1 level on building 7
				true
			);
		});

		it('building ok', () => {
			const planet = { Buildings: [] };
			planet.Buildings[7] = 3;

			assert.equal(
				Research.researchedParent({ research: { thermodynamique: -1, misc_mecStellaire: -1 } }, planet, 'prop_main', true),
				true
			);
		});

		it('building ok but not all research', () => {
			const planet = { Buildings: [] };
			planet.Buildings[7] = 3;

			assert.equal(
				Research.researchedParent({ research: { thermodynamique: -1 } }, planet, 'prop_main', true), // Missing misc_mecStellaire
				true
			);
		});

		it('planets count not ok', () => {
			const planet = { Buildings: [] };
			planet.Buildings[11] = 10;

			assert.equal(
				Research.researchedParent({ planetlist: ['1-2-3-4'], research: { prop_vsl: -1 } }, planet, 'prop_wd', true),
				true
			);
		});

		it('planets count ok', () => {
			const planet = { Buildings: [] };
			planet.Buildings[11] = 10;

			assert.equal(
				Research.researchedParent({ planetlist: ['1-2-3-4','1-2-3-4'], research: { prop_vsl: -1 } }, planet, 'prop_wd', true),
				true
			);
		});

		it('planets count ok + 1', () => {
			const planet = { Buildings: [] };
			planet.Buildings[11] = 10;

			assert.equal(
				Research.researchedParent({ planetlist: ['1-2-3-4','1-2-3-4','1-2-3-4'], research: { prop_vsl: -1 } }, planet, 'prop_wd', true),
				true
			);
		});
	});

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