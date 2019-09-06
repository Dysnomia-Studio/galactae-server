module.exports = class Combat {
	/**
	 * Constructs the object.
	 */
	constructor(atkFleetId, atkUser, defUser, sid, location) {
		// Flottes
		this.atkFleets = [];
		this.defFleets = [];

		// Cache des types d'unités
		this.unitCache = Object.assign({}, Units.specialUnits);

		// Cache des tactiques
		this.tacticCache = {};

		// Logs de bataille
		this.battleLog = [];

		this.plySid = sid;
		this.atkUser = atkUser;
		this.defUser = defUser;

		this.atkFleetId = atkFleetId;

		this.location = location;
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

		currFleet.unitsId = Object.keys(currFleet.units);

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
		if(type !== '') {
			for(const id in this.unitCache) {
				const currUnit = this.unitCache[id];
				if(currUnit.shipType === type) {
					compatibleUnits.push(currUnit.id);
				}
			}
		}

		let i = 0;
		do {
			for(const unitId in fleets[i].units) {
				if(type === '' || compatibleUnits.includes(unitId)) {
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
	getTarget(unit, currFleet, ennemyFleets) {
		let choosenFleet,
			choosenUnit;

		let currTactic = Object.assign({}, this.tacticCache[currFleet.tactic]);
		if(!isset(currTactic, 'object')) {
			currTactic = {
				orders: []
			};
		}

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

		const sourceWepons = Units.getWeapons(sourceUnit);
		const destinationShield = Units.getShields(destinationUnit);

		let damage = 0;
		const logs = [];

		for(const weapon of sourceWepons) {
			let originalDamage = weaponDamage[weapon.tech];

			if(fighterMult[this.unitCache[source].shipType]) {
				originalDamage *= weaponDamage[weapon.tech];
			}

			// @TODO: Desactivation de systèmes pour le prochain tour

			for(const shield of destinationShield) {
				originalDamage *= (1-this.getShieldAbsorption(weapon.tech, shield.tech));
			}

			// @TODO: Gestion du système singularité et du projecteur à distance via distanceShieldAbsorption

			// @TODO: Add miss chance

			// @TODO: Add to logs

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
				const currUnitId = this.atkFleets[currAtkFleets.fleetCounter].unitsId[currAtkFleets.unitTypeCounter];

				if(!this.atkFleets[currAtkFleets.fleetCounter].units[currUnitId] ||
					this.atkFleets[currAtkFleets.fleetCounter].units[currUnitId].length <= currAtkFleets.unitNbCounter ||
					Units.getWeapons(this.unitCache[currUnitId]).length === 0) {

					currAtkFleets.unitTypeCounter++;
					currAtkFleets.unitNbCounter = 0;

					if(this.atkFleets[currAtkFleets.fleetCounter].unitsId.length <= currAtkFleets.unitTypeCounter) {
						currAtkFleets.fleetCounter++;
						currAtkFleets.unitTypeCounter = 0;
					}

					continue; // Retry with new unit type
				}
				if(this.atkFleets[currAtkFleets.fleetCounter].unitsId.length <= currAtkFleets.unitTypeCounter) {
					currAtkFleets.fleetCounter++;
					currAtkFleets.unitTypeCounter = 0;
					continue; // Retry with new fleet
				}

				const target = this.getTarget(currUnitId, this.atkFleets[currAtkFleets.fleetCounter].id, this.defFleets);
				if(target.fleet === -1) { continue; } // Security

				const [damage, logs] = this.simulateDamage(currUnitId, target.unit);

				// @TODO: apply research bonuses

				if(!!this.unitCache[currUnitId].oneShot) {
					this.atkFleets[currAtkFleets.fleetCounter].units[currUnitId]--;
				}

				const fleetIndex = this.defFleets.map((f) => f.id).indexOf(target.fleet);

				this.defFleets[fleetIndex].units[target.unit] -= damage;

				if(this.defFleets[fleetIndex].units[target.unit] < 0) {
					delete this.defFleets[fleetIndex].units[target.unit];
					this.defFleets[fleetIndex].unitsId = Object.keys(this.defFleets[fleetIndex].units);
				}

				action = {
					fleetSource: this.atkFleets[currAtkFleets.fleetCounter].id,
					fleetDestination: target.fleet,
					unitSource: currUnitId,
					unitDestination: target.unit,
					damage: damage,
					details: logs,
				};

				++currAtkFleets.unitNbCounter;
			} else {
				const currUnitId = this.defFleets[currDefFleets.fleetCounter].unitsId[currDefFleets.unitTypeCounter];

				if(!this.defFleets[currDefFleets.fleetCounter].units[currUnitId] ||
					this.defFleets[currDefFleets.fleetCounter].units[currUnitId].length <= currDefFleets.unitNbCounter ||
					Units.getWeapons(this.unitCache[currUnitId]).length === 0) {

					currDefFleets.unitTypeCounter++;
					currDefFleets.unitNbCounter = 0;

					if(this.defFleets[currDefFleets.fleetCounter].unitsId.length <= currDefFleets.unitTypeCounter) {
						currDefFleets.fleetCounter++;
						currDefFleets.unitTypeCounter = 0;
					}

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

				if(!!this.unitCache[currUnitId].oneShot) {
					this.defFleets[currDefFleets.fleetCounter].units[currUnitId]--;
				}

				const fleetIndex = this.atkFleets.map((f) => f.id).indexOf(target.fleet);

				this.atkFleets[fleetIndex].units[target.unit] -= damage;

				if(this.atkFleets[fleetIndex].units[target.unit] <= 0) {
					delete this.atkFleets[fleetIndex].units[target.unit];
					this.atkFleets[fleetIndex].unitsId = Object.keys(this.atkFleets[fleetIndex].units);
				}

				action = {
					fleetSource: this.defFleets[currDefFleets.fleetCounter].id,
					fleetDestination: target.fleet,
					unitSource: currUnitId,
					unitDestination: target.unit,
					damage: damage,
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
			if(!isset(currFleet.tactic) || currFleet.tactic === '') { continue; }
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
			for(const currUnit in currFleet.units) {
				unitIdList.add(currUnit);
			}
		}

		let added = 0;

		// Get all units from db
		for(const unitId of unitIdList) {
			if(isset(this.unitCache[unitId])) {
				if(unitIdList.size === ++added) {
					callback();
				}

				continue;
			}

			db.unit.find(unitId, (currUnit) => {
				this.unitCache[currUnit.id] = currUnit;

				if(unitIdList.size === ++added) {
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

		if(this.atkFleets.length !== 0 && this.defFleets.length !== 0) {
			// Get all db data & Fight
			this.getAllTactics(() => {
				this.getAllUnits(() => {
					while(Fleets.groupHasOffensiveCapacity(this.atkFleets, this.unitCache) && Fleets.groupHasOffensiveCapacity(this.defFleets, this.unitCache)) {
						this.simulateTurn();
					}
				});
			});
		}

		this.saveLogs();

		if(this.atkFleets.length === 0 || !Fleets.groupHasOffensiveCapacity(this.atkFleets, this.unitCache)) {
			log('End of fight simulation - Planet: ' + this.location + ' - Def wins', 'info');
		} else {
			log('End of fight simulation - Planet: ' + this.location + ' - Atk wins', 'info');
		}

		// @TODO: save new fleet status (and delete empty fleets ofc)

		preventRestarts--;
	}

	addActionToBattleLog(action) {
		/*console.log('Logging action:');
		console.log(action);*/

		this.battleLog.push(action);
	}

	/**
	 * Saves logs & send it to client
	 */
	saveLogs() {
		let finalBattleLog;

		try {
			finalBattleLog = {
				atk_user_id: this.atkUser.id,
				atk_user_name: this.atkUser.name,

				atk_fleet_id: this.atkFleetId,
				atk_fleet_name: this.atkFleets.filter((f) => f.id === this.atkFleetId)[0].name,

				def_user_id: this.defUser.id,
				def_user_name: this.defUser.name,

				date: Date.now(),

				location: this.location,

				logs: this.battleLog,
			};

			// @TODO: format battle log:
			// - save units/fleet names instead of their ids if they are deleted
		} catch(e) {
			log('Error while writing battle logs: ' + e, 'error');
		}

		/*console.log("Final BattleLog:");
		console.log(finalBattleLog);*/

		if(isset(finalBattleLog, 'object')) {
			io.to(this.plySid).emit('combat-battleLog-send', finalBattleLog);
			db.battleLog.save(finalBattleLog);
		}
	}

	static beginFight(data, pid, atkUser, defUser, atkFleetId) {
		log('Begin of fight simulation - Planet: ' + pid, 'info');

		// @TODO: check beginners protection

		db.fleet.findByPosition(pid, (fleetList) => {
			const battle = new Combat(atkFleetId, atkUser, defUser, data.sid, pid);

			// Add all fleets to fight
			for(const i in fleetList) {
				if(fleetList[i].endMoveTime > Date.now()) { continue; }

				if(fleetList[i].orbitPosition === 0) {
					battle.joinTeam('def', fleetList[i]);
				} else if(fleetList[i].orbitPosition === 1 && fleetList[i].ownerId === atkUser.id) {
					// @TODO: Add ally check
					battle.joinTeam('atk', fleetList[i]);
				}
			}

			battle.fight();

			preventRestarts++;
		});
	}
};