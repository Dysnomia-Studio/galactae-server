module.exports = class combat {
	/**
	 * Constructs the object.
	 *
	 * @param      {<type>}  atk     Attack fleet
	 * @param      {<type>}  def     Defence Fleet
	 */
	constructor(atk, def) {
		// Flottes
		this.atkFleets = [atk];
		this.defFleets = [def];

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
			atkFleets.push(fleet);
		} else {
			defFleets.push(fleet);
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
		// @ADD: check beginners protection

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
}