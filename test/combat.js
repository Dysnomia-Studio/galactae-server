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
		const units = {
			'u1': { shipType: 'BLAH', id: 'u1' },
			'u2': { shipType: 'BLAH', id: 'u2' },
			'u3': { shipType: 'BLEH', id: 'u3' },
		};

		const battleArena = new Combat('f1');
		battleArena.unitCache = units;

		it('findUnit(specficType,_) : OK', () => {
			let fleets = [
				{ id: 'f1', units: { 'u3': 42 } },
				{ id: 'f2', units: { 'u4': 123, 'u3': 42 } },
				{ id: 'f3', units: { 'u1': 123, 'u3': 42 } },
			];

			assert.deepEqual(
				battleArena.findUnit('BLAH', fleets),
				['f3', 'u1']
			);

			fleets = [
				{ id: 'f1', units: { 'u3': 42 } },
				{ id: 'f2', units: { 'u4': 123, 'u2': 42 } },
				{ id: 'f3', units: { 'u1': 123, 'u3': 42 } },
			];

			assert.deepEqual(
				battleArena.findUnit('BLAH', fleets),
				['f2', 'u2']
			);
		});

		it('findUnit(specficType,_) : NOT FOUND', () => {
			const fleets = [
				{ id: 'f1', units: { 'u2': 42 } },
				{ id: 'f2', units: { 'u4': 123, 'u2': 42 } },
				{ id: 'f3', units: { 'u1': 123, 'u2': 42 } },
			];

			assert.deepEqual(
				battleArena.findUnit('BLEH', fleets),
				[-1, -1]
			);
		});

		it('findUnit(specficType,_) : NO COMPATIBLE UNIT => ALL', () => {
			const fleets = [
				{ id: 'f1', units: { 'u3': 42 } },
				{ id: 'f2', units: { 'u4': 123, 'u3': 42 } },
				{ id: 'f3', units: { 'u1': 123, 'u3': 42 } },
			];

			assert.deepEqual(
				battleArena.findUnit('BRUH', fleets),
				['f1', 'u3']
			);
		});

		it('findUnit("",_) : OK', () => {
			const fleets = [
				{ id: 'f1', units: { 'u3': 42 } },
				{ id: 'f2', units: { 'u4': 123, 'u3': 42 } },
				{ id: 'f3', units: { 'u1': 123, 'u3': 42 } },
			];

			assert.deepEqual(
				battleArena.findUnit('', fleets),
				['f1', 'u3']
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
		const units = {
			'u1': { shipType: 'BLAH', id: 'u1' },
			'u2': { shipType: 'BLAH', id: 'u2' },
			'u3': { shipType: 'BLEH', id: 'u3' },
		};

		const tactics = {
			't1': { orders: [
				{ unit: 'u1', priority: 1, target: 'BLAH' },
				{ unit: 'u1', priority: 3, target: 'BLEH' },
				{ unit: 'u2', priority: 1, target: 'BLAH' },
			] }
		};

		const fleets = [
			{ id: 'f1', units: { 'u3': 42 } },
			{ id: 'f2', units: { 'u4': 123, 'u3': 42 } },
			{ id: 'f3', units: { 'u1': 123, 'u3': 42 } },
		];

		const battleArena = new Combat(fleets[0].id);
		battleArena.unitCache = units;
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
					'u4',
					{ tactic: 't1' },
					fleets
				),
				{
					fleet: 'f1',
					unit: 'u3',
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
	 * Full battle
	 */
	/*describe('# full battle', () => {
		it('No defending units', () => {
			const fleetList = [

			];

			const battle = new Combat(atkFleetId);

			// Add all fleets to fight
			/*for(const i in fleetList) {
				if(fleetList[i].endMoveTime > 0) { continue; }

				if(fleetList[i].orbitPosition === 0) {
					battle.joinTeam('def', fleetList[i]);
				} else if(fleetList[i].orbitPosition === 1 && fleetList[i].ownerId === atkUserId) {
					// @TODO: Add ally check
					battle.joinTeam('atk', fleetList[i]);
				}
			}

			battle.fight();*//*
		});
	});*/

});