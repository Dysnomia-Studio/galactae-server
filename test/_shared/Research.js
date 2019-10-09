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
});