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

		// Cache des utilisateurs
		this.playerList = {};

		// Logs de bataille
		this.battleLog = [];

		this.finalBattleLog = {};

		this.simulationBeginTime = Date.now();

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

	findUnit(type, fleetList) {
		if(type === '') {
			let i = 0;
			while(i++ < Object.values(this.unitCache).length) {
				const currFleet = Math.round(Math.random() * (fleetList.length - 1));

				const currUnit = Math.round(Math.random() * (fleetList[currFleet].unitsId.length - 1));

				if(currUnit < 0) { continue; }

				const unitCount = fleetList[currFleet].units[fleetList[currFleet].unitsId[currUnit]];
				if(typeof unitCount !== 'undefined' && unitCount > 0) {
					return [
						fleetList[currFleet].id,
						fleetList[currFleet].unitsId[currUnit]
					];
				}
			}

			return [-1 , -1];
		}

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
			for(const unitId in fleetList[i].units) {
				if(compatibleUnits.includes(unitId)) {
					return [fleetList[i].id, unitId];
				}
			}
		} while(++i < fleetList.length);

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

		// @TODO: Gestion du système singularité qui rends les cibles prioritaires

		let currTactic = Object.assign({}, this.tacticCache[currFleet.tactic]);
		if(!isset(currTactic, 'object')) {
			currTactic = {
				orders: [],
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

			// @TODO: Desactivation de systèmes pour le prochain tour, liste d'unités avec compteur, si compteur = 0, getTarget() sinon on passe son tour

			for(const shield of destinationShield) {
				originalDamage *= (1-this.getShieldAbsorption(weapon.tech, shield.tech));
			}

			// @TODO: Gestion du projecteur à distance via distanceShieldAbsorption

			// @TODO: Add miss chance

			// @TODO: Add details to logs: original damage, shield absorption, miss (or not)

			damage += (Math.round(originalDamage * 100)/100);
		}

		damage /= shipHealth[destinationUnit.shipShape];

		if(damage > 1) {
			damage = 1;
		}

		return [damage, logs];
	}

	simulateSide(sourceFleets, destinationFleets, fleetIterator) {
		const currUnitId = sourceFleets[fleetIterator.fleetCounter].unitsId[fleetIterator.unitTypeCounter];

		if(!sourceFleets[fleetIterator.fleetCounter].units[currUnitId] ||
			sourceFleets[fleetIterator.fleetCounter].units[currUnitId].length <= fleetIterator.unitNbCounter ||
			Units.getWeapons(this.unitCache[currUnitId]).length === 0) {

			fleetIterator.unitTypeCounter++;
			fleetIterator.unitNbCounter = 0;

			// Retry with new fleet
			if(sourceFleets[fleetIterator.fleetCounter].unitsId.length <= fleetIterator.unitTypeCounter) {
				fleetIterator.fleetCounter++;
				fleetIterator.unitTypeCounter = 0;
			}

			throw -2; // Retry with new unit type
		}

		const target = this.getTarget(currUnitId, sourceFleets[fleetIterator.fleetCounter].id, destinationFleets);
		if(target.fleet === -1) { throw -1; } // Security

		const [damage, logs] = this.simulateDamage(currUnitId, target.unit);

		// @TODO: apply research bonuses

		if(this.unitCache[currUnitId].oneShot) {
			sourceFleets[fleetIterator.fleetCounter].units[currUnitId]--;
		}

		const fleetIndex = destinationFleets.map((f) => f.id).indexOf(target.fleet);

		const oldHealth = destinationFleets[fleetIndex].units[target.unit];
		destinationFleets[fleetIndex].units[target.unit] -= damage;

		if(destinationFleets[fleetIndex].units[target.unit] <= 0) {
			delete destinationFleets[fleetIndex].units[target.unit];
			destinationFleets[fleetIndex].unitsId = Object.keys(destinationFleets[fleetIndex].units);
		}

		if(sourceFleets[fleetIterator.fleetCounter].units[currUnitId] <= 0) {
			delete sourceFleets[fleetIterator.fleetCounter].units[currUnitId];
			sourceFleets[fleetIterator.fleetCounter].unitsId = Object.keys(sourceFleets[fleetIterator.fleetCounter].units);
		}

		const action = {
			fleetSource: sourceFleets[fleetIterator.fleetCounter].name,
			fleetDestination: destinationFleets[fleetIndex].name,
			fleetDestinationId: destinationFleets[fleetIndex].id,
			unitSource: this.unitCache[currUnitId].name,
			unitDestination: this.unitCache[target.unit].name,
			unitDestinationId: this.unitCache[target.unit].id,
			damage: damage,
			details: logs,
		};

		if(Math.floor(destinationFleets[fleetIndex].units[target.unit]) < Math.floor(oldHealth)) {
			destinationFleets[fleetIndex].population -= this.unitCache[action.unitDestinationId].cost[5];
			destinationFleets[fleetIndex].points -= (this.unitCache[action.unitDestinationId].cost[5] * pointsCoef.units);

			this.unitCache[action.unitDestinationId].owned--;
		}

		++fleetIterator.unitNbCounter;

		return [
			sourceFleets,
			destinationFleets,
			fleetIterator,
			action,
		];
	}

	/**
	 * Simulate a turn between both sides
	 */
	simulateTurn() {
		let currDefFleets = {
			fleetCounter: 0,
			unitTypeCounter: 0,
			unitNbCounter: 0,
		};
		let currAtkFleets = {
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

			try {
				// Then simulate alternate
				if(atk) {
					[ this.atkFleets, this.defFleet, currAtkFleets, action ] = this.simulateSide(this.atkFleets, this.defFleets, currAtkFleets);
				} else {
					[ this.defFleet, this.atkFleets, currDefFleets, action ] = this.simulateSide(this.atkFleets, this.atkFleets, currDefFleets);
				}
			} catch(e) {
				if(e === -1) {
					break;
				} else if(e === -2) {
					continue;
				}

				log(e, 'error');
			}

			atk = !atk;

			this.battleLog.push(action);
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
			db.tactics.find(tacticId, (tactic) => {
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
		// Get owner id list
		const ownerList = new Set();
		for(const currFleet of [].concat(this.atkFleets, this.defFleets)) {
			ownerList.add(currFleet.ownerId);
		}

		let added = 0;

		// Get all units from db
		for(const ownerId of ownerList) {
			db.unit.findByOwner(ownerId, (unitList) => {
				for(const currUnit of unitList) {
					this.unitCache[currUnit.id] = currUnit;
				}

				if(ownerList.size === ++added) {
					callback();
				}
			});
		}
	}

	async getAllPlayers() {
		// Get owner id list
		const ownerList = new Set();
		for(const currFleet of [].concat(this.atkFleets, this.defFleets)) {
			ownerList.add(currFleet.ownerId);
		}

		// Get all units from db
		for(const ownerId of ownerList) {
			this.playerList[ownerId] = await db.player.find(ownerId);
		}
	}

	/**
	 * Simulate the whole fight
	 */
	fight() {
		this.removeDuplicateFleets();
		this.sortFleets();

		// Get all db data & Fight
		this.getAllTactics(() => {
			this.getAllUnits(async() => {
				await this.getAllPlayers();

				this.saveFleetsBeforeSimulation();

				while(Fleets.groupHasOffensiveCapacity(this.atkFleets, this.unitCache) && Fleets.groupHasOffensiveCapacity(this.defFleets, this.unitCache)) {
					this.simulateTurn();
				}

				this.endFight();
			});
		});
	}

	async endFight() {
		const defWins = (this.atkFleets.length === 0 || (this.defFleets.length !== 0 && !Fleets.groupHasOffensiveCapacity(this.atkFleets, this.unitCache)));

		await this.saveLogs(defWins);

		if(defWins) {
			log('End of fight simulation - Planet: ' + this.location + ' - Def wins - ' + (Date.now() - this.simulationBeginTime) + 'ms', 'info');
		} else {
			log('End of fight simulation - Planet: ' + this.location + ' - Atk wins - ' + (Date.now() - this.simulationBeginTime) + 'ms', 'info');
		}

		db.fleet.bulkUpdate([...this.atkFleets, ...this.defFleets]);

		// @TODO: steal resources

		// @TODO: downgrade a building

		db.unit.bulkUpdate(this.unitCache);

		preventRestarts--;
	}

	saveFleetsBeforeSimulation() {
		this.finalBattleLog = {
			...this.finalBattleLog,

			atkFleets: [],
			defFleets: [],
		};

		for(const fleet of this.atkFleets) {
			this.finalBattleLog.atkFleets.push(
				Fleets.extractPublicInfo(fleet, this.playerList[fleet.ownerId].name, this.unitCache)
			);
		}

		for(const fleet of this.defFleets) {
			this.finalBattleLog.defFleets.push(
				Fleets.extractPublicInfo(fleet, this.playerList[fleet.ownerId].name, this.unitCache)
			);
		}
	}

	/**
	 * Saves logs & send it to client
	 */
	async saveLogs(defWins) {
		if(!this.finalBattleLog.atkFleets) {
			this.finalBattleLog = {
				...this.finalBattleLog,

				atkFleets: [], // @TODO: save fleets when there's no defense
				defFleets: [],
			};
		}

		try {
			this.finalBattleLog = {
				...this.finalBattleLog,

				atk_user_id: this.atkUser.id,
				atk_user_name: this.atkUser.name,

				atk_fleet_id: this.atkFleetId,
				atk_fleet_name: this.atkFleets.filter((f) => f.id === this.atkFleetId)[0].name,

				def_user_id: this.defUser.id,
				def_user_name: this.defUser.name,

				defWins,

				date: new Date(),

				location: this.location,
				// @TODO: save planet name

				logs: this.battleLog,
			};
		} catch(e) {
			log('Error while writing battle logs: ' + e, 'error');
			return;
		}

		const id = await db.battleLog.save(this.finalBattleLog, [this.atkUser.id, this.defUser.id]);

		Reports.refresh(this.atkUser.id, this.atkUser.sid);
		Reports.refresh(this.defUser.id, this.defUser.sid);
		// @TODO: notify ALL Players
	}

	static beginFight(sid, defPlanet, atkUser, defUser, atkFleetId) {
		log('Begin of fight simulation - Planet: ' + defPlanet.address, 'info');
		log('Attacking fleet leader: ' + atkUser.name, 'info');
		log('Defensing planet leader: ' + defUser.name, 'info');

		db.fleet.findByPosition(defPlanet.address, (fleetList) => {
			const battle = new Combat(atkFleetId, atkUser, defUser, sid, defPlanet.address);

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

			preventRestarts++;

			battle.fight();
		});
	}

	static async getAttacksAgainstPlayer(plyId, plySid) {
		const fleetList = await db.getAttacksAgainstPlayer(plyId);

		for(const fleet of fleetList) {
			fleet.arriveTime = new Date(parseInt(fleet.endMoveTime));
			delete fleet.endMoveTime;

			Websocket.sendNotification(plySid, 'attack', fleet);
		}
	}
};