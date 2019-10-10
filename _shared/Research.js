(function (exports) {
	exports._Research = class Research {
		static isSearched(user,researchName) {
			return typeof user.research[researchName] === 'number' && user.research[researchName] < 0;
		}

		static getResearchProduction(lvl) {
			return Math.round(
				researchProduction[0]*Math.pow(lvl,2) +
				researchProduction[1]*lvl +
				researchProduction[2]
			);
		}
	};
})(typeof exports === 'undefined'? window : exports);