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
	'shipShape': 'SHIP_CORVET_AEGIS',
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
	'shipShape': 'SHIP_BATTLECRUISER_ATRIOS',
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
},...Object.values(Units.specialUnits), {'id':'ee895564-5777-11e9-a8a8-03028c024814','name':'AG-1','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'80660e8a-5775-11e9-9959-e7363221e85e','cost':[25,35,42,23,0.4,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':6},{'id':'eed86136-5777-11e9-b8d8-13201bea7eee','name':'Corvus One','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'80658302-5775-11e9-86a1-7f506956c446','cost':[440,320,270,80,1.97,120],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_3','tech':'vsl'}],'armorType':'0','note':0,'owned':0},{'id':'eedafda6-5777-11e9-9ab2-5f066cbbf7cc','name':'BC-304 Croisseur','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'80660e8a-5775-11e9-9959-e7363221e85e','cost':[608,612,315,122,2.85,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':17},{'id':'eecf7d5a-5777-11e9-9ab2-7b0982fa893d','name':'Cu-12010','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'80655df0-5775-11e9-99e3-8b79cb37567b','cost':[549,591,328,135,2.6,301],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'none'},{'type':'shield','name':'shield_2','tech':'none'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':31},{'id':'eedf0cd4-5777-11e9-bb80-cb550c34b780','name':'BC-304 Transporteur','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'80660e8a-5775-11e9-9959-e7363221e85e','cost':[730,780,385,150,4.75,1301],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarSimple'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarSimple'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':4},{'id':'eecc5418-5777-11e9-b8d8-7b2f36e45aa1','name':'F-302 M','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'80660e8a-5775-11e9-9959-e7363221e85e','cost':[91,54,77,35,0.66,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'cannon','name':'cannon_2','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':160},{'id':'eea78f48-5777-11e9-b8d8-5ff5b53be6fe','name':'F-122','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'80655df0-5775-11e9-99e3-8b79cb37567b','cost':[58,35,46,22,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':12},{'id':'eeaa0034-5777-11e9-a8a8-236ac8528781','name':'Ark Royal CVL','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'80661808-5775-11e9-82cb-7b8f6e03caec','cost':[730,780,385,150,4.75,1301],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarSimple'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarSimple'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':50},{'id':'eeaa078c-5777-11e9-922f-ff6eaef4ad8a','name':'F-302 L','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'80660e8a-5775-11e9-9959-e7363221e85e','cost':[94,57,74,35,0.67,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'cannon','name':'cannon_2','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':160},{'id':'ee896d24-5777-11e9-b8d8-770cc9b523c4','name':'Sat Def L1','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'80658302-5775-11e9-86a1-7f506956c446','cost':[18,22,38,21,0.37,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':30},{'id':'ee6b3f3e-5777-11e9-922f-d365dca99a37','name':'F-121','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'80655df0-5775-11e9-99e3-8b79cb37567b','cost':[58,34,47,22,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':86},{'id':'eea42e70-5777-11e9-9438-b739d93b64e4','name':'X-Wing L2','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'80658302-5775-11e9-86a1-7f506956c446','cost':[59,37,47,22,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':60},{'id':'eea43686-5777-11e9-90a3-736c17007d16','name':'Def Electrique','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'80659eb4-5775-11e9-87ed-9f3369f548fc','cost':[14,16,43,20,0.35,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':30},{'id':'eed1acb0-5777-11e9-9438-07423891df72','name':'Millenium Falcon L2','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'80658302-5775-11e9-86a1-7f506956c446','cost':[98,65,76,36,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':30},{'id':'eed74f80-5777-11e9-a8a8-bf9964d313ba','name':'Triporter One','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'80658302-5775-11e9-86a1-7f506956c446','cost':[710,660,313,130,2.75,1281],'parts':[{'type':'hangar','name':'hangar_1','tech':'none'},{'type':'hangar','name':'hangar_2','tech':'none'},{'type':'hangar','name':'hangar_3','tech':'none'},{'type':'hangar','name':'hangar_4','tech':'none'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':0},{'id':'eedc8b6c-5777-11e9-9438-678752e23546','name':'Destroyer  One','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'80658302-5775-11e9-86a1-7f506956c446','cost':[595,690,335,158,3,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'shield','name':'shield_2','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':3},{'id':'eed49844-5777-11e9-90a3-fb96350cb065','name':'F-222','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'80661808-5775-11e9-82cb-7b8f6e03caec','cost':[91,54,77,35,0.66,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'cannon','name':'cannon_2','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':650},{'id':'eee13ab8-5777-11e9-90a3-23c5c7219682','name':'DeathStar One','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'80658302-5775-11e9-86a1-7f506956c446','cost':[608,612,315,122,2.85,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':2},{'id':'ee8b842e-5777-11e9-922f-ff30780dc725','name':'Viper MK1','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'80661808-5775-11e9-82cb-7b8f6e03caec','cost':[58,34,47,22,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':1291},{'id':'4c398c06-abe2-11e9-9e42-a794d80d06e4','name':'CV-2322221','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'80655df0-5775-11e9-99e3-8b79cb37567b','cost':[778,885,415,173,6.1,1361],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarDouble'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarDouble'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'wd'}],'armorType':'0','note':0,'owned':1},{'id':'6b035198-8212-11e9-a685-97ba9240af25','name':'Hunter X1','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'8065c2b8-5775-11e9-b446-cf8ff69571eb','cost':[59,37,47,22,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':10},{'id':'eed4da70-5777-11e9-922f-2b0c40175cd7','name':'Kongo BC','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'80661808-5775-11e9-82cb-7b8f6e03caec','cost':[695,750,375,168,3.3,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'shield','name':'shield_2','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':140},{'id':'eee15d72-5777-11e9-9314-3b4ca862fbb5','name':'Bc-12011','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'80655df0-5775-11e9-99e3-8b79cb37567b','cost':[480,501,271,103,2.32,241],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'rocketLauncher','name':'rocket_1','tech':'explosive'},{'type':'shield','name':'shield_1','tech':'none'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':196},{'id':'eee16ad8-5777-11e9-ae80-67804909a59f','name':'UnitTest Unit','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'80655df0-5775-11e9-99e3-8b79cb37567b','cost':[58,34,47,22,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':15},{'id':'eee14472-5777-11e9-922f-bb01ac379634','name':'Kirov CA','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'80661808-5775-11e9-82cb-7b8f6e03caec','cost':[613,632,317,132,2.9,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':250}];
const units = {};
for(const unit of unitsList) {
	units[unit.id] = unit;
}

describe('• Combat', () => {
	db.tactics.find = (id, callback) => {
		callback(tactics.filter((t) => t.id === id)[0]);
	};

	db.unit.findByOwner = (id, callback) => {
		callback(unitsList);
	};

	const findPlayer = async(id) => {
		return [
			{ id: 'u1', name: 'User 1', research: {} },
			{ id: 'u2', name: 'User 2', research: {} },
			{ id: 'u3', name: 'User 3', research: {} },
			{ id: 'u4', name: 'User 4', research: {} },
			{ id: 'u5', name: 'User 5', research: {} },
			{ id: '80655df0-5775-11e9-99e3-8b79cb37567b', name: 'Elanis', research: { prop_manoeuvre: -1 } },
			{ id: '80661808-5775-11e9-82cb-7b8f6e03caec', name: 'Firestorm', research: { prop_manoeuvre: -1, prop_advManoeuvre: -1 } },
			{ id: '80658302-5775-11e9-86a1-7f506956c446', name: 'junkyfox', research: { prop_manoeuvre: -1, prop_advManoeuvre: 1 } },
			{ id: '80660e8a-5775-11e9-9959-e7363221e85e', name: 'damlanil', research: { prop_manoeuvre: 1 } },
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
		battleArena.unitCache = units;

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
				battleArena.findUnit('fdgdfgfdg', fleets),
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
					{ unit: 'u1', priority: 7, target: 'SHIP_DEF' },
					{ unit: 'u1', priority: 3, target: 'SHIP_CORVET' },
					{ unit: 'u2', priority: 1, target: 'SHIP_CORVET' },
				],
			},
		};

		const fleets = [
			{ id: 'f1', units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: [specialUnitsUID.SHIP_WEP_MINES] },
			{ id: 'f2', units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: [specialUnitsUID.SHIP_WEP_MINES_NUKE,specialUnitsUID.SHIP_WEP_MINES] },
			{ id: 'f3', units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, unitsId: ['u1',specialUnitsUID.SHIP_WEP_MINES] },
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
				() => {
					assert(false);
					done();
				}, 2500
			);


			battleArena.getAllUnits(() => {
				clearTimeout(timeout);

				assert.deepEqual(
					battleArena.unitCache,
					Object.assign({}, units)
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
				() => {
					assert(false, 'Logs are not saved/transmitted to client.');
					done();
				}, 500
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
			battleArena.playerList = {
				u2: battleArena.atkUser,
				u1: battleArena.defUser,
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
			{ id: 'f1', name: 'Fleet 1', endMoveTime: null, population: 0, points: 0, tactic: 't1', ownerId: 'u2', orbitPosition: 1, units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
			{ id: 'f2', name: 'Fleet 2', endMoveTime: null, population: 0, points: 0, tactic: 't2', ownerId: 'u2', orbitPosition: 1, units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
			{ id: 'f3', name: 'Fleet 3', endMoveTime: null, population: 0, points: 0, tactic: '', ownerId: 'u2', orbitPosition: 1, units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } },
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

			date: new Date(),

			location: 'P1',

			logs: [],

			atkFleets: [],
			defFleets: [],
		}; // Real log content


		global.db.fleet.findByPosition = (pid) => {
			return globalFleetList;
		};

		it('No defending units', (done) => {
			db.player.find = findPlayer;

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

				expectedLogs.date = logs.date;
				expectedLogs.defWins = false;

				for(const fleet of [...logs.finalAtkFleets, ...logs.finalDefenseFleets]) {
					assert(!Number.isNaN(fleet.population));
					assert(!Number.isNaN(fleet.points));
				}

				delete logs.finalAtkFleets;
				delete logs.finalDefenseFleets;

				for(const unit in logs.finalUnitCache) {
					assert(!Number.isNaN(logs.finalUnitCache[unit].owned));
				}

				delete logs.finalUnitCache;

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
				{ id: 'f4', name: 'Fleet 4', endMoveTime: null, population: 0, points: 0, tactic: 't3', ownerId: 'u1', orbitPosition: 0, units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 } }
			);
			globalFleetList.push(
				{ id: 'f5', name: 'Fleet 5', endMoveTime: null, population: 0, points: 0, tactic: '', ownerId: 'u1', orbitPosition: 0, units: { 'u2': 56, 'u1': 54 } }
			);
			globalFleetList.push(
				{ id: 'f6', name: 'Fleet 6', endMoveTime: null, population: 0, points: 0, tactic: 't3', ownerId: 'u1', orbitPosition: 0, units: { 'u1': 45 } }
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

				for(const fleet of [...logs.finalAtkFleets, ...logs.finalDefenseFleets]) {
					assert(!Number.isNaN(fleet.population));
					assert(!Number.isNaN(fleet.points));
				}

				delete logs.finalAtkFleets;
				delete logs.finalDefenseFleets;

				for(const unit in logs.finalUnitCache) {
					assert(!Number.isNaN(logs.finalUnitCache[unit].owned));
				}

				delete logs.finalUnitCache;

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
					'endMoveTime': null,
					'units': {
						'ee6b3f3e-5777-11e9-922f-d365dca99a37': 92,
						'eea78f48-5777-11e9-b8d8-5ff5b53be6fe': 18,
						'eecf7d5a-5777-11e9-9ab2-7b0982fa893d': 33,
						'eee15d72-5777-11e9-9314-3b4ca862fbb5': 201,
						'4c398c06-abe2-11e9-9e42-a794d80d06e4': 1,
					},
					'population': 62917,
					'inBuilding': false,
					'motherPlanetId': 'ce2802b2-5776-11e9-88de-cf5ab62b4afb',
					'maxFuel': 58545000,
					'fuel': 56110700,
					'tactic': null,
				},
				{
					'id': '6272e472-586d-11e9-b743-2bbdb01acdd3',
					'name': 'Phalanx',
					'ownerId': '80661808-5775-11e9-82cb-7b8f6e03caec',
					'position': '5-4-189-P6',
					'motherPlanetAddress': '5-4-189-P6',
					'orbitPosition': 0,
					'points': 58.344,
					'endMoveTime': null,
					'units': {
						'eeaa0034-5777-11e9-a8a8-236ac8528781': 50,
						'ee8b842e-5777-11e9-922f-ff30780dc725': 1300,
						'eee14472-5777-11e9-922f-bb01ac379634': 250,
						'eed49844-5777-11e9-90a3-fb96350cb065': 650,
						'eed4da70-5777-11e9-922f-2b0c40175cd7': 140,
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
						'eed4da70-5777-11e9-922f-2b0c40175cd7',
					],
				},
			];

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

				for(const fleet of [...logs.finalAtkFleets, ...logs.finalDefenseFleets]) {
					assert(!Number.isNaN(fleet.population));
					assert(!Number.isNaN(fleet.points));
				}

				delete logs.finalAtkFleets;
				delete logs.finalDefenseFleets;

				for(const unit in logs.finalUnitCache) {
					assert(!Number.isNaN(logs.finalUnitCache[unit].owned));
				}

				delete logs.finalUnitCache;

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

		it('Normal battle n°3', (done) => {
			globalFleetList = [
				{
					'id': '62716d0e-586d-11e9-86fb-b30be47b62e1',
					'name': 'Alpha',
					'ownerId': '80655df0-5775-11e9-99e3-8b79cb37567b',
					'position': '5-4-189-P6',
					'motherPlanetAddress': '4-5-659-P0',
					'orbitPosition': 1,
					'points': 18.8751,
					'endMoveTime': null,
					'units': {
						'ee6b3f3e-5777-11e9-922f-d365dca99a37': 92,
						'eea78f48-5777-11e9-b8d8-5ff5b53be6fe': 18,
						'eecf7d5a-5777-11e9-9ab2-7b0982fa893d': 33,
						'eee15d72-5777-11e9-9314-3b4ca862fbb5': 201,
						'4c398c06-abe2-11e9-9e42-a794d80d06e4': 1,
					},
					'population': 62917,
					'inBuilding': false,
					'motherPlanetId': 'ce2802b2-5776-11e9-88de-cf5ab62b4afb',
					'maxFuel': 58545000,
					'fuel': 56110700,
					'tactic': null,
				},
				{
					'id':'627299cc-586d-11e9-a3e4-1b130d0eb996',
					'name':'SHIP_DEF',
					'ownerId':'80658302-5775-11e9-86a1-7f506956c446',
					'endMoveTime': null,
					'population': 0,
					'points': 0,
					'orbitPosition': 0,
					'units': {
						'00000000-0000-0000-0000-000000000001':8,
						'00000000-0000-0000-0000-000000000002':1,
						'ee896d24-5777-11e9-b8d8-770cc9b523c4':30,
					},
				},
				{
					'id':'6276d5fa-586d-11e9-94f1-4f74a65f2491',
					'name':'Fleet One',
					'ownerId':'80658302-5775-11e9-86a1-7f506956c446',
					'endMoveTime': null,
					'population': 0,
					'points': 0,
					'orbitPosition': 0,
					'units': {
						'eedc8b6c-5777-11e9-9438-678752e23546':3,
						'eee13ab8-5777-11e9-90a3-23c5c7219682':2,
						'eea42e70-5777-11e9-9438-b739d93b64e4':60,
						'eed1acb0-5777-11e9-9438-07423891df72':30,
					},
				},
			];

			tactics = [];

			expectedLogs.atkFleets = [
				Fleets.extractPublicInfo(globalFleetList[0], 'Elanis',  units),
			];

			expectedLogs.defFleets = [
				Fleets.extractPublicInfo(globalFleetList[1], 'junkyfox',  units),
				Fleets.extractPublicInfo(globalFleetList[2], 'junkyfox',  units),
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

					defWins: false,

					def_user_id: '80658302-5775-11e9-86a1-7f506956c446',
					def_user_name: 'junkyfox',

					date: logs.date,

					location: '5-4-2630-P2',

					logs: [],
				});

				for(const fleet of [...logs.finalAtkFleets, ...logs.finalDefenseFleets]) {
					if(Number.isNaN(fleet.population)) {
						console.log(fleet);
					}

					assert(!Number.isNaN(fleet.population));
					assert(!Number.isNaN(fleet.points));
				}

				delete logs.finalAtkFleets;
				delete logs.finalDefenseFleets;

				for(const unit in logs.finalUnitCache) {
					assert(!Number.isNaN(logs.finalUnitCache[unit].owned));
				}

				delete logs.finalUnitCache;

				assert.deepEqual(logs, expectedLogs);

				done();
			};

			Combat.beginFight('-1', { address: '5-4-2630-P2' }, {
				id:'80655df0-5775-11e9-99e3-8b79cb37567b',
				name:'Elanis',
			}, {
				id: '80658302-5775-11e9-86a1-7f506956c446',
				name:'junkyfox',
			}, '62716d0e-586d-11e9-86fb-b30be47b62e1');
		});

		it('Normal battle n°4', (done) => {
			globalFleetList = [
				{
					'id':'6279b126-586d-11e9-a633-0723427ef961',
					'name':'Flotte I',
					'owner':'damlanil',
					'orbitPosition': 1,
					'position': '5-4-189-P6',
					'ownerId': '80660e8a-5775-11e9-9959-e7363221e85e',
					'endMoveTime': null,
					'population': 0,
					'points': 0,
					'units': {
						'eecc5418-5777-11e9-b8d8-7b2f36e45aa1':160,
						'eeaa078c-5777-11e9-922f-ff6eaef4ad8a':160,
						'eedf0cd4-5777-11e9-bb80-cb550c34b780':4,
						'eedafda6-5777-11e9-9ab2-5f066cbbf7cc':18,
					},
				},
				{
					'id':'6272e472-586d-11e9-b743-2bbdb01acdd3',
					'name':'Phalanx',
					'owner':'Firestorm',
					'orbitPosition': 0,
					'position': '5-4-189-P6',
					'ownerId': '80661808-5775-11e9-82cb-7b8f6e03caec',
					'endMoveTime': null,
					'population': 0,
					'points': 0,
					'units': {
						'eeaa0034-5777-11e9-a8a8-236ac8528781':50,
						'ee8b842e-5777-11e9-922f-ff30780dc725':1300,
						'eee14472-5777-11e9-922f-bb01ac379634':250,
						'eed49844-5777-11e9-90a3-fb96350cb065':650,
						'eed4da70-5777-11e9-922f-2b0c40175cd7':140,
					},
				},
			];

			tactics = [];

			expectedLogs.atkFleets = [
				Fleets.extractPublicInfo(globalFleetList[0], 'damlanil',  units),
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
					atk_user_id: '80660e8a-5775-11e9-9959-e7363221e85e',
					atk_user_name: 'damlanil',

					atk_fleet_id: '6279b126-586d-11e9-a633-0723427ef961',
					atk_fleet_name: 'Flotte I',

					defWins: true,

					def_user_id: '80661808-5775-11e9-82cb-7b8f6e03caec',
					def_user_name: 'Firestorm',

					date: logs.date,

					location: '5-4-189-P6',

					logs: [],
				});

				for(const fleet of [...logs.finalAtkFleets, ...logs.finalDefenseFleets]) {
					assert(!Number.isNaN(fleet.population));
					assert(!Number.isNaN(fleet.points));
				}

				delete logs.finalAtkFleets;
				delete logs.finalDefenseFleets;

				for(const unit in logs.finalUnitCache) {
					assert(!Number.isNaN(logs.finalUnitCache[unit].owned));
				}

				delete logs.finalUnitCache;

				assert.deepEqual(logs, expectedLogs);

				done();
			};

			Combat.beginFight('-1', { address: '5-4-189-P6' }, {
				id:'80660e8a-5775-11e9-9959-e7363221e85e',
				name:'damlanil',
			}, {
				id: '80661808-5775-11e9-82cb-7b8f6e03caec',
				name:'Firestorm',
			}, '6279b126-586d-11e9-a633-0723427ef961');
		});

		it('Normal battle n°5', (done) => {
			globalFleetList = [
				{
					'id': '6272e472-586d-11e9-b743-2bbdb01acdd3',
					'name': 'Phalanx',
					'owner': 'Firestorm',
					'ownerId': '80661808-5775-11e9-82cb-7b8f6e03caec',
					'endMoveTime': null,
					'population': 0,
					'points': 0,
					'orbitPosition': 1,
					'position': '4-5-2349-P1',
					'units': {
						'eeaa0034-5777-11e9-a8a8-236ac8528781': 27,
						'ee8b842e-5777-11e9-922f-ff30780dc725': 1214,
						'eee14472-5777-11e9-922f-bb01ac379634': 219,
						'eed49844-5777-11e9-90a3-fb96350cb065': 547,
						'eed4da70-5777-11e9-922f-2b0c40175cd7': 132,
					},
				},
				{
					'id': '62728108-586d-11e9-a757-2b7974f9aa17',
					'name': 'SHIP_DEF',
					'owner': 'damlanil',
					'ownerId': '80660e8a-5775-11e9-9959-e7363221e85e',
					'endMoveTime': null,
					'population': 0,
					'points': 0,
					'orbitPosition': 0,
					'position': '4-5-2349-P1',
					'units': {
						'ee895564-5777-11e9-a8a8-03028c024814': 6,
					},
				},
			];

			tactics = [];

			expectedLogs.atkFleets = [
				Fleets.extractPublicInfo(globalFleetList[0], 'Firestorm',  units),
			];

			expectedLogs.defFleets = [
				Fleets.extractPublicInfo(globalFleetList[1], 'damlanil',  units),
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
					atk_user_id: '80661808-5775-11e9-82cb-7b8f6e03caec',
					atk_user_name: 'Firestorm',

					atk_fleet_id: '6272e472-586d-11e9-b743-2bbdb01acdd3',
					atk_fleet_name: 'Phalanx',

					defWins: false,

					def_user_id: '80660e8a-5775-11e9-9959-e7363221e85e',
					def_user_name: 'damlanil',

					date: logs.date,

					location: '4-5-2349-P1',

					logs: [],
				});

				for(const fleet of [...logs.finalAtkFleets, ...logs.finalDefenseFleets]) {
					assert(!Number.isNaN(fleet.population));
					assert(!Number.isNaN(fleet.points));
				}

				delete logs.finalAtkFleets;
				delete logs.finalDefenseFleets;

				for(const unit in logs.finalUnitCache) {
					assert(!Number.isNaN(logs.finalUnitCache[unit].owned));
				}

				delete logs.finalUnitCache;

				assert.deepEqual(logs, expectedLogs);

				done();
			};

			Combat.beginFight('-1', { address: '4-5-2349-P1' }, {
				id:'80661808-5775-11e9-82cb-7b8f6e03caec',
				name:'Firestorm',
			}, {
				id: '80660e8a-5775-11e9-9959-e7363221e85e',
				name:'damlanil',
			}, '6272e472-586d-11e9-b743-2bbdb01acdd3');
		});
	});

	describe('getAttacksAgainstPlayer()', () => {
		it('Should work', (done) => {
			db.getAttacksAgainstPlayer = async(plyId) => {
				return [
					{ id: 'f1', name: 'fleet1', endMoveTime: Date.now() },
					{ id: 'f2', name: 'fleet2', endMoveTime: Date.now() - 10000 },
				];
			};

			let doneTimes = 0;

			io.to = (sid) => {
				return {
					emit: (eventType, content) => {
						if(eventType === 'notification') {
							assert(content.type === 'attack');

							assert(content.args.arriveTime instanceof Date);

							delete content.args.arriveTime;

							if(content.args.id === 'f1') {
								assert.deepEqual(content.args, { id: 'f1', name: 'fleet1' });
							} else if(content.args.id === 'f2') {
								assert.deepEqual(content.args, { id: 'f2', name: 'fleet2' });
							} else {
								assert(false, 'invalid fleet id');
							}

							doneTimes++;
							if(doneTimes === 2) {
								done();
							}
						}
					},
				};
			};

			Combat.getAttacksAgainstPlayer('plyId', 'plySid');
		});
	});
});
