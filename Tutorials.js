(function (exports) {
	exports.Tutorials = class Tutorials {
		/**
		 * Determines if the user has finished tutorials.
		 *
		 * @param      {object}   user    The user
		 * @return     {boolean}  True if has finished tutorials, False otherwise.
		 */
		static hasFinishedTutorials(user) {
			return Object.keys(user.tutorials).length === tutorialsList.length;
		}

		static hasAllDependancies(currTuto, user, planet) {
			if(!tutorialsDependancies[currTuto]) {
				log('No dependency for tutorial: ' + currTuto, 'warn');
				return true;
			}

			for(const dependency of tutorialsDependancies[currTuto]) {
				switch(dependency.type) {
					case 'building':
						if(planet.Buildings[dependency.building] < dependency.level) {
							return false;
						}
						break;
					case 'research':
						if(!Research.isSearched(user, dependency.research)) {
							return false;
						}
						break;

					case 'oneOfManyResearch':
						let ok = false;
						for(const currResearch of dependency.researchList) {
							if(Research.isSearched(user, currResearch)) {
								ok = true;
								break;
							}
						}


						if(!ok) {
							return false;
						}
						break;
					case 'tutorial':
						if(!user.tutorials[dependency.tutorial]) {
							return false;
						}
						break;
					default:
						log('Invalid tutorial dependency type: ' + dependency.type, 'warn');
						return false;
				}
			}

			return true;
		}

		static checkTutorials(user, planet) {
			if(Tutorials.hasFinishedTutorials(user)) {
				return;
			}

			for(let currTuto=0; currTuto<tutorialsList.length; currTuto++) {
				if( !user.tutorials[tutorialsList[currTuto]] &&
					Tutorials.hasAllDependancies(tutorialsList[currTuto], user, planet)) {

					Websocket.sendTutorial(user, tutorialsList[currTuto]);
					break;
				}
			}
		}

		static updateTutorialList(user, planet) {
			if(Tutorials.hasFinishedTutorials(user)) {
				return user;
			}

			for(let currTuto=0; currTuto<tutorialsList.length; currTuto++) {
				if( !user.tutorials[tutorialsList[currTuto]] &&
					Tutorials.hasCompletedTutorial(tutorialsList[currTuto], user, planet)) {

					user.tutorials[tutorialsList[currTuto]] = true;
				}
			}

			return user;
		}

		static hasCompletedTutorial(currTuto, user, planet) {
			if(user.tutorials[currTuto]) {
				return true;
			}

			if(!tutorialObjectives[currTuto]) {
				log('No objective for tutorial: ' + currTuto, 'warn');
				return true;
			}

			if(!Tutorials.hasAllDependancies(currTuto, user, planet)) {
				return false;
			}

			for(const objective of tutorialObjectives[currTuto]) {
				switch(objective.type) {
					case 'building':
						if(planet.Buildings[objective.building] < objective.level) {
							return false;
						}
						break;
					case 'research':
						if(!Research.isSearched(user, objective.research)) {
							return false;
						}
						break;

					case 'oneOfManyResearch':
						let ok = false;
						for(const currResearch of objective.researchList) {
							if(Research.isSearched(user, currResearch)) {
								ok = true;
								break;
							}
						}

						if(!ok) {
							return false;
						}
						break;
					case 'tutorial':
						if(!isset(user.tutorials[objective.tutorial])) {
							return false;
						}
						break;
					default:
						log('Invalid tutorial objective type: ' + objective.type, 'warn');
						return false;
				}
			}

			return true;
		}
	};
})(typeof exports === 'undefined'? window : exports);