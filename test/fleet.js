/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../config')();
require('../misc')();

global.db = require('../database');

global.Fleet = require('../fleet');
global.Units = require('../units');

let gameDb;

describe('• Fleet', function() {
	before(function(done) {
		db.connect(function(success,general,database) {
			if(general) { database.close(); return; }
			gameDb = database;
			done();
		});
	});

	/**
	 * Slower speed ?
 	 */
	describe('# slowerSpeed()', function() {
		it('A slower than B', function() {
			let a = [1,2,3];
			let b = [3,2,1];

			assert.equal(
				Fleet.slowerSpeed(a, b),
				a
			);
		});

		it('A equals to B', function() {
			let a = [1,2,3];
			let b = [1,2,3];

			assert.equal(
				Fleet.slowerSpeed(a, b),
				a
			);
		});

		it('A faster than B', function() {
			let a = [3,2,1];
			let b = [1,2,3];
			
			assert.equal(
				Fleet.slowerSpeed(a, b),
				b
			);
		});
	});

	/**
	 * Calc fuel Cost ?
 	 */
	describe('# calcFuelCost()', function() {
		it('Sub', function() {
			let engines = {
				"vsolaire": 1, // 0
				"ion": 2, // 21364
				"plasma": 3, // 21732
			};

			assert.equal(
				Fleet.calcFuelCost(engines),
				43096
			);
		});

		it('Supra', function() {
			let engines = {
				"vsl": 1, // 32761
				"wd": 2, // 58024
				"hyperespace": 3, // 76476
			};

			assert.equal(
				Fleet.calcFuelCost(engines),
				167261
			);
		});
	});

	/**
	 * Calc fuel Cost ?
 	 */
	describe('# hasEnoughCarrier()', function() {
		it('Enought', function() {
			let fleetUnits = [
				["fighter", 1],
				["carrier", 1]
			];

			let unitList = [
				{
					_id: "fighter",
					shipType: "SHIP_FIGHTER",
					shipShape: "SHIP_FIGHTER_SMALL"
				},
				{
					_id: "carrier",
					shipType: "SHIP_CARRIER",
					parts: [
						{ type: "hangar", tech: "hangarDouble" },
						{ type: "sub_propulsion", tech: "vsolaire" },
					]
				},
				{
					_id: "other",
					shipType: "SHIP_OTHER",
				},
			];

			assert.equal(
				Fleet.hasEnoughCarrier(
					{ units: fleetUnits },
					unitList),
				true
			);
		});

		it('No Enought', function() {
			let fleetUnits = [
				["fighter", 80],
				["carrier", 1]
			];

			let unitList = [
				{
					_id: "fighter",
					shipType: "SHIP_FIGHTER",
					shipShape: "SHIP_FIGHTER_SMALL"
				},
				{
					_id: "carrier",
					shipType: "SHIP_CARRIER",
					parts: [
						{ type: "hangar", tech: "hangarDouble" },
						{ type: "sub_propulsion", tech: "vsolaire" },
					]
				},
			];

			assert.equal(
				Fleet.hasEnoughCarrier(
					{ units: fleetUnits },
					unitList),
				false
			);
		});
	});

	/**
	 * Calc move time
	 */
	describe('# calcMoveTime()', function() {
		it('1, 0 0 0 = 0', function() {
			assert.equal(
				Fleet.calcMoveTime(1, [0,0,0]),
				0
			);
		});
		it('1, 1 2 3 = 6', function() {
			assert.equal(
				Fleet.calcMoveTime(1, [1,2,3]),
				6
			);
		});
		it('2, 3 2 1 = 17', function() { // 3*(2^2)* + 2*2 + 1 = 12 + 4 + 1
			assert.equal(
				Fleet.calcMoveTime(2, [3,2,1]),
				17
			);
		});
	});

	/**
	 * Get units list
	 */
	describe('# getUnitsList()', function() {
		it('Existing', function(done) {
			let unitIdList = [
				["5b94e5bef438470454da3f4c",1]
			];

			Fleet.getUnitsList(unitIdList, function(unitList) {
				assert.equal(
					unitList.length,
					1
				);

				assert.equal(
					unitList[0].name,
					"UnitTest Unit"
				);

				done();
			});
		});

		it('Not existing', function(done) {
			let unitIdList = [
				["000000000000000000000000",1]
			];

			Fleet.getUnitsList(unitIdList, function(unitList) {
				assert.equal(
					unitList.length,
					0
				);

				done();
			});
		});
	});


	after(function(done) {
		gameDb.close();
		done();
	});
});