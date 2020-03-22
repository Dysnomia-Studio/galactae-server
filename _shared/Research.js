(function (exports) {
	exports._Research = class Research {
		static isSearched(user, researchName) {
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

			if(!atleastOne) {
				return DependencyEngine.hasAllDependencies(researchList[researchName].parents, user, planet);
			}

			return DependencyEngine.hasAtLeastOneDependency(researchList[researchName].parents, user, planet);
		}
	};
})(typeof exports === 'undefined'? window : exports);
