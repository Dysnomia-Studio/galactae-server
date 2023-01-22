(function (exports) {
	exports._Resources = class Resources {
		/**
		 * Config planet ratio
		 */
		static get planetRatios() {
			const ratios = [];

			ratios[0] = ratios[1] = ratios[2] = ratios[3] = ratios[4] = ratios[5] = ratios[6] = ratios[7] = ratios[8] = ratios[9] = {
				ironRatio: 0.35, aluRatio: 0.50, copperRatio: 0.04, titanRatio: 0.10
			}; // Earth type

			ratios[101] = {
				ironRatio: 0.41, aluRatio: 0.42, copperRatio: 0.06, titanRatio: 0.10
			}; // Lave I

			ratios[102] = {
				ironRatio: 0.38, aluRatio: 0.43, copperRatio: 0.07, titanRatio: 0.11
			}; // Pierre Grise I

			ratios[103] = {
				ironRatio: 0.39, aluRatio: 0.48, copperRatio: 0.04, titanRatio: 0.08
			}; // Glace

			ratios[104] = {
				ironRatio: 0.41, aluRatio: 0.42, copperRatio: 0.07, titanRatio: 0.09
			}; // Lave II

			ratios[105] = {
				ironRatio: 0.26, aluRatio: 0.57, copperRatio: 0.05, titanRatio: 0.11
			}; // Pierre Rouge I

			ratios[106] = {
				ironRatio: 0.36, aluRatio: 0.48, copperRatio: 0.04, titanRatio: 0.11
			}; // Montagnes, forets I

			ratios[107] = {
				ironRatio: 0.38, aluRatio: 0.46, copperRatio: 0.05, titanRatio: 0.10
			}; // Montagnes, forets II

			ratios[108] = {
				ironRatio: 0.37, aluRatio: 0.46, copperRatio: 0.07, titanRatio: 0.09
			}; // Montagnes, glace

			ratios[109] = {
				ironRatio: 0.32, aluRatio: 0.42, copperRatio: 0.10, titanRatio: 0.15
			}; // Pierre Rouge II

			ratios[110] = {
				ironRatio: 0.38, aluRatio: 0.41, copperRatio: 0.09, titanRatio: 0.11
			}; // Pierre Marron

			ratios[111] = {
				ironRatio: 0.24, aluRatio: 0.59, copperRatio: 0.04, titanRatio: 0.12
			}; // Pierre couleur rouille

			ratios[112] = {
				ironRatio: 0.48, aluRatio: 0.41, copperRatio: 0.03, titanRatio: 0.07
			}; // Pierre bleue et blanche

			ratios[113] = {
				ironRatio: 0.34, aluRatio: 0.49, copperRatio: 0.05, titanRatio: 0.11
			}; // Pierre Grise II

			return ratios;
		}

		/**
		 * Gets the minerals ratio depending on a planet type
		 *
		 * @class      GetRatiosPerPlanet (name)
		 * @param      {<type>}  type    The type of planet
		 * @return     {Object}  The minerals ratio.
		 */
		static GetRatiosPerPlanet(type) {
			if(Resources.planetRatios[type] !== undefined) {
				return Resources.planetRatios[type];
			}

			return Resources.planetRatios[0];
		}

		/**
		 * Calculates the new resources based on constants building level on a
		 * specific time period.
		 *
		 * @class      CalcNewResources (resources)
		 * @param      {array}   resources   The old resources
		 * @param      {number}  buildings   The buildings levels
		 * @param      {number}  planetType  The planet type
		 * @param      {number}  time        The time period
		 * @param      {object}  user        The user
		 */
		static CalcNewResources(resources,buildings,planetType,time,user,currentBuilding,fleetFuelAvailable) {
			time = time/3600/1000; // Passage en heures

			const ratio = Resources.GetRatiosPerPlanet(planetType);
			const ratios = [ratio.ironRatio,ratio.aluRatio,ratio.copperRatio,ratio.titanRatio];

			const mineralProdBase = mineralProd[0]*Math.pow(buildings[0],2) + mineralProd[1]*buildings[0] + mineralProd[2];
			const metalProdBase   = metalProd[0]*Math.pow(buildings[1],2)   + metalProd[1]*buildings[1]   + metalProd[2];
			const heliumProdBase  = heliumProd[0]*Math.pow(buildings[13],2)  + heliumProd[1]*buildings[13]  + heliumProd[2];

			const [ mineralStorageBase, metalsStorageBase, storageHelium ] = Buildings.calcStorageCapacity(buildings[5], buildings[10], Research.isSearched(user, 'cp_molecular_compression'));

			//Minerals
			if(currentBuilding === 0) {
				resources[0] += mineralProdBase*time*buildingSlowDown;
			} else {
				resources[0] += mineralProdBase*time;
			}

			//Helium 3
			if(buildings[13] !== 0) {
				if(currentBuilding === 13) {
					resources[1] += heliumProdBase*time*buildingSlowDown;
				} else {
					resources[1] += heliumProdBase*time;
				}
			}

			//Metals
			let metalSlowDown = 1;
			if(currentBuilding === 1) {
				metalSlowDown = buildingSlowDown;
			}

			if(resources[0]-(metalProdBase * time * metalSlowDown) > 0) { //Verify if you can use basic ressources
				for(let i=2; i<6; i++) {
					resources[i] += (metalProdBase * time * metalSlowDown)*ratios[i-2];
				}

				resources[0] -= (metalProdBase * time * metalSlowDown); //Consomation Algorithm
			} else { // Do the max we can
				for(let i=2; i<6; i++) {
					resources[i] += resources[0]*ratios[i-2];
				}

				resources[0] = 0;
			}


			// Si Max de tout les metaux
			if((resources[5] > metalsStorageBase*ratio.titanRatio) &&
				(resources[4] > metalsStorageBase*ratio.copperRatio) &&
				(resources[3] > metalsStorageBase*ratio.aluRatio) &&
				(resources[2] > metalsStorageBase*ratio.ironRatio)) {

				let min = (resources[2] - metalsStorageBase*ratios[0])/ratios[0];

				for(let i=3; i<6; i++) {
					const temp = (resources[i] - metalsStorageBase*ratios[i-2])/ratios[i-2];

					if(temp<min) {
						min = temp;
					}
				}
				resources[0]+=min;

				for(let i=2; i<6; i++) {
					resources[i] -= min*ratios[i-2];
				}
			}

			//Max Storage
			if(resources[0] > mineralStorageBase) {
				resources[0] = mineralStorageBase;
			}

			if(resources[1] > (storageHelium + fleetFuelAvailable)) {
				resources[1] = storageHelium + fleetFuelAvailable;
			}

			// On detruit tout ce qui est > au max
			for(let i=2; i<6; i++) {
				if(resources[i]>metalsStorageBase*ratios[i-2]) {
					resources[i] = metalsStorageBase*ratios[i-2];
				}
			}

			// Arrondi
			for(let i=0; i<resources.length; i++) {
				resources[i] = Math.round(resources[i] * 1000)/1000;
			}

			return resources;
		}
	};
})(typeof exports === 'undefined'? window : exports);
