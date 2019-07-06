/**
 * Libs
 */
const assert = require('assert');
global.Websocket = class Websocket {
	static SendMessageToClient() {
		// Do nothing
	}
};

/**
 * My libs
 */
require('../calcConstants')();
require('../config')();
require('../misc')();

global.Tactics    = require('../tactics');

describe('• Tactics', () => {
	describe('# checkTactic()', () => {
		it('wrong name type', () => {
			assert(
				!Tactics.checkTactic({
					'name': undefined,
				})
			);

			assert(
				!Tactics.checkTactic({
					'name': {},
				})
			);

			assert(
				!Tactics.checkTactic({
					'name': [],
				})
			);

			assert(
				!Tactics.checkTactic({
					'name': 1,
				})
			);
		});

		it('wrong owner type', () => {
			assert(
				!Tactics.checkTactic({
					'owner': 1,
				})
			);
		});

		it('wrong id type', () => {
			assert(
				!Tactics.checkTactic({
					'id': 1,
				})
			);
		});

		it('wrong orders type', () => {
			assert(
				!Tactics.checkTactic({
					'orders': undefined,
				})
			);

			assert(
				!Tactics.checkTactic({
					'orders': {},
				})
			);

			assert(
				!Tactics.checkTactic({
					'orders': 1,
				})
			);
		});

		it('wrong entry', () => {
			assert(
				!Tactics.checkTactic({
					'sdf': 'fgfg',
				})
			);
		});

		it('too much orders in list', () => {
			const orders = [];
			for(let i=0; i<TACTIC_MAX_ORDERS*2; i++) {
				orders.push({ 'test': 'test' });
			}

			assert(
				!Tactics.checkTactic({
					'orders': orders,
				}, {
					'username': 'moi',
				})
			);
		});

		it('empty orders list', () => {
			assert(
				!Tactics.checkTactic({
					'orders': [],
				}, {
					'username': 'moi',
				})
			);
		});
	});
});