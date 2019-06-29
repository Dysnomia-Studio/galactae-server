module.exports = class Combat {
	/**
	 * Constructs the object.
	 */
	constructor(atkFleetId) {
		// Flottes
		this.atkFleets = [];
		this.defFleets = [];

		// Cache des types d'unités
		this.unitCache = {};

		// Cache des tactiques
		this.tacticCache = {};

		// Logs de bataille
		this.battleLog = [];

		this.atkFleetId = atkFleetId;
	}

	removeDuplicateFleets() {
		const defFleetsId = this.defFleets.map((currFleet) => currFleet.id);
		const tmpAtkFleets = this.atkFleets.filter((currFleet) => !defFleetsId.includes(currFleet.id));

		const atkFleetsId = this.atkFleets.map((currFleet) => currFleet.id);
		const tmpDefFleets = this.defFleets.filter((currFleet) => !atkFleetsId.includes(currFleet.id));

		this.atkFleets = tmpAtkFleets;
		this.defFleets = tmpDefFleets;
	}

	sortFleets() {
		// Defense fleet attack first
		this.defFleets.sort((a,b) => {
			if(a.name === 'SHIP_DEF') {
				return -1;
			}
			if(b.name === 'SHIP_DEF') {
				return 1;
			}

			return 0;
		});

		// Attacking fleet first
		this.atkFleets.sort((a,b) => {
			if(a.id === this.atkFleetId) {
				return -1;
			}
			if(b.id === this.atkFleetId) {
				return 1;
			}

			return 0;
		});
	}

	/**
	 * Make a fleet join a team
	 *
	 * @param      {string}  team    Which team ?
	 * @param      {Fleet}   fleet   Fleet details
	 */
	joinTeam(team, currFleet) {
		if(!isset(currFleet, 'object')) {
			log('Fleet object misbuilded !','error');
			return;
		}

		currFleet.unitsId = currFleet.units.keys();

		if(team === 'atk') {
			this.atkFleets.push(currFleet);
		} else if (team === 'def') {
			this.defFleets.push(currFleet);
		} else {
			log('Team "' + team + '" not found !','error');
		}
	}

	/**
	 * Choose an ennemy depending on units, fleets and AI settings
	 *
	 * @param      {<type>}  unit    The unit
	 * @param      {<type>}  fleet   The fleet
	 */
	chooseEnemy(unit, fleet) {
		// @ADD: Get targets order
	}

	/**
	 * Simulate a turn between both sides
	 */
	simulateTurn() {
		// @ADD: simulate battle for each units
	}

	/**
	 * Gets all ai settings from database
	 *
	 * @param      {Function}  callback  Function to call back after these calls
	 */
	getAllTactics(callback) {
		// Get units id list
		const tacticsIdList = new Set();
		for(const currFleet of [].concat(this.atkFleets, this.defFleets)) {
			for(const unit of currFleet.units) {
				tacticsIdList.add(unit.tactic);
			}
		}

		let added = 0;
		function done(tactic) {
			this.tacticCache[tactic.id] = tactic;

			if(tacticsIdList.size <= ++added) {
				callback();
			}
		}

		// Get all units from db
		for(const tacticId of tacticsIdList) {
			db.tactic.find(tacticId, done);
		}
	}

	/**
	 * Gets all units from database
	 *
	 * @param      {Function}  callback  Function to call back after these calls
	 */
	getAllUnits(callback) {
		// Get units id list
		const unitIdList = new Set();
		for(const fleet of [].concat(this.atkFleets, this.defFleets)) {
			for(const unit of fleet.units) {
				unitIdList.add(unit);
			}
		}

		function done(unit) {
			this.unitCache[unit.id] = unit;

			if(unitIdList.size <= this.unitCache.length) {
				callback();
			}
		}

		// Get all units from db
		for(const unitId of unitIdList) {
			db.unit.find(unitId, done);
		}
	}

	/**
	 * Simulate the whole fight
	 */
	fight() {
		this.removeDuplicateFleets();
		this.sortFleets();

		if(this.atkFleets.length === 0 || this.defFleets.length === 0) { return; }

		// Get all db data & Fight
		this.getAllTactics(function() {
			this.getAllUnits(function() {
				while(this.atkFleets.length !== 0 && this.defFleets.length !== 0) {
					this.simulateTurn();
				}

				this.saveLogs();

				if(this.atkFleets.length === 0) {
					log('End of fight simulation - Planet: ' + pid + ' - Def wins', 'info');
				} else {
					log('End of fight simulation - Planet: ' + pid + ' - Atk wins', 'info');
				}

				preventRestarts--;
			});
		});
	}

	/**
	 * Saves logs & send it to client
	 */
	saveLogs() {
		// @TODO: Save report to database

		// @TODO: Send report to client
	}

	static beginFight(data, pid, atkUserId, atkFleetId) {
		log('Begin of fight simulation - Planet: ' + pid, 'info');

		// @TODO: check beginners protection

		db.fleet.findByPosition(pid, function(fleetList) {
			const battle = new Combat(atkFleetId);

			// Add all fleets to fight
			for(const i in fleetList) {
				if(fleetList[i].endMoveTime > 0) { continue; }

				if(fleetList[i].orbitPosition === 0) {
					battle.joinTeam('def', fleetList[i]);
				} else if(fleetList[i].orbitPosition === 1 && fleetList[i].ownerId === atkUserId) {
					// @TODO: Add ally check
					battle.joinTeam('atk', fleetList[i]);
				}
			}

			battle.fight();

			preventRestarts++;
		});
	}
};