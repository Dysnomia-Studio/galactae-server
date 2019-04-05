/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../config')();
require('../misc')();

global.db = require('../database');

global.Fleets = require('../fleets');
global.Units = require('../units');

let gameDb;

describe('• Fleets', function() {
	before(function(done) {
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
	describe('# hasEnoughCarrier()', function() {
		it('Enought', function() {
			const fleetUnits = {
				'fighter': 1,
				'carrier': 1
			};

			const unitList = [
				{
					_id: 'fighter',
					shipType: 'SHIP_FIGHTER',
					shipShape: 'SHIP_FIGHTER_SMALL'
				},
				{
					_id: 'carrier',
					shipType: 'SHIP_CARRIER',
					parts: [
						{ type: 'hangar', tech: 'hangarDouble' },
						{ type: 'sub_propulsion', tech: 'vsolaire' },
					]
				},
				{
					_id: 'other',
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

		it('No Enought', function() {
			const fleetUnits = {
				'fighter': 80,
				'carrier': 1
			};

			const unitList = [
				{
					_id: 'fighter',
					shipType: 'SHIP_FIGHTER',
					shipShape: 'SHIP_FIGHTER_SMALL'
				},
				{
					_id: 'carrier',
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
	describe('# getUnitsList()', function() {
		it('Existing', function(done) {
			const unitIdList = [
				['5c1f62fe951265134ca2fa59',1]
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
				['000000000000000000000000',1]
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
	});
});