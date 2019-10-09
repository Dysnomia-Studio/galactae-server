(function (exports) {
	exports._Research = class Research {
		static isSearched(user,researchName) {
			return isset(user.research[researchName], 'number') && user.research[researchName] < 0;
		}
	};
})(typeof exports === 'undefined'? window : exports);