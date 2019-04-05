/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
global.db = require('../database');

let gameDb;
let generalDb;

describe('• db', function() {
	before(function(done) {
		let count = 0;

		db.connect(function(success,general,database) {
			if(++count === 2) {
				done();
			}
		});
	});

	describe('# player {}', function() {
		it('findAll()', function(done) {
			db.player.findAll(function(users) {
				assert(users !== undefined && users !== null);
				if(users !== undefined && users !== null) {
					assert(users.length > 0);
				}

				done();
			});
		});
		it('searchByName(ok)', function(done) {
			db.player.searchByName('Elanis', function(user) {
				assert(user !== undefined && user !== null);
				if(user !== undefined && user !== null) {
					assert(user.name === 'Elanis');
				}

				done();
			});
		});
		it('searchByName(not ok)', function(done) {
			db.player.searchByName('ThisIsAFakeUser', function(user) {
				assert(user === undefined || user === null);
				done();
			});
		});
		it('searchById(ok)', function(done) {
			db.player.searchById('5bd73bd6c050b80095743eb4', function(user) {
				assert(user !== undefined && user !== null);
				if(user !== undefined && user !== null) {
					assert(user.name === 'Elanis');
				}

				done();
			});
		});
		it('searchById(not ok)', function(done) {
			db.player.searchById('000000000000000000000000', function(user) {
				assert(user === undefined || user === null);
				done();
			});
		});

		//searchBySid: can't do it easily

		// @TODO: Update

		// clearList: that's not a good idea ...
	});

	describe('# planet {}', function() {
		it('find(ok)', function(done) {
			let ok = false;
			db.planet.find('5-5-3-P2', function(planet) {
				assert(planet !== undefined && planet !== null);
				if(planet !== undefined && planet !== null) {
					assert(planet.address === '5-5-3-P2');
				}

				ok = true;
				done();
			});
			setTimeout(function() {
				if(ok) { return; }
				assert(false);
				done();
			}, 1500); // fallback
		});
		it('find(not ok)', function(done) {
			let ok = false;
			db.planet.find('wrong-planet-address', function(planet) {
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
			let ok = false;
			db.planet.findBySystemWithOwners('5-5-3', function(planets) {
				assert(planets !== undefined && planets !== null);
				if(planets !== undefined && planets !== null) {
					assert(planets.length > 0);
				}

				ok = true;
				done();
			});
			setTimeout(function() {
				if(ok) { return; }
				assert(false);
				done();
			}, 1500); // fallback
		});
		it('findBySystemWithOwners(not ok)', function(done) {
			let ok = false;
			db.planet.findBySystemWithOwners('wrong-system-address', function(planets) {
				assert(planets !== undefined && planets !== null);
				if(planets !== undefined && planets !== null) {
					assert(planets.length === 0);
				}

				ok = true;
				done();
			});
			setTimeout(function() {
				if(ok) { return; }
				assert(false);
				done();
			}, 1500); // fallback
		});
	});

	describe('# unit {}', function() {
		// @TODO: create, then find, findByOwner, delete

		it('findAll()', function(done) {
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
		db.closeConnections(() => {
			done();
		});
	});
});