const scenarios = {
	noDependencies: [],
	dependencyOneResearch: [{
		type: 'research',
		name: 'industrialisation',
	}],
	dependencyMultipleResearch: [{
		type: 'research',
		name: 'industrialisation',
	},{
		type: 'research',
		name: 'phyContemporaine',
	}],
	dependencyOneBuilding: [{
		type: 'building',
		id: 1,
		lvl: 5,
	}],
	dependencyMultipleBuilding: [{
		type: 'building',
		id: 1,
		lvl: 5,
	},{
		type: 'building',
		id: 3,
		lvl: 10,
	}],
	dependencyPlanetCount: [{
		type: 'planetCount',
		count: 2,
	}],
	dependencyTutorial: [{
		type: 'tutorial',
		name: 'welcome',
	}],
};

describe('• DependencyEngine (shared)', () => {
	describe('# getDependenciesStatus()', () => {
		it('No dependencies (undefined)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(),
				[[], []]
			);
		});

		it('No dependencies (empty array)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.noDependencies),
				[[], []]
			);
		});

		// Research
		it('One research (no dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyOneResearch, { research: {} }),
				[[], ['research_industrialisation']]
			);
		});

		it('One research (dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyOneResearch, { research: { industrialisation: -1 } }),
				[['research_industrialisation'], []]
			);
		});

		it('Multiple Research (no dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyMultipleResearch, { research: {} }),
				[[], ['research_industrialisation', 'research_phyContemporaine']]
			);
		});

		it('Multiple Research (one dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyMultipleResearch, { research: { industrialisation: -1 } }),
				[['research_industrialisation'], ['research_phyContemporaine']]
			);
		});

		it('Multiple Research (all dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyMultipleResearch, { research: { industrialisation: -1, phyContemporaine: -1 } }),
				[['research_industrialisation', 'research_phyContemporaine'], []]
			);
		});

		// Building
		it('One Building (no dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyOneBuilding, { }, { Buildings: [1,1,1,1,1,1,1,1] }),
				[[], ['building_1']]
			);
		});

		it('One Building (dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyOneBuilding, { }, { Buildings: [10,10,10,10,10,10,10,10] }),
				[['building_1'], []]
			);
		});

		it('Multiple Building (no dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyMultipleBuilding, { }, { Buildings: [1,1,1,1,1,1,1,1] }),
				[[], ['building_1', 'building_3']]
			);
		});

		it('Multiple Building (one dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyMultipleBuilding, { }, { Buildings: [5,5,1,1,1,1,1,1] }),
				[['building_1'], ['building_3']]
			);
		});

		it('Multiple Building (all dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyMultipleBuilding, { }, { Buildings: [10,10,10,10,10,10,10,10] }),
				[['building_1', 'building_3'], []]
			);
		});

		// Planet Count
		it('Planet Count (no dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyPlanetCount, { planetlist: ['id'] }),
				[[], ['planetCount']]
			);
		});

		it('Planet Count (all dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyPlanetCount, { planetlist: ['id', 'id2'] }),
				[['planetCount'], []]
			);
		});

		// Tutorials
		it('Tutorials (no dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyTutorial, { tutorials: {} }),
				[[], ['tutorial_welcome']]
			);
		});

		it('Tutorials (all dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.getDependenciesStatus(scenarios.dependencyTutorial, { tutorials: { welcome: true } }),
				[['tutorial_welcome'], []]
			);
		});
	});

	describe('# hasAllDependencies()', () => {
		it('No dependencies', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.noDependencies),
				true
			);
		});

		// Research
		it('One research (no dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyOneResearch, { research: {} }),
				false
			);
		});

		it('One research (dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyOneResearch, { research: { industrialisation: -1 } }),
				true
			);
		});

		it('Multiple Research (no dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyMultipleResearch, { research: {} }),
				false
			);
		});

		it('Multiple Research (one dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyMultipleResearch, { research: { industrialisation: -1 } }),
				false
			);
		});

		it('Multiple Research (all dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyMultipleResearch, { research: { industrialisation: -1, phyContemporaine: -1 } }),
				true
			);
		});

		// Building
		it('One Building (no dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyOneBuilding, { }, { Buildings: [1,1,1,1,1,1,1,1] }),
				false
			);
		});

		it('One Building (dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyOneBuilding, { }, { Buildings: [10,10,10,10,10,10,10,10] }),
				true
			);
		});

		it('Multiple Building (no dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyMultipleBuilding, { }, { Buildings: [1,1,1,1,1,1,1,1] }),
				false
			);
		});

		it('Multiple Building (one dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyMultipleBuilding, { }, { Buildings: [10,10,1,1,1,1,1,1] }),
				false
			);
		});

		it('Multiple Building (all dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyMultipleBuilding, { }, { Buildings: [10,10,10,10,10,10,10,10] }),
				true
			);
		});

		// Planet Count
		it('Planet Count (no dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyPlanetCount, { planetlist: ['id'] }),
				false
			);
		});

		it('Planet Count (all dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAllDependencies(scenarios.dependencyPlanetCount, { planetlist: ['id', 'id2'] }),
				true
			);
		});

		// Tutorials
		it('Tutorials (no dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.hasAllDependencies(scenarios.dependencyTutorial, { tutorials: {} }),
				false
			);
		});

		it('Tutorials (all dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.hasAllDependencies(scenarios.dependencyTutorial, { tutorials: { welcome: true } }),
				true
			);
		});
	});

	describe('# hasAtLeastOneDependency()', () => {
		it('No dependencies', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.noDependencies),
				true
			);
		});

		// Research
		it('One research (no dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyOneResearch, { research: {} }),
				false
			);
		});

		it('One research (dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyOneResearch, { research: { industrialisation: -1 } }),
				true
			);
		});

		it('Multiple Research (no dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyMultipleResearch, { research: {} }),
				false
			);
		});

		it('Multiple Research (one dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyMultipleResearch, { research: { industrialisation: -1 } }),
				true
			);
		});

		it('Multiple Research (all dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyMultipleResearch, { research: { industrialisation: -1, phyContemporaine: -1 } }),
				true
			);
		});

		// Building
		it('One Building (no dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyOneBuilding, { }, { Buildings: [1,1,1,1,1,1,1,1] }),
				false
			);
		});

		it('One Building (dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyOneBuilding, { }, { Buildings: [10,10,10,10,10,10,10,10] }),
				true
			);
		});

		it('Multiple Building (no dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyMultipleBuilding, { }, { Buildings: [1,1,1,1,1,1,1,1] }),
				false
			);
		});

		it('Multiple Building (one dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyMultipleBuilding, { }, { Buildings: [10,10,1,1,1,1,1,1] }),
				true
			);
		});

		it('Multiple Building (all dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyMultipleBuilding, { }, { Buildings: [10,10,10,10,10,10,10,10] }),
				true
			);
		});

		// Planet Count
		it('Planet Count (no dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyPlanetCount, { planetlist: ['id'] }),
				false
			);
		});

		it('Planet Count (all dependency satisfied)', () => {
			assert.equal(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyPlanetCount, { planetlist: ['id', 'id2'] }),
				true
			);
		});

		// Tutorials
		it('Tutorials (no dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyTutorial, { tutorials: {} }),
				false
			);
		});

		it('Tutorials (all dependency satisfied)', () => {
			assert.deepEqual(
				DependencyEngine.hasAtLeastOneDependency(scenarios.dependencyTutorial, { tutorials: { welcome: true } }),
				true
			);
		});
	});
});
