/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
//global.db = require('../database');

/*let gameDb;
let generalDb;

describe('• db', () => {
	before(function(done) {
		let count = 0;

		db.connect(function(success,general,database) {
			if(++count === 2) {
				done();
			}
		});
	});

	describe('# player {}', () => {
		it('findAll()', function(done) {
			let ok = false;
			db.player.findAll(function(users) {
				assert(users !== undefined && users !== null);
				if(users !== undefined && users !== null) {
					assert(users.length > 0);
				}

				ok = true;
				done();
			});
			setTimeout(() => {
				if(ok) { return; }
				assert(false);
				done();
			}, 1500); // fallback
		});
		it('searchByName(ok)', function(done) {
			let ok = false;
			db.player.searchByName('Elanis', function(user) {
				assert(user !== undefined && user !== null);
				if(user !== undefined && user !== null) {
					assert(user.name === 'Elanis');
				}

				ok = true;
				done();
			});
			setTimeout(() => {
				if(ok) { return; }
				assert(false);
				done();
			}, 1500); // fallback
		});
		it('searchByName(not ok)', function(done) {
			let ok = false;
			db.player.searchByName('ThisIsAFakeUser', function(user) {
				assert(user === undefined || user === null);

				ok = true;
				done();
			});
			setTimeout(() => {
				if(ok) { return; }
				assert(false);
				done();
			}, 1500); // fallback
		});
		it('searchById(ok)', function(done) {
			let ok = false;
			db.player.searchById('80655df0-5775-11e9-99e3-8b79cb37567b', function(user) {
				assert(user !== undefined && user !== null);
				if(user !== undefined && user !== null) {
					assert(user.name === 'Elanis');
				}

				ok = true;
				done();
			});
			setTimeout(() => {
				if(ok) { return; }
				assert(false);
				done();
			}, 1500); // fallback
		});
		it('searchById(not ok)', function(done) {
			let ok = false;
			db.player.searchById('00000000-0000-0000-0000-000000000000', function(user) {
				assert(user === undefined || user === null);

				ok = true;
				done();
			});
			setTimeout(() => {
				if(ok) { return; }
				assert(false);
				done();
			}, 1500); // fallback
		});

		//searchBySid: can't do it easily

		// @TODO: Update

		// clearList: that's not a good idea ...
	});

	describe('# planet {}', () => {
		it('find(ok)', function(done) {
			let ok = false;
			db.planet.find('4-5-659-P0', function(planet) {
				assert(planet !== undefined && planet !== null);
				if(planet !== undefined && planet !== null) {
					assert(planet.address === '4-5-659-P0');
				}

				ok = true;
				done();
			});
			setTimeout(() => {
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
			setTimeout(() => {
				if(ok) { return; }
				assert(true);
				done();
			}, 1500); // fallback
		});

		// @TODO: Update

		it('findBySystemWithOwners(ok)', function(done) {
			let ok = false;
			db.planet.findBySystemWithOwners('4-5-659', function(planets) {
				assert(planets !== undefined && planets !== null);
				if(planets !== undefined && planets !== null) {
					assert(planets.length > 0);
				}

				ok = true;
				done();
			});
			setTimeout(() => {
				if(ok) { return; }
				assert(false);
				done();
			}, 1500); // fallback
		});
		it('findBySystemWithOwners(not ok)', function(done) {
			let ok = false;
			db.planet.findBySystemWithOwners('wrong-system-address', function(planets) {
				assert(planets === undefined || planets === null || planets.length === 0);

				ok = true;
				done();
			});
			setTimeout(() => {
				if(ok) { return; }
				assert(false);
				done();
			}, 1500); // fallback
		});
	});

	describe('# unit {}', () => {
		// @TODO: create, then find, findByOwner, delete

		it('findAll()', function(done) {
			let ok = false;
			db.unit.findAll(function(units) {
				assert(units !== undefined && units !== null);
				if(units !== undefined && units !== null) {
					assert(units.length > 0);
				}

				ok = true;
				done();
			});
			setTimeout(() => {
				if(ok) { return; }
				assert(false);
				done();
			}, 1500); // fallback
		});
	});

	after(function(done) {
		db.closeConnections(() => {
			done();
		});
	});
});*/