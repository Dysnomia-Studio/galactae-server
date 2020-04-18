/* eslint-disable no-magic-numbers */

describe('• Conquest (shared)', () => {
	/**
	 * getPlanetMaxCount
	 */
	describe('# getPlanetMaxCount()', () => {
		it('points = 47, count = 1', () => {
			assert.equal(
				Conquest.getPlanetMaxCount(47),
				1
			);
		});
		it('points = 100, count = 1', () => {
			assert.equal(
				Conquest.getPlanetMaxCount(100),
				1
			);
		});
		it('points = 1000, count = 1', () => {
			assert.equal(
				Conquest.getPlanetMaxCount(1000),
				2
			);
		});
		it('points = 5000, count = 1', () => {
			assert.equal(
				Conquest.getPlanetMaxCount(5000),
				4
			);
		});
		it('points = 10000, count = 1', () => {
			assert.equal(
				Conquest.getPlanetMaxCount(10000),
				8
			);
		});
		it('points = 100000, count = 1', () => {
			assert.equal(
				Conquest.getPlanetMaxCount(100000),
				70
			);
		});
		it('points = 500000, count = 1', () => {
			assert.equal(
				Conquest.getPlanetMaxCount(500000),
				261
			);
		});
	});
});
