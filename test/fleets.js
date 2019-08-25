/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();

global.Fleets = require('../fleets');
global.Units = require('../units');

let gameDb;

describe('• Fleets', () => {
	/*before(function(done) {
		let count = 0;

		db.connect(function(success,general,database) {
			if(++count === 2) {
				done();
			}
		});
	});

	/**
	 * Has enough carrier capacity ?
 	 */
	describe('# hasEnoughCarrier()', () => {
		it('Enought', () => {
			const fleetUnits = {
				'fighter': 1,
				'carrier': 1
			};

			const unitList = [
				{
					id: 'fighter',
					shipType: 'SHIP_FIGHTER',
					shipShape: 'SHIP_FIGHTER_SMALL'
				},
				{
					id: 'carrier',
					shipType: 'SHIP_CARRIER',
					parts: [
						{ type: 'hangar', tech: 'hangarDouble' },
						{ type: 'sub_propulsion', tech: 'vsolaire' },
					]
				},
				{
					id: 'other',
					shipType: 'SHIP_OTHER',
				},
			];

			assert.equal(
				Fleets.hasEnoughCarrier(
					{ units: fleetUnits },
					unitList),
				true
			);
		});

		it('No Enought', () => {
			const fleetUnits = {
				'fighter': 80,
				'carrier': 1
			};

			const unitList = [
				{
					id: 'fighter',
					shipType: 'SHIP_FIGHTER',
					shipShape: 'SHIP_FIGHTER_SMALL'
				},
				{
					id: 'carrier',
					shipType: 'SHIP_CARRIER',
					parts: [
						{ type: 'hangar', tech: 'hangarDouble' },
						{ type: 'sub_propulsion', tech: 'vsolaire' },
					]
				},
			];

			assert.equal(
				Fleets.hasEnoughCarrier(
					{ units: fleetUnits },
					unitList),
				false
			);
		});
	});

	/**
	 * Get units list
	 */
	/*describe('# getUnitsList()', () => {
		it('Existing', function(done) {
			const unitIdList = [
				['eee16ad8-5777-11e9-ae80-67804909a59f',1]
			];

			Fleets.getUnitsList(unitIdList, function(unitList) {
				assert.equal(
					unitList.length,
					1
				);

				assert.equal(
					unitList[0].name,
					'UnitTest Unit'
				);

				done();
			});
		});

		it('Not existing', function(done) {
			const unitIdList = [
				['00000000-0000-0000-0000-000000000000',1]
			];

			Fleets.getUnitsList(unitIdList, function(unitList) {
				assert.equal(
					unitList.length,
					0
				);

				done();
			});
		});
	});


	after(function(done) {
		db.closeConnections(() => {
			done();
		});
	});*/
});