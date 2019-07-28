/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../misc')();

const Player = require('../player');

describe('• Player', () => {
	/**
	 * canAct
	 */
	describe('# canAct()', () => {
		it('canAct(now)', () => {
			assert.equal(
				Player.canAct({ lastAction: Date.now() }),
				false
			);
		});
		it('canAct(now - 1000)', () => {
			assert.equal(
				Player.canAct({ lastAction: Date.now() - 1000 }),
				true
			);
		});
	});

	/**
	 * calcResearchPoints
	 */
	describe('# calcResearchPoints()', () => {
		it('calcResearchPoints(no research)', () => {
			assert.equal(
				Player.calcResearchPoints({ research: {} }),
				0
			);
		});

		it('calcResearchPoints(some research)', () => {
			assert.equal(
				Player.calcResearchPoints({ research: { researchCenter: -1, industrialistion: -1, phyContemporaine: -1, thermodynamique: -1 } }),
				pointsCoef.research * (0 + 8 + 20 + 13)
			);
		});

		it('calcResearchPoints(all research)', () => {
			const research = {};
			let total = 0;
			for(const researchName in researchList) {
				research[researchName] = -1;
				total += researchList[researchName].cost;
			}

			assert.equal(
				Player.calcResearchPoints({ research: research }),
				pointsCoef.research * total
			);
		});
	});
});