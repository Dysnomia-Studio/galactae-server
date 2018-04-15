module.exports = class combat {
	/**
	 * Constructs the object.
	 *
	 * @param      {<type>}  atk     Attack fleet
	 * @param      {<type>}  def     Defence Fleet
	 */
	constructor() {
		// Flottes
		this.atkFleets = [];
		this.defFleets = [];

		// Roles IA
		this.atkAI = [];
		this.defAI = [];

		// Cache des types d'unités
		this.unitCache = [];

		// Logs de bataille
		this.battleLog = [];
	}

	/**
	 * Make a fleet join a team
	 *
	 * @param      {string}  team    Which team ?
	 * @param      {Fleet}   fleet   Fleet details
	 */
	joinTeam(team, fleet) {
		if(team == "atk") {
			this.atkFleets.push(fleet);
		} else if (team == "def") {
			this.defFleets.push(fleet);
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
	getAllAI(callback) {
		// @ADD: Get All AIs from db then call callback
	}

	/**
	 * Gets all units from database
	 *
	 * @param      {Function}  callback  Function to call back after these calls
	 */
	getAllUnits(callback) {
		// @ADD: Get All units from db then call callback
	}

	/**
	 * Simulate the whole fight
	 */
	fight() {
		if(this.atkFleets.length == 0 || this.defFleets.length == 0) { return; }

		// Get all db data & Fight
		this.getAllAI(function() {
			this.getAllUnits(function() {
				while(this.atkFleets.population != 0 && this.defFleets.population != 0) {
					this.simulateTurn();
				}

				this.saveLogs();
			});
		});
	}

	/**
	 * Saves logs & send it to client
	 */
	saveLogs() {
		// @ADD: Save report to database

		// @ADD: Send report to client
	}

	static beginFight(data, pid) {
		// @ADD: check beginners protection

		// @ADD: Get all in-orbit fleets
		var fleets = {};

		var battle = new combat();

		// Add all fleets to fight
		for(var i in fleets) {
			if(fleets[i].orbitPosition == 0) {
				battle.joinTeam("def", fleets[i]);
			} else if(fleets[i].orbitPosition == 1) {
				battle.joinTeam("atk", fleets[i]);
			} 
		}

		combat.fight();
	}
};