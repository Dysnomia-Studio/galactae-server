var db = require('./database');

module.exports = function() {
	this.researchBonus = {
		// Bonus construction
		cp_mecanisation: -0.05,
		cp_tracteur: 	 -0.05,
		cp_materielTp: 	 -0.1,
	}

	this.refreshUserResearch = function(data) {
		db.player.searchByName(data.username,function(dataReturned) {		
			var newData = dataReturned;
			var researchList = [
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

			// Checks if new research
			if(researchList.length!=newData.research.length) {
				for(var i=0; i<researchList.length; i++) {
					var key = -1;
					for(var j=0; j<newData.research.length; j++) {
						if(researchList[i]==newData.research[j][0]) {
							key = j;
							break;
						}
					}
					if(key == -1) {
						newData.research.push([researchList[i],0]);
					}
				}
			}

			researchRecalc(newData,function(user) {
				// Update to database
				user.lastAction = Date.now();
				db.player.update(user);	

				// Send data to client
				var researchOut = {};

				for(var i=0; i<user.research.length; i++) {
					researchOut[user.research[i][0]] = user.research[i][1];
				}

				io.to(data.sid).emit('player-recieve-data',{
					research: researchOut
				});
			});
		});
	}
	this.getResearch = function(data,research) {
		for(var i=0; i<data.research.length; i++) {
			if(data.research[i][0]==research) {
				return data.research[i][1];
			}
		}
		return 0;
	}

	this.researchRecalc = function(user,callback) {
		var newUser = user;

		//@Add: Calcs

		callback(newUser);
	}
}