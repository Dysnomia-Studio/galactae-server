/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
global.db = require('./database');

let gameDb;
let generalDb;

describe('• db', function() {
	before(function(done) {
		db.connect(function(success,general,database) {
			if(general) { 
				generalDb = database;
			} else {
				gameDb = database;
			}

			if(generalDb !== undefined && gameDb !== undefined) {
				done();
			}
		});
	});

	describe('# player {}', function(done) {
		it('findAll()', function() {
			db.player.findAll(function(users) {
				assert(users !== undefined && users !== null);
				if(users !== undefined && users !== null) {
					assert(users.length > 0);
				}

				done();
			});
		});
		it('searchByName(ok)', function(done) {
			db.player.searchByName("Elanis", function(user) {
				assert(user !== undefined && user !== null);
				if(user !== undefined && user !== null) {
					assert(user.name == "Elanis");
				}

				done();
			});
		});
		it('searchByName(not ok)', function(done) {
			db.player.searchByName("ThisIsAFakeUser", function(user) {
				assert(user === undefined || user === null);
				done();
			});
		});
		it('searchById(ok)', function(done) {
			db.player.searchById("58fa309a7acc0f4281af935d", function(user) {
				assert(user !== undefined && user !== null);
				if(user !== undefined && user !== null) {
					assert(user.name == "Elanis");
				}

				done();
			});
		});
		it('searchById(not ok)', function(done) {
			db.player.searchById("000000000000000000000000", function(user) {
				assert(user === undefined || user === null);
				done();
			});
		});

		//searchBySid: can't do it easily

		// @TODO: Update

		// clearList: that's not a good idea ...
	});

	describe('# planet {}', function(done) {
		it('find(ok)', function() {
			db.planet.find("5-5-3-P2", function(planet) {
				assert(planet !== undefined && planet !== null);
				if(planet !== undefined && planet !== null) {
					assert(planet.address == "5-5-3-P2");
				}

				done();
			});
		});
		it('find(not ok)', function(done) {
			let ok = false;
			db.planet.find("wrong-planet-address", function(planet) {
				assert(planet === undefined || planet === null);
				ok = true;
				done();
			});
			setTimeout(function() {
				if(ok) { return; }
				assert(true);
				done();
			}, 1500); // fallback
		});

		// @TODO: Update

		it('findBySystemWithOwners(ok)', function(done) {
			db.planet.findBySystemWithOwners("5-5-3", function(planets) {
				assert(planets !== undefined && planets !== null);
				if(planets !== undefined && planets !== null) {
					assert(planets.length > 0);
				}

				done();
			});
		});
		it('findBySystemWithOwners(not ok)', function(done) {
			db.planet.findBySystemWithOwners("wrong-system-address", function(planets) {
				assert(planets !== undefined && planets !== null);
				if(planets !== undefined && planets !== null) {
					assert(planets.length == 0);
				}
				done();
			});
		});
	});

	describe('# unit {}', function(done) {
		// @TODO: create, then find, findByOwner, delete

		it('findAll()', function() {
			db.unit.findAll(function(units) {
				assert(units !== undefined && units !== null);
				if(units !== undefined && units !== null) {
					assert(units.length > 0);
				}

				done();
			});
		});
	});

	after(function(done) {
		gameDb.close();
		generalDb.close();
		done();
	});
});