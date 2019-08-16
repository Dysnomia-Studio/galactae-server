/**
 * Libs
 */
const assert = require('assert');

require('../calcConstants')();

global.Unit       = require('../Unit').Unit;

global.log       = function(txt) { console.log(txt); };

global.db        = global.db || {};
global.db.fleet   = global.db.fleet || {};
global.db.battleLog   = global.db.battleLog || {};
global.db.tactic = global.db.tactic || {};
global.db.unit   = global.db.unit || {};

global.io        = global.io || {};

global.preventRestarts = 0;

const tactics = [
	{
		id: 't1',
		orders: [
			{ unit: 'u1', priority: 1, target: 'SHIP_CORVET' },
			{ unit: 'u1', priority: 3, target: 'SHIP_BATTLECRUISER' },
			{ unit: 'u2', priority: 1, target: 'SHIP_CORVET' },
		]
	},
	{
		id: 't2',
		orders: [
			{ unit: 'u1', priority: 1, target: 'SHIP_CORVET' },
			{ unit: 'u1', priority: 3, target: 'SHIP_BATTLECRUISER' },
			{ unit: 'u2', priority: 1, target: 'SHIP_CORVET' },
		]
	},
	{
		id: 't3',
		orders: [
			{ unit: 'u1', priority: 3, target: 'SHIP_DEF' },
			{ unit: 'u2', priority: 1, target: 'SHIP_DEF' },
			{ unit: 'u2', priority: 2, target: 'SHIP_CORVET' },
		]
	}
];

db.tactic.find = (id, callback) => {
	callback(tactics.filter((t) => t.id === id)[0]);
};

global.unitsList = [{
	'id': 'u1',
	'name': 'corvette',
	'shipType': 'SHIP_CORVET',
	'shipShape': 'SHIP_CORVET_SMALL',
	'ownerId': 'c8160ce6-8473-11e9-a63c-e76275663acb',
	'cost': [420, 230, 220, 90, 1.77, 120],
	'parts': [{
		'type': 'cloak',
		'name': 'cloak_1',
		'tech': 'none'
	}, {
		'type': 'scanner',
		'name': 'scanner_1',
		'tech': 'none'
	}, {
		'type': 'sub_propulsion',
		'name': 'prop_1',
		'tech': 'vsolaire'
	}, {
		'type': 'sub_propulsion',
		'name': 'prop_2',
		'tech': 'vsolaire'
	}, {
		'type': 'sup_propulsion',
		'name': 'prop_3',
		'tech': 'vsl'
	}],
	'armorType': '0',
	'note': 0,
	'owned': 2
}, {
	'id': 'u2',
	'name': 'croiseur',
	'shipType': 'SHIP_BATTLECRUISER',
	'shipShape': 'SHIP_BATTLECRUISER_SMALL',
	'ownerId': 'c8160ce6-8473-11e9-a63c-e76275663acb',
	'cost': [480, 501, 271, 103, 2.32, 241],
	'parts': [{
		'type': 'cannon',
		'name': 'cannon_1',
		'tech': 'railgun'
	}, {
		'type': 'rocketLauncher',
		'name': 'rocket_1',
		'tech': 'explosive'
	}, {
		'type': 'shield',
		'name': 'shield_1',
		'tech': 'none'
	}, {
		'type': 'sup_propulsion',
		'name': 'prop_1',
		'tech': 'vsl'
	}, {
		'type': 'sub_propulsion',
		'name': 'prop_2',
		'tech': 'ion'
	}, {
		'type': 'sub_propulsion',
		'name': 'prop_3',
		'tech': 'ion'
	}],
	'armorType': '0',
	'note': 0,
	'owned': 1
}];

db.unit.find = (id, callback) => {
	callback(unitsList.filter((u) => u.id === id)[0]);
};

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
	 * removeDuplicateFleets
	 */
	describe('# removeDuplicateFleets()', function() {
		it('removeDuplicateFleets(); [],[]', function() {
			const battleArena = new Combat();

			battleArena.removeDuplicateFleets();

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 0);
		});

		it('removeDuplicateFleets(); [x,y,z],[a,b,c]', function() {
			const battleArena = new Combat();

			battleArena.atkFleets = [
				{id: 'x'},
				{id: 'y'},
				{id: 'z'},
			];
			battleArena.defFleets = [
				{id: 'a'},
				{id: 'b'},
				{id: 'c'},
			];


			battleArena.removeDuplicateFleets();

			assert.equal(battleArena.atkFleets.length, 3);
			assert.equal(battleArena.defFleets.length, 3);
		});

		it('removeDuplicateFleets(); [x,y,z,g],[a,b,c,g]', function() {
			const battleArena = new Combat();

			battleArena.atkFleets = [
				{id: 'x'},
				{id: 'y'},
				{id: 'z'},
				{id: 'g'},
			];
			battleArena.defFleets = [
				{id: 'a'},
				{id: 'b'},
				{id: 'c'},
				{id: 'g'},
			];

			battleArena.removeDuplicateFleets();

			assert.equal(battleArena.atkFleets.length, 3);
			assert.equal(battleArena.defFleets.length, 3);
		});
	});

	/**
	 * sortFleets
	 */
	describe('# sortFleets()', function() {
		it('sortFleets(); [],[]', function() {
			const battleArena = new Combat();

			battleArena.sortFleets();

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 0);
		});

		it('sortFleets() sort def', function() {
			const battleArena = new Combat();

			battleArena.atkFleets = [];
			battleArena.defFleets = [
				{name: 'a'},
				{name: 'b'},
				{name: 'SHIP_DEF'},
				{name: 'c'},
			];

			battleArena.sortFleets();

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 4);
			assert.equal(battleArena.defFleets[0].name, 'SHIP_DEF');
		});

		it('sortFleets(); sort atk', function() {
			const battleArena = new Combat('g');

			battleArena.atkFleets = [
				{id: 'x'},
				{id: 'g'},
				{id: 'z'},
				{id: 'y'},
			];
			battleArena.defFleets = [];

			battleArena.sortFleets();

			assert.equal(battleArena.atkFleets.length, 4);
			assert.equal(battleArena.defFleets.length, 0);
			assert.equal(battleArena.atkFleets[0].id, 'g');
		});

		it('sortFleets(); sort both', function() {
			const battleArena = new Combat('g');

			battleArena.atkFleets = [
				{id: 'x'},
				{id: 'y'},
				{id: 'z'},
				{id: 'g'},
			];
			battleArena.defFleets = [
				{name: 'a'},
				{name: 'b'},
				{name: 'SHIP_DEF'},
				{name: 'c'},
			];

			battleArena.sortFleets();

			assert.equal(battleArena.atkFleets.length, 4);
			assert.equal(battleArena.atkFleets[0].id, 'g');

			assert.equal(battleArena.defFleets.length, 4);
			assert.equal(battleArena.defFleets[0].name, 'SHIP_DEF');
		});
	});


	/**
	 * joinTeam
	 */
	describe('# joinTeam()', function() {
		it('joinTeam(..., {}) => No fleet added', function() {
			const battleArena = new Combat();

			battleArena.joinTeam('def', {});

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 0);
		});

		it('joinTeam(wrongTeam, {...}) => No fleet added', function() {
			const battleArena = new Combat();

			battleArena.joinTeam('test', { id: 'test', units: ['testUnit1', 'testUnit2'] });

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 0);
		});

		it('joinTeam(def, {...}) => Def fleet added', function() {
			const battleArena = new Combat();

			battleArena.joinTeam('def', { id: 'test', units: ['testUnit1', 'testUnit2'] });

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 1);
		});

		it('joinTeam(atk, {...}) => Atk fleet added', function() {
			const battleArena = new Combat();

			battleArena.joinTeam('atk', { id: 'test', units: ['testUnit1', 'testUnit2'] });

			assert.equal(battleArena.atkFleets.length, 1);
			assert.equal(battleArena.defFleets.length, 0);
		});
	});

	/**
	 * findUnit
	 */
	describe('# findUnit()', () => {
		const battleArena = new Combat('f1');
		battleArena.unitCache = unitsList;

		it('findUnit(specficType,_) : OK', () => {
			let fleets = [
				{ id: 'f1', units: { 'SHIP_WEP_MINES': 42 } },
				{ id: 'f2', units: { 'u2': 123, 'u1': 42 } },
				{ id: 'f3', units: { 'u1': 123, 'u2': 42 } },
			];

			assert.deepEqual(
				battleArena.findUnit('SHIP_CORVET', fleets),
				['f2', 'u1']
			);

			fleets = [
				{ id: 'f1', units: { 'u2': 42 } },
				{ id: 'f2', units: { 'SHIP_WEP_MINES_NUKE': 123, 'SHIP_WEP_MINES': 42 } },
				{ id: 'f3', units: { 'u2': 123, 'u1': 42 } },
			];

			assert.deepEqual(
				battleArena.findUnit('SHIP_BATTLECRUISER', fleets),
				['f1', 'u2']
			);
		});

		it('findUnit(specficType,_) : NOT FOUND', () => {
			const fleets = [
				{ id: 'f1', units: { 'u2': 42 } },
				{ id: 'f2', units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, 'u2': 42 } },
				{ id: 'f3', units: { 'u1': 123, 'u2': 42 } },
			];

			assert.deepEqual(
				battleArena.findUnit('BLEH', fleets),
				[-1, -1]
			);
		});

		it('findUnit(specficType,_) : NO COMPATIBLE UNIT => ALL', () => {
			const fleets = [
				{ id: 'f1', units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
				{ id: 'f2', units: { 'SHIP_WEP_MINES': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
				{ id: 'f3', units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
			];

			assert.deepEqual(
				battleArena.findUnit('SHIP_DEF', fleets),
				[-1, -1]
			);
		});

		it('findUnit("",_) : OK', () => {
			const fleets = [
				{ id: 'f1', units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
				{ id: 'f2', units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
				{ id: 'f3', units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
			];

			assert.deepEqual(
				battleArena.findUnit('', fleets),
				['f1', specialUnitsUID.SHIP_WEP_MINES]
			);
		});

		it('findUnit("",_) : NOT FOUND', () => {
			const fleets = [
				{ id: 'f1', units: { } },
			];

			assert.deepEqual(
				battleArena.findUnit('', fleets),
				[-1, -1]
			);
		});
	});

	/**
	 * getTarget()
	 */
	describe('# getTarget()', () => {
		const tactics = {
			't1': { orders: [
				{ unit: 'u1', priority: 1, target: 'SHIP_DEF' },
				{ unit: 'u1', priority: 3, target: 'SHIP_CORVET' },
				{ unit: 'u2', priority: 1, target: 'SHIP_CORVET' },
			] }
		};

		const fleets = [
			{ id: 'f1', units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
			{ id: 'f2', units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
			{ id: 'f3', units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
		];

		const battleArena = new Combat(fleets[0].id);
		battleArena.unitCache = unitsList;
		battleArena.tacticCache = tactics;

		it('getTarget(_, _, _) - compatible: 1', () => {
			assert.deepEqual(
				battleArena.getTarget(
					'u1',
					{ tactic: 't1' },
					fleets
				),
				{
					fleet: 'f3',
					unit: 'u1',
				}
			);
		});

		it('getTarget(_, _, _) - compatible: 0', () => {
			assert.deepEqual(
				battleArena.getTarget(
					specialUnitsUID.SHIP_WEP_MINES_NUKE,
					{ tactic: 't1' },
					fleets
				),
				{
					fleet: 'f1',
					unit: specialUnitsUID.SHIP_WEP_MINES,
				}
			);
		});
	});

	/**
	 * getShieldAbsorption
	 */
	describe('# getShieldAbsorption()', () => {
		const battleArena = new Combat('f1');

		const weapons = ['railgun', 'plasma', 'laser', 'explosive', 'iem', 'nuke', 'antimater'];
		const shields = ['magnetic', 'turret', 'singularity', 'projector'];

		const weaponToType = {
			'explosive': 'lightMissile',
			'iem': 'lightMissile',
			'nuke': 'heavyMissile',
			'antimater': 'heavyMissile',
		};

		for(const weapon of weapons) {
			let weaponName = weapon;
			if(weaponToType[weaponName]) {
				weaponName = weaponToType[weaponName];
			}

			for(const shield of shields) {
				it('getShieldAbsorption(' + weapon + ', ' + shield + ')', () => {
					assert.equal(
						battleArena.getShieldAbsorption(weapon, shield),
						shieldAbsorption[shield][weaponName]
					);
				});
			}
		}

		it('getShieldAbsorption(_, none)', () => {
			assert.equal(
				battleArena.getShieldAbsorption('blah', 'none'),
				0
			);
		});

		it('getShieldAbsorption(invalid, magnetic)', () => {
			assert.equal(
				battleArena.getShieldAbsorption('invalid', 'magnetic'),
				0
			);
		});
	});

	/**
	 * @TODO: simulateDamage
	 */

	/**
	 * @TODO: simulateTurn
	 */

	/**
	 * getAllTactics
	 */
	describe('# getAllTactics()', () => {
		it('getAllTactics(_)', () => {
			const battleArena = new Combat('f1');
			battleArena.atkFleets = [
				{ tactic: 't1' },
				{ tactic: 't2' },
				{ tactic: 't1' },
			];

			const expected = {
				't1': tactics[0],
				't2': tactics[1],
			};

			battleArena.getAllTactics(() => {
				assert.deepEqual(
					battleArena.tacticCache,
					expected
				);
			});
		});
	});

	/**
	 * getAllUnits
	 */
	describe('# getAllUnits()', () => {
		it('getAllUnits(_)', (done) => {
			const battleArena = new Combat('f1');
			battleArena.atkFleets = [
				{ units: {'u1': 12, 'u2': 89 } },
				{ units: { [specialUnitsUID.SHIP_WEP_MINES]: 85, 'u2': 2 } },
				{ units: { [specialUnitsUID.SHIP_WEP_MINES]: 24, 'u2': 78 } },
			];

			const timeout = setTimeout(
				() => { assert(false); done(); },
				2500
			);

			const expected = {
				'u1': unitsList[0],
				'u2': unitsList[1],
			};

			battleArena.getAllUnits(() => {
				clearTimeout(timeout);

				assert.deepEqual(
					battleArena.unitCache,
					Object.assign({}, Unit.specialUnits, expected)
				);

				done();
			});
		});
	});

	/**
	 * addActionToBattleLog
	 */
	describe('# addActionToBattleLog()', () => {
		it('addActionToBattleLog()', () => {
			const battleArena = new Combat('f1');

			const action = {
				'message': 'test'
			};

			battleArena.addActionToBattleLog(action);

			assert.deepEqual(
				battleArena.battleLog,
				[action]
			);
		});
	});

	/**
	 * saveLogs
	 */
	describe('# saveLogs()', () => {
		it('saveLogs', (done) => {
			const timeout = setTimeout(
				() => { assert(false, 'Logs are not saved/transmitted to client.'); done(); },
				500
			);

			let added = 0;
			const stepEnd = () => {
				if(++added === 2) {
					clearTimeout(timeout);
					done();
				}
			};

			global.db.battleLog.save = () => {
				stepEnd();
			};

			global.io = {
				to: (sid) => {
					return {
						emit: (event, content) => {
							stepEnd(sid, event, content);
						}
					};
				}
			};

			const battleArena = new Combat('f1');
			battleArena.atkFleets = [
				{ id: 'f1', name: 'Fleet 1' },
			];

			const action = {
				'message': 'test'
			};

			battleArena.addActionToBattleLog(action);

			battleArena.saveLogs();

			assert.deepEqual(
				battleArena.battleLog,
				[action]
			);
		});
	});

	/**
	 * Full battle
	 */
	describe('# beginFight', () => {
		const expectedLogs = {
			atk_user_id: 'u2',
			atk_user_name: 'User 2',

			atk_fleet_id: 'f3',
			atk_fleet_name: 'Fleet 3',


			def_user_id: 'u1',
			def_user_name: 'User 1',

			//date: Date.now(),

			location: 'P1',

			logs: [],
		}; // Real log content

		const globalFleetList = [
			{ id: 'f1', name: 'Fleet 1', endMoveTime: -1, tactic: 't1', ownerId: 'u2', orbitPosition: 1, units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
			{ id: 'f2', name: 'Fleet 2', endMoveTime: -1, tactic: 't2', ownerId: 'u2', orbitPosition: 1, units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
			{ id: 'f3', name: 'Fleet 3', endMoveTime: -1, tactic: '', ownerId: 'u2', orbitPosition: 1, units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
		];

		global.db.fleet.findByPosition = (pid, callback) => {
			callback(globalFleetList);
		};

		it('No defending units', (done) => {
			let doneSteps = 0;
			let logs = {};

			const stepEnd = () => {
				if(++doneSteps === 2) {
					assert(typeof logs.date === 'number');

					delete logs.date;

					assert.deepEqual(logs, expectedLogs);

					done();
				}
			};

			global.io = {
				to: (sid) => {
					return {
						emit: () => {
							stepEnd();
						}
					};
				}
			};
			global.db.battleLog.save = (content) => {
				logs = content;
				stepEnd();
			};


			Combat.beginFight({}, 'P1', 'u2', 'f3');
		});

		it('Normal battle', (done) => {
			let doneSteps = 0;
			let logs = {};

			globalFleetList.push(
				{ id: 'f4', name: 'Fleet 4', endMoveTime: -1, tactic: 't3', ownerId: 'u1', orbitPosition: 0, units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } }
			);
			globalFleetList.push(
				{ id: 'f5', name: 'Fleet 5', endMoveTime: -1, tactic: '', ownerId: 'u1', orbitPosition: 0, units: { 'u2': 56, [specialUnitsUID.SHIP_WEP_MINES]: 54 } }
			);
			globalFleetList.push(
				{ id: 'f6', name: 'Fleet 6', endMoveTime: -1, tactic: 't3', ownerId: 'u3', orbitPosition: 0, units: { 'u1': 45, [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 12 } }
			);

			const stepEnd = () => {
				if(++doneSteps === 2) {
					assert(typeof logs.date === 'number');
					assert(logs.logs.length > 0);

					delete logs.date;

					assert.deepEqual(logs, expectedLogs);

					done();
				}
			};

			global.io = {
				to: (sid) => {
					return {
						emit: () => {
							stepEnd();
						}
					};
				}
			};
			global.db.battleLog.save = (content) => {
				logs = content;
				stepEnd();
			};

			Combat.beginFight({}, 'P1', 'u2', 'f3');
		});
	});
});