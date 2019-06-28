/* eslint-disable no-magic-numbers */
module.exports = function() {
	this.globalConst = {
		groundBuildingNumber:9,
		buildingNumber: 	14,
		maxFleetSize:   300000, // Number of people
	};
	this.pointsCoef = {
		planet:				1,
		research: 			0.08,
		units: 				0.0003,
		money: 			    0.0001,
	};
	this.TIME = {
		DAY_TO_HOUR: 24,
		DAY_TO_MINUTES: 24*60,
		DAY_TO_SECONDS: 24*60*60,
		DAY_TO_MS: 24*60*60*1000,

		HOUR_TO_MINUTES: 60,
		HOUR_TO_SECONDS: 60*60,
		HOUR_TO_MS: 60*60*1000,

		MINUTES_TO_SECONDS: 60,
		MINUTES_TO_MS: 60*1000,

		SECONDS_TO_MS: 1000,

		SECOND_MARGIN: 5,
	};
	/**
	 * Production
	 */
	this.mineralProd = 	[1.8,-1.5,147];
	this.metalProd = 	[1.85,-3,139];
	this.heliumProd = 	[190,-424,500];

	this.storageRatio = [0.1,0.5,7];
	this.heliumStorageRatio = 0.2;

	this.electricity = [2080000,165000,550000];
	this.habGen = [25447,419910,-170000];

	this.buildLvlUnitBuildingSpeedBonus = 0.005;

	/**
	 * Buildings
	 */
	this.buildingMaxLvl = [
		25,	// Carriere
		25,	// Metallurgie
		25,	// Habitations
		25,	// Serres
		30,	// Centrales Solaires
		25,	// Entrepôts
		5,	// Etat Major
		35,	// Centre de lancement
		30,	// Centre de recherches
		10,	// Radar
		25,	// Reservoir
		25,	// Chantier naval
		15,	// Commerce
		25,	// Mine He3
	];
	this.buildingPointCoef = [
		3, 	// Carriere
		3,	// Metallurgie
		5,	// Habitations
		5,	// Serres
		4,	// Centrales Solaires
		2,	// Entrepôts
		10,	// Etat Major
		7,	// Centre de lancement
		8,	// Centre de recherches
		4,	// Radar
		2,	// Reservoir
		8,	// Chantier naval
		6,	// Commerce
		3,	// Mine He3
	];

	this.buildingParents = [];
	this.buildingParents[9] = { // Radar
		research: ['misc_telemetrie','misc_em'],
		building: [ [7, 2] ], // Launching Center lvl 2
	};
	this.buildingParents[10] = { // Tank
		research: [],
		building: [ [7, 8] ], // Launching Center lvl 8
	};
	this.buildingParents[11] = { // Shipyard
		research: ['prop_main'],
		building: [ [7, 5] ], // Launching Center lvl 5
	};
	this.buildingParents[12] = { // Trade
		research: [],
		building: [ [11, 5], [9, 1] ], // Shipyard lvl 5 & Radar lvl 1
	};
	this.buildingParents[13] = { // He3exp
		research: [],
		building: [ [7, 8] ], // Launching Center lvl 8
	};

	/**
	 * Research
	 */
	this.researchProduction = [-0.05,12,-8];
	this.researchBonus = {
		// Bonus construction
		cp_mecanisation: -0.05,
		cp_tracteur: 	 -0.05,
		cp_materielTp: 	 -0.1,
		cp_molecular_compression: 1.1,
	};

	this.researchPos = {
		// Noeud Central
		researchCenter:		[5000,5000],
		industrialistion:	[5563,5000],
		phyContemporaine:	[4813,5333],
		thermodynamique:	[4900,4467],
		// Mise en orbite et propulsion
		prop_main:			[4313,3933],
		prop_vSolaire:		[3600,4250],
		prop_ions:			[5922,4114],
		prop_plasma:		[6918,4196],
		prop_vsl:			[7800,4150],
		prop_wd:			[8700,4100],
		prop_hyperespace:	[8750,3000],
		prop_manoeuvre:		[4813,3433],
		prop_advManoeuvre:	[5000,3000],
		prop_suprastability:[7850,3850],
		// Construction et production
		cp_mecanisation:	[6000,4600],
		cp_tracteur:		[6300,4950],
		cp_materielTp:		[6550,5250],
		cp_dbRaffinage:		[6100,5400],
		cp_molecular_compression: [5450,5350],
		// Armes
		wep_railgun:		[5900,5700],
		wep_nuke:			[6500,6300],
		wep_laser:			[6600,6000],
		wep_plasma:			[7300,6400],
		// Shields & Defenses
		def_turret:			[7500,5750],
		def_shield_magnetic:[7800,6100],
		def_shield_projector:[8100,6450],
		def_shield_singularity:[7800,7400],
		// Hangars
		hangarDouble:		[5750,3300],
		// Mines
		wep_mines:			[5300,6600],
		wep_mines_nuke:		[6250,6600],
		wep_mines_iem:		[4600,6100],
		// Figther
		figther_light_interceptor: [6100,3700],
		figther_heavy_interceptor: [6150,3400],
		figther_bomber: 	[6250,3100],
		// Battlecruiser
		battlecruiser_small: [7800,4900],
		// Cuirasse
		cuirasse_small: 	[7500,4500],
		// Corvet
		corvet_small: 		[6600,3800],
		// Carrier
		carrier_small: 		[5750,3600],
		carrier_medium: 	[5350,3350],
		// Satellites
		wep_sat_ag1:		[5300,7100],
		wep_sat_ag2:		[6350,7500],
		wep_sat_ag3:		[7329,7850],
		// Autres recherches spatiales
		misc_astronomie:	[5200,6200],
		misc_telemetrie:	[6100,6200],
		misc_advTelemetrie:	[6900,5600],
		misc_mecStellaire:	[4000,6100],
		misc_phySolaire:	[3700,5850],
		misc_phyQuantique:	[4800,5850],
		misc_calcGravit:	[4500,6500],
		misc_em:			[4300,5600],
	};

	this.researchList = {
		// Noeud Central
		researchCenter: 			{ cost: 0, 		parents: [] },
		industrialistion: 			{ cost: 8, 		parents: ['researchCenter'] },
		phyContemporaine: 			{ cost: 20, 	parents: ['researchCenter'] },
		thermodynamique: 			{ cost: 13, 	parents: ['researchCenter'] },
		// Mise en orbite et propulsion
		prop_main: 					{ cost: 380, 	parents: ['thermodynamique','misc_mecStellaire', [7,3] ] },
		prop_vSolaire: 				{ cost: 2300, 	parents: ['prop_main','misc_phySolaire'] },
		prop_ions: 					{ cost: 2000, 	parents: ['prop_main','misc_phyQuantique'] },
		prop_plasma:				{ cost: 2500, 	parents: ['prop_ions','misc_phyQuantique'] },
		prop_vsl: 					{ cost: 15000, 	parents: ['prop_ions','misc_advTelemetrie', [11, 5], [8, 10] ] },
		prop_wd: 					{ cost: 24000, 	parents: ['prop_vsl', [11,10], ['planet', 2] ] },
		prop_hyperespace: 			{ cost: 35000, 	parents: ['prop_wd', [11,20], ['planet', 5] ] },
		prop_manoeuvre: 			{ cost: 450, 	parents: ['prop_main'] },
		prop_advManoeuvre: 			{ cost: 700, 	parents: ['prop_manoeuvre'] },
		prop_suprastability:		{ cost: 5000, 	parents: ['prop_vsl'] },
		// Construction et production
		cp_mecanisation: 			{ cost: 120, 	parents: ['industrialistion'] },
		cp_tracteur: 	 			{ cost: 150, 	parents: ['industrialistion', [9,1] ] },
		cp_materielTp: 				{ cost: 350, 	parents: ['cp_tracteur','misc_advTelemetrie'] },
		cp_dbRaffinage: 			{ cost: 100, 	parents: ['industrialistion'] },
		cp_molecular_compression:	{ cost: 180, 	parents: ['industrialistion','misc_phyQuantique'] },
		// Armes
		wep_railgun:				{ cost: 50, 	parents: ['phyContemporaine'] },
		wep_nuke:					{ cost: 180, 	parents: ['wep_railgun'] },
		wep_laser:					{ cost: 260, 	parents: ['wep_railgun','misc_phyQuantique'] },
		wep_plasma:					{ cost: 480, 	parents: ['wep_laser'] },
		// Shields & Defenses
		def_turret:					{ cost: 450, 	parents: ['wep_railgun','misc_advTelemetrie'] },
		def_shield_magnetic:		{ cost: 750, 	parents: ['def_turret','misc_em'] },
		def_shield_projector:		{ cost: 1150, 	parents: ['def_shield_magnetic'] },
		def_shield_singularity:		{ cost: 1550, 	parents: ['def_shield_magnetic','misc_calcGravit'] },
		// Hangars
		hangarDouble: 				{ cost: 2200, 	parents: ['carrier_small'] },
		// Mines spatiales
		wep_mines: 					{ cost: 380, 	parents: ['misc_calcGravit','misc_telemetrie', [7,5] ] },
		wep_mines_nuke:				{ cost: 750, 	parents: ['wep_mines','wep_nuke', [7,10]] },
		wep_mines_iem:				{ cost: 550, 	parents: ['wep_mines','misc_em', [7,15]] },
		// Figther
		figther_light_interceptor: 	{ cost: 550, 	parents: ['prop_main', 'misc_advTelemetrie'] },
		figther_heavy_interceptor: 	{ cost: 850, 	parents: ['figther_light_interceptor'] },
		figther_bomber: 			{ cost: 1320, 	parents: ['figther_heavy_interceptor', 'wep_nuke'] },
		// Battlecruiser
		battlecruiser_small: 		{ cost: 2550, 	parents: ['prop_ions','misc_advTelemetrie'] },
		// Cuirasse
		cuirasse_small: 			{ cost: 2580, 	parents: ['prop_ions','misc_advTelemetrie'] },
		// Corvet
		corvet_small: 				{ cost: 680, 	parents: ['prop_main', 'misc_advTelemetrie'] },
		// Carrier
		carrier_small: 				{ cost: 2580, 	parents: ['figther_light_interceptor','prop_ions'] },
		carrier_medium: 			{ cost: 2850, 	parents: ['carrier_small'] },
		// Satellites
		wep_sat_ag1:				{ cost: 360, 	parents: ['misc_calcGravit','misc_telemetrie', [7,5] ] },
		wep_sat_ag2:				{ cost: 650, 	parents: ['wep_sat_ag1','misc_advTelemetrie', [7,10]] },
		wep_sat_ag3:				{ cost: 1500, 	parents: ['wep_sat_ag2', [7,15] ] },
		// Autres recherches
		misc_astronomie:			{ cost: 45, 	parents: ['phyContemporaine'] },
		misc_telemetrie: 			{ cost: 90, 	parents: ['misc_astronomie'] },
		misc_advTelemetrie:			{ cost: 320, 	parents: ['misc_telemetrie'] },
		misc_mecStellaire: 			{ cost: 600, 	parents: ['misc_calcGravit', 'misc_phySolaire'] },
		misc_phyQuantique: 			{ cost: 120, 	parents: ['phyContemporaine', [8,3] ] },
		misc_phySolaire: 			{ cost: 280, 	parents: ['misc_phyQuantique'] },
		misc_calcGravit: 			{ cost: 240, 	parents: ['misc_astronomie'] },
		misc_em: 					{ cost: 110, 	parents: ['phyContemporaine'] },
	};

	/**
	 * Units
	 */
	this.specialUnitsUID = {
		SHIP_WEP_MINES: '00000000-0000-0000-0000-000000000001',
		SHIP_WEP_MINES_IEM: '00000000-0000-0000-0000-000000000002',
		SHIP_WEP_MINES_NUKE: '00000000-0000-0000-0000-000000000003'
	};

	this.hqFleetCount = [2,5,9,14,20,0]; // Last entry to prevent bugs
	this.shipResearchDependencies = {
		// Satelites shapes
		SHIP_SAT_AG1: 'wep_sat_ag1',
		SHIP_SAT_AG2: 'wep_sat_ag2',
		SHIP_SAT_AG3: 'wep_sat_ag3',

		// Mines
		SHIP_WEP_MINES: 'wep_mines',
		SHIP_WEP_MINES_IEM: 'wep_mines_iem',
		SHIP_WEP_MINES_NUKE: 'wep_mines_nuke',

		// Fighter
		SHIP_FIGHTER_SMALL: 'figther_light_interceptor',
		SHIP_FIGHTER_MEDIUM: 'figther_heavy_interceptor',

		// Battlecruiser
		SHIP_BATTLECRUISER_SMALL: 'battlecruiser_small',

		// Cuirasse
		SHIP_CUIRASSE_SMALL: 'cuirasse_small',

		// Corvet
		SHIP_CORVET_SMALL: 'corvet_small',

		// Carrier
		SHIP_CARRIER_MEDIUM: 'carrier_medium',

		// Explosives
		explosive: 'wep_mines',
		nuke: 'wep_nuke',
		iem: 'wep_iem',
		antimater: 'wep_antimater',

		// Cannon
		railgun: 'wep_railgun',
		laser: 'wep_laser',
		plasma: 'wep_plasma',

		// Shields & Defences
		magnetic: 'def_shield_magnetic',
		turret: 'def_turret',
		singularity: 'def_shield_singularity',
		projector: 'def_shield_projector',

		// Cloak

		// Scanners

		// Hangar
		hangarDouble: 'hangar_double',

		// Propulsion
		vsl: 'prop_vsl',
		wd: 'prop_wd',
		hyperespace: 'prop_hyperespace',

		ion: 'prop_ions',
		pplasma: 'prop_plasma',
		vsolaire: 'prop_vSolaire',
	};
	this.shipShapesDetails = {
		SHIP_DEF: {
			SHIP_SAT_AG1: {
				svg: [
					// Aile Gauche
					['struct','rect', 75,175,250,150],
					['struct','line',125,185,125,315],
					['struct','line',175,185,175,315],
					['struct','line',225,185,225,315],
					['struct','line',275,185,275,315],
					// Centre
					['struct','rect',325,125,150,250],
					// Aile droite
					['struct','rect',475,175,250,150],
					['struct','line',525,185,525,315],
					['struct','line',575,185,575,315],
					['struct','line',625,185,625,315],
					['struct','line',675,185,675,315],
					// Contenu
					['cannon','rect',375,150, 50, 50, 'cannon_1'],
					['shield','rect',375,300, 50, 50, 'shield_1'],
				],
				content: {
					cannon: ['railgun','laser','plasma'],
					shield: ['none','magnetic','projector'],
				},
				partCount: 2,
			},
		},
		SHIP_BATTLECRUISER: {
			SHIP_BATTLECRUISER_SMALL: {
				svg: [
					// Structure
					['struct','path','M200',130,'Q',300,165,200,200,'L100',200,'L100',130,'L200',130], // Moteur gauche
					['struct','path','M400',200,'Q',600,250,400,300,'L100',300,'Q',20,250,100,200,'L400',200], // Centre
					['struct','path','M200',300,'Q',300,335,200,370,'L100',370,'L100',300,'L200',300], // Moteur droit
					// Armes
					['cannon','rect',410,225, 50, 50, 'cannon_1'],
					['rocketLauncher','rect'  ,325,225, 50, 50, 'rocket_1'],
					// Boucliers
					['shield','rect',200,225, 50, 50, 'shield_1'],
					// Propulseurs
					['sup_propulsion','rect'  , 80,225, 50, 50, 'prop_1'],
					['sub_propulsion','rect'  ,120,140, 50, 50, 'prop_2'],
					['sub_propulsion','rect'  ,120,310, 50, 50, 'prop_3'],
				],
				content: {
					cannon: ['railgun','laser','plasma'],
					rocketLauncher: ['explosive','nuke','antimater'],
					sub_propulsion: ['ion','pplasma'],
					sup_propulsion: ['vsl','wd'],
					shield: ['none','magnetic','turret'],
				},
				partCount: 6,
			},
		},
		SHIP_CUIRASSE: {
			SHIP_CUIRASSE_SMALL: {
				svg: [
					['struct','poly',100,100,50,200,50,300,100,400,225,300,500,250,225,200],
					['struct','poly',50,200,50,300,340,275,400,250,340,225],
					// Armes
					['cannon','rect',200,225, 50, 50,'cannon_1'],
					// Boucliers
					['shield','rect',130,225, 50, 50, 'shield_1'],
					['shield','rect',270,225, 50, 50, 'shield_2'],
					// Propulseurs
					['sup_propulsion','rect', 60,225, 50, 50, 'prop_1'],
					['sub_propulsion','rect', 90,140, 50, 50, 'prop_2'],
					['sub_propulsion','rect', 90,310, 50, 50, 'prop_3'],
				],
				content: {
					cannon: ['railgun','laser','plasma'],
					sub_propulsion: ['ion','pplasma'],
					sup_propulsion: ['vsl','wd'],
					shield: ['none','magnetic','turret','singularity','projector'],
				},
				partCount: 6,
			},
		},
		SHIP_FIGHTER: {
			SHIP_FIGHTER_SMALL: {
				svg: [
					['struct','poly',100,100,70,250,100,400,170,400,250,250,170,100], // Ailes
					['struct','poly',60,205,50,250,60,295,510,280,520,250,510,220], // Corps
					//['struct','poly',50,50,50,50,50,50,50,50], // Cockpit
					// Armes
					['cannon','rect'  ,455,225, 50, 50,'cannon_1'],
					// Propulseur
					['sub_propulsion','rect'  ,70,225, 50, 50,'prop_1'],
				],
				content: {
					cannon: ['railgun','laser','plasma'],
					sub_propulsion: ['vsolaire','ion'],
				},
				partCount: 2,
			},
			SHIP_FIGHTER_MEDIUM: {
				svg: [
					['struct','path','M50',300,'Q',300,-100,550,300], // Arriere
					['struct','path','M260',228,'Q',300,130,340,228], // Avant
					['struct','path','M50',300,'Q',300,150,550,300], // Cockpit
					// Armes
					['cannon','rect'  ,150,180, 50, 50,'cannon_1'],
					['cannon','rect'  ,400,180, 50, 50,'cannon_2'],
					// Propulseur
					['sub_propulsion','rect'  ,275,115, 50, 50,'prop_1'],
				],
				content: {
					cannon: ['railgun','laser','plasma'],
					sub_propulsion: ['vsolaire','ion'],
				},
				partCount: 3,
			},
		},
		SHIP_CORVET: {
			SHIP_CORVET_SMALL: {
				svg: [
					['struct','rect'  , 50,150,120, 60], // Moteur 1
					['struct','rect'  , 50,290,120, 60], // Moteur 2
					['struct','circle',250,250,150], // Corps
					['struct','path'  ,'M385',185,'Q',300,250,385,315], // Cockpit
					// Cloak
					['cloak','rect',250,120,50,50,'cloak_1'],
					// Scanner
					['scanner','rect',250,330,50,50,'scanner_1'],
					// Propulseurs
					['sub_propulsion','rect'  , 55,295, 50, 50,'prop_1'],
					['sub_propulsion','rect'  , 55,155, 50, 50,'prop_2'],
					['sup_propulsion','rect'  ,110,225, 50, 50,'prop_3'],
				],
				content: {
					cloak: ['none'],
					scanner: ['none'],
					sub_propulsion: ['vsolaire','ion','pplasma'],
					sup_propulsion: ['vsl','wd'],
				},
				partCount: 5,
			},
		},
		SHIP_CARRIER: {
			SHIP_CARRIER_MEDIUM: {
				svg: [
					['struct','path','M400',200,'Q',500,250,400,300,'L50',300,'Q',0,250,50,200,'L400',200], // Centre
					['struct','poly',60,200,60,130,220,130,240,200], // Aile gauche avant
					['struct','poly',60,200,60,90,130,90,150,200], // Aile gauche arriere
					['struct','poly',60,300,60,370,220,370,240,300], // Aile droite avant
					['struct','poly',60,300,60,410,130,410,150,300], // Aile droite arriere
					// Hangars
					['hangar','rect', 70,110,50,50,'hangar_1'], // Aile gauche arriere
					['hangar','rect',160,140,50,50,'hangar_2'], // Aile gauche avant
					['hangar','rect', 70,340,50,50,'hangar_3'], // Aile droite arriere
					['hangar','rect',160,310,50,50,'hangar_4'], // Aile droite avant
					// Boucliers
					['shield','rect',250,225, 50, 50,'shield_1'],
					// Propulseurs
					['sub_propulsion','rect'  , 100,225, 50, 50,'prop_1'],
					['sup_propulsion','rect'  , 40,225, 50, 50,'prop_2'],
				],
				content: {
					hangar: ['none','hangarSimple','hangarDouble'],
					sub_propulsion: ['ion','pplasma'],
					sup_propulsion: ['vsl','wd','hyperespace'],
					shield: ['none','magnetic','turret'],
				},
				partCount: 7,
			},
		},
	};
	this.shipCosts =  { // [Al,Fe,Ti,Cu,Time,Population]
		/**
		 * Ship shapes
		 */

		// Defenses
		SHIP_WEP_MINES: 			[  2, 15,  5,  4,0.08,   0],
		SHIP_WEP_MINES_NUKE: 		[  4, 20,  7,  6,0.10,   0],
		SHIP_WEP_MINES_IEM: 		[ 15, 25,  6, 15,0.20,   0],
		SHIP_WEP_MINES_AM: 			[  4, 25,  8,  7,0.12,   0],
		// Satellites
		SHIP_SAT_AG1: 				[ 10, 15, 35, 15,0.25,   0],
		SHIP_SAT_AG2: 				[ 15, 20, 50, 23,0.37,   0],
		SHIP_SAT_AG3: 				[ 30, 35, 60, 36,0.70,   0],
		// Battlecruisers
		SHIP_BATTLECRUISER_SMALL: 	[250,250,120, 65,1.12, 160],
		// Cruisaders
		SHIP_CUIRASSE_SMALL: 		[320,350,180,100,1.45, 220],
		// Fighters
		SHIP_FIGHTER_SMALL: 		[ 45, 25, 40, 20, 0.35,   5],
		SHIP_FIGHTER_MEDIUM: 		[ 65, 35, 60, 30, 0.52,  10],
		SHIP_FIGHTER_BOMBER: 		[ 90, 60,100, 48, 0.78,  20],
		// Corvets
		SHIP_CORVET_SMALL: 			[115, 20, 90, 40,0.62,  40],
		// Carriers
		SHIP_CARRIER_SMALL: 		[400,300,140, 75,1.25, 920],
		SHIP_CARRIER_MEDIUM: 		[500,420,190, 95,1.65,1200],

		/**
		 * Ship parts
		 */
		// Boom
		explosive: 		[  1, 10,  3,  3,0.05   ,0],
		nuke: 			[  3, 12,  5,  4,0.08,   0],
		iem: 			[ 10, 15,  4, 10,0.19,   0],
		antimater: 		[  3, 15,  6,  5,0.10,   0],
		// Cannons
		railgun: 		[  4,  1,  8,  5,0.10,   1],
		laser: 			[  8,  7,  3,  6,0.12,   1],
		plasma: 		[ 15, 20,  7,  8,0.15,   1],
		// Propulsions subluminiques
		ion: 			[ 80, 60, 40,  5,0.25,   0],
		pplasma: 		[130, 90, 60, 10,0.40,   0],
		vsolaire: 		[120, 45, 35, 15,0.30,   0],
		// Propulsions supraluminiques
		vsl: 			[ 65,120, 60, 20,0.55,  80],
		wd: 			[ 80,145, 60, 25,0.65, 120],
		hyperespace: 	[100,160,115, 30,0.75, 160],
		// Defences
		magnetic: 		[ 20, 50,  5, 15,0.20,   1],
		turret: 		[ 15, 30,  3,  5,0.15,   1],
		singularity: 	[ 20, 45,  8, 20,0.45,   1],
		projector: 		[ 22, 65,  7, 20,0.30,   1],
		// Hangars
		hangarSimple: 	[  5, 30, 18,  5,0.50,   5],
		hangarDouble: 	[ 12, 45, 25,  7,0.80,  10],

		none: [0,0,0,0,0,0],
	};

	this.shipPartsSpeed = {
		// Propulsions subluminiques
		ion: 			[ -0.000046, 0.0096, 0],
		pplasma: 		[ -0.000045, 0.0090, 0],
		vsolaire: 		[ -0.000040, 0.0080, 0],
		// Propulsions supraluminiques
		vsl: 			[    -0.027,   7.23, 0.001],
		wd: 			[    -0.016,   5.13, 0.001],
		hyperespace: 	[    -0.014,   3.68, 0.001],
	};

	this.fuelCost = {
		// Propulsions subluminiques
		ion: 			10682,
		pplasma: 		 7244,
		vsolaire: 		    0,
		// Propulsions supraluminiques
		vsl: 			32761,
		wd: 			29012,
		hyperespace: 	25492,
	};

	this.fuelStorage = {
		SHIP_BATTLECRUISER_SMALL: 250000,

		SHIP_CUIRASSE_SMALL: 225000,

		SHIP_FIGHTER_SMALL: 5000,
		SHIP_FIGHTER_MEDIUM: 10000,
		SHIP_FIGHTER_BOMBER: 13000,

		SHIP_CORVET_SMALL: 80000,

		SHIP_CARRIER_SMALL: 180000,
		SHIP_CARRIER_MEDIUM: 320000,
	};

	this.fighterWeight = {
		SHIP_FIGHTER_SMALL: 1,
		SHIP_FIGHTER_MEDIUM: 2,
		SHIP_FIGHTER_BOMBER: 2,
	};

	this.fighterMult = {
		SHIP_FIGHTER_SMALL: 0.15,
		SHIP_FIGHTER_MEDIUM: 0.3,
		SHIP_FIGHTER_BOMBER: 0.3,
	};

	this.hangarSize = {
		hangarSimple: 40,
		hangarDouble: 75,
	};

	this.hangarMiss = {
		hangarSimple:  -2,
		hangarDouble: -10,
	};

	/**
	 * Tactics
	 */
	this.TACTIC_MAX_ORDERS = 50;

	/**
	 * Tutorials
	 */
	this.tutorialsList = [
		'welcome',
		'energy',
		'inhabitants',
		'resources',
		'research',
		'endFirstPart',
		'unitsCreate',
		'unitsBuild',
		// 'buyAndSell',
		'interplanetaryFlight',
		'interstellarFlight',
		//'spy',
		'battle',
		// 'joinAlly',
		// 'quests',
		// 'secondPlanet',
	];
	this.tutorialsDependancies = {
		'welcome': [],
		'energy':
			[{
				type: 'tutorial',
				tutorial: 'welcome',
			}],
		'inhabitants':
			[{
				type: 'tutorial',
				tutorial: 'energy',
			}],
		'resources':
			[{
				type: 'tutorial',
				tutorial: 'inhabitants',
			}],
		'research':
			[{
				type: 'tutorial',
				tutorial: 'resources',
			}],
		'endFirstPart':
			[{
				type: 'tutorial',
				tutorial: 'research',
			}],
		'unitsCreate':[
			{
				type: 'oneOfManyResearch',
				researchList: [
					'figther_light_interceptor',
					'figther_heavy_interceptor',
					'figther_bomber',

					'battlecruiser_small',
					'cuirasse_small',

					'corvet_small',

					'carrier_small',
					'carrier_medium',

					'wep_sat_ag1',
					'wep_sat_ag2',
					'wep_sat_ag3',
				]
			}
		],
		'unitsBuild':
			[{ //@TODO: prendre en compte les mines
				type: 'tutorial',
				tutorial: 'unitsCreate',
			}],
		// 'buyAndSell':[],
		'interplanetaryFlight':[
			{
				type: 'tutorial',
				tutorial: 'unitsBuild',
			},
			{
				type: 'oneOfManyResearch',
				researchList: [
					'prop_vSolaire',
					'prop_ions',
				]
			}
		],
		'interstellarFlight':[
			{
				type: 'tutorial',
				tutorial: 'unitsBuild',
			},
			{
				type: 'research',
				research: 'prop_vsl',
			}
		],
		/*'spy':
			[{ //@TODO: prendre en compte corvette
				type: 'tutorial',
				tutorial: 'unitsBuild',
			}],*/
		'battle':
			[{
				type: 'tutorial',
				tutorial: 'interplanetaryFlight',
			}],
		// 'joinAlly':[],
		// 'quests':[],
		// 'secondPlanet':[],
	};
	this.tutorialObjectives ={
		'welcome': [],
		'energy':
		[{
			type: 'building',
			building: 4,
			level: 2,
		}],
		'inhabitants':
		[{
			type: 'building',
			building: 2,
			level: 2,
		},{
			type: 'building',
			building: 3,
			level: 2,
		}],
		'resources':
		[{
			type: 'building',
			building: 0,
			level: 2,
		},{
			type: 'building',
			building: 1,
			level: 2,
		}],
		'research':
		[{
			type: 'oneOfManyResearch',
			researchList: [
				'thermodynamique',
				'phyContemporaine',
				'industrialistion',
			]
		}],
		'endFirstPart': [],
		'unitsCreate': [{
			type: 'unitModel',
			count: 1,
		}],
		'unitsBuild': [{
			type: 'unitBuild',
			count: 5,
		}],
		// 'buyAndSell': [],
		'interplanetaryFlight': [{
			type: 'move',
			moveType: 'move',
			location: 'all',
		}],
		'interstellarFlight': [{
			type: 'move',
			moveType: 'move',
			location: 'outerSystem',
		}],
		//'spy': [],
		'battle': [{
			type: 'move',
			moveType: 'attack',
			location: 'all',
		}],
		// 'joinAlly': [],
		// 'quests': [],
		// 'secondPlanet': [],
	};

	/**
	 * Char filters
	 */
	this.unwantedCharAndString = [
		['<',''],
		['>',''],
		['( . ) ( . )',''],
		['(.)(.)',''],
	];
};