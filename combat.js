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

	findUnit(type, fleets) {
		const compatibleUnits = [];
		for(const id in this.unitCache) {
			const unit = this.unitCache[id];
			if(unit.shipType === type || type === '') {
				compatibleUnits.push(unit.id);
			}
		}

		let i = 0;
		do {
			for(const unitId in fleets[i].units) {
				if(compatibleUnits.length === 0 || compatibleUnits.includes(unitId)) {
					return [fleets[i].id, unitId];
				}
			}
		} while(++i < fleets.length);

		return [-1, -1];
	}

	/**
	 * Choose an ennemy depending on units, fleets and AI settings
	 *
	 * @param      {<type>}  unit    The unit
	 * @param      {<type>}  fleet   The fleet
	 */
	getTarget(unit, fleet, ennemyFleets) {
		let choosenFleet,
			choosenUnit;

		const currTactic = Object.assign({}, this.tacticCache[fleet.tactic]);

		const compatibleTactics = currTactic.orders.filter((t) => t.unit === unit).sort((a,b) => {
			if(a.priority < b.priority) {
				return -1;
			}
			if(a.priority === b.priority) {
				return 0;
			}

			return 1;
		});

		let blocked = false;
		do {
			if(compatibleTactics.length === 0) {
				blocked = true;
				compatibleTactics.push({ target: '', priority: 1 });
			}

			[choosenFleet, choosenUnit] = this.findUnit(compatibleTactics[0].target, ennemyFleets);

			compatibleTactics.splice(0,1);
		} while(choosenFleet === -1 && !blocked);

		return { fleet: choosenFleet, unit: choosenUnit };
	}

	getShieldAbsorption(weapon, shield) {
		if(shield === 'none') { return 0; }

		let weaponType = '';
		switch(weapon) {
			case 'railgun':
			case 'plasma':
			case 'laser':
				weaponType = weapon;
				break;
			case 'explosive':
			case 'iem':
				weaponType = 'lightMissile';
				break;
			case 'nuke':
			case 'antimater':
				weaponType = 'heavyMissile';
				break;
			default:
				log('Shield absorption not defined for part ' + weapon);
				return 0;
		}

		return shieldAbsorption[shield][weaponType];
	}

	simulateDamage(source, destination) {
		const sourceUnit = this.unitCache[source];
		const destinationUnit = this.unitCache[destination];

		const sourceWepons = sourceUnit.parts.filter((part) => part.type === 'cannon' || part.type === 'rocketLauncher');
		const destinationShield = destinationUnit.parts.filter((part) => part.type === 'shield');

		let damage = 0;
		const logs = [];

		for(const weapon of sourceWepons) {
			let originalDamage = weaponDamage[weapon];

			// @TODO: Desactivation de systèmes pour le prochain tour

			for(const shield of destinationShield) {
				originalDamage *= (1-this.getShieldAbsorption(weapon, shield));
			}

			// @TODO: Gestion du système singularité et du projecteur à distance via distanceShieldAbsorption

			// @TODO: Add miss chance

			damage += (Math.round(originalDamage * 100)/100);
		}

		if(damage > 1) {
			damage = 1;
		}

		return [damage, logs];
	}

	/**
	 * Simulate a turn between both sides
	 */
	simulateTurn() {
		const currDefFleets = {
			fleetCounter: 0,
			unitTypeCounter: 0,
			unitNbCounter: 0,
		};
		const currAtkFleets = {
			fleetCounter: 0,
			unitTypeCounter: 0,
			unitNbCounter: 0,
		};

		let atk = true;

		let action;

		while( (currDefFleets.fleetCounter + currAtkFleets.fleetCounter) < (this.defFleets.length + this.atkFleets.length) ) {
			if(currAtkFleets.fleetCounter >= this.atkFleets.length) {
				atk = false;
			}
			if(currDefFleets.fleetCounter >= this.defFleets.length) {
				atk = true;
			}

			// Then simulate alternate
			if(atk) {
				const currUnitId = this.atkFleets[currAtkFleets.fleetCounter].unitId[currAtkFleets.unitTypeCounter];

				if(this.atkFleets[currAtkFleets.fleetCounter].units[currUnitId] <= currAtkFleets.unitNbCounter) {
					currAtkFleets.unitTypeCounter++;
					currAtkFleets.unitNbCounter = 0;
					continue; // Retry with new unit type
				}
				if(this.atkFleets[currAtkFleets.fleetCounter].unitsId.length <= currAtkFleets.unitTypeCounter) {
					currAtkFleets.fleetCounter++;
					currAtkFleets.unitTypeCounter = 0;
					continue; // Retry with new fleet
				}

				const target = this.getTarget(currUnitId, this.atkFleets[currDefFleets.fleetCounter].id, this.defFleets);
				if(target.fleet === -1) { continue; } // Security

				const [damage, logs] = this.simulateDamage(currUnitId, target.unit);

				// @TODO: apply research bonuses

				this.defFleets[currAtkFleets.fleetCounter].units[currUnitId] -= target.damage;

				if(this.defFleets[currAtkFleets.fleetCounter].units[currUnitId] < 0) {
					this.defFleets[currAtkFleets.fleetCounter].units[currUnitId] = 0;
				}

				action = {
					fleetSource: this.atkFleets[currDefFleets.fleetCounter].id,
					fleetDestination: target.fleet,
					unitSource: currUnitId,
					unitDestination: target.unit,
					damage: target.damage,
					details: logs,
				};

				++currAtkFleets.unitNbCounter;
			} else {
				const currUnitId = this.defFleets[currDefFleets.fleetCounter].unitId[currDefFleets.unitTypeCounter];

				if(this.defFleets[currDefFleets.fleetCounter].units[currUnitId] <= currDefFleets.unitNbCounter) {
					currDefFleets.unitTypeCounter++;
					currDefFleets.unitNbCounter = 0;
					continue; // Retry with new unit type
				}
				if(this.defFleets[currDefFleets.fleetCounter].unitsId.length <= currDefFleets.unitTypeCounter) {
					currDefFleets.fleetCounter++;
					currDefFleets.unitTypeCounter = 0;
					continue; // Retry with new fleet
				}

				const target = this.getTarget(currUnitId, this.defFleets[currDefFleets.fleetCounter].id, this.atkFleets);
				if(target.fleet === -1) { continue; } // Security

				const [damage, logs] = this.simulateDamage(currUnitId, target.unit);

				// @TODO: apply research bonuses

				this.atkFleets[currAtkFleets.fleetCounter].units[currUnitId] -= target.damage;

				if(this.atkFleets[currAtkFleets.fleetCounter].units[currUnitId] < 0) {
					this.atkFleets[currAtkFleets.fleetCounter].units[currUnitId] = 0;
				}

				action = {
					fleetSource: this.defFleets[currDefFleets.fleetCounter].id,
					fleetDestination: target.fleet,
					unitSource: currUnitId,
					unitDestination: target.unit,
					damage: target.damage,
					details: logs,
				};

				++currDefFleets.unitNbCounter;
			}

			atk = !atk;

			this.addActionToBattleLog(action);
		}
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
			tacticsIdList.add(currFleet.tactic);
		}

		let added = 0;
		// Get all units from db
		for(const tacticId of tacticsIdList) {
			db.tactic.find(tacticId, (tactic) => {
				this.tacticCache[tactic.id] = tactic;

				if(tacticsIdList.size <= ++added) {
					callback();
				}
			});
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
		for(const currFleet of [].concat(this.atkFleets, this.defFleets)) {
			for(const unit in currFleet.units) {
				unitIdList.add(unit);
			}
		}

		let added = 0;

		// Get all units from db
		for(const unitId of unitIdList) {
			db.unit.find(unitId, (unit) => {
				this.unitCache[unit.id] = unit;

				if(unitIdList.size <= ++added) {
					callback();
				}
			});
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

	addActionToBattleLog(action) {
		this.battleLog.push(action);
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