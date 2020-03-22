(function (exports) {
	exports._Buildings = class Buildings {
		/**
		 * Build costs config
		 */
		static get buildCost() {
			/*eslint-disable no-magic-numbers */
			return {
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
					[0.35,9,-5], // Living
					[0,0,0], // Serres
					[0.57,3,-3], // Solar panel
					[0,0,0], // Warehouse
					[0,0,0], // Hedquarters
					[0.8,3,3], // Launching Center
					[0.45,4,0], // Research Center
					// Space stations
					[0.3,9,0], // Radar
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
					[0.03,0.045,-0.2], // Quarry
					[0.06,-0.2,0.2], // Metallurgie
					[0.068,-0.1,0.05], // Living
					[0.063,-0.12,0.04], // Serres
					[0.05,-0.11,0.05], // Solar panel
					[0.035,0.03,-0.17], // Warehouse
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
					[700,90120,-60000], // Quarry
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
			/*eslint-enable no-magic-numbers */
		}

		/**
		 * Gets the cost for a specific building & level
		 *
		 * @class      GetCost (name)
		 * @param      {number}  build   The building id
		 * @param      {number}  level   The level asked
		 * @return     {object}  The building cost.
		 */
		static GetCost(build,level) {
			if(build < 0 || build >= globalConst.buildingNumber) {
				return {};
			}

			const retour = {
				aluminium: 	Math.round(Buildings.buildCost['aluminium'][build][0]*Math.pow(level,2) +		Buildings.buildCost['aluminium'][build][1]*level + 	Buildings.buildCost['aluminium'][build][2]),
				iron: 		Math.round(Buildings.buildCost['iron'][build][0]*Math.pow(level,2) +			Buildings.buildCost['iron'][build][1]*level + 		Buildings.buildCost['iron'][build][2]),
				copper: 	Math.round(Buildings.buildCost['copper'][build][0]*Math.pow(level,2) + 		Buildings.buildCost['copper'][build][1]*level + 		Buildings.buildCost['copper'][build][2]),
				titanium: 	Math.round(Buildings.buildCost['titanium'][build][0]*Math.pow(level,2) + 		Buildings.buildCost['titanium'][build][1]*level + 	Buildings.buildCost['titanium'][build][2]),
				time: 				   Buildings.buildCost['time'][build][0]*Math.pow(level,2) + 			Buildings.buildCost['time'][build][1]*level + 		Buildings.buildCost['time'][build][2],
				energy: 	Math.round(Math.pow(Buildings.buildCost['energy'][build][0]*level,2) + 		Buildings.buildCost['energy'][build][1]*level + 		Buildings.buildCost['energy'][build][2]),
				energy_difference: Math.round(Math.pow(Buildings.buildCost['energy'][build][0]*level,2) + Buildings.buildCost['energy'][build][1]*level +       Buildings.buildCost['energy'][build][2]
											- (Math.pow(Buildings.buildCost['energy'][build][0]*(level-1),2) + Buildings.buildCost['energy'][build][1]*(level-1) +   Buildings.buildCost['energy'][build][2])),
				habitants:  Math.round(Buildings.buildCost['habitants'][build][0]*Math.pow(level,2) +		Buildings.buildCost['habitants'][build][1]*level + 	Buildings.buildCost['habitants'][build][2]),
				habitants_difference: Math.round(Buildings.buildCost['habitants'][build][0]*Math.pow(level,2) +	Buildings.buildCost['habitants'][build][1]*level + 	Buildings.buildCost['habitants'][build][2]
											- (Buildings.buildCost['habitants'][build][0]*Math.pow((level-1),2) +	Buildings.buildCost['habitants'][build][1]*(level-1) + Buildings.buildCost['habitants'][build][2])),
			};

			if(level === 1) {
				retour.habitants_difference = retour.habitants;
				retour.energy_difference = retour.energy;
			}

			return retour;
		}

		/**
		 * Determines if building has needed requirements.
		 *
		 * @class      HasRequirements
		 * @param      {<type>}  user    Current user
		 * @param      {<type>}  planet  Current planet
		 * @param      {<type>}  id      Building identifier
		 * @return     {string}  The requirements.
		 */
		static GetRequirements(user, planet, id) {
			if(planet.Buildings[id] > 0 || buildingParents[id] === undefined) {
				return '';
			}

			// @TODO: Use dependency engine

			let requirements = '';

			for(let i=0; i<buildingParents[id].research.length; i++) {
				if(!Research.isSearched(user, buildingParents[id].research[i])) {
					requirements += ', ';

					if(typeof translate !== 'undefined') {
						requirements += translate['research'][buildingParents[id].research[i]].name;
					}
				}
			}

			for(let i=0; i<buildingParents[id].building.length; i++) {
				const currentBuilding = buildingParents[id].building[i];
				if(currentBuilding[1] > planet.Buildings[currentBuilding[0]]) {
					requirements += ', ';

					if(typeof translate !== 'undefined') {
						requirements += translate['buildings'][currentBuilding[0]].name + ' ' + translate.messages['LEVEL'] + ' ' + currentBuilding[1];
					}
				}
			}

			return requirements.substring(1);
		}
		// Boolean version of last method
		static HasRequirements(user, planet, id) {
			return Buildings.GetRequirements(user, planet, id) === '';
		}


		/**
		 * Gets the energy production depending on building levels
		 *
		 * @param      {number}  buildings  The buildings list
		 * @return     {<type>}  Energy production
		 */
		static getEnergyProd(buildings) {
			return Math.round(
				electricity[0] * Math.pow(buildings[4],2) +
				electricity[1] * buildings[4] +
				electricity[2]
			);
		}

		/**
		 * Gets the energy consumption depending on building levels
		 *
		 * @param      {number}  buildings  The buildings list
		 * @return     {<type>}  Energy consumption
		 */
		static getEnergyCons(buildings) {
			let cons = 0;

			for(let i=0; i<globalConst.groundBuildingNumber; i++) {
				cons += parseInt(Buildings.GetCost(i,buildings[i]).energy);
			}

			return cons;
		}


		/**
		 * Check if a building configuration has enough energy to work
		 *
		 * @param      {<type>}  buildings  The buildings
		 * @return     {<type>}  { description_of_the_return_value }
		 */
		static enoughEnergy(buildings) {
			return Buildings.getEnergyProd(buildings) > Buildings.getEnergyCons(buildings);
		}

		/**
		 * Calculates the storage capacity of a planet depending on building levels
		 *
		 * @param      {number}  storageLvl                The storage level
		 * @param      {number}  heliumStorageLvl          The helium storage level
		 * @param      {<type>}  cp_molecular_compression  The status of cp_molecular_compression research
		 * @return     {Array}   The differents storage capacity.
		 */
		static calcStorageCapacity(storageLvl, heliumStorageLvl, cp_molecular_compression) {
			const warehouseBase = storageRatio[0]*Math.pow(storageLvl,2) + storageRatio[1]*storageLvl + storageRatio[2];

			let mineralStorageBase = (mineralProd[0]*Math.pow(storageLvl,2) + mineralProd[1]*storageLvl + mineralProd[2])*warehouseBase;
			let metalsStorageBase  = (metalProd[0]*Math.pow(storageLvl,2)   + metalProd[1]*storageLvl   + metalProd[2])*warehouseBase;
			let storageHelium = 0;

			if(heliumStorageLvl !== 0) {
				storageHelium = (heliumProd[0]*Math.pow(heliumStorageLvl,2)  + heliumProd[1]*heliumStorageLvl  + heliumProd[2])*
					(storageRatio[0]*Math.pow(heliumStorageLvl, 2) + storageRatio[1] * heliumStorageLvl + storageRatio[2])*heliumStorageRatio; // Helium 3
			}

			if(cp_molecular_compression) {
				mineralStorageBase *= researchBonus.cp_molecular_compression;
				metalsStorageBase *= researchBonus.cp_molecular_compression;
				storageHelium *= researchBonus.cp_molecular_compression;
			}

			return [ mineralStorageBase, metalsStorageBase, storageHelium ];
		}

		/**
		 * Determines if a planet has enough storage to upgrade a specific building
		 *
		 * @param      {<type>}   planet      The planet data
		 * @param      {<type>}   buildingId  The building number
		 * @return     {boolean}  True if has enough storage, False otherwise.
		 */
		static hasEnoughtStorage(planet, buildingId, cp_molecular_compression) {
			const metal = Buildings.calcStorageCapacity(planet.Buildings[5], planet.Buildings[10], cp_molecular_compression)[1];

			const ratio = Resources.GetRatiosPerPlanet(planet.planetType);
			const cost = Buildings.GetCost(buildingId, planet.Buildings[buildingId] + 1);

			return (cost.titanium <= metal*ratio.titanRatio) &&
				(cost.copper <= metal*ratio.copperRatio) &&
				(cost.aluminium <= metal*ratio.aluRatio) &&
				(cost.iron <= metal*ratio.ironRatio);
		}

		/**
		 * Calculates the morale of a planet
		 */
		static calcPlanetMorale(buildings) {
			return Math.min(
				0.5 + 0.5 * buildings[3] / buildings[2],
				2
			);
		}

		/**
		 * Gets the people count
		 *
		 * @param      {<type>}  currPlanet  Planet data
		 * @param      {<type>}  fleetList   The fleet list
		 * @return     {Array}   The people consumation & production
		 */
		static getPeopleConsAndProd(currPlanet, fleetList) {
			const buildings = currPlanet.Buildings;
			const prod = Math.round(habGen[0]*Math.pow(buildings[2],2) + habGen[1]*buildings[2] + habGen[2]);
			let cons = 0;

			// Buildings
			for(let i=0; i<14; i++) {
				if(buildings[i]===0) {
					continue;
				}

				if(i===currPlanet.nextBuilding) {
					// Current in-build building
					cons += parseInt(Buildings.GetCost(i,buildings[i] + 1).habitants);
					continue;
				}
				cons += parseInt(Buildings.GetCost(i,buildings[i]).habitants);
			}

			// Units builded and in-build
			for(let i=0; i<fleetList.length; i++) {
				cons += fleetList[i].population;
			}

			return [prod, cons];
		}

		/**
		 * Is there enough people on planet ?
		 *
		 * @param      {Object}  buildings  The buildings list
		 */
		static enoughPeople(planetData, fleets) {
			const [prod, cons] = Buildings.getPeopleConsAndProd(planetData, fleets);

			if(prod<cons) {
				return false;
			}

			return true;
		}

		/**
		 * Check if we can buid a building (cost given) on a specific planet
		 *
		 * @param      {<type>}  planet    The planet data
		 * @param      {<type>}  user      The user data
		 * @param      {<type>}  cost      The cost of the building
		 * @param      {number}  building  The building id
		 * @param      {Date}  currTime  The current time
		 * @return     {string}  error message, empty string if it's ok
		 */
		static checkIfCanBuild(currentPlanet, fleetList, user, cost, building, currTime) {
			let errormsg = '';

			// Cost verif
			if(cost.iron>currentPlanet.resources[2] || cost.aluminium>currentPlanet.resources[3] || cost.copper>currentPlanet.resources[4] || cost.titanium>currentPlanet.resources[5] ) {
				errormsg = 'BUILDING_ERROR_COST';
			}
			// Un bâtiment est déja en construction ?
			if(currentPlanet.nextBuildingTime !== null && currentPlanet.nextBuildingTime.getTime() > currTime.getTime()) {
				errormsg = 'BUILDING_ERROR_ALREADY';
			}
			// Niveau maximum ?
			if(currentPlanet.Buildings[building]>buildingMaxLvl[currentPlanet.planetType][building]) {
				errormsg = 'BUILDING_ERROR_MAXIMUM';
			}
			// Les requirements ?
			if(!Buildings.HasRequirements(user, currentPlanet, building)) {
				errormsg = 'BUILDING_ERROR_DEPENDENCIES';
			}

			currentPlanet.Buildings[building]++; // Only for calcs

			// Energie ? Habitants ?
			if(errormsg === '') {
				if(!Buildings.enoughEnergy(currentPlanet.Buildings) && building <= globalConst.groundBuildingNumber && building !== 4) { // Only ground buildings affected by this
					errormsg = 'BUILDING_ERROR_ENERGY';
				}
			}

			if(errormsg === '') {
				if(!Buildings.enoughPeople(currentPlanet, fleetList)) {
					errormsg = 'BUILDING_ERROR_PEOPLE';
				}
			}

			currentPlanet.Buildings[building]--; // Revert

			return errormsg;
		}
	};
})(typeof exports === 'undefined'? window : exports);
