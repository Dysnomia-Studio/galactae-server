(function (exports) {
	exports._Reports = class Reports {
		/**
		 * Gets all lost units in fleets of a specific report
		 *
		 * @param      {object}  report  The report data
		 * @return     {object}  All lost units in fleets.
		 */
		static getAllLostUnitsInFleets(report) {
			const fleetLosts = {};

			for(const action of report.logs) {
				if(!fleetLosts[action.fleetDestinationId]) {
					fleetLosts[action.fleetDestinationId] = {};
				}

				if(!fleetLosts[action.fleetDestinationId][action.unitDestinationId]) {
					fleetLosts[action.fleetDestinationId][action.unitDestinationId] = 0;
				}

				fleetLosts[action.fleetDestinationId][action.unitDestinationId] += action.damage;
			}

			return fleetLosts;
		}
	};
})(typeof exports === 'undefined'? window : exports);
