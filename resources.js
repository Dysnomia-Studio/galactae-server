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
			var dataOut = dataIn.resources;
			var buildings = dataIn.groundBuilding;
			var ratio = GetMineralsRatio(dataIn.planetType);
			var time = (Date.now()-dataIn.lastResourcesUpdate)/1000/3600;
			var Dtime = Date.now()-dataIn.nextBuildingTime

			var baseProd = 2*Math.pow(buildings[1],2)-3* buildings[1]+139; // Metaux
			var baseProd1 = (2*Math.pow(buildings[1]+1,2)-3* buildings[1]+1)+139; // Metaux lvl+1

			// Maximal Storage :D
			var storageRatio = 2*Math.pow(buildings[5],2)-3* buildings[5]+139*(47.52*Math.log(buildings[5]) + 8.29); // Metaux
			var storageRatio1 = (2.2*Math.pow(buildings[5],2)-3*buildings[5]+145)*(47.52*Math.log(buildings[5]) + 8.29); // Minerais



			//Minerals
			dataOut[0] += (2.2*Math.pow(buildings[0],2)-3*buildings[0]+145)*time; //Production Algorithm

			// Prise en compte du building
			if(dataIn.nextBuilding==0 && Date.now()>dataIn.nextBuildingTime) {
				dataOut[0] += ((2.2*Math.pow(buildings[0],2)-3*buildings[0]+145)*Dtime) - (2.2*Math.pow(buildings[0],2)-3*buildings[0]+145)*Dtime;
			}

			//Helium 3
			//dataOut[1] = ?; //Space Resource

			// @ADD: prendre en compte dérive du niveau pour H-3

			//Metals
			if(dataOut[0]-(baseProd/360)>0) { //Verify if you can use basic ressources
				dataOut[2] += (baseProd*time)*ratio.ironRatio; //Iron
				dataOut[3] += (baseProd*time)*ratio.aluRatio; //Aluminium
				dataOut[4] += (baseProd*time)*ratio.copperRatio; //Copper
				dataOut[5] += (baseProd*time)*ratio.titanRatio; //Titanium

				dataOut[0] -= (baseProd*time); //Consomation Algorithm

				//Prise en compte du building
				if(dataIn.nextBuilding==1 && Date.now()>dataIn.nextBuildingTime && 
					dataIn.resources[0] 
					- ((baseProd1*Dtime) 
						- baseProd*Dtime)>0) {

					dataOut[2] += ((baseProd1*Dtime) - baseProd*Dtime)*ratio.ironRatio;
					dataOut[3] += ((baseProd1*Dtime) - baseProd*Dtime)*ratio.aluRatio;
					dataOut[4] += ((baseProd1*Dtime) - baseProd*Dtime)*ratio.copperRatio;
					dataOut[5] += ((baseProd1*Dtime) - baseProd*Dtime)*ratio.titanRatio;

					dataOut[0] -= ((baseProd1*Dtime) - baseProd*Dtime)
				}
			}
			else { // Do the max we can
				dataOut[2] += dataOut[0]*ratio.ironRatio;
				dataOut[3] += dataOut[0]*ratio.aluRatio;
				dataOut[4] += dataOut[0]*ratio.copperRatio;
				dataOut[5] += dataOut[0]*ratio.titanRatio;

				dataOut[0] = 0;
			}		

			//Max Storage
			if(dataOut[0]>storageRatio1) {
				dataOut[0] = storageRatio1;
			}
			if(dataOut[2]>storageRatio*ratio.ironRatio) { // You can't have more iron than your storage capacity
				dataOut[2] = storageRatio*ratio.ironRatio;
			}
			if(dataOut[3]>storageRatio*ratio.aluRatio) { // You can't have more aluminium than your storage capacity
				dataOut[3] = storageRatio*ratio.aluRatio;
			}
			if(dataOut[4]>storageRatio*ratio.copperRatio) { // You can't have more copper than your storage capacity
				dataOut[4] = storageRatio*ratio.copperRatio;
			}
			if(dataOut[5]>storageRatio*ratio.titanRatio) { // You can't have more titanium than your storage capacity
				dataOut[5] = storageRatio*ratio.titanRatio;
			}

			return dataOut
		}

		/* GetBuildingCost
		INPUT: building id (int), level (int)
		OUTPUT: cost (data) */
		this.GetBuildingCost = function(building,level) {
			switch(building)  {
			case 0: //Quarry
				cost = {
					aluminium: 0,
					iron: Math.round(8*Math.pow(level,2) - 20*level + 17),
					copper: 0,
					titanium: Math.round(Math.pow(0.75*level,2) + 6.5*level - 2),
					time: 0.03*Math.pow(level,2) + 0.05*level -0.2,
					energy: Math.round(Math.pow(725*level,2) + 100000*level + 500000),
					energy_difference: (Math.round(Math.pow(725*level,2) + 100000*level + 500000)-Math.round(Math.pow(725*(level-1),2) + 100000*(level-1) + 500000))
				}
			break;
			case 1: //Metallurgie
				cost = {
					aluminium: 0,
					iron: Math.round(Math.pow(2*level,2) - 2*level), //Structure
					copper: 0,
					titanium: Math.round(2.8*Math.pow(level,2) + 6*level + 6),
					time: 0.06*Math.pow(level,2) - 0.15*level + 0.1,
					energy: Math.round(Math.pow(1000*level,2) + 10000*level + 700),
					energy_difference: Math.round(Math.pow(1000*level,2) + 10000*level + 700)-Math.round(Math.pow(1000*(level-1),2) + 10000*(level-1) + 700)
				}
			break;
			case 2: //Living
				cost = {
					aluminium: 0,
					iron: Math.round(2.7*Math.pow(level,2) - 6*level + 8),
					copper: Math.round(0.4*Math.pow(level,2) + 9*level - 5),
					titanium: 0,
					time: 0.07*Math.pow(level,2) - 0.1*level + 0.05,
					energy: Math.round(Math.pow(400*level,2) + 1100*level + 700),
					energy_difference: Math.round(Math.pow(400*level,2) + 1100*level + 700)-Math.round(Math.pow(400*(level-1),2) + 1100*(level-1) + 700)
				}
			break;
			case 3: //Serres
				cost = {
					aluminium: Math.round(0.8*Math.pow(level,2) + 8*level - 5), //Structure
					iron: 0, 
					copper: 0,
					titanium: Math.round(1.2*Math.pow(level,2) + 12*level - 3.8),
					time: 0.065*Math.pow(level,2) - 0.1*level,
					energy: Math.round(80000*level - 10000),
					energy_difference: Math.round(80000*(level-1)-10000)-Math.round(80000*(level-1)-10000)
				}
			break;
			case 4: //Solar panel
				cost = {
					aluminium: Math.round(0.6*Math.pow(level,2) + 3*level),
					iron: Math.round(Math.pow(0.5*level,2) + 2*level),
					copper: Math.round(0.4*Math.pow(level,2) + 9*level - 5),
					titanium: 0,
					time: 0.05*Math.pow(level,2) - 0.1*level + 0.03,
					energy: 0,
					energy_difference: 0,
				}
			break;
			case 5: //Warehouse
				cost = {
					aluminium: 0,
					iron: Math.round(1.75*Math.pow(level,2) -1.5*level), //Structure
					copper: 0,
					titanium: Math.round(2.5*Math.pow(level,2) + 6*level + 6.5), //Blindage
					time: 0.035*Math.pow(level,2) + 0.05*level - 0.2,
					energy: Math.round(Math.pow(35*level,2)-200*level + 800), //Energy is just for lights :D
					energy_difference: Math.round(Math.pow(35*level,2) -200*level + 800)-Math.round(Math.pow(35*(level-1),2) -200*(level-1) + 800),
				}
			break;
			case 6: //Tank
				cost = {
					aluminium: Math.round(0.6*Math.pow(level,2) + 8*level - 6),
					iron: Math.round(Math.pow(2.2*level,2) + level - 10),
					copper: 0,
					titanium: Math.round(2*Math.pow(level,2) + 7*level - 6.5),
					time: 0.025*Math.pow(level,2) + 0.1*level - 0.2,
					energy: Math.round(Math.pow(15*level,2)+200*level + 1200), //Energy is just for lights :D
					energy_difference: Math.round(Math.pow(15*level,2)+200*level + 1200)-Math.round(Math.pow(15*(level-1),2)+200*(level-1) + 1200),
				}
			break;
			case 7: //Shipyard
				cost = {
					aluminium: Math.round(Math.pow(0.6*level,2) + 3*level),
					iron: Math.round(6*Math.pow(level,2) - 20*level + 24),
					copper: Math.round(0.85*Math.pow(level,2) + 3*level + 3),
					titanium: Math.round(0.5*Math.pow(level,2) + 6.5*level - 2),
					time: Math.pow(0.04*level,2) + 0.08*level - 0.1,
					energy: Math.round(Math.pow(300*level,2)-1300*level + 800),
					energy_difference: Math.round(Math.pow(300*level,2)-1300*level + 800)-Math.round(Math.pow(300*(level-1),2)-1300*(level-1) + 800),
				}
			break;
			case 8: //Research Center
				cost = {
					aluminium: Math.round(0.25*Math.pow(level,2) + 8*level),
					iron: Math.round(1.25*Math.pow(level,2) - level),
					copper: Math.round(0.25*Math.pow(level,2) + 4*level),
					titanium: Math.round(Math.pow(0.8*level,2) + 6.5*level - 2),
					time: 0.02*Math.pow(level,2) + 0.03*level - 0.1,
					energy: Math.round(Math.pow(550*level,2)-2500*level + 700),
					energy_difference: Math.round(Math.pow(550*level,2)-2500*level + 700)-Math.round(Math.pow(550*(level-1),2)-2500*(level-1) + 700),
				}
			break;
			default:
				cost = {
					aluminium: 0,
					iron: 0,
					copper: 0,
					titanium: 0,
					time: 0,
					energy: 0,
					energy_difference: 0,
				}
		}
		return cost
	}
}