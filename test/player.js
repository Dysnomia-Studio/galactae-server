/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../misc')();
require('../calcConstants')();

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
	 * getDayBonus
	 */
	describe('# getDayBonus()', () => {
		const inputPlayer = {
			id: 'u1',
			lastBonus: Date.now(),
			dayBonusStreak: 1,
			dayBonusBest: 100,
		};
		const expectedPlayer = Object.assign({}, inputPlayer);
		delete expectedPlayer.lastBonus;

		it('Aujourd\'hui', () => {
			const {
				credits,
				helium,
				outputPlayer,
			} = Player.getDayBonus(inputPlayer, 1);

			assert.equal(credits, 0);
			assert.equal(helium, 0);
		});

		it('Hier', () => {
			inputPlayer.lastBonus = Date.now() - TIME.DAY_TO_MS;
			expectedPlayer.dayBonusStreak += 1;

			const {
				credits,
				helium,
				newPlayerData,
			} = Player.getDayBonus(inputPlayer, 1);

			assert.equal(credits, 25);
			assert.equal(helium, 0);

			delete newPlayerData.lastBonus;
			assert.deepEqual(newPlayerData, expectedPlayer);
		});

		it('Avant-hier', () => {
			inputPlayer.lastBonus = Date.now() - 2*TIME.DAY_TO_MS;
			expectedPlayer.dayBonusStreak = 1;

			const {
				credits,
				helium,
				newPlayerData,
			} = Player.getDayBonus(inputPlayer, 1);

			assert.equal(credits, 15);
			assert.equal(helium, 0);

			delete newPlayerData.lastBonus;
			assert.deepEqual(newPlayerData, expectedPlayer);
		});

		it('Très longtemps avant', () => {
			inputPlayer.lastBonus = 100000;
			expectedPlayer.dayBonusStreak = 1;

			const {
				credits,
				helium,
				newPlayerData,
			} = Player.getDayBonus(inputPlayer, 1);

			assert.equal(credits, 15);
			assert.equal(helium, 0);

			delete newPlayerData.lastBonus;
			assert.deepEqual(newPlayerData, expectedPlayer);
		});

		it('Depassement de best', () => {
			inputPlayer.lastBonus = Date.now() - TIME.DAY_TO_MS;
			inputPlayer.dayBonusStreak = 100;
			inputPlayer.dayBonusBest = 100;
			expectedPlayer.dayBonusStreak = 101;
			expectedPlayer.dayBonusBest = 101;

			const {
				credits,
				helium,
				newPlayerData,
			} = Player.getDayBonus(inputPlayer, 1);

			assert.equal(credits, 120);
			assert.equal(helium, 19250);

			delete newPlayerData.lastBonus;
			assert.deepEqual(newPlayerData, expectedPlayer);
		});

		it('Helium possible', () => {
			inputPlayer.lastBonus = Date.now() - TIME.DAY_TO_MS;
			inputPlayer.dayBonusStreak = 19;

			const {
				credits,
				helium,
				newPlayerData,
			} = Player.getDayBonus(inputPlayer, 1);

			assert.equal(helium, 40000);
		});

		it('Helium impossible', () => {
			inputPlayer.lastBonus = Date.now() - TIME.DAY_TO_MS;
			inputPlayer.dayBonusStreak = 0;

			const {
				credits,
				helium,
				newPlayerData,
			} = Player.getDayBonus(inputPlayer, 1);

			assert.equal(helium, 0);
		});
	});
});