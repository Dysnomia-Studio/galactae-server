/**
 * Libs
 */
const assert = require('assert');

// On a pas besoin de log ici
global.log = function() {};

/**
 * My libs
 */
require('../misc')();

const Combat = require('../combat');

describe('• Combat', function() {
	/**
	 * constructor
	 */
	describe('# constructor()', function() {
		it('constructor()', function() {
			let errMsg = '';

			try {
				const battleArena = new Combat();
			} catch(e) {
				errMsg = e.message;
			}

			assert.equal(errMsg, '');
		});
	});

	/**
	 * joinTeam
	 */
	describe('# joinTeam()', function() {
		it('constructor(..., {}) => No fleet added', function() {
			const battleArena = new Combat();

			battleArena.joinTeam('def', {});

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 0);
		});

		it('constructor(wrongTeam, {...}) => No fleet added', function() {
			const battleArena = new Combat();

			battleArena.joinTeam('test', { _id: 'test' });

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 0);
		});

		it('constructor(def, {...}) => Def fleet added', function() {
			const battleArena = new Combat();

			battleArena.joinTeam('def', { _id: 'test' });

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 1);
		});

		it('constructor(atk, {...}) => Atk fleet added', function() {
			const battleArena = new Combat();

			battleArena.joinTeam('atk', { _id: 'test' });

			assert.equal(battleArena.atkFleets.length, 1);
			assert.equal(battleArena.defFleets.length, 0);
		});
	});
});