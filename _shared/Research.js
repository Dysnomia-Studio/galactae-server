(function (exports) {
	exports._Research = class Research {
		static isSearched(user,researchName) {
			return researchName === 'researchCenter' || (typeof user.research[researchName] === 'number' && user.research[researchName] < 0);
		}

		static getResearchProduction(lvl) {
			return Math.round(
				researchProduction[0]*Math.pow(lvl,2) +
				researchProduction[1]*lvl +
				researchProduction[2]
			);
		}

		static researchedParent(user, planet, researchName, atleastOne=false) {
			if(researchList[researchName] === undefined) {
				return false;
			}
			if(researchName === 'researchCenter') {
				return true;
			}

			let count = 0;

			for(const currentParent of researchList[researchName].parents) {
				if(typeof currentParent === 'string') {
					if((!Research.isSearched(user,currentParent)) &&
						currentParent !== 'researchCenter') { // Recherche

						if(!atleastOne) {
							return false;
						}
					} else {
						count++;
					}
				} else if(
					typeof currentParent === 'object' &&
					typeof currentParent[0] === 'number') { // Batiment

					if(!atleastOne && planet.Buildings[currentParent[0]] < currentParent[1]) {
						return false;
					}
				} else if(
					typeof currentParent === 'object' &&
					typeof currentParent[0] === 'string') { // Planete

					if(!atleastOne && currentParent[0] === 'planet' && user.planetlist.length < currentParent[1]) {
						return false;
					}
				}
			}

			if(count === 0 && researchList[researchName].parents.length > 0) {
				return false;
			}

			return true;
		}
	};
})(typeof exports === 'undefined'? window : exports);
