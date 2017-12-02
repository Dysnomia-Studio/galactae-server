module.exports = function() {
	this.globalConst = {
		buildingNumber: 	14,
		maxFleetSize:   300000, // Number of people
	};
	this.pointsCoef = {
		planet:				1,
		research: 			0.08,
		money: 			    0.0001,
	};
	/** 
	 * Production
	 */
	this.planetRatios = [
		{ironRatio: 0.35, aluRatio: 0.50, copperRatio: 0.04, titanRatio: 0.10}, // Earth type
	];

	this.mineralProd = 	[2,-2,145];
	this.metalProd = 	[1.85,-3,139];
	this.heliumProd = 	[190,-424,500];

	this.storageRatio = [47.52,8.29];
	this.heliumStorageRatio = 0.2;

	this.electricity = [2080000,165000,550000];
	this.habGen = [25447,419910,-250000];
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
		25	// Mine He3
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
	this.buildCost = {
		aluminium: [
			// Ground building
			[0,0,0], // Quarry
			[0,0,0], // Metallurgie
			[0,0,0], // Living
			[0.8,8,-5], // Serres
			[0.6,3,0], // Solar panel
			[0,0,0], // Warehouse
			[0.6,8,-6], // Hedquarters
			[0.6,3,0], // Launching Center
			[0.25,8,0], // Research Center
			// Space stations
			[1.7,1,0], // Radar
			[0.7,8,-3], // Tank
			[0.5,4,5], // Shipyard
			[0.6,3,5], // Trade
			[0.9,9,-3], // He3exp
		],
		iron: [
			// Ground building
			[8,-20,17], // Quarry
			[2,-2,0], // Metallurgie
			[2.7,-6,8], // Living
			[0,0,0], // Serres
			[0.5,2,0], // Solar panel
			[1.75,-1.5,0], // Warehouse
			[0.8,2,0], // Hedquarters
			[6,-20,24], // Launching Center
			[1.25,-1,0], // Research Center
			// Space stations
			[0,0,0], // Radar
			[2.2,2,0], // Tank
			[2,2,8], // Shipyard
			[2.5,4,0], // Trade
			[1.5,3,0], // He3exp
		],
		copper: [
			// Ground building
			[0,0,0], // Quarry
			[0,0,0], // Metallurgie
			[0.4,9,-5], // Living
			[0,0,0], // Serres
			[0.4,9,-5], // Solar panel
			[0,0,0], // Warehouse
			[0,0,0], // Hedquarters
			[0.85,3,3], // Launching Center
			[0.25,4,0], // Research Center
			// Space stations
			[0.35,9,0], // Radar
			[0,0,0], // Tank
			[0,0,0], // Shipyard
			[0,0,0], // Trade
			[0,0,0], // He3exp
		],
		titanium: [
			// Ground building
			[0.75,6.5,-2], // Quarry
			[2.8,6,6], // Metallurgie
			[0,0,0], // Living
			[1.2,12,-3.8], // Serres
			[0,0,0], // Solar panel
			[2.5,6,6.5], // Warehouse
			[1.2,5,-6.5], // Hedquarters
			[0.5,6.5,-2], // Launching Center
			[0.8,6.5,-2], // Research Center
			// Space stations
			[0,0,0], // Radar
			[0,0,0], // Tank
			[3,0,8], // Shipyard
			[0,0,0], // Trade
			[0,0,0], // He3exp
		],
		time: [
			// Ground building
			[0.03,0.05,-0.2], // Quarry
			[0.06,-0.15,0.1], // Metallurgie
			[0.07,-0.1,0.05], // Living
			[0.065,-0.1,0], // Serres
			[0.05,-0.1,0.03], // Solar panel
			[0.035,0.05,-0.2], // Warehouse
			[0.05,0.1,-0.1], // Hedquarters
			[0.04,0.08,-0.1], // Launching Center
			[0.02,0.03,-0.1], // Research Center
			// Space stations
			[0.1,0.1,0], // Radar
			[0.025,0.1,0], // Tank
			[0.075,0.15,0.15], // Shipyard
			[0.12,0.5,0], // Trade
			[0.017,0.15,0], // He3exp
		],
		energy: [
			// Ground building
			[725,100000,500000], // Quarry
			[1000,-10000,700], // Metallurgie
			[400,-1100,700], // Living
			[0,80000,-10000], // Serres
			[0,0,0], // Solar panel
			[35,-200,800], // Warehouse
			[150,200,1200], // Hedquarters
			[300,-1300,800], // Launching Center
			[550,-2500,700], // Research Center
			// Space stations
			[0,0,0], // Radar
			[0,0,0], // Tank
			[0,0,0], // Shipyard
			[0,0,0], // Trade
			[0,0,0], // He3exp
		],
		habitants: [
			// Ground building
			[700,90120,60000], // Quarry
			[1300,72010,-32359], // Metallurgie
			[0,0,0], // Living
			[2035,24090,15464], // Serres
			[323,18721,-3092], // Solar panel
			[1640,12231,-6422], // Warehouse
			[0,1750,-1250], // Hedquarters
			[1550,40504,0], // Launching Center
			[1000,22439,30231], // Research Center
			// Space stations
			[0,267,-167], // Radar
			[800,14500,-1500], // Tank
			[2205,32000,20000], // Shipyard
			[7000,18000,20000], // Trade
			[3029,10533,18000], // He3exp
		],
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
		prop_thermique:		[4313,3933],
		prop_vSolaire:		[3600,4250],
		prop_ions:			[5922,4114],
		prop_vsl:			[6918,4196],
		prop_hyperespace:	[7800,4150],
		prop_manoeuvre:		[4813,3433],
		prop_advManoeuvre:	[5000,3000],
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
		// Mines
		wep_mines:			[5300,6600],
		wep_mines_nuke:		[6250,6600],
		wep_mines_iem:		[4600,6100],
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
		researchCenter: 	{ cost: 0, parents: [] },
		industrialistion: 	{ cost: 8, parents: ["researchCenter"] },		
		phyContemporaine: 	{ cost: 20, parents: ["researchCenter"] },	
		thermodynamique: 	{ cost: 13, parents: ["researchCenter"] },
		// Mise en orbite et propulsion
		prop_main: 			{ cost: 380, parents: ["thermodynamique","misc_mecStellaire",] },
		prop_vSolaire: 		{ cost: 2300, parents: ["prop_main","misc_phySolaire"] },
		prop_ions: 			{ cost: 2000, parents: ["prop_main","misc_phyQuantique"] },
		prop_vsl: 			{ cost: 15000, parents: ["prop_ions","misc_advTelemetrie"] },
		prop_hyperespace: 	{ cost: 35000, parents: ["prop_vsl"] },
		prop_manoeuvre: 	{ cost: 450, parents: ["prop_main"] },
		prop_advManoeuvre: 	{ cost: 700, parents: ["prop_manoeuvre"] },
		// Construction et production
		cp_mecanisation: 	{ cost: 120, parents: ["industrialistion"] },
		cp_tracteur: 	 	{ cost: 150, parents: ["industrialistion"] },
		cp_materielTp: 		{ cost: 350, parents: ["cp_tracteur","misc_advTelemetrie"] },
		cp_dbRaffinage: 	{ cost: 100, parents: ["industrialistion"] },
		cp_molecular_compression: 	{ cost: 180, parents: ["industrialistion","misc_phyQuantique"] },
		// Armes
		wep_railgun:		{ cost: 50, parents: ["phyContemporaine"] },
		wep_nuke:			{ cost: 180, parents: ["wep_railgun"] },
		wep_laser:			{ cost: 260, parents: ["wep_railgun","misc_phyQuantique"] },
		wep_plasma:			{ cost: 480, parents: ["wep_laser"] },
		// Mines spatiales
		wep_mines: 			{ cost: 380, parents: ["misc_calcGravit","misc_telemetrie"] },
		wep_mines_nuke:		{ cost: 750, parents: ["wep_mines","wep_nuke"] },
		wep_mines_iem:		{ cost: 550, parents: ["wep_mines","misc_em"] },
		// Satellites
		wep_sat_ag1:		{ cost: 360, parents: ["misc_calcGravit","misc_telemetrie"] },
		wep_sat_ag2:		{ cost: 650, parents: ["wep_sat_ag1","misc_advTelemetrie"] },
		wep_sat_ag3:		{ cost: 1500, parents: ["wep_sat_ag2"] },
		// Autres recherches
		misc_astronomie:	{ cost: 45, parents: ["phyContemporaine"] },
		misc_telemetrie: 	{ cost: 90, parents: ["misc_astronomie"] },
		misc_advTelemetrie: { cost: 320, parents: ["misc_telemetrie"] },
		misc_mecStellaire: 	{ cost: 340, parents: ["misc_calcGravit"] },
		misc_phyQuantique: 	{ cost: 120, parents: ["phyContemporaine"] },
		misc_phySolaire: 	{ cost: 280, parents: ["misc_phyQuantique"] },
		misc_calcGravit: 	{ cost: 240, parents: ["misc_astronomie"] },
		misc_em: 			{ cost: 110, parents: ["phyContemporaine"] },
	};
	this.researchNamesList = [
		// Noeud Central
		"researchCenter",
		"industrialistion",
		"phyContemporaine",
		"thermodynamique",
		// Mise en orbite et propulsion
		"prop_main",
		"prop_vSolaire",
		"prop_ions",
		"prop_vsl",
		"prop_hyperespace",
		"prop_manoeuvre",
		"prop_advManoeuvre",
		// Construction et production
		"cp_mecanisation",
		"cp_tracteur",
		"cp_materielTp",
		"cp_dbRaffinage",
		"cp_molecular_compression",
		// Armes
		"wep_railgun",
		"wep_nuke",
		"wep_laser",
		"wep_plasma",
		// Mines Spatiales
		"wep_mines",
		"wep_mines_nuke",
		"wep_mines_iem",
		// Satellites
		"wep_sat_ag1",
		"wep_sat_ag2",
		"wep_sat_ag3",
		// Autres recherches
		"misc_astronomie",
		"misc_telemetrie",
		"misc_advTelemetrie",
		"misc_mecStellaire",
		"misc_phyQuantique",
		"misc_phySolaire",
		"misc_calcGravit",
		"misc_em",
	];
	this.researchCost = {
		researchCenter: 	0,
		industrialistion: 	8,		
		phyContemporaine: 	20,	
		thermodynamique: 	13,
		// Mise en orbite et propulsion
		prop_main: 			380,
		prop_vSolaire: 		2300,
		prop_ions: 			2000,
		prop_vsl: 			15000,
		prop_hyperespace: 	35000,
		prop_manoeuvre: 	450,
		prop_advManoeuvre: 	700,
		// Construction et production
		cp_mecanisation: 	120,
		cp_tracteur: 	 	150,
		cp_materielTp: 		350,
		cp_dbRaffinage: 	100,
		cp_molecular_compression: 180,
		// Armes
		wep_railgun:		50,
		wep_nuke:			180,
		wep_laser:			260,
		wep_plasma:			480,
		// Mines spatiales
		wep_mines: 			380,
		wep_mines_nuke:		750,
		wep_mines_iem:		550,
		// Satellites
		wep_sat_ag1:	    360,
		wep_sat_ag2:		650,
		wep_sat_ag3:		1500,
		// Autres recherches
		misc_astronomie:	45,
		misc_telemetrie: 	90,
		misc_advTelemetrie: 320,
		misc_mecStellaire: 	340,
		misc_phyQuantique: 	120,
		misc_phySolaire: 	280,
		misc_calcGravit: 	240,
		misc_em: 			110,
	};
	/**
	 * Units
	 */
	this.hqFleetCount = [2,5,9,14,20,0]; // Last entry to prevent bugs
	this.shipResearchDependencies = {
		// Satelites shapes
		SHIP_SAT_AG1: "wep_sat_ag1",
		SHIP_SAT_AG2: "wep_sat_ag2",
		SHIP_SAT_AG3: "wep_sat_ag3",

		// Mines
		SHIP_WEP_MINES: "wep_mines",
		SHIP_WEP_MINES_IEM: "wep_mines_iem",
		SHIP_WEP_MINES_NUKE: "wep_mines_nuke",

		// Explosives
		explosive: "wep_mines",
		nuke: "wep_nuke",
		iem: "wep_iem",
		antimater: "wep_antimater",

		// Cannon
		railgun: "wep_railgun",
		laser: "wep_laser",
		plasma: "wep_plasma",

		// Shields

		// Cloak
		
		// Scanners
		
		// Propulsion
		vsl: "prop_vsl",
		hyperespace: "prop_hyperespace",

		ion: "prop_ions",
		vsolaire: "prop_vSolaire",
	};
	this.shipShapesDetails = {
		SHIP_DEF: {
			SHIP_SAT_AG1: {
				svg: [
					// Aile Gauche
					["struct","rect", 75,175,250,150],
					["struct","line",125,185,125,315],
					["struct","line",175,185,175,315],
					["struct","line",225,185,225,315],
					["struct","line",275,185,275,315],
					// Centre
					["struct","rect",325,125,150,250],
					// Aile droite
					["struct","rect",475,175,250,150],
					["struct","line",525,185,525,315],
					["struct","line",575,185,575,315],
					["struct","line",625,185,625,315],
					["struct","line",675,185,675,315],
					// Contenu
					["cannon","rect",375,150, 50, 50, "cannon_1"],
					["shield","rect",375,300, 50, 50, "shield_1"],
				],
				content: {
					cannon: ["railgun","laser","plasma"],
					shield: ["none"],
				},
				stats: {
					mass: 0,
				},
			},
		},
		SHIP_BATTLECRUISER: {
			SHIP_BATTLECRUISER_SMALL: {
				svg: [
					// Structure
					["struct","path","M200",130,"Q",300,165,200,200,"L100",200,"L100",130,"L200",130], // Moteur gauche
					["struct","path","M400",200,"Q",600,250,400,300,"L100",300,"Q",20,250,100,200,"L400",200], // Centre
					["struct","path","M200",300,"Q",300,335,200,370,"L100",370,"L100",300,"L200",300], // Moteur droit
					// Armes
					["cannon","rect",410,225, 50, 50, "cannon_1"],
					["rocketLauncher","rect"  ,325,225, 50, 50, "rocket_1"],
					// Boucliers
					["shield","rect",200,225, 50, 50, "shield_1"],
					// Propulseurs
					["sup_propulsion","rect"  , 80,225, 50, 50, "prop_1"],
					["sub_propulsion","rect"  ,120,140, 50, 50, "prop_2"],
					["sub_propulsion","rect"  ,120,310, 50, 50, "prop_3"],
				],
				content: {
					cannon: ["railgun","laser","plasma"],
					rocketLauncher: ["explosive","nuke","antimater"],
					sub_propulsion: ["ion"],
					sup_propulsion: ["vsl","hyperespace"],
					shield: ["none"],
				},
				stats: {
					mass: 0,
				},
			},
		},
		SHIP_CUIRASSE: {
			SHIP_CUIRASSE_SMALL: {
				svg: [],
				content: {},
				stats: {
					mass: 0,
				},
			},
		},
		SHIP_FIGHTER: {
			SHIP_FIGHTER_SMALL: {
				svg: [
					["struct","poly",100,100,70,250,100,400,170,400,250,250,170,100], // Ailes
					["struct","poly",60,205,50,250,60,295,510,280,520,250,510,220], // Corps
					//["struct","poly",50,50,50,50,50,50,50,50], // Cockpit
					// Armes
					["cannon","rect"  ,455,225, 50, 50,"cannon_1"],
					// Propulseur
					["sub_propulsion","rect"  ,70,225, 50, 50,"prop_1"],
				],
				content: {
					cannon: ["railgun","laser","plasma"],
					sub_propulsion: ["ion","vsolaire"],
				},
				stats: {
					mass: 0,
				},
			},
			SHIP_FIGHTER_MEDIUM: {
				svg: [
					["struct","path","M50",300,"Q",300,-100,550,300], // Arriere
					["struct","path","M260",228,"Q",300,130,340,228], // Avant
					["struct","path","M50",300,"Q",300,150,550,300], // Cockpit
					// Armes
					["cannon","rect"  ,150,180, 50, 50,"cannon_1"],
					["cannon","rect"  ,400,180, 50, 50,"cannon_2"],
					// Propulseur
					["sub_propulsion","rect"  ,275,115, 50, 50,"prop_1"],
				],
				content: {
					cannon: ["railgun","laser","plasma"],
					sub_propulsion: ["ion","vsolaire"],
				},
				stats: {
					mass: 0,
				},
			},
		},
		SHIP_CORVET: {
			SHIP_CORVET_SMALL: {
				svg: [			
					["struct","rect"  , 50,150,120, 60], // Moteur 1
					["struct","rect"  , 50,290,120, 60], // Moteur 2
					["struct","circle",250,250,150], // Corps
					["struct","path"  ,"M385",185,"Q",300,250,385,315], // Cockpit
					// Cloak
					["cloak","rect",250,120,50,50,"cloak_1"],
					// Scanner
					["scanner","rect",250,330,50,50,"scanner_1"],
					// Propulseurs
					["sub_propulsion","rect"  , 55,295, 50, 50,"prop_1"],
					["sub_propulsion","rect"  , 55,155, 50, 50,"prop_2"],
					["sup_propulsion","rect"  ,110,225, 50, 50,"prop_3"],
				],
				content: {
					cloak: ["none"],
					scanner: ["none"],
					sub_propulsion: ["ion","vsolaire"],
					sup_propulsion: ["vsl","hyperespace"],
				},
				stats: {
					mass: 0,
				},
			},
		},
		SHIP_CARRIER: {
			SHIP_CARRIER_MEDIUM: {
				svg: [
					["struct","path","M400",200,"Q",500,250,400,300,"L50",300,"Q",0,250,50,200,"L400",200], // Centre	
					["struct","poly",60,200,60,130,220,130,240,200], // Aile gauche avant 
					["struct","poly",60,200,60,90,130,90,150,200], // Aile gauche arriere
					["struct","poly",60,300,60,370,220,370,240,300], // Aile droite avant
					["struct","poly",60,300,60,410,130,410,150,300], // Aile droite arriere
					// Hangars
					["hangar","rect", 70,110,50,50,"hangar_1"], // Aile gauche arriere 
					["hangar","rect",160,140,50,50,"hangar_2"], // Aile gauche avant 
					["hangar","rect", 70,340,50,50,"hangar_3"], // Aile droite arriere
					["hangar","rect",160,310,50,50,"hangar_4"], // Aile droite avant
					// Boucliers
					["shield","rect",250,225, 50, 50,"shield_1"],
					// Propulseurs
					["sub_propulsion","rect"  , 100,225, 50, 50,"prop_1"],
					["sup_propulsion","rect"  , 40,225, 50, 50,"prop_2"],
				],
				content: {
					hangar: ["none"],
					sub_propulsion: ["ion"],
					sup_propulsion: ["vsl","hyperespace"],
					shield: ["none"],
				},
				stats: {
					mass: 0,
				},
			},
		},
	};
}