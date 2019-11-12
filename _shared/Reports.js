(function (exports) {
	exports._Reports = class Reports {
		static getAllLostUnits(report) {
			const units = {};

			for(const action of report.logs) {
				// @TODO
			}

			return units;
		}

		static getAllLostUnitsInFleets(report) {
			const fleetLosts = {};

			for(const action of report.logs) {
				if(!fleetLosts[action.fleetDestination]) {
					fleetLosts[action.fleetDestination] = {};
				}

				if(!fleetLosts[action.fleetDestination][action.unitDestionation]) {
					fleetLosts[action.fleetDestination][action.unitDestionation] = 0;
				}

				fleetLosts[action.fleetDestination][action.unitDestionation] += action.damage;
			}

			return fleetLosts;
		}
	};
})(typeof exports === 'undefined'? window : exports);