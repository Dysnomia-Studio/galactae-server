let tactics = [
	{
		id: 't1',
		orders: [
			{ unit: 'u1', priority: 1, target: 'SHIP_CORVET' },
			{ unit: 'u1', priority: 3, target: 'SHIP_BATTLECRUISER' },
			{ unit: 'u2', priority: 1, target: 'SHIP_CORVET' },
		],
	},
	{
		id: 't2',
		orders: [
			{ unit: 'u1', priority: 1, target: 'SHIP_CORVET' },
			{ unit: 'u1', priority: 3, target: 'SHIP_BATTLECRUISER' },
			{ unit: 'u2', priority: 1, target: 'SHIP_CORVET' },
		],
	},
	{
		id: 't3',
		orders: [
			{ unit: 'u1', priority: 3, target: 'SHIP_DEF' },
			{ unit: 'u2', priority: 1, target: 'SHIP_DEF' },
			{ unit: 'u2', priority: 2, target: 'SHIP_CORVET' },
		],
	},
];

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
		'tech': 'none',
	}, {
		'type': 'scanner',
		'name': 'scanner_1',
		'tech': 'none',
	}, {
		'type': 'sub_propulsion',
		'name': 'prop_1',
		'tech': 'vsolaire',
	}, {
		'type': 'sub_propulsion',
		'name': 'prop_2',
		'tech': 'vsolaire',
	}, {
		'type': 'sup_propulsion',
		'name': 'prop_3',
		'tech': 'vsl',
	}],
	'armorType': '0',
	'note': 0,
	'owned': 2,
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
		'tech': 'railgun',
	}, {
		'type': 'rocketLauncher',
		'name': 'rocket_1',
		'tech': 'explosive',
	}, {
		'type': 'shield',
		'name': 'shield_1',
		'tech': 'none',
	}, {
		'type': 'sup_propulsion',
		'name': 'prop_1',
		'tech': 'vsl',
	}, {
		'type': 'sub_propulsion',
		'name': 'prop_2',
		'tech': 'ion',
	}, {
		'type': 'sub_propulsion',
		'name': 'prop_3',
		'tech': 'ion',
	}],
	'armorType': '0',
	'note': 0,
	'owned': 1,
}];

describe('• Combat', () => {
	db.tactics.find = (id, callback) => {
		callback(tactics.filter((t) => t.id === id)[0]);
	};

	db.unit.findByOwner = (id, callback) => {
		callback(unitsList);
	};

	db.player.find = async(id) => {
		return [
			{ id: 'u1', name: 'User 1' },
			{ id: 'u2', name: 'User 2' },
			{ id: 'u3', name: 'User 3' },
			{ id: 'u4', name: 'User 4' },
			{ id: 'u5', name: 'User 5' },
			{ id: '80655df0-5775-11e9-99e3-8b79cb37567b', name: 'Elanis' },
			{ id: '80661808-5775-11e9-82cb-7b8f6e03caec', name: 'Firestorm' }
		].filter((elt) => elt.id === id)[0];
	};

	/**
	 * constructor
	 */
	describe('# constructor()', () => {
		it('constructor()', () => {
			let errMsg = '';

			try {
				new Combat();
			} catch(e) {
				errMsg = e.message;
			}

			assert.equal(errMsg, '');
		});
	});

	/**
	 * removeDuplicateFleets
	 */
	describe('# removeDuplicateFleets()', () => {
		it('removeDuplicateFleets(); [],[]', () => {
			const battleArena = new Combat();

			battleArena.removeDuplicateFleets();

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 0);
		});

		it('removeDuplicateFleets(); [x,y,z],[a,b,c]', () => {
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

		it('removeDuplicateFleets(); [x,y,z,g],[a,b,c,g]', () => {
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
	describe('# sortFleets()', () => {
		it('sortFleets(); [],[]', () => {
			const battleArena = new Combat();

			battleArena.sortFleets();

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 0);
		});

		it('sortFleets() sort def', () => {
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

		it('sortFleets(); sort atk', () => {
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

		it('sortFleets(); sort both', () => {
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
	describe('# joinTeam()', () => {
		it('joinTeam(..., {}) => No fleet added', () => {
			const battleArena = new Combat();

			battleArena.joinTeam('def', {});

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 0);
		});

		it('joinTeam(wrongTeam, {...}) => No fleet added', () => {
			const battleArena = new Combat();

			battleArena.joinTeam('test', { id: 'test', units: ['testUnit1', 'testUnit2'] });

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 0);
		});

		it('joinTeam(def, {...}) => Def fleet added', () => {
			const battleArena = new Combat();

			battleArena.joinTeam('def', { id: 'test', units: ['testUnit1', 'testUnit2'] });

			assert.equal(battleArena.atkFleets.length, 0);
			assert.equal(battleArena.defFleets.length, 1);
		});

		it('joinTeam(atk, {...}) => Atk fleet added', () => {
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
				{ id: 'f1', units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 42 }, unitsId: [specialUnitsUID.SHIP_WEP_MINES_NUKE] },
				{ id: 'f2', units: { 'u2': 123, 'u1': 42 }, unitsId: ['u1','u2'] },
				{ id: 'f3', units: { 'u1': 123, 'u2': 42 }, unitsId: ['u1','u2'] },
			];

			assert.deepEqual(
				battleArena.findUnit('SHIP_CORVET', fleets),
				['f2', 'u1']
			);

			fleets = [
				{ id: 'f1', units: { 'u2': 42 }, unitsId: ['u2'] },
				{ id: 'f2', units: { 'SHIP_WEP_MINES_NUKE': 123, 'SHIP_WEP_MINES': 42 }, unitsId: ['SHIP_WEP_MINES_NUKE','SHIP_WEP_MINES'] },
				{ id: 'f3', units: { 'u2': 123, 'u1': 42 }, unitsId: ['u1','u2'] },
			];

			assert.deepEqual(
				battleArena.findUnit('SHIP_BATTLECRUISER', fleets),
				['f1', 'u2']
			);
		});

		it('findUnit(specficType,_) : NOT FOUND', () => {
			const fleets = [
				{ id: 'f1', units: { 'u2': 42 }, unitsId: ['u2'] },
				{ id: 'f2', units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, 'u2': 42 }, unitsId: [specialUnitsUID.SHIP_WEP_MINES_NUKE,'u2'] },
				{ id: 'f3', units: { 'u1': 123, 'u2': 42 }, unitsId: ['u1','u2'] },
			];

			assert.deepEqual(
				battleArena.findUnit('BLEH', fleets),
				[-1, -1]
			);
		});

		it('findUnit(specficType,_) : NO COMPATIBLE UNIT => ALL', () => {
			const fleets = [
				{ id: 'f1', units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: [specialUnitsUID.SHIP_WEP_MINES] },
				{ id: 'f2', units: { 'SHIP_WEP_MINES': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: ['SHIP_WEP_MINES',specialUnitsUID.SHIP_WEP_MINES] },
				{ id: 'f3', units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: ['u1',specialUnitsUID.SHIP_WEP_MINES] },
			];

			assert.deepEqual(
				battleArena.findUnit('SHIP_DEF', fleets),
				[-1, -1]
			);
		});

		it('findUnit("",_) : OK', () => {
			const fleets = [
				{ id: 'f1', units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: [specialUnitsUID.SHIP_WEP_MINES] },
				{ id: 'f2', units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: [specialUnitsUID.SHIP_WEP_MINES_NUKE,specialUnitsUID.SHIP_WEP_MINES] },
				{ id: 'f3', units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: ['u1',specialUnitsUID.SHIP_WEP_MINES] },
			];

			const result = battleArena.findUnit('', fleets);

			assert(isset(result, 'array'));
			assert(isset(result[0], 'string'));
			assert(isset(result[1], 'string'));
		});

		it('findUnit("",_) : NOT FOUND', () => {
			const fleets = [
				{ id: 'f1', units: { }, unitsId: [] },
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
			't1': {
				orders: [
					{ unit: 'u1', priority: 1, target: 'SHIP_DEF' },
					{ unit: 'u1', priority: 3, target: 'SHIP_CORVET' },
					{ unit: 'u2', priority: 1, target: 'SHIP_CORVET' },
				],
			}
		};

		const fleets = [
			{ id: 'f1', units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: [specialUnitsUID.SHIP_WEP_MINES] },
			{ id: 'f2', units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: [specialUnitsUID.SHIP_WEP_MINES_NUKE,specialUnitsUID.SHIP_WEP_MINES] },
			{ id: 'f3', units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: ['u1',specialUnitsUID.SHIP_WEP_MINES] },
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
			const result = battleArena.getTarget(
				specialUnitsUID.SHIP_WEP_MINES_NUKE,
				{ tactic: 't1' },
				fleets
			);

			assert(isset(result, 'object'));
			assert(isset(result.fleet, 'string'));
			assert(isset(result.unit, 'string'));
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
					Object.assign({}, Units.specialUnits, expected)
				);

				done();
			});
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

			db.battleLog.save = () => {
				stepEnd();
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						stepEnd();
					},
				};
			};

			const battleArena = new Combat('f1');
			battleArena.atkFleets = [
				{ id: 'f1', name: 'Fleet 1' },
			];
			battleArena.atkUser = {
				id:'u2',
				name:'User 2',
			};
			battleArena.defUser = {
				id: 'u1',
				name:'User 1',
			};

			const action = {
				'message': 'test',
			};

			battleArena.battleLog.push(action);

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
		let globalFleetList = [
			{ id: 'f1', name: 'Fleet 1', endMoveTime: -1, tactic: 't1', ownerId: 'u2', orbitPosition: 1, units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
			{ id: 'f2', name: 'Fleet 2', endMoveTime: -1, tactic: 't2', ownerId: 'u2', orbitPosition: 1, units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
			{ id: 'f3', name: 'Fleet 3', endMoveTime: -1, tactic: '', ownerId: 'u2', orbitPosition: 1, units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
		];

		db.fleet.bulkUpdate = async() => { };
		db.unit.bulkUpdate = async() => { };

		let expectedLogs = {
			atk_user_id: 'u2',
			atk_user_name: 'User 2',

			atk_fleet_id: 'f3',
			atk_fleet_name: 'Fleet 3',

			defWins: false,

			def_user_id: 'u1',
			def_user_name: 'User 1',

			date: Date.now(),

			location: 'P1',

			logs: [],

			atkFleets: [],
			defFleets: [],
		}; // Real log content


		global.db.fleet.findByPosition = (pid, callback) => {
			callback(globalFleetList);
		};

		it('No defending units', (done) => {
			io.to = (sid) => {
				return {
					emit: (event, content) => {
						// Do nothing
					},
				};
			};

			db.battleLog.save = (logs) => {
				assert(typeof logs.date === 'object');
				assert(logs.date instanceof Date);

				expectedLogs.date = logs.date;
				expectedLogs.defWins = false;

				assert.deepEqual(logs, expectedLogs);

				done();
			};

			Combat.beginFight('-1', { address: 'P1' }, {
				id:'u2',
				name:'User 2',
			}, {
				id: 'u1',
				name:'User 1',
			}, 'f3');
		});

		it('Normal battle n°1', (done) => {
			globalFleetList.push(
				{ id: 'f4', name: 'Fleet 4', endMoveTime: -1, tactic: 't3', ownerId: 'u1', orbitPosition: 0, units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } }
			);
			globalFleetList.push(
				{ id: 'f5', name: 'Fleet 5', endMoveTime: -1, tactic: '', ownerId: 'u1', orbitPosition: 0, units: { 'u2': 56, 'u1': 54 } }
			);
			globalFleetList.push(
				{ id: 'f6', name: 'Fleet 6', endMoveTime: -1, tactic: 't3', ownerId: 'u1', orbitPosition: 0, units: { 'u1': 45 } }
			);

			const units = {
				[specialUnitsUID.SHIP_WEP_MINES]: Units.specialUnits[specialUnitsUID.SHIP_WEP_MINES],
				[specialUnitsUID.SHIP_WEP_MINES_NUKE]: Units.specialUnits[specialUnitsUID.SHIP_WEP_MINES_NUKE],
				'u1': unitsList[0],
				'u2': unitsList[1],
			};

			expectedLogs.atkFleets = [
				Fleets.extractPublicInfo(globalFleetList[2], 'User 2',  units),
				Fleets.extractPublicInfo(globalFleetList[0], 'User 2',  units),
				Fleets.extractPublicInfo(globalFleetList[1], 'User 2',  units),
			];

			expectedLogs.defFleets = [
				Fleets.extractPublicInfo(globalFleetList[3], 'User 1',  units),
				Fleets.extractPublicInfo(globalFleetList[4], 'User 1',  units),
				Fleets.extractPublicInfo(globalFleetList[5], 'User 1',  units),
			];

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						// Do nothing
					},
				};
			};

			db.battleLog.save = (logs) => {
				assert(typeof logs.date === 'object');
				assert(logs.date instanceof Date);
				assert(logs.logs.length > 0);

				expectedLogs.date = logs.date;
				expectedLogs.defWins = true;
				logs.logs = [];

				assert.deepEqual(logs, expectedLogs);

				done();
			};

			Combat.beginFight('-1', { address: 'P1' }, {
				id:'u2',
				name:'User 2',
			}, {
				id: 'u1',
				name:'User 1',
			}, 'f3');
		});

		it('Normal battle n°2', (done) => {
			globalFleetList = [
				{
					'id': '62716d0e-586d-11e9-86fb-b30be47b62e1',
					'name': 'Alpha',
					'ownerId': '80655df0-5775-11e9-99e3-8b79cb37567b',
					'position': '5-4-189-P6',
					'motherPlanetAddress': '4-5-659-P0',
					'orbitPosition': 1,
					'points': 18.8751,
					'endMoveTime': -1,
					'units': {
						'ee6b3f3e-5777-11e9-922f-d365dca99a37': 92,
						'eea78f48-5777-11e9-b8d8-5ff5b53be6fe': 18,
						'eecf7d5a-5777-11e9-9ab2-7b0982fa893d': 33,
						'eee15d72-5777-11e9-9314-3b4ca862fbb5': 201,
						'4c398c06-abe2-11e9-9e42-a794d80d06e4': 1
					},
					'population': 62917,
					'inBuilding': false,
					'motherPlanetId': 'ce2802b2-5776-11e9-88de-cf5ab62b4afb',
					'maxFuel': 58545000,
					'fuel': 56110700,
					'tactic': null
				},
				{
					'id': '6272e472-586d-11e9-b743-2bbdb01acdd3',
					'name': 'Phalanx',
					'ownerId': '80661808-5775-11e9-82cb-7b8f6e03caec',
					'position': '5-4-189-P6',
					'motherPlanetAddress': '5-4-189-P6',
					'orbitPosition': 0,
					'points': 58.344,
					'endMoveTime': '-1',
					'units': {
						'eeaa0034-5777-11e9-a8a8-236ac8528781': 50,
						'ee8b842e-5777-11e9-922f-ff30780dc725': 1300,
						'eee14472-5777-11e9-922f-bb01ac379634': 250,
						'eed49844-5777-11e9-90a3-fb96350cb065': 650,
						'eed4da70-5777-11e9-922f-2b0c40175cd7': 140
					},
					'population': 192565,
					'inBuilding': false,
					'motherPlanetId': 'cb795124-5776-11e9-88de-ef6bfaf53683',
					'maxFuel': 123000000,
					'fuel': 122562000,
					'tactic': '9923a48e-71ae-11e9-b1b6-0f0a67399da5',
					'unitsId': [
						'eeaa0034-5777-11e9-a8a8-236ac8528781',
						'ee8b842e-5777-11e9-922f-ff30780dc725',
						'eee14472-5777-11e9-922f-bb01ac379634',
						'eed49844-5777-11e9-90a3-fb96350cb065',
						'eed4da70-5777-11e9-922f-2b0c40175cd7'
					]
				}
			];

			const units = {'00000000-0000-0000-0000-000000000001':{'id':'00000000-0000-0000-0000-000000000001','note':0,'cost':[2,15,5,4,0.08,0],'parts':[{'type':'rocketLauncher','name':'rocket_1','tech':'explosive'}],'shipShape':'SHIP_WEP_MINES','shipType':'SHIP_DEF','oneShot':true},'00000000-0000-0000-0000-000000000002':{'id':'00000000-0000-0000-0000-000000000002','note':0,'cost':[15,25,6,15,0.2,0],'parts':[{'type':'rocketLauncher','name':'rocket_1','tech':'iem'}],'shipShape':'SHIP_WEP_MINES_IEM','shipType':'SHIP_DEF','oneShot':true},'00000000-0000-0000-0000-000000000003':{'id':'00000000-0000-0000-0000-000000000003','note':0,'cost':[4,20,7,6,0.1,0],'parts':[{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'}],'shipShape':'SHIP_WEP_MINES_NUKE','shipType':'SHIP_DEF','oneShot':true},'ee6b3f3e-5777-11e9-922f-d365dca99a37':{'id':'ee6b3f3e-5777-11e9-922f-d365dca99a37','name':'F-121','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'80655df0-5775-11e9-99e3-8b79cb37567b','cost':[58,34,47,22,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':86},'eea78f48-5777-11e9-b8d8-5ff5b53be6fe':{'id':'eea78f48-5777-11e9-b8d8-5ff5b53be6fe','name':'F-122','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'80655df0-5775-11e9-99e3-8b79cb37567b','cost':[58,35,46,22,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':12},'eecf7d5a-5777-11e9-9ab2-7b0982fa893d':{'id':'eecf7d5a-5777-11e9-9ab2-7b0982fa893d','name':'Cu-12010','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'80655df0-5775-11e9-99e3-8b79cb37567b','cost':[549,591,328,135,2.6,301],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'none'},{'type':'shield','name':'shield_2','tech':'none'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':31},'eee15d72-5777-11e9-9314-3b4ca862fbb5':{'id':'eee15d72-5777-11e9-9314-3b4ca862fbb5','name':'Bc-12011','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_SMALL','ownerId':'80655df0-5775-11e9-99e3-8b79cb37567b','cost':[480,501,271,103,2.32,241],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'rocketLauncher','name':'rocket_1','tech':'explosive'},{'type':'shield','name':'shield_1','tech':'none'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':196},'4c398c06-abe2-11e9-9e42-a794d80d06e4':{'id':'4c398c06-abe2-11e9-9e42-a794d80d06e4','name':'CV-2322221','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'80655df0-5775-11e9-99e3-8b79cb37567b','cost':[778,885,415,173,6.1,1361],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarDouble'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarDouble'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'wd'}],'armorType':'0','note':0,'owned':1},'eeaa0034-5777-11e9-a8a8-236ac8528781':{'id':'eeaa0034-5777-11e9-a8a8-236ac8528781','name':'Ark Royal CVL','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'80661808-5775-11e9-82cb-7b8f6e03caec','cost':[730,780,385,150,4.75,1301],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarSimple'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarSimple'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':50},'ee8b842e-5777-11e9-922f-ff30780dc725':{'id':'ee8b842e-5777-11e9-922f-ff30780dc725','name':'Viper MK1','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'80661808-5775-11e9-82cb-7b8f6e03caec','cost':[58,34,47,22,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':1291},'eee14472-5777-11e9-922f-bb01ac379634':{'id':'eee14472-5777-11e9-922f-bb01ac379634','name':'Kirov CA','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_SMALL','ownerId':'80661808-5775-11e9-82cb-7b8f6e03caec','cost':[613,632,317,132,2.9,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':250},'eed49844-5777-11e9-90a3-fb96350cb065':{'id':'eed49844-5777-11e9-90a3-fb96350cb065','name':'F-222','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'80661808-5775-11e9-82cb-7b8f6e03caec','cost':[91,54,77,35,0.66,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'cannon','name':'cannon_2','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':650},'eed4da70-5777-11e9-922f-2b0c40175cd7':{'id':'eed4da70-5777-11e9-922f-2b0c40175cd7','name':'KongoBC','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'80661808-5775-11e9-82cb-7b8f6e03caec','cost':[695,750,375,168,3.3,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'shield','name':'shield_2','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':140}};
			unitsList = Object.values(units);
			tactics = Object.values({'9923a48e-71ae-11e9-b1b6-0f0a67399da5':{'id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','name':'basique','owner':'80661808-5775-11e9-82cb-7b8f6e03caec','orders':[{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'ee8b842e-5777-11e9-922f-ff30780dc725','target':'SHIP_FIGHTER','priority':1},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eee14472-5777-11e9-922f-bb01ac379634','target':'SHIP_BATTLECRUISER','priority':1},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eed4da70-5777-11e9-922f-2b0c40175cd7','target':'SHIP_CUIRASSE','priority':1},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eed49844-5777-11e9-90a3-fb96350cb065','target':'SHIP_CUIRASSE','priority':1},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eed4da70-5777-11e9-922f-2b0c40175cd7','target':'SHIP_BATTLECRUISER','priority':2},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eed49844-5777-11e9-90a3-fb96350cb065','target':'SHIP_DEF','priority':2},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eee14472-5777-11e9-922f-bb01ac379634','target':'SHIP_CARRIER','priority':2}]}});

			expectedLogs.atkFleets = [
				Fleets.extractPublicInfo(globalFleetList[0], 'Elanis',  units),
			];

			expectedLogs.defFleets = [
				Fleets.extractPublicInfo(globalFleetList[1], 'Firestorm',  units),
			];

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						// Do nothing
					},
				};
			};

			db.battleLog.save = (logs) => {
				assert(typeof logs.date === 'object');
				assert(logs.date instanceof Date);
				assert(logs.logs.length > 0);

				logs.logs = [];

				expectedLogs = Object.assign(expectedLogs, {
					atk_user_id: '80655df0-5775-11e9-99e3-8b79cb37567b',
					atk_user_name: 'Elanis',

					atk_fleet_id: '62716d0e-586d-11e9-86fb-b30be47b62e1',
					atk_fleet_name: 'Alpha',

					defWins: true,

					def_user_id: '80661808-5775-11e9-82cb-7b8f6e03caec',
					def_user_name: 'Firestorm',

					date: logs.date,

					location: '5-4-189-P6',

					logs: [],
				});

				console.log(JSON.stringify(logs));
				console.log(JSON.stringify(expectedLogs));

				assert.deepEqual(logs, expectedLogs);

				done();
			};

			Combat.beginFight('-1', { address: '5-4-189-P6' }, {
				id:'80655df0-5775-11e9-99e3-8b79cb37567b',
				name:'Elanis',
			}, {
				id: '80661808-5775-11e9-82cb-7b8f6e03caec',
				name:'Firestorm',
			}, '62716d0e-586d-11e9-86fb-b30be47b62e1');
		});

		/*it('Normal battle n°3 (BDD)', (done) => {
			const tempDb = require('../database');

			tempDb.connect(async(ok, general) => {
				if(!general) { return; }
				if(!ok) {
					assert(false, 'Error while connecting to database');
				}

				globalFleetList = await tempDb.fleet.findAll();

				unitsList = await tempDb.unit.findAll();
				tactics = await tempDb.tactics.findAll();

				io.to = (sid) => {
					return {
						emit: (event, content) => {
							// Do nothing
						},
					};
				};

				const planetList = {};
				// TODO

				db.battleLog.save = (logs) => {
					assert(typeof logs.date === 'object');
					assert(logs.date instanceof Date);
					assert(logs.logs.length > 0);

					logs.logs = [];

					assert.deepEqual(logs, {
						atk_user_id: '80655df0-5775-11e9-99e3-8b79cb37567b',
						atk_user_name: 'Elanis',

						atk_fleet_id: '62716d0e-586d-11e9-86fb-b30be47b62e1',
						atk_fleet_name: 'Alpha',

						defWins: true,

						def_user_id: '80661808-5775-11e9-82cb-7b8f6e03caec',
						def_user_name: 'Firestorm',

						date: logs.date,

						location: '5-4-189-P6',

						logs: [],
					});

					done();
				};

				Combat.beginFight('-1', { address: '5-4-189-P6' }, {
					id:'80655df0-5775-11e9-99e3-8b79cb37567b',
					name:'Elanis',
				}, {
					id: '80661808-5775-11e9-82cb-7b8f6e03caec',
					name:'Firestorm',
				}, '62716d0e-586d-11e9-86fb-b30be47b62e1');
			});
		});*/
	});
});