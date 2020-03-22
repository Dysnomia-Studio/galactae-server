(function (exports) {
	exports._DependencyEngine = class DependencyEngine {
		static getDependenciesStatus(dependencies, user, planet, fleets, units, combatReports) {
			if(!Array.isArray(dependencies) || dependencies.length === 0) {
				return [[], []];
			}

			const validatedDependencies = [];
			const notValidatedDependencies = [];

			// Buildings
			const buildingsDependencies = dependencies.filter((dependency) => dependency.type === 'building');
			for(const buildingDependency of buildingsDependencies) {
				if(planet.Buildings[buildingDependency.id] >= buildingDependency.lvl) {
					validatedDependencies.push('building_' + buildingDependency.id);
				} else {
					notValidatedDependencies.push('building_' + buildingDependency.id);
				}
			}

			// Planet Count
			const planetCountDependencies = dependencies.filter((dependency) => dependency.type === 'planetCount');
			for(const planetCountDependency of planetCountDependencies) {
				if(user.planetlist.length >= planetCountDependency.count) {
					validatedDependencies.push('planetCount');
				} else {
					notValidatedDependencies.push('planetCount');
				}
			}

			// Research
			const researchDependencies = dependencies.filter((dependency) => dependency.type === 'research');
			for(const researchDependency of researchDependencies) {
				if(Research.isSearched(user, researchDependency.name)) {
					validatedDependencies.push('research_' + researchDependency.name);
				} else {
					notValidatedDependencies.push('research_' + researchDependency.name);
				}
			}

			// Tutorials
			const tutorialsDependencies = dependencies.filter((dependency) => dependency.type === 'tutorial');
			for(const tutorialDependency of tutorialsDependencies) {
				if(user.tutorials[tutorialDependency.name]) {
					validatedDependencies.push('tutorial_' + tutorialDependency.name);
				} else {
					notValidatedDependencies.push('tutorial_' + tutorialDependency.name);
				}
			}

			// At least one dependency
			const atLeastOneDependencies = dependencies.filter((dependency) => dependency.type === 'atLeastOne');
			for(const atLeastOneDependency of atLeastOneDependencies) {
				if(DependencyEngine.hasAtLeastOneDependency(atLeastOneDependency.subDependencies, user, planet, fleets, units, combatReports)) {
					validatedDependencies.push('atLeastOne_' + atLeastOneDependency.name);
				} else {
					notValidatedDependencies.push('atLeastOne_' + atLeastOneDependency.name);
				}
			}

			// Unit Model
			const unitModelDependencies = dependencies.filter((dependency) => dependency.type === 'unitModel');
			for(const unitModelDependency of unitModelDependencies) {
				if(unitModelDependency.count <= units.length) {
					validatedDependencies.push('unitModel_' + unitModelDependency.count);
				} else {
					notValidatedDependencies.push('unitModel_' + unitModelDependency.count);
				}
			}

			// Unit Build
			const unitBuildDependencies = dependencies.filter((dependency) => dependency.type === 'unitBuild');
			if(unitBuildDependencies.length > 0) {
				let owned = 0;
				for(const unit of units) {
					owned += unit.owned;
				}
				for(const unitBuildDependency of unitBuildDependencies) {
					if(owned >= unitBuildDependency.count) {
						validatedDependencies.push('unitBuild_' + unitBuildDependency.count);
					} else {
						notValidatedDependencies.push('unitBuild_' + unitBuildDependency.count);
					}
				}
			}

			// Move
			const moveDependencies = dependencies.filter((dependency) => dependency.type === 'move');
			if(moveDependencies.length > 0) {
				for(const moveDependency of moveDependencies) {
					const movingFleets = DependencyEngine.countMovingFleets(fleets, moveDependency);
					if(movingFleets >= moveDependency.count) {
						validatedDependencies.push('move_' + moveDependency.count);
					} else {
						notValidatedDependencies.push('move_' + moveDependency.count);
					}
				}
			}

			return [
				validatedDependencies,
				notValidatedDependencies
			];
		}

		static countMovingFleets(fleetList, dependency) {
			let movingFleets = 0;
			for(const fleet of fleetList) {
				if(typeof fleet.ownerId === 'undefined') {
					continue; // We got only public info, it's a foreign fleet
				}

				if(dependency.location === 'outerSystem' && (
					GameMap.getSystemFromAdress(fleet.position) === GameMap.getSystemFromAdress(fleet.motherPlanetAddress)
				)) {
					continue;
				}

				if(dependency.location === 'innerSystem' && (
					GameMap.getSystemFromAdress(fleet.position) !== GameMap.getSystemFromAdress(fleet.motherPlanetAddress)
				)) {
					continue;
				}

				if(dependency.moveType !== fleet.orbitPosition) {
					continue;
				}

				movingFleets++;
			}
			return movingFleets;
		}

		static hasAllDependencies(dependencies, user, planet, fleets, units, combatReports) {
			const [
				validatedDependencies,
				notValidatedDependencies
			] = DependencyEngine.getDependenciesStatus(dependencies, user, planet, fleets, units, combatReports);

			return notValidatedDependencies.length === 0;
		}

		static hasAtLeastOneDependency(dependencies, user, planet, fleets, units, combatReports) {
			const [
				validatedDependencies,
				notValidatedDependencies
			] = DependencyEngine.getDependenciesStatus(dependencies, user, planet, fleets, units, combatReports);

			return notValidatedDependencies.length === 0 ||
					validatedDependencies.length > 0;
		}
	};
})(typeof exports === 'undefined'? window : exports);