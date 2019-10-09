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
});