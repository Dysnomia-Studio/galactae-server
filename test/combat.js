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
global.units = {};
function rebuildUnitsIndex() {
	units = {};

	for(const unit of unitsList) {
		units[unit.id] = unit;
	}
}
rebuildUnitsIndex();


describe('• Combat', () => {
	db.tactics.find = (id) => {
		return tactics.filter((t) => t.id === id)[0];
	};

	db.unit.findByOwner = (id) => {
		return unitsList;//.filter((u) => !u.ownerId || u.ownerId === id);
	};

	db.conquest.abortAllMilitaryConquest = () => { };

	db.conquest.getActiveConquestsByPlayer = async() => [];
	db.conquest.getActiveConquestsOnPlanet = async() => [];
	db.conquest.getConquestsByPlayer = () => [];
	db.planet.findbyAddress = () => { return { owner: 'u1' }; };

	const findPlayer = (id) => {
		return [
			{ id: 'u1', name: 'User 1', planetlist: ['p1'], research: {} },
			{ id: 'u2', name: 'User 2', planetlist: ['p1'], research: {} },
			{ id: 'u3', name: 'User 3', planetlist: ['p1'], research: {} },
			{ id: 'u4', name: 'User 4', planetlist: ['p1'], research: {} },
			{ id: 'u5', name: 'User 5', planetlist: ['p1'], research: {} },
			{ id: '80655df0-5775-11e9-99e3-8b79cb37567b', name: 'Elanis', planetlist: ['p1'], research: { prop_manoeuvre: -1 } },
			{ id: '80661808-5775-11e9-82cb-7b8f6e03caec', name: 'Firestorm', planetlist: ['p1'], research: { prop_manoeuvre: -1, prop_advManoeuvre: -1 } },
			{ id: '80658302-5775-11e9-86a1-7f506956c446', name: 'junkyfox', planetlist: ['p1'], research: { prop_manoeuvre: -1, prop_advManoeuvre: 1 } },
			{ id: '80660e8a-5775-11e9-9959-e7363221e85e', name: 'damlanil', planetlist: ['p1'], research: { prop_manoeuvre: 1 } },
			{ id: '00000000-0000-0000-0000-000000000001', name: 'System', planetlist: ['p1'], research: {} },
			{ id: '00000000-0000-0000-0000-000000000002', name: 'System', planetlist: ['p1'], research: {} },
			{ id: '00000000-0000-0000-0000-000000000003', name: 'System', planetlist: ['p1'], research: {} },
			{ id: '7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa', name: 'Baltazar', planetlist: ['p1', 'p1', 'p1', 'p1', 'p1', 'p1'], research: { prop_manoeuvre: -1, prop_advManoeuvre: 1 } },
			{ id: '13f030b0-acec-11e9-9f3b-33409afd4da4', name: 'Evoknn', planetlist: ['p1'], research: { prop_manoeuvre: -1, prop_advManoeuvre: 1 } },
			{ id: '77c9c5c8-7a24-11ea-b422-e3beacbb5f86', name: '737373elj', planetlist: ['p1'], research: { prop_manoeuvre: -1, prop_advManoeuvre: 1 } },
			{ id: '7f37d8ba-8482-11e9-b379-0303a5a9b21b', name: 'Skodt', planetlist: ['p1'], research: { prop_manoeuvre: -1, prop_advManoeuvre: 1 } },
			{ id: 'c8160ce6-8473-11e9-a63c-e76275663acb', name: 'Elanis', planetlist: ['p1'], research: { prop_manoeuvre: -1, prop_advManoeuvre: 1 } },
			{ id: '0c750d1a-8474-11e9-9b8e-172be54d7e41', name: 'damlanil', planetlist: ['p1'], research: { prop_manoeuvre: -1, prop_advManoeuvre: 1 } },
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
		it('getAllTactics(_)', async() => {
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

			await battleArena.getAllTactics();

			assert.deepEqual(
				battleArena.tacticCache,
				expected
			);
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
				{ id: 'f1', name: 'Fleet 1', maxFuel: 0, fuel: 0 },
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
		db.fleet.bulkUpdate = async() => { };
		db.unit.bulkUpdate = async() => { };

		let globalFleetList;

		global.db.fleet.findByPosition = (pid) => {
			return globalFleetList.filter((fleet) => !fleet.position || fleet.position === pid);
		};

		global.db.fleet.find = (id) => {
			return {};
		};

		const expectedLogs = {
			logs: [],

			atkFleets: [],
			defFleets: [],
		}; // Real log content

		let lastSimulationFleetList = [];

		const simulations = {
			/**
			 * No defending units
			 */
			'No defending units': {
				fleets: [
					{ id: 'f3', name: 'Fleet 3', endMoveTime: null, population: 0, points: 0, tactic: '', ownerId: 'u2', orbitPosition: 1, units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, maxFuel: 0, fuel: 0 },
					{ id: 'f1', name: 'Fleet 1', endMoveTime: null, population: 0, points: 0, tactic: 't1', ownerId: 'u2', orbitPosition: 1, units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 }, maxFuel: 0, fuel: 0 },
					{ id: 'f2', name: 'Fleet 2', endMoveTime: null, population: 0, points: 0, tactic: 't2', ownerId: 'u2', orbitPosition: 1, units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, maxFuel: 0, fuel: 0 },
				],
				defWins: false,
				planet: { address: 'P1' },
				atkUser: { id: 'u2', name: 'User 2' },
				defUser: { id: 'u1', name: 'User 1' },
				atkFleetId: 'f3',
			},
			/**
			 * Normal battle n°1
			 */
			'Normal battle n°1': {
				fleets: [
					{ id: 'f3', name: 'Fleet 3', endMoveTime: null, population: 0, points: 0, tactic: '', ownerId: 'u2', orbitPosition: 1, units: { 'u1': 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, maxFuel: 0, fuel: 0 },
					{ id: 'f1', name: 'Fleet 1', endMoveTime: null, population: 0, points: 0, tactic: 't1', ownerId: 'u2', orbitPosition: 1, units: { [specialUnitsUID.SHIP_WEP_MINES]: 42 }, maxFuel: 0, fuel: 0 },
					{ id: 'f2', name: 'Fleet 2', endMoveTime: null, population: 0, points: 0, tactic: 't2', ownerId: 'u2', orbitPosition: 1, units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, maxFuel: 0, fuel: 0 },
					{ id: 'f4', name: 'Fleet 4', endMoveTime: null, population: 0, points: 0, tactic: 't3', ownerId: 'u1', orbitPosition: 0, units: { [specialUnitsUID.SHIP_WEP_MINES_NUKE]: 123, [specialUnitsUID.SHIP_WEP_MINES]: 42 }, maxFuel: 0, fuel: 0 },
					{ id: 'f5', name: 'Fleet 5', endMoveTime: null, population: 0, points: 0, tactic: '', ownerId: 'u1', orbitPosition: 0, units: { 'u2': 56, 'u1': 54 }, maxFuel: 0, fuel: 0 },
					{ id: 'f6', name: 'Fleet 6', endMoveTime: null, population: 0, points: 0, tactic: 't3', ownerId: 'u1', orbitPosition: 0, units: { 'u1': 45 }, maxFuel: 0, fuel: 0 },
				],
				defWins: true,
				planet: { address: '5-4-189-P6' },
				atkUser: { id: 'u2', name: 'User 2' },
				defUser: { id: 'u1', name: 'User 1' },
				atkFleetId: 'f3',
			},
			/**
			 * Normal battle n°2
			 */
			'Normal battle n°2': {
				fleets: [
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
				],
				tactics: Object.values({'9923a48e-71ae-11e9-b1b6-0f0a67399da5':{'id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','name':'basique','owner':'80661808-5775-11e9-82cb-7b8f6e03caec','orders':[{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'ee8b842e-5777-11e9-922f-ff30780dc725','target':'SHIP_FIGHTER','priority':1},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eee14472-5777-11e9-922f-bb01ac379634','target':'SHIP_BATTLECRUISER','priority':1},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eed4da70-5777-11e9-922f-2b0c40175cd7','target':'SHIP_CUIRASSE','priority':1},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eed49844-5777-11e9-90a3-fb96350cb065','target':'SHIP_CUIRASSE','priority':1},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eed4da70-5777-11e9-922f-2b0c40175cd7','target':'SHIP_BATTLECRUISER','priority':2},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eed49844-5777-11e9-90a3-fb96350cb065','target':'SHIP_DEF','priority':2},{'tactic_id':'9923a48e-71ae-11e9-b1b6-0f0a67399da5','unit':'eee14472-5777-11e9-922f-bb01ac379634','target':'SHIP_CARRIER','priority':2}]}}),
				defWins: true,
				planet: { address: '5-4-189-P6' },
				atkUser: findPlayer('80655df0-5775-11e9-99e3-8b79cb37567b'),
				defUser: findPlayer('80661808-5775-11e9-82cb-7b8f6e03caec'),
				atkFleetId: '62716d0e-586d-11e9-86fb-b30be47b62e1',
			},
			/**
			 * Normal battle n°3
			 */
			'Normal battle n°3': {
				fleets: [
					{
						'id': '62716d0e-586d-11e9-86fb-b30be47b62e1',
						'name': 'Alpha',
						'ownerId': '80655df0-5775-11e9-99e3-8b79cb37567b',
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
				],
				tactics: [],
				defWins: false,
				planet: { address: '5-4-2630-P2' },
				atkUser: findPlayer('80655df0-5775-11e9-99e3-8b79cb37567b'),
				defUser: findPlayer('80658302-5775-11e9-86a1-7f506956c446'),
				atkFleetId: '62716d0e-586d-11e9-86fb-b30be47b62e1',
			},
			/**
			 * Normal battle n°4:
			 */
			'Normal battle n°4': {
				fleets: [
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
				],
				tactics: [],
				defWins: true,
				planet: { address: '5-4-189-P6' },
				atkUser: findPlayer('80660e8a-5775-11e9-9959-e7363221e85e'),
				defUser: findPlayer('80661808-5775-11e9-82cb-7b8f6e03caec'),
				atkFleetId: '6279b126-586d-11e9-a633-0723427ef961',
			},
			/**
			 * Normal battle n°5:
			 */
			'Normal battle n°5': {
				fleets: [
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
				],
				tactics: [],
				defWins: false,
				planet: { address: '4-5-2349-P1' },
				atkUser: findPlayer('80661808-5775-11e9-82cb-7b8f6e03caec'),
				defUser: findPlayer('80660e8a-5775-11e9-9959-e7363221e85e'),
				atkFleetId: '6272e472-586d-11e9-b743-2bbdb01acdd3',
			},
			/**
			 * Normal battle n°6:
			 */
			'Normal battle n°6': {
				fleets: [{'id':'13afce10-9cfe-11e9-b7ba-b3706d4e424e','name':'Test','ownerId':'ba54617a-868f-11e9-9deb-df990a64fc6a','position':'5-4-818-P5','motherPlanetAddress':'5-4-818-P5','orbitPosition':0,'endMoveTime':null,'units':{'51fb2ee0-998d-11e9-b825-db21c6cacda7':3,'30693340-9cfc-11e9-b7ba-f3942e4582c5':3,'044d0908-a337-11e9-b7ba-3f7543c3fda6':1},'population':351,'inBuilding':false,'maxFuel':270000,'fuel':77439,'tactic':null,'points':'0'},{'id':'82095d80-a30d-11e9-b7ba-3bdc56a721d6','name':'Exploration','ownerId':'436e2930-8615-11e9-b1a6-5fa9d38289ff','position':'5-4-2725-P0','motherPlanetAddress':'5-4-2725-P0','orbitPosition':0,'endMoveTime':null,'units':{'130b31b6-a2f8-11e9-b7ba-d3004226d1bb':1},'population':5,'inBuilding':false,'maxFuel':5000,'fuel':5000,'tactic':null,'points':'0'},{'id':'444b730a-8f78-11e9-82ab-476df0733baa','name':'Flotte1','ownerId':'31bf4a78-8a77-11e9-ac88-a7fded6aced5','position':'4-5-1680-P0','motherPlanetAddress':'4-5-1680-P0','orbitPosition':0,'endMoveTime':null,'units':{'2b60e85c-8f78-11e9-82ab-ab8bbaade2cd':2},'population':10,'inBuilding':false,'maxFuel':10000,'fuel':10000,'tactic':null,'points':'0'},{'id':'1caf0d2c-f48e-11e9-b7a5-23d4934b25cf','name':'103','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','position':'4-4-1459-P0','motherPlanetAddress':'4-4-1459-P0','orbitPosition':0,'endMoveTime':null,'units':{'0f4342de-f48e-11e9-b7a5-bfbdc92ac108':1},'population':120,'inBuilding':false,'maxFuel':80000,'fuel':80000,'tactic':null,'points':'0'},{'id':'c5ca0348-a3d1-11e9-b7ba-3b8bb3e526c7','name':'Flotte','ownerId':'b4da4388-8d04-11e9-9ee9-efdf3f501bcc','position':'5-4-1313-P1','motherPlanetAddress':'5-4-1313-P1','orbitPosition':0,'endMoveTime':null,'units':{'bd709680-a3d1-11e9-b7ba-bf177e581c28':90},'population':450,'inBuilding':false,'maxFuel':450000,'fuel':0,'tactic':null,'points':'0'},{'id':'9faf2000-9317-11e9-b3b5-bf45d8768a62','name':'SHIP_DEF','ownerId':'ba54617a-868f-11e9-9deb-df990a64fc6a','position':'5-4-818-P5','motherPlanetAddress':'5-4-818-P5','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES':10,'f689a7d2-93d6-11e9-b3b5-b7890ed48133':1},'population':7,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'379df448-a3c8-11e9-b7ba-3b6a3d5f87d1','name':'d','ownerId':'436e2930-8615-11e9-b1a6-5fa9d38289ff','position':'5-4-2725-P0','motherPlanetAddress':'5-4-2725-P0','orbitPosition':0,'endMoveTime':null,'units':{'080715c2-a317-11e9-b7ba-cbb7ebaadc7a':2},'population':80,'inBuilding':false,'maxFuel':160000,'fuel':42910.4,'tactic':null,'points':'0'},{'id':'07244386-e2a6-11e9-8839-d3588c75dca0','name':'Swarm101','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','position':'4-4-1459-P0','motherPlanetAddress':'4-4-1459-P0','orbitPosition':0,'endMoveTime':null,'units':{'d9428310-e2a5-11e9-8839-bbecd835a0a1':6},'population':240,'inBuilding':false,'maxFuel':480000,'fuel':480000,'tactic':null,'points':'0'},{'id':'e7f34a54-f284-11e9-b7a5-ff8843515a44','name':'SHIP_DEF','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','position':'4-4-516-P5','motherPlanetAddress':'4-4-516-P5','orbitPosition':0,'endMoveTime':null,'units':{'9948bb00-f284-11e9-b7a5-6b9521d935ca':100,'SHIP_WEP_MINES':45,'SHIP_WEP_MINES_NUKE':45},'population':99,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':'9991eea8-f28c-11e9-b7a5-8f13ba8d11ef','points':'0'},{'id':'691db600-903d-11e9-b3b5-177f2431a6d2','name':'F-Ch-01','ownerId':'294dc758-8490-11e9-aa57-57c1056dcf5c','position':'5-4-94-P4','motherPlanetAddress':'5-4-94-P4','orbitPosition':0,'endMoveTime':null,'units':{'4b34dfe2-903d-11e9-b3b5-877efcd0fa2e':1,'3b47f768-903d-11e9-b3b5-2f66634601a0':3},'population':25,'inBuilding':false,'maxFuel':25000,'fuel':325,'tactic':'08c41190-9048-11e9-b3b5-7f4e47cd69d0','points':'0'},{'id':'65fedc52-937f-11e9-b3b5-a326933405fe','name':'Cadia-F1','ownerId':'294dc758-8490-11e9-aa57-57c1056dcf5c','position':'5-4-94-P4','motherPlanetAddress':'5-4-94-P4','orbitPosition':0,'endMoveTime':null,'units':{'3b47f768-903d-11e9-b3b5-2f66634601a0':3,'08953bf0-9380-11e9-b3b5-b365ddc4e76f':1},'population':1316,'inBuilding':false,'maxFuel':335000,'fuel':86745.6,'tactic':null,'points':'1'},{'id':'35f47778-9803-11e9-b825-97ee3a19f811','name':'SHIP_DEF','ownerId':'00d9da7a-84b6-11e9-8b79-63dd5595f332','position':'4-5-2377-P1','motherPlanetAddress':'4-5-2377-P1','orbitPosition':0,'endMoveTime':null,'units':{'2764c6d6-9803-11e9-b825-6f19bd1b0e1b':21,'SHIP_WEP_MINES':371,'e99d1278-9b85-11e9-b7ba-8347ddcba1d3':91,'SHIP_WEP_MINES_NUKE':663,'SHIP_WEP_MINES_IEM':132},'population':203,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'e667399a-a4cb-11e9-b7ba-5b25c6f2b8b6','name':'1èreLegion','ownerId':'00d9da7a-84b6-11e9-8b79-63dd5595f332','position':'4-5-2377-P1','motherPlanetAddress':'4-5-2377-P1','orbitPosition':0,'endMoveTime':null,'units':{'d559a08e-a4cb-11e9-b7ba-770e9a8aad3c':26},'population':130,'inBuilding':false,'maxFuel':130000,'fuel':130000,'tactic':null,'points':'0'},{'id':'e1931ca0-8f58-11e9-82ab-bf407636f76b','name':'SHIP_DEF','ownerId':'e0ff7f4e-8482-11e9-a487-e7161d49a1d9','position':'5-4-1320-P0','motherPlanetAddress':'5-4-1320-P0','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES':2},'population':0,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'9e9d9b56-9664-11e9-b825-67652cf37114','name':'SHIP_DEF','ownerId':'79f272ae-90d3-11e9-9949-232c668277b4','position':'4-5-132-P1','motherPlanetAddress':'4-5-132-P1','orbitPosition':0,'endMoveTime':null,'units':{'44e7d43e-9653-11e9-b825-1b8a1638191e':2},'population':0,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'2780e594-92d7-11ea-bf1a-9bd2e1cc7665','name':'ILflotte1','ownerId':'06cc1f82-86d7-11ea-a36a-3f63e7ddd0ef','position':'4-5-1961-P1','motherPlanetAddress':'4-5-1961-P1','orbitPosition':0,'endMoveTime':null,'units':{'1a4f26ec-92d7-11ea-bf1a-a78883d06a08':4},'population':20,'inBuilding':false,'maxFuel':20000,'fuel':0,'tactic':null,'points':'0'},{'id':'4f570056-90d2-11e9-b3b5-f32b2bc70a38','name':'SHIP_DEF','ownerId':'436e2930-8615-11e9-b1a6-5fa9d38289ff','position':'5-4-2725-P0','motherPlanetAddress':'5-4-2725-P0','orbitPosition':0,'endMoveTime':null,'units':{'459dbbcc-90d2-11e9-b3b5-a33cd1821fa7':2,'eddfd93e-90d5-11e9-b3b5-d71ff48e8b2a':1,'SHIP_WEP_MINES':2,'f83a4722-9259-11e9-b3b5-cffb3d8f7a2e':1,'SHIP_WEP_MINES_NUKE':101,'1c6e29b8-a2e2-11e9-b7ba-cb2871924933':35},'population':73,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'bcfc5a0e-9048-11ea-b95b-533bc11186b8','name':'SHIP_DEF','ownerId':'06cc1f82-86d7-11ea-a36a-3f63e7ddd0ef','position':'4-5-1961-P1','motherPlanetAddress':'4-5-1961-P1','orbitPosition':0,'endMoveTime':null,'units':{'cbe9af4a-9033-11ea-b95b-5bae044feb0d':4},'population':4,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'6049d6ec-ac55-11e9-9064-e3e2430029f6','name':'SHIP_DEF','ownerId':'98646422-a230-11e9-aaa2-830e2150217c','position':'5-5-1983-P1','motherPlanetAddress':'5-5-1983-P1','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES_NUKE':25},'population':0,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'f2810de4-ac93-11e9-9064-f3697aa232f3','name':'F1','ownerId':'98646422-a230-11e9-aaa2-830e2150217c','position':'5-5-1983-P1','motherPlanetAddress':'5-5-1983-P1','orbitPosition':0,'endMoveTime':null,'units':{'eed55c78-ac51-11e9-9064-ef82d1b6e3a8':39,'4483b83e-b4f6-11e9-9232-1ff6dd024582':1,'e2916cd2-b371-11e9-8ed6-e709d5108983':7},'population':3210,'inBuilding':false,'maxFuel':2265000,'fuel':925573.1,'tactic':'f460f81a-ad1d-11e9-9064-ffee6bbb61c1','points':'2'},{'id':'05e3d232-9663-11e9-b825-ef66f9e86673','name':'Explo','ownerId':'e1d3e0c8-89ef-11e9-9b4f-1b3c79306104','position':'4-4-724-P2','motherPlanetAddress':'4-4-724-P2','orbitPosition':0,'endMoveTime':null,'units':{'705e2e72-9024-11e9-b3b5-d73c4b53c57b':1},'population':120,'inBuilding':false,'maxFuel':80000,'fuel':0,'tactic':null,'points':'0'},{'id':'ed71ac92-f25b-11e9-b7a5-9b07df166d66','name':'401','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','position':'4-4-705-P2','motherPlanetAddress':'4-4-1459-P0','orbitPosition':1,'endMoveTime':null,'units':{'cd8c29ca-f25b-11e9-b7a5-039e23a37b09':1,'204b4a5a-f302-11e9-b7a5-eb39f259852a':3,'8b713f54-e864-11e9-b7a5-630324df6372':9,'439d7868-f558-11e9-b7a5-e7a6541ec008':1,'d3737bf4-ee87-11e9-b7a5-abbb2f0c1224':2,'e61eeefc-f808-11e9-b7a5-8b39f4b1034b':2},'population':2330,'inBuilding':false,'maxFuel':1090000,'fuel':1034190,'tactic':'275b7b46-f0c6-11e9-b7a5-4f64d4b728d4','points':'1'},{'id':'c4dd8a9a-bc77-11e9-9232-8b0007e63e2d','name':'Explorationgalactique','ownerId':'436e2930-8615-11e9-b1a6-5fa9d38289ff','position':'5-4-2725-P0','motherPlanetAddress':'5-4-2725-P0','orbitPosition':0,'endMoveTime':null,'units':{'56ea76e0-a3ce-11e9-b7ba-43a8b7500a68':1},'population':120,'inBuilding':false,'maxFuel':80000,'fuel':14354,'tactic':null,'points':'0'},{'id':'e30d14ee-ee87-11e9-b7a5-735272bc4274','name':'Swarm301','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','position':'5-4-399-P1','motherPlanetAddress':'4-4-1459-P0','orbitPosition':1,'endMoveTime':null,'units':{'d3737bf4-ee87-11e9-b7a5-abbb2f0c1224':1},'population':303,'inBuilding':false,'maxFuel':225000,'fuel':124110,'tactic':'275b7b46-f0c6-11e9-b7a5-4f64d4b728d4','points':'0'},{'id':'9b598cb4-e864-11e9-b7a5-27ea82071ea7','name':'Swarm201','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','position':'4-4-1459-P0','motherPlanetAddress':'4-4-1459-P0','orbitPosition':0,'endMoveTime':null,'units':{'8b713f54-e864-11e9-b7a5-630324df6372':6,'ddcc1a98-efd6-11e9-b7a5-1fb956237fc1':1},'population':272,'inBuilding':false,'maxFuel':280000,'fuel':280000,'tactic':'63afb696-e8da-11e9-b7a5-8f3215bb4669','points':'0'},{'id':'3ae838a8-ec01-11e9-b7a5-afc5eb8e4130','name':'Swarm102','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','position':'4-4-1459-P0','motherPlanetAddress':'4-4-1459-P0','orbitPosition':0,'endMoveTime':null,'units':{'3071414a-e827-11e9-b7a5-3f72e2cea44c':1},'population':40,'inBuilding':false,'maxFuel':80000,'fuel':80000,'tactic':'63afb696-e8da-11e9-b7a5-8f3215bb4669','points':'0'},{'id':'1da18c92-e2cc-11e9-b7a5-23ad84600c47','name':'SHIP_DEF','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','position':'4-4-1459-P0','motherPlanetAddress':'4-4-1459-P0','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES':9,'119d6410-e827-11e9-b7a5-3b2cad33d9df':24,'SHIP_WEP_MINES_IEM':23},'population':48,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'3143d23e-1060-11ea-b7a5-cb2435c68614','name':'Inquisition','ownerId':'ee8981f2-064e-11ea-ae00-73a802309321','position':'4-5-237-P0','motherPlanetAddress':'4-5-237-P0','orbitPosition':0,'endMoveTime':null,'units':{'f590a230-105f-11ea-b7a5-83c02a18be63':5},'population':200,'inBuilding':false,'maxFuel':400000,'fuel':761,'tactic':null,'points':'0'},{'id':'3d091e02-4f31-11ea-88ba-bf05053b4656','name':'LaFloteGuépard','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','position':'4-4-516-P5','motherPlanetAddress':'4-4-516-P5','orbitPosition':0,'endMoveTime':null,'units':{'9768c576-4f2e-11ea-88ba-ab916176139a':10,'7011fe34-4f2e-11ea-88ba-0312c925e600':450,'4b87c674-8940-11ea-b95b-a743b8e148c0':100},'population':19058,'inBuilding':false,'maxFuel':8700000,'fuel':4601909,'tactic':null,'points':'10'},{'id':'477db146-976a-11ea-afa2-5324ccb1ad3d','name':'Flottecolonialdereserve','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','position':'5-4-1973-P3','motherPlanetAddress':'5-4-1973-P3','orbitPosition':0,'endMoveTime':null,'units':{'f7adb30c-4118-11ea-8ac8-63bed4737f7a':2},'population':3305,'inBuilding':false,'maxFuel':150000,'fuel':150000,'tactic':null,'points':'2'},{'id':'8de1de1a-e107-11e9-8839-8f1f888d2ebe','name':'IntercepteurLourd','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','position':'5-4-2060-P3','motherPlanetAddress':'5-4-2060-P3','orbitPosition':0,'endMoveTime':null,'units':{'ec13ef1e-9684-11e9-b825-73c5a08608d2':100},'population':1100,'inBuilding':false,'maxFuel':1000000,'fuel':1000000,'tactic':null,'points':'1'},{'id':'f5ae52e4-9c5f-11ea-bb78-7b93cf3f6ed4','name':'SHIP_DEF','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','position':'5-4-2228-P1','motherPlanetAddress':'5-4-2228-P1','orbitPosition':0,'endMoveTime':null,'units':{'3b8b1b8a-83ba-11ea-b95b-1b7ab8392437':6},'population':12,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'f00961f4-982b-11ea-afa2-eb3d62b409ed','name':'SHIP_DEF','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','position':'4-4-2326-P0','motherPlanetAddress':'4-4-2326-P0','orbitPosition':0,'endMoveTime':null,'units':{'eb86e3ae-982b-11ea-afa2-ebbfac199409':2},'population':4,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'a44bc73c-4071-11ea-8ac8-bb339f232c1e','name':'ChasseurslégersMk2','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','position':'5-4-2060-P3','motherPlanetAddress':'5-4-2060-P3','orbitPosition':0,'endMoveTime':null,'units':{'9134fa10-4071-11ea-8ac8-3b58a6d50314':481},'population':2500,'inBuilding':false,'maxFuel':2405000,'fuel':2405000,'tactic':null,'points':'1'},{'id':'cde610f6-451d-11ea-8ac8-4f03b77206c4','name':'VaisseauxColoniauxLégersMk1','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','position':'5-4-2060-P3','motherPlanetAddress':'5-4-2060-P3','orbitPosition':0,'endMoveTime':null,'units':{'8fe8eb76-42a1-11ea-8ac8-dbafb5b5f171':124},'population':83947,'inBuilding':false,'maxFuel':150000,'fuel':150000,'tactic':null,'points':'42'},{'id':'e4002078-9ac4-11ea-8f22-039de9799410','name':'SHIP_DEF','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','position':'5-5-1729-P2','motherPlanetAddress':'5-5-1729-P2','orbitPosition':0,'endMoveTime':null,'units':{'0f65f48a-4201-11ea-8ac8-1750ba443087':6},'population':10,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'dbe2d34a-8bf1-11ea-b95b-2768d7c93805','name':'carrale','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','position':'5-4-2228-P1','motherPlanetAddress':'5-4-2228-P0','orbitPosition':0,'endMoveTime':null,'units':{'f39a96f6-8ae0-11ea-b95b-df592a0b3184':3},'population':661,'inBuilding':false,'maxFuel':105000,'fuel':110,'tactic':null,'points':'0'},{'id':'134c875a-9231-11ea-bf1a-134a7134fdf4','name':'Col-3','ownerId':'c8160ce6-8473-11e9-a63c-e76275663acb','position':'5-5-2397-P2','motherPlanetAddress':'5-5-783-P1','orbitPosition':1,'endMoveTime':'2020-05-24T07:07:36.967Z','units':{'9eccded4-91db-11ea-b95b-1781614e5da0':1},'population':1322,'inBuilding':false,'maxFuel':225000,'fuel':214849,'tactic':null,'points':'1'},{'id':'d9b63ffa-badf-11e9-9232-a3002353d819','name':'SHIP_DEF','ownerId':'098d8e86-b56d-11e9-9b82-b753467c7bd3','position':'4-4-705-P3','motherPlanetAddress':'4-4-705-P3','orbitPosition':0,'endMoveTime':null,'units':{'c9cff2f2-badf-11e9-9232-c361552aaf4b':5,'5aea8358-be1c-11e9-9c84-ef37c8869b3c':8,'SHIP_WEP_MINES':15,'SHIP_WEP_MINES_NUKE':10,'7292185e-fd96-11e9-b7a5-c34fab82b24c':4},'population':29,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'d77840b6-fd89-11e9-b7a5-3befc09b0fe8','name':'FDT1','ownerId':'098d8e86-b56d-11e9-9b82-b753467c7bd3','position':'4-4-705-P3','motherPlanetAddress':'4-4-705-P3','orbitPosition':0,'endMoveTime':null,'units':{'23a9a5f0-bf6a-11e9-9c84-63a2c68f9f89':3,'4f56227c-fd96-11e9-b7a5-0b06ff0c67ee':2,'094a40be-fe14-11e9-b7a5-c72d249b9b40':7,'e328c40a-fe13-11e9-b7a5-2bb9425cab3d':5},'population':127,'inBuilding':false,'maxFuel':120000,'fuel':14009.752,'tactic':null,'points':'0'},{'id':'34a26a8e-c51b-11e9-8839-6b6c5627cda9','name':'SHIP_DEF','ownerId':'9b0a623e-8af3-11e9-a4a5-97bb37ff71c2','position':'4-5-2100-P6','motherPlanetAddress':'4-5-2100-P6','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES':10},'population':0,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'e702112e-90af-11ea-b95b-d7a2c50b7eab','name':'SHIP_DEF','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','position':'5-4-2228-P0','motherPlanetAddress':'5-4-2228-P0','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES_NUKE':5,'3b8b1b8a-83ba-11ea-b95b-1b7ab8392437':5},'population':10,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':'13e9e2fa-9c60-11ea-bb78-8b167ce91aaf','points':'0'},{'id':'77def838-b78f-11e9-9232-f74739794f9e','name':'Escadrille1','ownerId':'9b0a623e-8af3-11e9-a4a5-97bb37ff71c2','position':'4-5-2100-P6','motherPlanetAddress':'4-5-2100-P6','orbitPosition':0,'endMoveTime':null,'units':{'6256e2c2-b50b-11e9-9232-4f8b907aa32b':1},'population':40,'inBuilding':false,'maxFuel':80000,'fuel':30043.787,'tactic':null,'points':'0'},{'id':'a3d1f76a-000a-11ea-b7a5-07b01774e741','name':'SHIP_DEF','ownerId':'b85bc856-f99c-11e9-a26f-2f7d8b924610','position':'5-5-1193-P0','motherPlanetAddress':'5-5-1193-P0','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES':45},'population':0,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'92a4669a-4992-11ea-86ab-d73082a5bb69','name':'SHIP_DEF','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','position':'5-4-1973-P3','motherPlanetAddress':'5-4-1973-P3','orbitPosition':0,'endMoveTime':null,'units':{'f3b6ec94-4200-11ea-8ac8-9f5918547186':49,'0f65f48a-4201-11ea-8ac8-1750ba443087':89},'population':310,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'a7f15e4e-b7ad-11e9-9232-b7180d0cd48c','name':'LesVoyageurs','ownerId':'9b0a623e-8af3-11e9-a4a5-97bb37ff71c2','position':'4-5-2100-P6','motherPlanetAddress':'4-5-2100-P6','orbitPosition':0,'endMoveTime':null,'units':{'95472f26-b78f-11e9-9232-87cb52ee7057':4},'population':160,'inBuilding':false,'maxFuel':320000,'fuel':65251,'tactic':null,'points':'0'},{'id':'f100cf4e-2fa2-11ea-b890-abb2f7aeba93','name':'Exploreurs3000','ownerId':'9b0a623e-8af3-11e9-a4a5-97bb37ff71c2','position':'4-5-2100-P6','motherPlanetAddress':'4-5-2100-P6','orbitPosition':0,'endMoveTime':null,'units':{'d67bc336-2fa2-11ea-b890-8fde5ad722c4':1},'population':1280,'inBuilding':false,'maxFuel':320000,'fuel':0,'tactic':null,'points':'1'},{'id':'39e53b3c-f713-11e9-b7a5-e3f2c5e1df0a','name':'Patrouilled\'Hellion','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','position':'4-4-1881-P3','motherPlanetAddress':'4-4-516-P5','orbitPosition':2,'endMoveTime':null,'units':{'adc891a0-f6f7-11e9-b7a5-9bce1c0ee9bf':516,'66e41176-fd08-11e9-b7a5-9f723a95d99c':6,'0ac7591e-f995-11e9-b7a5-ff820d4079a8':220,'aceec9a4-fe2a-11e9-b7a5-4bda9ccda84c':18,'23f6fe8e-fc16-11e9-b7a5-5b686a107a06':40,'2f7bb1c8-fc16-11e9-b7a5-53782480ac59':5,'bc97ab40-49df-11ea-86ab-2b14d8c647cb':2},'population':26874,'inBuilding':false,'maxFuel':22000000,'fuel':12653521,'tactic':'4ea81a72-f8e8-11e9-b7a5-3321abfe94d1','points':'13'},{'id':'1b08d070-92c3-11e9-b3b5-8f86baad75ff','name':'SHIP_DEF','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','position':'4-4-2326-P2','motherPlanetAddress':'4-4-2326-P2','orbitPosition':0,'endMoveTime':null,'units':{'12b8243e-92c3-11e9-b3b5-9baf783a56e3':157,'7527f3e6-78ce-11ea-a334-17aa2b77f77b':102,'SHIP_WEP_MINES_IEM':239},'population':467,'inBuilding':true,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'68104db4-9442-11e9-b3b5-cfcda8971a23','name':'Phalanx','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','position':'5-4-1973-P3','motherPlanetAddress':'5-4-1973-P3','orbitPosition':0,'endMoveTime':null,'units':{'41d32b1c-943d-11e9-b3b5-a7543177ad85':310,'a28067f6-9599-11e9-b3b5-d7ac7a1b7b1e':1546,'69999738-9a75-11e9-b7ba-43dfcef12925':50,'87c131a2-9599-11e9-b3b5-cbea7ebde4ad':220,'8862aa7c-c6af-11e9-8839-dbe64ed8bb30':910,'ca9502fc-1388-11ea-a49a-ab6a8ff16b2f':69,'937fa3bc-1388-11ea-a49a-9757f11a6377':217,'f7adb30c-4118-11ea-8ac8-63bed4737f7a':0},'population':299894,'inBuilding':false,'maxFuel':229829980,'fuel':207379780,'tactic':null,'points':'150'},{'id':'929f8aac-528f-11ea-acb4-1f4a1a4722f2','name':'LesColons-sateurs','ownerId':'9b0a623e-8af3-11e9-a4a5-97bb37ff71c2','position':'4-5-2100-P6','motherPlanetAddress':'4-5-2100-P6','orbitPosition':0,'endMoveTime':null,'units':{'7f86c372-528f-11ea-acb4-bb737d1aaf43':2},'population':1320,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'1'},{'id':'fa475bae-a85c-11e9-b7ba-97c66725ccb1','name':'Flotte2','ownerId':'b4da4388-8d04-11e9-9ee9-efdf3f501bcc','position':'5-4-1313-P1','motherPlanetAddress':'5-4-1313-P1','orbitPosition':0,'endMoveTime':null,'units':{'f27b1604-a85c-11e9-b7ba-43ba063f713c':119,'d4ccfca6-b1f5-11e9-a97f-73833564b86c':36},'population':1705,'inBuilding':false,'maxFuel':1550000,'fuel':0,'tactic':null,'points':'1'},{'id':'ffbccd1a-98f9-11ea-afa2-6bb1a2a0ad8e','name':'Narik','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','position':'5-4-1080-P4','motherPlanetAddress':'5-4-2228-P0','orbitPosition':0,'endMoveTime':null,'units':{'b09219e4-8bf1-11ea-b95b-c79f361fc828':0,'98f44eda-88d4-11ea-b95b-3be3120e68f7':1},'population':661,'inBuilding':false,'maxFuel':325000,'fuel':12976,'tactic':null,'points':'0'},{'id':'d33439ca-88d4-11ea-b95b-93049a7ffc37','name':'ariok','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','position':'5-4-2228-P0','motherPlanetAddress':'5-4-2228-P0','orbitPosition':0,'endMoveTime':null,'units':{'71bcd2a6-88d4-11ea-b95b-fbb5a4534ddf':2,'f39a96f6-8ae0-11ea-b95b-df592a0b3184':6,'6e02653a-91e5-11ea-a6e0-a75e6e0f3d72':1,'a3dddf80-982b-11ea-afa2-47066a9f1df4':2,'afb709c6-982b-11ea-afa2-ffba54542940':2},'population':4659,'inBuilding':false,'maxFuel':1705000,'fuel':288810.38,'tactic':'8ccf215a-8e49-11ea-b95b-170d636e0a62','points':'2'},{'id':'4c2294ae-a4b9-11e9-b7ba-57ca010be59e','name':'SHIP_DEF','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','position':'5-4-2060-P3','motherPlanetAddress':'5-4-2060-P3','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES_IEM':150,'SHIP_WEP_MINES_NUKE':1000,'SHIP_WEP_MINES':100,'0f1afeee-9685-11e9-b825-3bdb5771fa88':16,'b0c56eb2-c503-11e9-9c84-5fde933daa08':300},'population':330,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'c424259c-9f34-11e9-b7ba-7fd71f205585','name':'SquadI','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','position':'5-4-2060-P3','motherPlanetAddress':'5-4-2060-P3','orbitPosition':0,'endMoveTime':null,'units':{'ec13ef1e-9684-11e9-b825-73c5a08608d2':44,'cc7bc2c6-9684-11e9-b825-f7969f69f5a3':7},'population':1452,'inBuilding':false,'maxFuel':2190000,'fuel':2190000,'tactic':null,'points':'1'},{'id':'26c26366-9c6a-11ea-bb78-9b38ddaf16e7','name':'SHIP_DEF','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','position':'5-4-399-P4','motherPlanetAddress':'5-4-399-P4','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES_NUKE':6},'population':0,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'7871fef6-93be-11ea-9417-e37ea2270b30','name':'Varèse','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','position':'5-4-399-P3','motherPlanetAddress':'5-4-2228-P0','orbitPosition':0,'endMoveTime':null,'units':{'b09219e4-8bf1-11ea-b95b-c79f361fc828':0,'98f44eda-88d4-11ea-b95b-3be3120e68f7':1},'population':661,'inBuilding':false,'maxFuel':325000,'fuel':33637,'tactic':null,'points':'0'},{'id':'f257695e-b494-11e9-9232-1bc6142b22db','name':'SHIP_DEF','ownerId':'b4da4388-8d04-11e9-9ee9-efdf3f501bcc','position':'5-4-1313-P1','motherPlanetAddress':'5-4-1313-P1','orbitPosition':0,'endMoveTime':null,'units':{'ed8b6c52-b455-11e9-9232-c73de7c2ef73':82,'SHIP_WEP_MINES_IEM':131,'SHIP_WEP_MINES_NUKE':558,'SHIP_WEP_MINES':364},'population':164,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'fde70d4a-8ad9-11e9-828b-73a76f9f0161','name':'Flottelégère','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','position':'5-4-2060-P3','motherPlanetAddress':'5-4-2060-P3','orbitPosition':0,'endMoveTime':null,'units':{'df0b78d4-8ad9-11e9-828b-3f17aefc632d':4},'population':20,'inBuilding':false,'maxFuel':20000,'fuel':20000,'tactic':null,'points':'0'},{'id':'219d6ae8-9685-11e9-b825-2fbd3ed792e6','name':'Flottecroiseur','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','position':'5-4-2060-P2','motherPlanetAddress':'5-4-2060-P3','orbitPosition':2,'endMoveTime':null,'units':{'8fe8eb76-42a1-11ea-8ac8-dbafb5b5f171':1},'population':972,'inBuilding':false,'maxFuel':75000,'fuel':75000,'tactic':null,'points':'0'},{'id':'06d39184-a3ef-11e9-b7ba-df7d00cf8922','name':'FleetAlpha','ownerId':'c8160ce6-8473-11e9-a63c-e76275663acb','position':'5-5-783-P1','motherPlanetAddress':'5-5-783-P1','orbitPosition':0,'endMoveTime':null,'units':{'0102c996-a3ef-11e9-b7ba-87d0ab75b590':494,'e351d5d2-e466-11e9-b7a5-c3dd50998f27':89,'924fb330-98fc-11e9-b825-9742d023bcd2':62,'2f111406-620c-11ea-aaab-a3a1a0767523':5,'9eccded4-91db-11ea-b95b-1781614e5da0':0},'population':130819,'inBuilding':false,'maxFuel':145715010,'fuel':117964904,'tactic':null,'points':'65'},{'id':'a6755afe-92fc-11ea-bf1a-e7691b20a31c','name':'Bêta','ownerId':'c8160ce6-8473-11e9-a63c-e76275663acb','position':'5-5-783-P1','motherPlanetAddress':'5-5-783-P1','orbitPosition':0,'endMoveTime':null,'units':{'0102c996-a3ef-11e9-b7ba-87d0ab75b590':56,'9eccded4-91db-11ea-b95b-1781614e5da0':1},'population':13193,'inBuilding':false,'maxFuel':16400000,'fuel':6228650,'tactic':null,'points':'7'},{'id':'f5b428f6-107b-11ea-9cfe-9710232cbf25','name':'SHIP_DEF','ownerId':'c8160ce6-8473-11e9-a63c-e76275663acb','position':'5-5-783-P1','motherPlanetAddress':'5-5-783-P1','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES_NUKE':879,'SHIP_WEP_MINES':400},'population':0,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'869504ca-7f45-11ea-a334-4fe259dea0de','name':'6èmeflotted\'interventionrapide','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','position':'5-4-1973-P3','motherPlanetAddress':'5-4-1973-P3','orbitPosition':0,'endMoveTime':null,'units':{'ca9502fc-1388-11ea-a49a-ab6a8ff16b2f':50,'feb4ffce-4501-11ea-8ac8-e7a2383bb349':129,'937fa3bc-1388-11ea-a49a-9757f11a6377':70,'41d32b1c-943d-11e9-b3b5-a7543177ad85':70},'population':81700,'inBuilding':true,'maxFuel':78500000,'fuel':66888340,'tactic':null,'points':'41'},{'id':'ad8cd342-422c-11ea-8ac8-fba9ec7e52f7','name':'3èmeflotted\'invasion','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','position':'5-4-1973-P3','motherPlanetAddress':'5-4-1973-P3','orbitPosition':0,'endMoveTime':null,'units':{'4dfbf864-414f-11ea-8ac8-531fbbe1eb2d':20,'feb4ffce-4501-11ea-8ac8-e7a2383bb349':45,'ca9502fc-1388-11ea-a49a-ab6a8ff16b2f':60,'b9712e24-4501-11ea-8ac8-dbfe8135e039':230,'937fa3bc-1388-11ea-a49a-9757f11a6377':96,'719c97e2-414f-11ea-8ac8-0f6a75e68563':900,'f7adb30c-4118-11ea-8ac8-63bed4737f7a':1},'population':92067,'inBuilding':false,'maxFuel':62025000,'fuel':56453732,'tactic':null,'points':'46'},{'id':'50e51e28-9372-11ea-9417-db294b19fbdc','name':'Matra','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','position':'5-4-334-P1','motherPlanetAddress':'5-4-2228-P0','orbitPosition':0,'endMoveTime':null,'units':{'b09219e4-8bf1-11ea-b95b-c79f361fc828':0,'71bcd2a6-88d4-11ea-b95b-fbb5a4534ddf':1},'population':661,'inBuilding':false,'maxFuel':300000,'fuel':6299,'tactic':null,'points':'0'},{'id':'57fc8058-920e-11ea-9f4a-53ca2d64f0c5','name':'bermud','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','position':'5-4-399-P4','motherPlanetAddress':'5-4-2228-P0','orbitPosition':0,'endMoveTime':null,'units':{'71bcd2a6-88d4-11ea-b95b-fbb5a4534ddf':1,'b09219e4-8bf1-11ea-b95b-c79f361fc828':0},'population':661,'inBuilding':false,'maxFuel':300000,'fuel':41792,'tactic':null,'points':'0'},{'id':'5b7258ce-929b-11ea-bf1a-a771a3078437','name':'Col-4','ownerId':'c8160ce6-8473-11e9-a63c-e76275663acb','position':'5-5-783-P1','motherPlanetAddress':'5-5-783-P1','orbitPosition':0,'endMoveTime':null,'units':{'0102c996-a3ef-11e9-b7ba-87d0ab75b590':56},'population':13193,'inBuilding':false,'maxFuel':155000,'fuel':155000,'tactic':null,'points':'7'},{'id':'3329223c-931b-11ea-bf1a-8fa4a9b898a7','name':'9èmeFlottedeSoutien','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','position':'4-4-2326-P2','motherPlanetAddress':'4-4-2326-P2','orbitPosition':0,'endMoveTime':null,'units':{'3b111030-6144-11ea-aaab-cf53243ece48':118,'2cb8872a-6b80-11ea-aaab-4f280eabd9e3':19,'913ceb44-087c-11ea-b7a5-f3869107a2b1':2,'6b3ac03a-96ff-11ea-afa2-f7a302fd9be1':97,'acf20f84-9078-11ea-b95b-b7e1c0e3d4c2':90,'4e1fb5bc-8eb5-11e9-82ab-ef707500a591':71,'f5d114b8-7d07-11ea-a334-974834f04b34':53,'8d9912cc-984d-11ea-afa2-8ff677d177bb':2},'population':16765,'inBuilding':false,'maxFuel':34060000,'fuel':1715196.8,'tactic':'f24f5ea4-93db-11ea-9417-4fda9293d391','points':'8'},{'id':'ad8c815c-7be4-11ea-a334-2f08722f74ec','name':'1èreFlotteColoniale','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','position':'4-4-2326-P2','motherPlanetAddress':'4-4-2326-P2','orbitPosition':0,'endMoveTime':'2020-05-22T15:15:03.367Z','units':{'3b111030-6144-11ea-aaab-cf53243ece48':17,'f5d114b8-7d07-11ea-a334-974834f04b34':213,'2cb8872a-6b80-11ea-aaab-4f280eabd9e3':54,'913ceb44-087c-11ea-b7a5-f3869107a2b1':1,'b2d9146c-8626-11ea-b95b-ef146a15c4d6':1,'4e1fb5bc-8eb5-11e9-82ab-ef707500a591':53,'acf20f84-9078-11ea-b95b-b7e1c0e3d4c2':59,'7292c078-a658-11e9-b7ba-a7f3b7c4615b':2,'8d9912cc-984d-11ea-afa2-8ff677d177bb':0},'population':21959,'inBuilding':false,'maxFuel':21520000,'fuel':971137,'tactic':'f24f5ea4-93db-11ea-9417-4fda9293d391','points':'11'},{'id':'f365e286-81d9-11ea-a334-eb86f51e3e60','name':'TheExplorationFleet1','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','position':'4-4-1398-P1','motherPlanetAddress':'4-4-1398-P1','orbitPosition':0,'endMoveTime':'2020-05-24T00:37:55.628Z','units':{'81b67b8e-8b8c-11ea-b95b-7f6887d3dd02':0,'214507f0-8cdd-11ea-b95b-77c22fae696f':1},'population':1242,'inBuilding':false,'maxFuel':225000,'fuel':159098,'tactic':null,'points':'1'},{'id':'07b9f244-9c07-11ea-8f22-3f9eef0c393e','name':'ExplorationFleet2','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','position':'4-4-1473-P6','motherPlanetAddress':'4-4-1398-P1','orbitPosition':1,'endMoveTime':'2020-05-24T06:50:05.126Z','units':{'fc3f8302-9c06-11ea-8f22-eb0c462461f7':1,'b1662100-8da7-11ea-b95b-5fd68e8c2b07':1},'population':964,'inBuilding':false,'maxFuel':300000,'fuel':25152,'tactic':null,'points':'0'},{'id':'2a4648c6-83ca-11ea-b95b-3f4e771b180b','name':'SHIP_DEF','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','position':'4-4-1398-P1','motherPlanetAddress':'4-4-1398-P1','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES':5,'dbc0d782-852e-11ea-b95b-fb250f07426e':4},'population':6,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'aaf776b8-83c3-11ea-b95b-5bae420d31b4','name':'HomeDefenseFleet1','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','position':'4-4-1398-P1','motherPlanetAddress':'4-4-1398-P1','orbitPosition':0,'endMoveTime':null,'units':{'d55c7d04-81d9-11ea-a334-6b3220d8563b':6,'96e4881e-8f3a-11ea-b95b-23fcf4e69e84':1,'47af62f6-91d2-11ea-b95b-1b9e78459d72':1},'population':5,'inBuilding':false,'maxFuel':290000,'fuel':290000,'tactic':null,'points':'0'},{'id':'4c1ed110-9c71-11ea-bb78-438d41cbffb8','name':'ColonyFar2','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','position':'4-4-1538-P2','motherPlanetAddress':'4-4-1538-P2','orbitPosition':0,'endMoveTime':null,'units':{'42092766-9c71-11ea-bb78-734ab03103c9':2},'population':1983,'inBuilding':false,'maxFuel':150000,'fuel':0,'tactic':null,'points':'1'},{'id':'2c3ba4aa-94af-11ea-bd89-b74eb9b1f806','name':'Colo3','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','position':'4-5-1727-P5','motherPlanetAddress':'4-5-1727-P5','orbitPosition':0,'endMoveTime':null,'units':{'e2729258-75fe-11ea-89fb-ef2a1a4ac405':1,'d900225a-9650-11e9-b825-df8864a4df49':1},'population':1980,'inBuilding':false,'maxFuel':400000,'fuel':174247,'tactic':null,'points':'1'},{'id':'48b49b2e-8bb3-11e9-828b-1fa0ea3c75d0','name':'SHIP_DEF','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','position':'4-5-1727-P5','motherPlanetAddress':'4-5-1727-P5','orbitPosition':0,'endMoveTime':null,'units':{'d4e4b54a-8adf-11e9-828b-9317418aa3c9':1},'population':3,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'a67a5dd4-9463-11ea-9417-675099a2d070','name':'Colo2','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','position':'4-5-2177-P1','motherPlanetAddress':'4-5-1727-P5','orbitPosition':1,'endMoveTime':'2020-05-23T09:56:27.860Z','units':{'e2729258-75fe-11ea-89fb-ef2a1a4ac405':1,'d900225a-9650-11e9-b825-df8864a4df49':1},'population':660,'inBuilding':false,'maxFuel':550000,'fuel':391071,'tactic':null,'points':'0'},{'id':'ec447d92-9651-11e9-b825-33198a03f9b9','name':'SG-1','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','position':'4-5-1727-P5','motherPlanetAddress':'4-5-1727-P5','orbitPosition':0,'endMoveTime':null,'units':{'cf993214-9651-11e9-b825-d7fd78dccea2':1131,'e17a3e2e-9651-11e9-b825-afb862708af5':941,'d900225a-9650-11e9-b825-df8864a4df49':142,'f0bd431e-9650-11e9-b825-cbdfb094adbd':42,'e2729258-75fe-11ea-89fb-ef2a1a4ac405':2},'population':117285,'inBuilding':false,'maxFuel':69810000,'fuel':8911703,'tactic':'bd505554-977a-11e9-b825-7bec9e8ba1fc','points':'59'},{'id':'372170f0-9b3d-11e9-b7ba-3b28170a98a4','name':'Colo1','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','position':'4-5-2177-P0','motherPlanetAddress':'4-5-1727-P5','orbitPosition':0,'endMoveTime':null,'units':{'d900225a-9650-11e9-b825-df8864a4df49':1,'e2729258-75fe-11ea-89fb-ef2a1a4ac405':0},'population':1562,'inBuilding':false,'maxFuel':400000,'fuel':203788,'tactic':null,'points':'1'},{'id':'23af0592-9555-11ea-afa2-6bceb94ee062','name':'Colo4','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','position':'4-5-1727-P5','motherPlanetAddress':'4-5-1727-P5','orbitPosition':0,'endMoveTime':null,'units':{'cf993214-9651-11e9-b825-d7fd78dccea2':1,'e2729258-75fe-11ea-89fb-ef2a1a4ac405':1},'population':11,'inBuilding':false,'maxFuel':85000,'fuel':19162,'tactic':null,'points':'0'},{'id':'e81fa54c-942b-11ea-9417-1b4b903b3a51','name':'Atlasse','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','position':'5-4-1080-P3','motherPlanetAddress':'5-4-2228-P0','orbitPosition':0,'endMoveTime':null,'units':{'b09219e4-8bf1-11ea-b95b-c79f361fc828':0,'71bcd2a6-88d4-11ea-b95b-fbb5a4534ddf':1},'population':661,'inBuilding':false,'maxFuel':300000,'fuel':500,'tactic':null,'points':'0'},{'id':'3ea84302-9265-11e9-b3b5-e76295db2d1a','name':'SquadronPlasma','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','position':'5-5-783-P1','motherPlanetAddress':'4-4-1538-P2','orbitPosition':1,'endMoveTime':null,'units':{'83471742-41ea-11ea-8ac8-a35d8559ff75':0},'population':-65955,'inBuilding':false,'maxFuel':74360000,'fuel':25594720,'tactic':'508e3482-9bf7-11e9-b7ba-eb12acaf39aa','points':'-33'},{'id':'4973715c-9850-11ea-afa2-bb471f989dde','name':'Cuirassé','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','position':'4-4-1538-P2','motherPlanetAddress':'4-4-1538-P2','orbitPosition':0,'endMoveTime':null,'units':{'88588936-9bce-11e9-b7ba-0b62985aee78':52,'b733f0a4-98dd-11e9-b825-13def35a1780':37},'population':19392,'inBuilding':true,'maxFuel':52745000,'fuel':30044700,'tactic':null,'points':'10'},{'id':'deee7b54-9d75-11e9-b7ba-4372e365a21b','name':'Buffer','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','position':'4-4-1538-P2','motherPlanetAddress':'4-4-1538-P2','orbitPosition':0,'endMoveTime':null,'units':{'a0911b56-8889-11e9-828b-a3cbd432d8ec':1,'6b69bfa0-8faf-11e9-b3b5-af40b4a7ec84':3},'population':4855,'inBuilding':true,'maxFuel':50000,'fuel':4738,'tactic':null,'points':'2'},{'id':'d7ebff16-8cf9-11e9-a57d-178657c388f0','name':'Colonizer','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','position':'4-4-1538-P2','motherPlanetAddress':'4-4-1538-P2','orbitPosition':0,'endMoveTime':null,'units':{'42092766-9c71-11ea-bb78-734ab03103c9':1},'population':35,'inBuilding':false,'maxFuel':75000,'fuel':75000,'tactic':null,'points':'0'},{'id':'5e276624-9217-11ea-9f4a-3782dc611921','name':'M-F-C','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','position':'5-5-1263-P6','motherPlanetAddress':'5-5-1263-P6','orbitPosition':0,'endMoveTime':null,'units':{'4df3a00e-7955-11ea-a334-5bebaebd3b5d':1,'0646a290-7afb-11ea-a334-93713d4727bc':1},'population':4868,'inBuilding':false,'maxFuel':625000,'fuel':625000,'tactic':null,'points':'2'},{'id':'e5a9c718-70c0-11ea-ae0b-b331780b20c1','name':'M-F-S','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','position':'5-5-1263-P6','motherPlanetAddress':'5-5-1263-P6','orbitPosition':0,'endMoveTime':null,'units':{'895cc5d2-70c0-11ea-ae0b-87e01f24c570':10,'6c8566d2-7113-11ea-ae0b-ff6a5ecce0a0':30,'68a0daac-7955-11ea-a334-4f6ffbe9e774':2,'4df3a00e-7955-11ea-a334-5bebaebd3b5d':3,'057927c6-7bb3-11ea-a334-13f6ecf4bf02':1},'population':3694,'inBuilding':false,'maxFuel':1870000,'fuel':1870000,'tactic':null,'points':'2'},{'id':'c2434d3a-9523-11ea-afa2-bbd95c49345c','name':'M-F-01','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','position':'5-5-1263-P6','motherPlanetAddress':'5-5-1263-P6','orbitPosition':0,'endMoveTime':null,'units':{'6c8566d2-7113-11ea-ae0b-ff6a5ecce0a0':13,'057927c6-7bb3-11ea-a334-13f6ecf4bf02':1},'population':110,'inBuilding':false,'maxFuel':450000,'fuel':450000,'tactic':null,'points':'0'},{'id':'d2cb2728-6f11-11ea-ae0b-6bb545cae546','name':'SHIP_DEF','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','position':'5-5-1263-P6','motherPlanetAddress':'5-5-1263-P6','orbitPosition':0,'endMoveTime':null,'units':{'1ceedd5e-6ec7-11ea-ae0b-f797ae32a841':6,'7d8c0412-6ed5-11ea-ae0b-8b90790f0d3d':1,'SHIP_WEP_MINES':10,'a97f07be-6f3d-11ea-ae0b-33cf047d52f3':4,'SHIP_WEP_MINES_NUKE':15,'SHIP_WEP_MINES_IEM':10},'population':16,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'bbaea644-9007-11e9-b3b5-1f465ceef85f','name':'SHIP_DEF','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','position':'4-4-1538-P2','motherPlanetAddress':'4-4-1538-P2','orbitPosition':0,'endMoveTime':null,'units':{'SHIP_WEP_MINES':10,'SHIP_WEP_MINES_IEM':1267,'SHIP_WEP_MINES_NUKE':432,'14fd8820-9b0a-11e9-b7ba-ab01e5b551d7':10},'population':20,'inBuilding':false,'maxFuel':0,'fuel':0,'tactic':null,'points':'0'},{'id':'d84df0c4-c10e-11e9-9c84-9b112a730b5d','name':'SquadronElec3','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','position':'5-5-783-P1','motherPlanetAddress':'4-4-1538-P2','orbitPosition':1,'endMoveTime':'2020-05-22T12:51:25.494Z','units':{'88588936-9bce-11e9-b7ba-0b62985aee78':1},'population':10707,'inBuilding':false,'maxFuel':41270000,'fuel':135804,'tactic':null,'points':'5'},{'id':'fcb72092-9c38-11ea-bb78-b3665e871aac','name':'ColonyFar','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','position':'4-4-1155-P0','motherPlanetAddress':'4-4-1538-P2','orbitPosition':1,'endMoveTime':'2020-05-22T20:41:21.218Z','units':{'627db108-9c38-11ea-bb78-ef2229d391ec':1},'population':820,'inBuilding':false,'maxFuel':75000,'fuel':3886,'tactic':null,'points':'0'}],
				tactics: [{'id':'08c41190-9048-11e9-b3b5-7f4e47cd69d0','name':'T:D','owner':'294dc758-8490-11e9-aa57-57c1056dcf5c'},{'id':'bd505554-977a-11e9-b 825-7bec9e8ba1fc','name':'base','owner':'0c750d1a-8474-11e9-9b8e-172be54d7e41'},{'id':'508e3482-9bf7-11e9-b7ba-eb12acaf39aa','name':'C hasseur lourd','owner':'7f37d8ba-8482-11e9-b379-0303a5a9b21b'},{'id':'f460f81a-ad1d-11e9-9064-ffee6bbb61c1','name':'Basic Defense Atk' ,'owner':'98646422-a230-11e9-aaa2-830e2150217c'},{'id':'63afb696-e8da-11e9-b7a5-8f3215bb4669','name':'Sting A','owner':'7592a6ca-da2a- 11e9-93c4-1f9fcab2f1aa'},{'id':'275b7b46-f0c6-11e9-b7a5-4f64d4b728d4','name':'Bzz','owner':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa'},{'i d':'9991eea8-f28c-11e9-b7a5-8f13ba8d11ef','name':'Défance d& Hellion','owner':'8a31c3d2-ef5a-11e9-8c38-3f3008600859'},{'id':'4ea81a72- f8e8-11e9-b7a5-3321abfe94d1','name':'Patrouille de Helion','owner':'8a31c3d2-ef5a-11e9-8c38-3f3008600859'},{'id':'cca8231e-23ee-11ea-b e1b-bf08c65aabfe','name':'Manœuvre d\'attaque Alpha 4 ','owner':'d9bca0cc-8473-11e9-8308-275703a6477d'},{'id':'a64a2e1c-4f2f-11ea-88ba- 0bbc771383cc','name':'La Flotte Guépard','owner':'8a31c3d2-ef5a-11e9-8c38-3f3008600859'},{'id':'8ccf215a-8e49-11ea-b95b-170d636e0a62', 'name':'alpha defense ','owner':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d'},{'id':'f24f5ea4-93db-11ea-9417-4fda9293d391','name':'Assaut In ter-Corps','owner':'99040396-8495-11e9-a2dc-2b87aaaf482b'},{'id':'6ed506ca-9532-11ea-afa2-9f3d6dfa9503','name':'Assaut de Cuirassés',' owner':'99040396-8495-11e9-a2dc-2b87aaaf482b'},{'id':'13e9e2fa-9c60-11ea-bb78-8b167ce91aaf','name':'anti-colonies ','owner':'ba6af2c2- b56b-11e9-80ae-1f5495ce680d'}],
				units: [{'id':'df0b78d4-8ad9-11e9-828b-3f17aefc632d','name':'Chasseurléger','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','cost':[63,34,47,20,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':4},{'id':'3b47f768-903d-11e9-b3b5-2f66634601a0','name':'Ch-L-01','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'294dc758-8490-11e9-aa57-57c1056dcf5c','cost':[64,37,47,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':6},{'id':'2b60e85c-8f78-11e9-82ab-ab8bbaade2cd','name':'Chasseur1','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'31bf4a78-8a77-11e9-ac88-a7fded6aced5','cost':[63,34,47,20,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':2},{'id':'459dbbcc-90d2-11e9-b3b5-a33cd1821fa7','name':'SD-L0A1','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'436e2930-8615-11e9-b1a6-5fa9d38289ff','cost':[18,22,38,21,0.37,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':2},{'id':'4d5ec908-9381-11e9-b3b5-9f8f9c065833','name':'InterLeg1','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'576e3654-850d-11e9-983a-2f3200d8387d','cost':[63,34,47,20,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':0},{'id':'08953bf0-9380-11e9-b3b5-b365ddc4e76f','name':'CadianT1','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'294dc758-8490-11e9-aa57-57c1056dcf5c','cost':[740,780,385,150,4.75,1301],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarSimple'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarSimple'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':1},{'id':'4b34dfe2-903d-11e9-b3b5-877efcd0fa2e','name':'Ch-H-01','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'294dc758-8490-11e9-aa57-57c1056dcf5c','cost':[103,65,76,31,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':1},{'id':'d4e4b54a-8adf-11e9-828b-9317418aa3c9','name':'AG-1','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','cost':[45,85,47,38,0.6,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':1},{'id':'8a8a96a0-9317-11e9-b3b5-a757166aa075','name':'Sat1','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'ba54617a-868f-11e9-9deb-df990a64fc6a','cost':[14,16,43,20,0.35,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'eddfd93e-90d5-11e9-b3b5-d71ff48e8b2a','name':'SD-E0A1','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'436e2930-8615-11e9-b1a6-5fa9d38289ff','cost':[14,16,43,20,0.35,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':1},{'id':'f83a4722-9259-11e9-b3b5-cffb3d8f7a2e','name':'SD-LBMA1','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'436e2930-8615-11e9-b1a6-5fa9d38289ff','cost':[38,72,43,36,0.57,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':1},{'id':'627db108-9c38-11ea-bb78-ef2229d391ec','name':'Colony3','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[650,740,460,150,6,820],'parts':[{'type':'sup_propulsion','name':'prop_1','tech':'hyperespace'},{'type':'sup_propulsion','name':'prop_2','tech':'hyperespace'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'sub_propulsion','name':'prop_4','tech':'ion'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':1},{'id':'d93f7188-9684-11e9-b825-87e6880332d9','name':'Petitcuirassé','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','cost':[698,737,371,161,3.27,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'shield','name':'shield_2','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':0},{'id':'44e7d43e-9653-11e9-b825-1b8a1638191e','name':'SAT-TROLX-1','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'79f272ae-90d3-11e9-9949-232c668277b4','cost':[14,16,43,20,0.35,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':2},{'id':'ec13ef1e-9684-11e9-b825-73c5a08608d2','name':'Intercepteurlourd','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','cost':[99,57,74,30,0.67,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'cannon','name':'cannon_2','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':144},{'id':'f689a7d2-93d6-11e9-b3b5-b7890ed48133','name':'Sat2','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'ba54617a-868f-11e9-9deb-df990a64fc6a','cost':[18,22,38,21,0.37,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':1},{'id':'a0911b56-8889-11e9-828b-a3cbd432d8ec','name':'CL-II-I','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[63,34,47,20,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':2},{'id':'0fcb658c-98e1-11e9-b825-930d62efd91e','name':'CL-I-III','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[70,35,46,21,0.42,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':0},{'id':'4e1fb5bc-8eb5-11e9-82ab-ef707500a591','name':'X-60E','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[63,34,47,20,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':124},{'id':'92c593bc-9689-11ea-afa2-7beb9f74dbc8','name':'M-VC-G2','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[725,800,393,155,6.25,741],'parts':[{'type':'sup_propulsion','name':'prop_1','tech':'wd'},{'type':'sup_propulsion','name':'prop_2','tech':'wd'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_4','tech':'pplasma'},{'type':'shield','name':'shield_1','tech':'turret'}],'armorType':'0','note':0,'owned':0},{'id':'09b0e64a-98e1-11e9-b825-cf66025fcdaa','name':'CL-I-II','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[69,33,46,21,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':0},{'id':'0f1afeee-9685-11e9-b825-3bdb5771fa88','name':'Satellite','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','cost':[38,72,43,36,0.57,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':15},{'id':'2764c6d6-9803-11e9-b825-6f19bd1b0e1b','name':'DefSat','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'00d9da7a-84b6-11e9-8b79-63dd5595f332','cost':[14,16,43,20,0.35,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':21},{'id':'25f5e1c0-98e1-11e9-b825-dbc6522f9ec6','name':'CL-II-III','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[64,37,47,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':0},{'id':'6b3ac03a-96ff-11ea-afa2-f7a302fd9be1','name':'X-60P','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[64,37,47,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':96},{'id':'f45fe092-9684-11e9-b825-bf188ecd40b9','name':'Intercepteurléger','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','cost':[63,35,46,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':0},{'id':'42092766-9c71-11ea-bb78-734ab03103c9','name':'Colomin','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[600,710,355,145,5.8,661],'parts':[{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'sub_propulsion','name':'prop_4','tech':'ion'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':3},{'id':'e17a3e2e-9651-11e9-b825-afb862708af5','name':'F-302L','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','cost':[103,65,76,31,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':952},{'id':'7e68d702-9cf7-11ea-bb78-4bc5b68a493f','name':'TransporteurPegasus','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[750,800,500,160,6.3,820],'parts':[{'type':'sup_propulsion','name':'prop_1','tech':'hyperespace'},{'type':'sup_propulsion','name':'prop_2','tech':'hyperespace'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_4','tech':'pplasma'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'bcab8066-98eb-11e9-b825-73fffe724726','name':'CarrierII','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[725,750,382,145,4.6,1300],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarSimple'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarSimple'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':2},{'id':'5be69c7e-9689-11ea-afa2-f356cb4a028b','name':'M-C-CA-G2','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[633,637,315,122,2.95,282],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'wd'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'}],'armorType':'0','note':0,'owned':0},{'id':'bc1740e4-9689-11ea-afa2-d7d3b0efa95e','name':'M-C-P-G2','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[727,805,382,188,3.8,343],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'wd'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'shield','name':'shield_1','tech':'singularity'},{'type':'shield','name':'shield_2','tech':'projector'}],'armorType':'0','note':0,'owned':0},{'id':'e31be8a2-9689-11ea-afa2-d7ef929380c4','name':'M-T-M-G2','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[783,865,413,163,6.05,1361],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarDouble'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarDouble'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'wd'},{'type':'shield','name':'shield_1','tech':'turret'}],'armorType':'0','note':0,'owned':0},{'id':'87c131a2-9599-11e9-b3b5-cbea7ebde4ad','name':'CuirassérapideKongo','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[694,731,376,160,3.25,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'shield','name':'shield_2','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':219},{'id':'a28067f6-9599-11e9-b3b5-d7ac7a1b7b1e','name':'F-302','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[63,34,47,20,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':1590},{'id':'d73c348a-0582-11ea-b7a5-87aecbc74697','name':'PCorvette','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'b85bc856-f99c-11e9-a26f-2f7d8b924610','cost':[350,108,155,65,1.22,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'},{'type':'sub_propulsion','name':'prop_2','tech':'vsolaire'},{'type':'sup_propulsion','name':'prop_3','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'924fb330-98fc-11e9-b825-9742d023bcd2','name':'Corvette','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'c8160ce6-8473-11e9-a63c-e76275663acb','cost':[415,228,215,85,1.77,120],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'},{'type':'sub_propulsion','name':'prop_2','tech':'vsolaire'},{'type':'sup_propulsion','name':'prop_3','tech':'vsl'}],'armorType':'0','note':0,'owned':68},{'id':'cd5d54a6-98e2-11e9-b825-a35657d61263','name':'CM-I-III','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[115,61,75,34,0.7,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':0},{'id':'30693340-9cfc-11e9-b7ba-f3942e4582c5','name':'Chasseurlourd','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'ba54617a-868f-11e9-9deb-df990a64fc6a','cost':[103,65,76,31,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':3},{'id':'51fb2ee0-998d-11e9-b825-db21c6cacda7','name':'Chasseur1','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'ba54617a-868f-11e9-9deb-df990a64fc6a','cost':[70,35,46,21,0.42,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':3},{'id':'130b31b6-a2f8-11e9-b7ba-d3004226d1bb','name':'Laser','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'436e2930-8615-11e9-b1a6-5fa9d38289ff','cost':[69,33,46,21,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':1},{'id':'4483b83e-b4f6-11e9-9232-1ff6dd024582','name':'TraL1','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'98646422-a230-11e9-aaa2-830e2150217c','cost':[768,840,413,158,5.95,1321],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarDouble'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarDouble'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':1},{'id':'39aa6208-121d-11ea-a49a-53846cc64f61','name':'CorvetterecoV.2','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'ee8981f2-064e-11ea-ae00-73a802309321','cost':[370,198,205,55,1.42,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_3','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'e99d1278-9b85-11e9-b7ba-8347ddcba1d3','name':'AG-IShield','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'00d9da7a-84b6-11e9-8b79-63dd5595f332','cost':[34,66,48,35,0.55,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':91},{'id':'1c6e29b8-a2e2-11e9-b7ba-cb2871924933','name':'Plasma','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'436e2930-8615-11e9-b1a6-5fa9d38289ff','cost':[45,85,47,38,0.6,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':35},{'id':'d16adf3c-98dd-11e9-b825-3f8f819ec035','name':'Croiseur-II-III-II-T','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[518,552,275,107,2.55,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'}],'armorType':'0','note':0,'owned':29},{'id':'3cfb902a-98de-11e9-b825-7fc074745d39','name':'Corv-V-II','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[335,258,225,65,1.67,120],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sup_propulsion','name':'prop_3','tech':'vsl'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':25},{'id':'f0bd431e-9650-11e9-b825-cbdfb094adbd','name':'BC-304Transporteur','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','cost':[740,780,385,150,4.75,1301],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarSimple'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarSimple'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':43},{'id':'69999738-9a75-11e9-b7ba-43dfcef12925','name':'ArkRoyalCVL','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[745,800,387,160,4.8,1301],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarSimple'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarSimple'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':50},{'id':'bd709680-a3d1-11e9-b7ba-bf177e581c28','name':'...','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'b4da4388-8d04-11e9-9ee9-efdf3f501bcc','cost':[63,34,47,20,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':90},{'id':'044d0908-a337-11e9-b7ba-3f7543c3fda6','name':'cuir1','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'ba54617a-868f-11e9-9deb-df990a64fc6a','cost':[612,725,339,168,3.15,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'projector'},{'type':'shield','name':'shield_2','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':1},{'id':'d559a08e-a4cb-11e9-b7ba-770e9a8aad3c','name':'IntercepteurElectro','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'00d9da7a-84b6-11e9-8b79-63dd5595f332','cost':[69,32,46,21,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':26},{'id':'b86ed660-b36c-11e9-8ed6-df4d16d58fa6','name':'ILoPlas','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'98646422-a230-11e9-aaa2-830e2150217c','cost':[103,65,76,31,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':0},{'id':'bc616aca-a666-11e9-b7ba-fb919bdb6fcd','name':'BasicSatAG1','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'98646422-a230-11e9-aaa2-830e2150217c','cost':[34,66,48,35,0.55,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':0},{'id':'c6849fb8-ac51-11e9-9064-ab15d76ec4dc','name':'BasicSatAG2','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'98646422-a230-11e9-aaa2-830e2150217c','cost':[45,85,47,38,0.6,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':0},{'id':'d4ccfca6-b1f5-11e9-a97f-73833564b86c','name':'!!','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'b4da4388-8d04-11e9-9ee9-efdf3f501bcc','cost':[103,65,76,31,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':36},{'id':'d67bc336-2fa2-11ea-b890-8fde5ad722c4','name':'Inter-Transport','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'9b0a623e-8af3-11e9-a4a5-97bb37ff71c2','cost':[705,630,310,125,2.6,1280],'parts':[{'type':'hangar','name':'hangar_1','tech':'none'},{'type':'hangar','name':'hangar_2','tech':'none'},{'type':'hangar','name':'hangar_3','tech':'none'},{'type':'hangar','name':'hangar_4','tech':'none'},{'type':'shield','name':'shield_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':1},{'id':'0f3c9192-a717-11e9-b7ba-e3bb74e095f4','name':'CUI-TROLX-1','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'79f272ae-90d3-11e9-9949-232c668277b4','cost':[605,690,335,153,3,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'shield','name':'shield_2','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':0},{'id':'7519e778-ad46-11e9-9064-5f175f477708','name':'DEF','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'b4da4388-8d04-11e9-9ee9-efdf3f501bcc','cost':[36,81,50,40,0.65,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'projector'}],'armorType':'0','note':0,'owned':0},{'id':'f27b1604-a85c-11e9-b7ba-43ba063f713c','name':'.','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'b4da4388-8d04-11e9-9ee9-efdf3f501bcc','cost':[96,54,77,30,0.66,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'cannon','name':'cannon_2','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':119},{'id':'eed55c78-ac51-11e9-9064-ef82d1b6e3a8','name':'ILPlas','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'98646422-a230-11e9-aaa2-830e2150217c','cost':[64,37,47,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':39},{'id':'e2916cd2-b371-11e9-8ed6-e709d5108983','name':'PCRNuPla','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'98646422-a230-11e9-aaa2-830e2150217c','cost':[618,612,315,117,2.85,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':7},{'id':'d3737bf4-ee87-11e9-b7a5-abbb2f0c1224','name':'HornetI','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','cost':[705,750,375,163,3.3,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'shield','name':'shield_2','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':3},{'id':'0ac7591e-f995-11e9-b7a5-ff820d4079a8','name':'GardienI','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[103,65,76,31,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':228},{'id':'b0c56eb2-c503-11e9-9c84-5fde933daa08','name':'Minesspatiales','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','cost':[25,35,42,23,0.4,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':300},{'id':'ed8b6c52-b455-11e9-9232-c73de7c2ef73','name':'AG-PB-III','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'b4da4388-8d04-11e9-9ee9-efdf3f501bcc','cost':[47,100,49,43,0.7,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'projector'}],'armorType':'0','note':0,'owned':82},{'id':'612a424a-c4c9-11e9-9c84-4fbd3ec5b97e','name':'DeathDefense','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'9b0a623e-8af3-11e9-a4a5-97bb37ff71c2','cost':[45,85,47,38,0.6,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':0},{'id':'c9cff2f2-badf-11e9-9232-c361552aaf4b','name':'obselette','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'098d8e86-b56d-11e9-9b82-b753467c7bd3','cost':[14,16,43,20,0.35,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':5},{'id':'23a9a5f0-bf6a-11e9-9c84-63a2c68f9f89','name':'obsolette3','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'098d8e86-b56d-11e9-9b82-b753467c7bd3','cost':[64,37,47,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':3},{'id':'8b713f54-e864-11e9-b7a5-630324df6372','name':'WaspI','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','cost':[64,37,47,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':15},{'id':'6256e2c2-b50b-11e9-9232-4f8b907aa32b','name':'Voyageur2','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'9b0a623e-8af3-11e9-a4a5-97bb37ff71c2','cost':[370,198,205,55,1.42,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_3','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':1},{'id':'94f4bed2-c49e-11e9-9c84-afad3645782a','name':'Interspatial','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'9b0a623e-8af3-11e9-a4a5-97bb37ff71c2','cost':[435,318,265,75,1.97,120],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_3','tech':'vsl'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'119d6410-e827-11e9-b7a5-3b2cad33d9df','name':'HiveCluster','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','cost':[45,85,47,38,0.6,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':24},{'id':'5aea8358-be1c-11e9-9c84-ef37c8869b3c','name':'PlateformeTracker','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'098d8e86-b56d-11e9-9b82-b753467c7bd3','cost':[34,66,48,35,0.55,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':8},{'id':'e328c40a-fe13-11e9-b7a5-2bb9425cab3d','name':'Ragnak','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'098d8e86-b56d-11e9-9b82-b753467c7bd3','cost':[103,65,76,31,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':5},{'id':'204b4a5a-f302-11e9-b7a5-eb39f259852a','name':'StingI','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','cost':[101,61,75,31,0.68,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':3},{'id':'9948bb00-f284-11e9-b7a5-6b9521d935ca','name':'AG-ILII','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[18,22,38,21,0.37,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':100},{'id':'cd8c29ca-f25b-11e9-b7a5-039e23a37b09','name':'QueenI','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','cost':[773,860,415,168,6,1321],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarDouble'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarDouble'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':1},{'id':'439d7868-f558-11e9-b7a5-e7a6541ec008','name':'MothI','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','cost':[710,765,380,178,3.6,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'shield','name':'shield_1','tech':'singularity'},{'type':'shield','name':'shield_2','tech':'magnetic'}],'armorType':'0','note':0,'owned':1},{'id':'ddcc1a98-efd6-11e9-b7a5-1fb956237fc1','name':'GuchoI','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','cost':[618,612,315,117,2.85,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':1},{'id':'aceec9a4-fe2a-11e9-b7a5-4bda9ccda84c','name':'CurasséI','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[605,690,335,153,3,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'shield','name':'shield_2','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':18},{'id':'e61eeefc-f808-11e9-b7a5-8b39f4b1034b','name':'String2','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','cost':[113,57,74,34,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':2},{'id':'4f56227c-fd96-11e9-b7a5-0b06ff0c67ee','name':'Obsolette2','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'098d8e86-b56d-11e9-9b82-b753467c7bd3','cost':[96,54,77,30,0.66,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'cannon','name':'cannon_2','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':2},{'id':'2d86906e-05a2-11ea-b7a5-f7e1eda91272','name':'CIntercepteurL','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'b85bc856-f99c-11e9-a26f-2f7d8b924610','cost':[69,32,46,21,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':0},{'id':'0f4342de-f48e-11e9-b7a5-bfbdc92ac108','name':'ButerflyI','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','cost':[415,228,215,85,1.77,120],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'},{'type':'sub_propulsion','name':'prop_2','tech':'vsolaire'},{'type':'sup_propulsion','name':'prop_3','tech':'vsl'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':1},{'id':'7292185e-fd96-11e9-b7a5-c34fab82b24c','name':'PlateformeDestroyer','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'098d8e86-b56d-11e9-9b82-b753467c7bd3','cost':[45,85,47,38,0.6,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':4},{'id':'42978102-05a2-11ea-b7a5-9fb9e34fb31a','name':'DefSat','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'b85bc856-f99c-11e9-a26f-2f7d8b924610','cost':[14,16,43,20,0.35,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'f590a230-105f-11ea-b7a5-83c02a18be63','name':'Corvettereco','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'ee8981f2-064e-11ea-ae00-73a802309321','cost':[270,138,165,45,1.12,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sup_propulsion','name':'prop_3','tech':'none'}],'armorType':'0','note':0,'owned':5},{'id':'e351d5d2-e466-11e9-b7a5-c3dd50998f27','name':'F-2-1','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'c8160ce6-8473-11e9-a63c-e76275663acb','cost':[96,54,77,30,0.66,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'cannon','name':'cannon_2','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':100},{'id':'51164b40-32c6-11ea-b890-bfe98b4d6897','name':'Chasseur','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'b4c70e6c-848f-11e9-a54f-b305d03ba1de','cost':[69,32,46,21,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':0},{'id':'094a40be-fe14-11e9-b7a5-c72d249b9b40','name':'Electra','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'098d8e86-b56d-11e9-9b82-b753467c7bd3','cost':[63,34,47,20,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':7},{'id':'eabbb576-98e0-11e9-b825-bf771fa8c5a9','name':'CL-I-I','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[69,32,46,21,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':0},{'id':'66e41176-fd08-11e9-b7a5-9f723a95d99c','name':'Transporteur','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[695,770,367,155,4.65,1301],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarSimple'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarSimple'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':6},{'id':'88588936-9bce-11e9-b7ba-0b62985aee78','name':'Cu-II-III-SSBM','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[610,705,340,168,3.3,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'shield','name':'shield_1','tech':'singularity'},{'type':'shield','name':'shield_2','tech':'magnetic'}],'armorType':'0','note':0,'owned':37},{'id':'2f7bb1c8-fc16-11e9-b7a5-53782480ac59','name':'CroiseurNucléaire','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[518,552,275,107,2.55,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'}],'armorType':'0','note':0,'owned':5},{'id':'bed2918e-f8e7-11e9-b7a5-17ba77d59439','name':'L-III','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[45,85,47,38,0.6,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':0},{'id':'913ceb44-087c-11ea-b7a5-f3869107a2b1','name':'Projection','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[754,810,399,154,5.35,1311],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'shield','name':'shield_1','tech':'turret'}],'armorType':'0','note':0,'owned':3},{'id':'eb86e3ae-982b-11ea-afa2-ebbfac199409','name':'AG-IBSafran','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[45,85,47,38,0.6,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':2},{'id':'b1ef63f6-414f-11ea-8ac8-670ad4289849','name':'HF-301','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[100,59,77,30,0.67,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':0},{'id':'8862aa7c-c6af-11e9-8839-dbe64ed8bb30','name':'Seraph','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[99,57,74,30,0.67,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'cannon','name':'cannon_2','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':925},{'id':'705e2e72-9024-11e9-b3b5-d73c4b53c57b','name':'SysTravelMK1','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'e1d3e0c8-89ef-11e9-9b4f-1b3c79306104','cost':[270,138,165,45,1.12,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sup_propulsion','name':'prop_3','tech':'none'}],'armorType':'0','note':0,'owned':1},{'id':'f7adb30c-4118-11ea-8ac8-63bed4737f7a','name':'TransporteurGalactica','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[695,750,393,145,6.05,661],'parts':[{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_4','tech':'pplasma'}],'armorType':'0','note':0,'owned':11},{'id':'080715c2-a317-11e9-b7ba-cbb7ebaadc7a','name':'Explo','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'436e2930-8615-11e9-b1a6-5fa9d38289ff','cost':[350,108,155,65,1.22,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'},{'type':'sub_propulsion','name':'prop_2','tech':'vsolaire'},{'type':'sup_propulsion','name':'prop_3','tech':'none'}],'armorType':'0','note':0,'owned':2},{'id':'d9428310-e2a5-11e9-8839-bbecd835a0a1','name':'MosquitoI','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','cost':[270,138,165,45,1.12,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sup_propulsion','name':'prop_3','tech':'none'}],'armorType':'0','note':0,'owned':6},{'id':'cc7bc2c6-9684-11e9-b825-f7969f69f5a3','name':'Petitcroiseur','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','cost':[616,619,313,125,2.87,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':7},{'id':'56ea76e0-a3ce-11e9-b7ba-43a8b7500a68','name':'Explorateur','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'436e2930-8615-11e9-b1a6-5fa9d38289ff','cost':[415,228,215,85,1.77,120],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'},{'type':'sub_propulsion','name':'prop_2','tech':'vsolaire'},{'type':'sup_propulsion','name':'prop_3','tech':'vsl'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':1},{'id':'95472f26-b78f-11e9-9232-87cb52ee7057','name':'Fast&Corvette','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'9b0a623e-8af3-11e9-a4a5-97bb37ff71c2','cost':[350,108,155,65,1.22,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'},{'type':'sub_propulsion','name':'prop_2','tech':'vsolaire'},{'type':'sup_propulsion','name':'prop_3','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':4},{'id':'3071414a-e827-11e9-b7a5-3f72e2cea44c','name':'MosquitoII','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa','cost':[370,198,205,55,1.42,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_3','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':1},{'id':'68ce4940-4347-11ea-8ac8-1f4be42ce98f','name':'Toto','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'1811a454-0597-11ea-a270-43cd4b3d41c9','cost':[14,16,43,20,0.35,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'83471742-41ea-11ea-8ac8-a35d8559ff75','name':'Colonizer','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[700,770,395,155,6.1,661],'parts':[{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_4','tech':'pplasma'}],'armorType':'0','note':0,'owned':4},{'id':'9134fa10-4071-11ea-8ac8-3b58a6d50314','name':'ChasseurlégerMk2','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','cost':[64,37,47,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':500},{'id':'a3dddf80-982b-11ea-afa2-47066a9f1df4','name':'caraqueII','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[633,637,315,122,2.95,282],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'wd'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'}],'armorType':'0','note':0,'owned':2},{'id':'adc891a0-f6f7-11e9-b7a5-9bce1c0ee9bf','name':'ALPHAIII','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[64,37,47,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':529},{'id':'23f6fe8e-fc16-11e9-b7a5-5b686a107a06','name':'Croisseured\'Assaut','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[521,570,275,116,2.57,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'explosive'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':40},{'id':'bc97ab40-49df-11ea-86ab-2b14d8c647cb','name':'Collons1','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[600,710,355,145,5.8,661],'parts':[{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'sub_propulsion','name':'prop_4','tech':'ion'}],'armorType':'0','note':0,'owned':2},{'id':'a2ba8140-4f2d-11ea-88ba-53d5a35f3028','name':'CurasséII','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[705,750,375,163,3.3,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'shield','name':'shield_2','tech':'turret'}],'armorType':'0','note':0,'owned':0},{'id':'3a3ea6cc-4f2e-11ea-88ba-6fcd79bce360','name':'Croiseurd\'AssautII','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[621,630,315,126,2.87,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'explosive'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':0},{'id':'496861ba-4f2e-11ea-88ba-eb6752a46069','name':'CroiseurNucléaireII','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[623,632,317,127,2.9,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':0},{'id':'9768c576-4f2e-11ea-88ba-ab916176139a','name':'TransporteurR-I','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[725,680,315,140,2.8,1281],'parts':[{'type':'hangar','name':'hangar_1','tech':'none'},{'type':'hangar','name':'hangar_2','tech':'none'},{'type':'hangar','name':'hangar_3','tech':'none'},{'type':'hangar','name':'hangar_4','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':10},{'id':'3b111030-6144-11ea-aaab-cf53243ece48','name':'Empyrée','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[705,750,375,163,3.3,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'shield','name':'shield_2','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':135},{'id':'0102c996-a3ef-11e9-b7ba-87d0ab75b590','name':'croiseur','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'c8160ce6-8473-11e9-a63c-e76275663acb','cost':[490,501,271,98,2.32,241],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'rocketLauncher','name':'rocket_1','tech':'explosive'},{'type':'shield','name':'shield_1','tech':'none'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':533},{'id':'7f86c372-528f-11ea-acb4-bb737d1aaf43','name':'Colonel','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'9b0a623e-8af3-11e9-a4a5-97bb37ff71c2','cost':[580,660,350,130,5.6,660],'parts':[{'type':'shield','name':'shield_1','tech':'none'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'sub_propulsion','name':'prop_4','tech':'ion'}],'armorType':'0','note':0,'owned':2},{'id':'d900225a-9650-11e9-b825-df8864a4df49','name':'BC-304Croisseur','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','cost':[623,632,317,127,2.9,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':146},{'id':'6e02653a-91e5-11ea-a6e0-a75e6e0f3d72','name':'doser','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[759,830,401,164,5.4,1311],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':1},{'id':'7011fe34-4f2e-11ea-88ba-0312c925e600','name':'ChasseurR-I','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[115,61,75,34,0.7,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':468},{'id':'719c97e2-414f-11ea-8ac8-0f6a75e68563','name':'F-302MKII','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[63,35,46,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':917},{'id':'4dfbf864-414f-11ea-8ac8-531fbbe1eb2d','name':'YorktownCV','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[768,840,413,158,5.95,1321],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarDouble'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarDouble'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'shield','name':'shield_1','tech':'turret'}],'armorType':'0','note':0,'owned':22},{'id':'2f111406-620c-11ea-aaab-a3a1a0767523','name':'CV-1322221','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'c8160ce6-8473-11e9-a63c-e76275663acb','cost':[768,840,413,158,5.95,1321],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarDouble'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarDouble'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':5},{'id':'e2729258-75fe-11ea-89fb-ef2a1a4ac405','name':'colonialI','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','cost':[680,720,390,140,5.9,660],'parts':[{'type':'shield','name':'shield_1','tech':'none'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_4','tech':'pplasma'}],'armorType':'0','note':0,'owned':12},{'id':'ca9502fc-1388-11ea-a49a-ab6a8ff16b2f','name':'CuirasséArizona','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[705,750,375,163,3.3,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'shield','name':'shield_2','tech':'turret'}],'armorType':'0','note':0,'owned':183},{'id':'afca839a-98de-11e9-b825-dfc172c412fd','name':'Corv-III','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[370,198,205,55,1.42,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_3','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'0d2a8776-9081-11e9-b3b5-3bff12372b86','name':'CM-bugué','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[99,59,74,29,0.64,10],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':0},{'id':'68a0daac-7955-11ea-a334-4f6ffbe9e774','name':'M-P-G1','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[705,750,375,163,3.3,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'shield','name':'shield_2','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':2},{'id':'7d8c0412-6ed5-11ea-ae0b-8b90790f0d3d','name':'S-AG-I-G0','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[34,66,48,35,0.55,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':1},{'id':'7292c078-a658-11e9-b7ba-a7f3b7c4615b','name':'Explorer-classcarrier','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[740,780,385,150,4.75,1301],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarSimple'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarSimple'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':2},{'id':'1ceedd5e-6ec7-11ea-ae0b-f797ae32a841','name':'S-AG-I-G1','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[38,72,43,36,0.57,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':3},{'id':'b2d9146c-8626-11ea-b95b-ef146a15c4d6','name':'Pionnier','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[768,840,413,158,5.95,1321],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarDouble'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarDouble'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'shield','name':'shield_1','tech':'turret'}],'armorType':'0','note':0,'owned':1},{'id':'872cd7b2-9e42-11e9-b7ba-7fdc16afaf40','name':'CM-II-I','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[96,54,77,30,0.66,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'cannon','name':'cannon_2','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':701},{'id':'3b8b1b8a-83ba-11ea-b95b-1b7ab8392437','name':'aggro','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[45,85,47,38,0.6,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':11},{'id':'7527f3e6-78ce-11ea-a334-17aa2b77f77b','name':'AG-IPlasma','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[25,35,42,23,0.4,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':149},{'id':'4e40e20e-98de-11e9-b825-477759eff456','name':'Corv-V-III','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[435,318,265,75,1.97,120],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_3','tech':'vsl'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'a7840d02-83b9-11ea-b95b-2ff4afa93354','name':'arras','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[64,37,47,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':0},{'id':'d55c7d04-81d9-11ea-a334-6b3220d8563b','name':'Eta-2ActisRailgunIon','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[63,34,47,20,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':6},{'id':'dbc0d782-852e-11ea-b95b-fb250f07426e','name':'SatLasLaserMag','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[38,72,43,36,0.57,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':3},{'id':'b3ce1590-839f-11ea-b95b-4315f512d5aa','name':'Eta-2ActisLaserIon','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[63,35,46,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':0},{'id':'a3c0539a-8555-11ea-b95b-eff3613ccf52','name':'SatLasPlasmaMag','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[45,85,47,38,0.6,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':0},{'id':'98f44eda-88d4-11ea-b95b-3be3120e68f7','name':'caraque','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[518,552,275,107,2.55,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':2},{'id':'4b87c674-8940-11ea-b95b-a743b8e148c0','name':'ChasseurR-IILaser','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'8a31c3d2-ef5a-11e9-8c38-3f3008600859','cost':[99,57,74,30,0.67,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'cannon','name':'cannon_2','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':100},{'id':'07845b42-85bf-11ea-b95b-3b261ca0b23e','name':'Eta-2ActisPlasmaIon','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[64,37,47,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':0},{'id':'9eccded4-91db-11ea-b95b-1781614e5da0','name':'VCol-01','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'c8160ce6-8473-11e9-a63c-e76275663acb','cost':[600,710,355,145,5.8,661],'parts':[{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'sub_propulsion','name':'prop_4','tech':'ion'}],'armorType':'0','note':0,'owned':9},{'id':'cf993214-9651-11e9-b825-d7fd78dccea2','name':'F-302M','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'0c750d1a-8474-11e9-9b8e-172be54d7e41','cost':[96,54,77,30,0.66,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'cannon','name':'cannon_2','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':1141},{'id':'937fa3bc-1388-11ea-a49a-9757f11a6377','name':'CroiseurmissilesHaruHaru','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[610,611,316,123,2.82,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'explosive'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':397},{'id':'f6b6e116-8c82-11ea-b95b-afe5b84d7107','name':'AG-ILaser','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[38,72,43,36,0.57,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':0},{'id':'96e4881e-8f3a-11ea-b95b-23fcf4e69e84','name':'ARC-170ILL','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[99,57,74,30,0.67,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'cannon','name':'cannon_2','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':1},{'id':'cbe9af4a-9033-11ea-b95b-5bae044feb0d','name':'SatelliteAG-1','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'06cc1f82-86d7-11ea-a36a-3f63e7ddd0ef','cost':[18,22,38,21,0.37,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':4},{'id':'5b8fa144-9454-11ea-9417-ff1d2f2e4b2a','name':'Colony2','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[680,720,390,140,5.9,660],'parts':[{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_4','tech':'pplasma'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':2},{'id':'f3b6ec94-4200-11ea-8ac8-9f5918547186','name':'AG-iPlasma','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[47,100,49,43,0.7,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'projector'}],'armorType':'0','note':0,'owned':55},{'id':'acf20f84-9078-11ea-b95b-b7e1c0e3d4c2','name':'X-60L','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[63,35,46,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':149},{'id':'8fe8eb76-42a1-11ea-8ac8-dbafb5b5f171','name':'VaisseauColoniallégerMk1','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'fd989762-8482-11e9-809b-d70fe98c7429','cost':[700,770,395,155,6.1,661],'parts':[{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_4','tech':'pplasma'}],'armorType':'0','note':0,'owned':127},{'id':'b09219e4-8bf1-11ea-b95b-c79f361fc828','name':'lacor','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[595,690,353,135,5.75,661],'parts':[{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'sub_propulsion','name':'prop_4','tech':'ion'}],'armorType':'0','note':0,'owned':6},{'id':'13ada764-8cdd-11ea-b95b-3b3249791aee','name':'MandatorIIIFIMagPMag','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[610,710,337,163,3.05,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'shield','name':'shield_2','tech':'magnetic'}],'armorType':'0','note':0,'owned':0},{'id':'b733f0a4-98dd-11e9-b825-13def35a1780','name':'Croiseur-II-III-II-BM','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[523,572,277,117,2.6,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':55},{'id':'057927c6-7bb3-11ea-a334-13f6ecf4bf02','name':'M-T-M-G1','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[768,840,413,158,5.95,1321],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarDouble'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarDouble'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'}],'armorType':'0','note':0,'owned':2},{'id':'afb709c6-982b-11ea-afa2-ffba54542940','name':'babyloneI','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[615,695,333,148,3.05,343],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'wd'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'shield','name':'shield_2','tech':'turret'}],'armorType':'0','note':0,'owned':2},{'id':'feb4ffce-4501-11ea-8ac8-e7a2383bb349','name':'CroiseurLegion','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[623,632,317,127,2.9,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':185},{'id':'6c8566d2-7113-11ea-ae0b-ff6a5ecce0a0','name':'M-ILo-G1','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[103,65,76,31,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':40},{'id':'b9712e24-4501-11ea-8ac8-dbfe8135e039','name':'Sabre','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[96,54,77,30,0.66,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'cannon','name':'cannon_2','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':243},{'id':'f5d114b8-7d07-11ea-a334-974834f04b34','name':'CP1CE1MI','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[100,59,77,30,0.67,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':266},{'id':'a97f07be-6f3d-11ea-ae0b-33cf047d52f3','name':'S-AG-I-G2','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[45,85,47,38,0.6,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':4},{'id':'895cc5d2-70c0-11ea-ae0b-87e01f24c570','name':'M-ILe-G1','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[64,37,47,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':10},{'id':'2cb8872a-6b80-11ea-aaab-4f280eabd9e3','name':'Vindication','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[618,612,315,117,2.85,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':71},{'id':'a99d8ecc-98de-11e9-b825-33e6cd141b99','name':'Corv-II','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[270,138,165,45,1.12,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sup_propulsion','name':'prop_3','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'ba117cc6-982b-11ea-afa2-536707cb73a1','name':'doserI','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[774,855,401,169,5.5,1351],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_2','tech':'wd'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':0},{'id':'71bcd2a6-88d4-11ea-b95b-fbb5a4534ddf','name':'babylone','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[600,670,333,143,2.95,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'shield','name':'shield_2','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'}],'armorType':'0','note':0,'owned':5},{'id':'12b8243e-92c3-11e9-b3b5-9baf783a56e3','name':'AG-ISafran','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[34,66,48,35,0.55,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':157},{'id':'0f65f48a-4201-11ea-8ac8-1750ba443087','name':'AG-iLaser','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[38,72,43,36,0.57,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':105},{'id':'1a4f26ec-92d7-11ea-bf1a-a78883d06a08','name':'IL1','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'06cc1f82-86d7-11ea-a36a-3f63e7ddd0ef','cost':[63,34,47,20,0.4,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':4},{'id':'1f7b67f2-98e1-11e9-b825-3b51d13abe18','name':'CL-II-II','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_SMALL','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[63,35,46,20,0.41,5],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':82},{'id':'6b69bfa0-8faf-11e9-b3b5-af40b4a7ec84','name':'CM-II-II','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[99,57,74,30,0.67,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'cannon','name':'cannon_2','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':340},{'id':'a3694574-935a-11ea-bf1a-13c2bc28fa9b','name':'M-CoA-G1','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[435,318,265,75,1.97,120],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sup_propulsion','name':'prop_3','tech':'vsl'}],'armorType':'0','note':0,'owned':0},{'id':'35ec344c-98de-11e9-b825-c7c659b04686','name':'Corv-V-I','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[415,228,215,85,1.77,120],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'},{'type':'sub_propulsion','name':'prop_2','tech':'vsolaire'},{'type':'sup_propulsion','name':'prop_3','tech':'vsl'}],'armorType':'0','note':0,'owned':0},{'id':'8d9912cc-984d-11ea-afa2-8ff677d177bb','name':'VaillantII','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'99040396-8495-11e9-a2dc-2b87aaaf482b','cost':[730,820,395,165,6.3,741],'parts':[{'type':'sup_propulsion','name':'prop_1','tech':'wd'},{'type':'sup_propulsion','name':'prop_2','tech':'wd'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_4','tech':'pplasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':3},{'id':'4df3a00e-7955-11ea-a334-5bebaebd3b5d','name':'M-CA-G1','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[618,612,315,117,2.85,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':4},{'id':'41d32b1c-943d-11e9-b3b5-a7543177ad85','name':'CroiseurLégerKirov','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'d9bca0cc-8473-11e9-8308-275703a6477d','cost':[611,599,311,115,2.82,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':380},{'id':'df469964-92ad-11ea-bf1a-dbc2cd2c90ea','name':'lacorI','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[695,750,393,145,6.05,661],'parts':[{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_4','tech':'pplasma'},{'type':'shield','name':'shield_1','tech':'turret'}],'armorType':'0','note':0,'owned':0},{'id':'f39a96f6-8ae0-11ea-b95b-df592a0b3184','name':'balca','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[112,55,75,33,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'railgun'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':9},{'id':'0646a290-7afb-11ea-a334-93713d4727bc','name':'M-VC-G1','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'8ee3368e-6adb-11ea-bfe9-7b7ce8280b4a','cost':[695,750,393,145,6.05,661],'parts':[{'type':'shield','name':'shield_1','tech':'turret'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_4','tech':'pplasma'}],'armorType':'0','note':0,'owned':6},{'id':'76791428-98dc-11e9-b825-43be2a2cea18','name':'CarrierI','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[675,720,362,140,4.45,1300],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarSimple'},{'type':'hangar','name':'hangar_2','tech':'hangarSimple'},{'type':'hangar','name':'hangar_3','tech':'hangarSimple'},{'type':'hangar','name':'hangar_4','tech':'hangarSimple'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'a5adfb5e-98dd-11e9-b825-afafa6d19f6b','name':'Croiseur-II-III-II-NA','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[503,522,272,102,2.4,241],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'9fd4798e-98eb-11e9-b825-dfb18c07afd8','name':'Carrier0','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[665,660,326,130,3.45,1290],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarSimple'},{'type':'hangar','name':'hangar_2','tech':'none'},{'type':'hangar','name':'hangar_3','tech':'hangarSimple'},{'type':'hangar','name':'hangar_4','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'79213854-9c38-11e9-b7ba-abfa227115ba','name':'AG-III-NA','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[25,35,42,23,0.4,1],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'b59863ca-9909-11e9-b825-770d6234290f','name':'CM-I-II','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[108,51,71,31,0.65,10],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'}],'armorType':'0','note':0,'owned':0},{'id':'fc3f8302-9c06-11ea-8f22-eb0c462461f7','name':'SmallBattleshipPFPMagLasProj','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[705,772,375,176,3.42,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'shield','name':'shield_1','tech':'projector'},{'type':'shield','name':'shield_2','tech':'magnetic'}],'armorType':'0','note':0,'owned':1},{'id':'61d6efb0-aaf0-11e9-b7ba-3f8e6c1dd457','name':'Cu-II-III-TT','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[600,670,333,143,2.95,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'shield','name':'shield_2','tech':'turret'}],'armorType':'0','note':0,'owned':56},{'id':'4da95d20-9456-11ea-9417-a35ee13d9608','name':'caraqueI','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'ba6af2c2-b56b-11e9-80ae-1f5495ce680d','cost':[618,612,315,117,2.85,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'turret'}],'armorType':'0','note':0,'owned':0},{'id':'36d1d29c-9008-11e9-b3b5-cbd5d5e71a9a','name':'Cu-II-II-TT','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[593,657,329,141,2.92,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'shield','name':'shield_1','tech':'turret'},{'type':'shield','name':'shield_2','tech':'turret'}],'armorType':'0','note':0,'owned':1},{'id':'dd7e4c50-98e2-11e9-b825-3f8d0202b1a6','name':'CM-II-III','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[103,65,76,31,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':1477},{'id':'14fd8820-9b0a-11e9-b7ba-ab01e5b551d7','name':'猫','shipType':'SHIP_DEF','shipShape':'SHIP_SAT_AG1','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[47,100,49,43,0.7,2],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'shield','name':'shield_1','tech':'projector'}],'armorType':'0','note':0,'owned':10},{'id':'6917c8c2-98de-11e9-b825-4f9c6af22714','name':'Corv-I','shipType':'SHIP_CORVET','shipShape':'SHIP_CORVET_AEGIS','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[350,108,155,65,1.22,40],'parts':[{'type':'cloak','name':'cloak_1','tech':'none'},{'type':'sub_propulsion','name':'prop_1','tech':'vsolaire'},{'type':'sub_propulsion','name':'prop_2','tech':'vsolaire'},{'type':'sup_propulsion','name':'prop_3','tech':'none'},{'type':'scanner','name':'scanner_1','tech':'none'}],'armorType':'0','note':0,'owned':0},{'id':'b1662100-8da7-11ea-b95b-5fd68e8c2b07','name':'MC80FFPPMagShield','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[700,770,395,155,6.1,661],'parts':[{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_4','tech':'pplasma'},{'type':'shield','name':'shield_1','tech':'magnetic'}],'armorType':'0','note':0,'owned':1},{'id':'81b67b8e-8b8c-11ea-b95b-7f6887d3dd02','name':'MC80FFIIMagShield','shipType':'SHIP_COLONY','shipShape':'SHIP_COLONY','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[600,710,355,145,5.8,661],'parts':[{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'sub_propulsion','name':'prop_4','tech':'ion'}],'armorType':'0','note':0,'owned':1},{'id':'8dec4c2e-8f3a-11ea-b95b-3be3df7e1974','name':'ARC-170IPP','shipType':'SHIP_FIGHTER','shipShape':'SHIP_FIGHTER_MEDIUM','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[103,65,76,31,0.69,11],'parts':[{'type':'cannon','name':'cannon_1','tech':'plasma'},{'type':'cannon','name':'cannon_2','tech':'plasma'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'}],'armorType':'0','note':0,'owned':0},{'id':'47af62f6-91d2-11ea-b95b-1b9e78459d72','name':'Imperial-classPPMagNL','shipType':'SHIP_BATTLECRUISER','shipShape':'SHIP_BATTLECRUISER_ATRIOS','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[616,619,313,125,2.87,242],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'rocketLauncher','name':'rocket_1','tech':'nuke'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'pplasma'},{'type':'sub_propulsion','name':'prop_3','tech':'pplasma'}],'armorType':'0','note':0,'owned':1},{'id':'214507f0-8cdd-11ea-b95b-77c22fae696f','name':'MandatorIIIFIMagLMag','shipType':'SHIP_CUIRASSE','shipShape':'SHIP_CUIRASSE_SMALL','ownerId':'77c9c5c8-7a24-11ea-b422-e3beacbb5f86','cost':[603,697,333,161,3.02,303],'parts':[{'type':'cannon','name':'cannon_1','tech':'laser'},{'type':'sup_propulsion','name':'prop_1','tech':'vsl'},{'type':'sub_propulsion','name':'prop_2','tech':'ion'},{'type':'sub_propulsion','name':'prop_3','tech':'ion'},{'type':'shield','name':'shield_1','tech':'magnetic'},{'type':'shield','name':'shield_2','tech':'magnetic'}],'armorType':'0','note':0,'owned':1},{'id':'9171eace-ac6a-11e9-9064-03db7ee06a0d','name':'Carrier-Max','shipType':'SHIP_CARRIER','shipShape':'SHIP_CARRIER_MEDIUM','ownerId':'7f37d8ba-8482-11e9-b379-0303a5a9b21b','cost':[703,780,390,148,5.65,1320],'parts':[{'type':'hangar','name':'hangar_1','tech':'hangarDouble'},{'type':'hangar','name':'hangar_2','tech':'hangarDouble'},{'type':'hangar','name':'hangar_3','tech':'hangarDouble'},{'type':'hangar','name':'hangar_4','tech':'hangarDouble'},{'type':'sub_propulsion','name':'prop_1','tech':'ion'},{'type':'sup_propulsion','name':'prop_2','tech':'vsl'},{'type':'shield','name':'shield_1','tech':'none'}],'armorType':'0','note':0,'owned':13}],
				defWins: false,
				planet: { address: '4-4-705-P2' },
				atkUser: findPlayer('7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa'),
				defUser: findPlayer('00000000-0000-0000-0000-000000000002'),
				atkFleetId: 'ed71ac92-f25b-11e9-b7a5-9b07df166d66',
			},
			/**
			 * Normal battle n°7:
			 */
			'Normal battle n°7': {
				defWins: false,
				planet: { address: '5-4-399-P1' },
				atkUser: findPlayer('7592a6ca-da2a-11e9-93c4-1f9fcab2f1aa'),
				defUser: findPlayer('13f030b0-acec-11e9-9f3b-33409afd4da4'),
				atkFleetId: 'e30d14ee-ee87-11e9-b7a5-735272bc4274',
			},
			/**
			 * Normal battle n°8:
			 */
			'Normal battle n°8': {
				defWins: false,
				planet: { address: '5-5-2397-P2' },
				atkUser: findPlayer('c8160ce6-8473-11e9-a63c-e76275663acb'),
				defUser: findPlayer('00000000-0000-0000-0000-000000000002'),
				atkFleetId: '134c875a-9231-11ea-bf1a-134a7134fdf4',
			},
			/**
			 * Normal battle n°9:
			 */
			'Normal battle n°9': {
				defWins: false,
				planet: { address: '4-4-1473-P6' },
				atkUser: findPlayer('77c9c5c8-7a24-11ea-b422-e3beacbb5f86'),
				defUser: findPlayer('00000000-0000-0000-0000-000000000002'),
				atkFleetId: '07b9f244-9c07-11ea-8f22-3f9eef0c393e',
			},
			/**
			 * Normal battle n°10:
			 */
			'Normal battle n°10': {
				defWins: false,
				planet: { address: '4-5-2177-P1' },
				atkUser: findPlayer('0c750d1a-8474-11e9-9b8e-172be54d7e41'),
				defUser: findPlayer('00000000-0000-0000-0000-000000000002'),
				atkFleetId: 'a67a5dd4-9463-11ea-9417-675099a2d070',
			},
			/**
			 * Normal battle n°11:
			 */
			'Normal battle n°11': {
				defWins: true,
				planet: { address: '5-5-783-P1' },
				atkUser: findPlayer('7f37d8ba-8482-11e9-b379-0303a5a9b21b'),
				defUser: findPlayer('c8160ce6-8473-11e9-a63c-e76275663acb'),
				atkFleetId: 'd84df0c4-c10e-11e9-9c84-9b112a730b5d',
			},
			/**
			 * Normal battle n°12:
			 */
			'Normal battle n°12': {
				defWins: false,
				planet: { address: '4-4-1155-P0' },
				atkUser: findPlayer('7f37d8ba-8482-11e9-b379-0303a5a9b21b'),
				defUser: findPlayer('00000000-0000-0000-0000-000000000002'),
				atkFleetId: 'fcb72092-9c38-11ea-bb78-b3665e871aac',
			},
			/**
			 * Example:
			'Example': {
				fleets: [],
				tactics: [],
				defWins: false,
				planet: { address: '' },
				atkUser: findPlayer(''),
				defUser: findPlayer(''),
				atkFleetId: '',
			},
			 */
		};

		// Generate tests
		for(const simulationName in simulations) {
			it(simulationName, (done) => {
				if(simulations[simulationName].fleets) {
					globalFleetList = JSON.parse(JSON.stringify(simulations[simulationName].fleets)).map((fleet) => {
						return {
							...fleet,
							endMoveTime: new Date(fleet.endMoveTime),
						};
					});
					lastSimulationFleetList = JSON.parse(JSON.stringify(globalFleetList)).map((fleet) => {
						return {
							...fleet,
							endMoveTime: new Date(fleet.endMoveTime),
						};
					});
				} else {
					globalFleetList = JSON.parse(JSON.stringify(lastSimulationFleetList)).map((fleet) => {
						return {
							...fleet,
							endMoveTime: new Date(fleet.endMoveTime),
						};
					});
				}

				if(simulations[simulationName].tactics) {
					tactics = JSON.parse(JSON.stringify(simulations[simulationName].tactics));
				}

				if(simulations[simulationName].units) {
					unitsList = [...JSON.parse(JSON.stringify(simulations[simulationName].units)), ...Object.values(Units.specialUnits)];
					rebuildUnitsIndex();
				}

				db.player.find = async(id) => { return findPlayer(id); };

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

					logs.logs = [];

					expectedLogs.atk_user_id = simulations[simulationName].atkUser.id;
					expectedLogs.atk_user_name = simulations[simulationName].atkUser.name;

					expectedLogs.def_user_id = simulations[simulationName].defUser.id;
					expectedLogs.def_user_name = simulations[simulationName].defUser.name;

					expectedLogs.atkFleets = lastSimulationFleetList.filter((fleet) => {
						return fleet.ownerId === simulations[simulationName].atkUser.id && (!fleet.position || fleet.position === simulations[simulationName].planet.address);
					}).map((fleet) => {
						return Fleets.extractPublicInfo(fleet, findPlayer(fleet.ownerId).name,  JSON.parse(JSON.stringify(units)));
					});
					expectedLogs.defFleets = lastSimulationFleetList.filter((fleet) => {
						return fleet.ownerId === simulations[simulationName].defUser.id && (!fleet.position || fleet.position === simulations[simulationName].planet.address);
					}).map((fleet) => {
						return Fleets.extractPublicInfo(fleet, findPlayer(fleet.ownerId).name,  JSON.parse(JSON.stringify(units)));
					});
					expectedLogs.date = logs.date = new Date();
					expectedLogs.defWins = simulations[simulationName].defWins;
					expectedLogs.location = simulations[simulationName].planet.address;

					expectedLogs.atk_fleet_id = simulations[simulationName].atkFleetId;
					expectedLogs.atk_fleet_name = lastSimulationFleetList.filter((fleet) => { return fleet.id === simulations[simulationName].atkFleetId; })[0].name;

					for(const fleet of [...logs.finalAtkFleets, ...logs.finalDefenseFleets]) {
						assert(!Number.isNaN(fleet.population));

						for(const unit in fleet.units) {
							assert(!Number.isNaN(unit));
						}
					}

					delete logs.finalAtkFleets;
					delete logs.finalDefenseFleets;

					for(const unit in logs.finalUnitCache) {
						assert(!Number.isNaN(logs.finalUnitCache[unit].owned));
					}

					delete logs.finalUnitCache;


					function sortFleets(a, b) {
						if(a.name < b.name) {
							return -1;
						}
						return 1;
					}

					logs.atkFleets.sort(sortFleets);
					logs.defFleets.sort(sortFleets);
					expectedLogs.atkFleets.sort(sortFleets);
					expectedLogs.defFleets.sort(sortFleets);

					assert.deepEqual(logs, expectedLogs);

					done();
				};

				Combat.beginFight(
					'-1',
					simulations[simulationName].planet,
					simulations[simulationName].atkUser,
					simulations[simulationName].defUser,
					simulations[simulationName].atkFleetId,
					new Date());
			});
		}
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
