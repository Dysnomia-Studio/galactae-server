(function (exports) {
	exports._Tutorials = class Tutorials {
		/**
		 * Determines if the user has finished tutorials.
		 *
		 * @param      {object}   user    The user
		 * @return     {boolean}  True if has finished tutorials, False otherwise.
		 */
		static hasFinishedTutorials(user) {
			return user.tutorials && Object.keys(user.tutorials).length === tutorialsList.length;
		}

		static hasAllDependancies(currTuto, user, planet) {
			if(!tutorialsDependancies[currTuto]) {
				log('No dependency for tutorial: ' + currTuto, 'warn');
				return true;
			}

			return DependencyEngine.hasAllDependencies(tutorialsDependancies[currTuto], user, planet);
		}

		static checkTutorials(user, planet) {
			if(Tutorials.hasFinishedTutorials(user)) {
				return;
			}

			for(let currTuto=0; currTuto<tutorialsList.length; currTuto++) {
				if(user.tutorials && !user.tutorials[tutorialsList[currTuto]] &&
					Tutorials.hasAllDependancies(tutorialsList[currTuto], user, planet)) {

					Websocket.sendTutorial(user, tutorialsList[currTuto]);
					break;
				}
			}
		}

		static updateTutorialList(user, planet, fleets, units) {
			if(Tutorials.hasFinishedTutorials(user)) {
				return user;
			}

			for(let currTuto=0; currTuto<tutorialsList.length; currTuto++) {
				if(user.tutorials && !user.tutorials[tutorialsList[currTuto]] &&
					Tutorials.hasCompletedTutorial(tutorialsList[currTuto], user, planet, fleets, units)) {

					user.tutorials[tutorialsList[currTuto]] = true;
				}
			}

			return user;
		}

		static hasCompletedTutorial(currTuto, user, planet, fleets, units, manually=true) {
			if(user.tutorials && user.tutorials[currTuto]) {
				return true;
			}

			if(!tutorialObjectives[currTuto]) {
				log('No objective for tutorial: ' + currTuto, 'warn');
				return true;
			}

			if(manually && tutorialObjectives[currTuto].length === 0) {
				return false; // Must be completed manually
			}

			if(!Tutorials.hasAllDependancies(currTuto, user, planet)) {
				return false;
			}

			return DependencyEngine.hasAllDependencies(tutorialObjectives[currTuto], user, planet, fleets, units);
		}
	};
})(typeof exports === 'undefined'? window : exports);
