describe('• Research (shared)', () => {
	/**
	 * isSearched
	 */
	describe('# isSearched()', () => {
		it('Finished research', () => {
			assert.equal(
				Research.isSearched({ research: { 'foo': -1 } }, 'foo'),
				true
			);
		});

		it('Not Finished research', () => {
			assert.equal(
				Research.isSearched({ research: { 'foo': 10 } }, 'foo'),
				false
			);
		});

		it('Not existing research', () => {
			assert.equal(
				Research.isSearched({ research: { 'bar': -1 } }, 'foo'),
				false
			);
		});
	});

	/**
	 * getResearchProduction
	 */
	describe('# getResearchProduction()', () => {
		it('Get research production (lvl 1)', () => {
			assert.equal(
				Research.getResearchProduction(1),
				4
			);
		});
		it('Get research production (lvl 30)', () => {
			assert.equal(
				Research.getResearchProduction(30),
				307
			);
		});
	});

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
});
