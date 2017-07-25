module.exports = function() {
	this.globalConst = {
		buildingNumber: 	14,
	}
	this.pointsCoef = {
		planet:				1,
		research: 			0.02,
	}
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
		30,	// Centre de lancement
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
	};
	this.researchList = [
		// Noeud Central
		"researchCenter",
		"industrialistion",
		"phyContemporaine",
		"thermodynamique",
		// Mise en orbite et propulsion
		"prop_thermique",
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
		"wep_sat_railgun",
		"wep_sat_laser",
		"wep_sat_plasma",
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
		prop_thermique: 	380,
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
		wep_sat_railgun:	360,
		wep_sat_laser:		650,
		wep_sat_plasma:		1500,
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
}