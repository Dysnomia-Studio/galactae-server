module.exports = function() {
		/* GetMineralsRatio
		INPUT: planet type ( int )
		OUTPUT: ratios ( array ) */
		this.GetMineralsRatio = function(type) {
				switch(type) {
					case 0: //Earth type
						ironRatio = 0.35;
						aluRatio = 0.50;
						copperRatio = 0.04;
						titanRatio = 0.10;
					break;
					case 1:
						ironRatio = 0.1;
						aluRatio = 0.2;
						copperRatio = 0.3;
						titanRatio = 0.4;
					break;
					default:
						ironRatio = 42;
						aluRatio = 42;
						copperRatio = 42;
						titanRatio = 42;	
					break;
				}
			return {ironRatio: ironRatio ,aluRatio: aluRatio ,copperRatio: copperRatio ,titanRatio: titanRatio};	
		}
		/* CalcNewResources
		INPUT: planet data ( array )
		OUTPUT: new data ( array ) */
		this.CalcNewResources = function(dataIn) {
			var dataOut = new Array();
			var ratio = GetMineralsRatio(dataIn.planetType);

			//Minerals
			dataOut[0] = dataIn.resources[0] + ((dataIn.groundBuilding[0]*300)+100)/360; //Production Algorithm
			//Petrol
			dataOut[1] = dataIn.resources[1] + ((dataIn.groundBuilding[1]*300)+100)/360; //Production Algorithm
			//Gaz
			dataOut[2] = dataIn.resources[2] + ((dataIn.groundBuilding[2]*300)+100)/360; //Production Algorithm

			//Metals
			if(dataIn.resources[0]-(((dataIn.groundBuilding[3]*200)+100)/360)>0) { //Verify if you can use basic ressources
				dataOut[3] = dataIn.resources[3] + (((dataIn.groundBuilding[3]*200)+100)/360)*ratio.ironRatio; //Iron
				dataOut[4] = dataIn.resources[4] + (((dataIn.groundBuilding[3]*200)+100)/360)*ratio.aluRatio; //Aluminium
				dataOut[5] = dataIn.resources[5] + (((dataIn.groundBuilding[3]*200)+100)/360)*ratio.copperRatio; //Copper
				dataOut[6] = dataIn.resources[6] + (((dataIn.groundBuilding[3]*200)+100)/360)*ratio.titanRatio; //Titanium

				dataOut[0] -= (((dataIn.groundBuilding[3]*200)+100)/360); //Consomation Algorithm
			}
			else { //Modify nothing
				dataOut[3] = dataIn.resources[3];
				dataOut[4] = dataIn.resources[4];
				dataOut[5] = dataIn.resources[5];
				dataOut[6] = dataIn.resources[6];	
			}		

			return dataOut
		}

		/* GetBuildingCost
		INPUT: building id (int), level (int)
		OUTPUT: cost (data) */
		this.GetBuildingCost = function(building,level) {
			switch(building) {
				case 0: //Quarry
					cost = {
						aluminium: 0,
						iron: Math.round(4*Math.exp(0.3214*level)),
						copper: 0,
						titanium:  Math.round(Math.pow(0.75*level,2) + 6.5*level - 2),
						time: Math.pow(0.037*level,2) + 0.0255*level - 0.05,
						energy: Math.round(65.2*Math.exp(0.4314*level)),
						energy_difference: (Math.round(65.2*Math.exp(0.4314*level))-Math.round(65.2*Math.exp(0.4314*(level-1))))
					}
				break;
				case 1: //Metallurgie
					cost = {
						aluminium: 0,
						iron: Math.round(Math.pow(2*level,2) - 2*level + 2), //Structure
						copper: 0,
						titanium: Math.round(4.3*Math.pow(level,2) + 6*level + 6),
						time: 0.0122*Math.exp(0.3676*level),
						energy: Math.round(360*Math.pow(level,2) -1000*level + 700),
						energy_difference: Math.round(360*Math.pow(level,2) -1000*level + 700)-Math.round(360*Math.pow(level-1,2) -1000*(level-1) + 700)
					}
				break;
				case 2: //Living
					cost = {
						aluminium: 0,
						iron: Math.round(1.3*Math.pow(level,2) + 13*level - 10),
						copper: Math.round(0.4*Math.pow(level,2) + 9*level - 5),
						titanium: 0,
						time: 0.03*Math.exp(0.3*level),
						energy: Math.round(400*Math.pow(level,2) - 1100*level + 760),
						energy_difference: Math.round(400*Math.pow(level,2) - 1100*level + 760)-Math.round(400*Math.pow(level-1,2) - 1100*(level-1) + 760)
					}
				break;
				case 3: //Serres
					cost = {
						aluminium: Math.round(0.4*Math.pow(level,2) + 8*level - 3.8), //Structure
						iron: 0, 
						copper: 0,
						titanium: Math.round(1.2*Math.pow(level,2) + 12*level - 3.8),
						time: 0.035*Math.exp(0.28*level),
						energy: Math.round(5*level),
						energy_difference: Math.round(5*level)-Math.round(5*(level-1))
					}
				break;
				case 4: //Solar panel
					cost = {
						aluminium: Math.round(Math.pow(0.1*level,2) + 3*level),
						iron: Math.round(Math.pow(0.25*level,2) + 2*level + 3),
						copper: Math.round(Math.pow(0.7*level,2) + 7*level - 3),
						titanium: 0,
						time: 0.0132*Math.exp(0.3476*level),
						energy: 0,
						energy_difference: 0,
					}
				break;
				case 5: //Warehouse
					cost = {
						aluminium: 0,
						iron: Math.round(Math.pow(2*level,2) - 2*level + 2), //Structure
						copper: 0,
						titanium: Math.round(Math.pow(4.1*level,2) + 6.07*level + 6.5), //Outside
						time: 0.0122*Math.exp(0.3676*level),
						energy: Math.round(2.5*level), //Energy is just for lights :D
						energy_difference: Math.round(2.5*level)-Math.round(2.5*(level-1)),
					}
				break;
				case 6: //Tank
					cost = {
						aluminium: 0,
						iron: Math.round(Math.pow(2.2*level,2) + level + 2),
						copper: 0,
						titanium: Math.round(Math.pow(3.15*level,2) + 7.1*level - 6.5),
						time: 0.0172*Math.exp(0.33*level),
						energy: Math.round(2*level), //Energy is just for lights :D
						energy_difference: Math.round(2.5*level)-Math.round(2.5*(level-1)),
					}
				break;
				case 7: //Shipyard
					cost = {
						aluminium: 0,
						iron: Math.round(4*Math.exp(0.3214*level)),
						copper: Math.round(Math.pow(level,2) + 3*level + 3),
						titanium: 0,
						time: Math.pow(0.04*level,2) + 0.08*level - 0.1,
						energy: Math.round(4*level), //Energy is just for lights :D
						energy_difference: Math.round(2.5*level)-Math.round(2.5*(level-1)),
					}
				break;
				case 8: //launchpad
					cost = {
						aluminium: 0,
						iron: 1,
						copper: Math.round(0.25*Math.pow(level,2) + 4*level),
						titanium: 0,
						time: 0.032*Math.exp(0.345*level),
						energy: Math.round(14.975*Math.pow(level,3.1193)),
						energy_difference: Math.round(14.975*Math.pow(level,3.1193))-Math.round(14.975*Math.pow(level-1,3.1193)),
					}
				break;
				default:
					cost = {
						aluminium: 0,
						iron: 0,
						copper: 0,
						titanium: 0,
						time: getStringTime(0),
						energy: 0,
						energy_difference: 0,
					}
			}
		return cost
	}
}