module.exports = {
	find: (id,callback) => {
		serverClient.query('SELECT * FROM fleets WHERE id=$1',[id], (err, obj) => {
			if(err) { log(err, 'error'); return; }
			if(callback) {
				const fleet = obj.rows[0];

				if(isset(fleet, 'object')) {
					fleet.fuel = parseInt(fleet.fuel);
					fleet.maxFuel = parseInt(fleet.maxFuel);

					if(Number.isNaN(fleet.fuel) || Number.isNaN(fleet.maxFuel)) {
						log('Can\'t parse fuel/maxFuel for fleet ' + fleet.name + '!', 'warn');
						return;
					}
				}

				callback(fleet);
			}
		});
	},
	findAll: (callback) => {
		serverClient.query('SELECT * FROM fleets', [], (err, obj) => {
			if(err) { log(err, 'error'); return; }
			callback(obj.rows);
		});
	},
	findByOwner: (id,callback) => {
		serverClient.query('SELECT * FROM fleets WHERE "ownerId"=$1', [id], (err, obj) => {
			if(err) { log(err, 'error'); return; }
			callback(obj.rows);
		});
	},
	findByMotherPlanet: (planetId,callback) => {
		serverClient.query('SELECT * FROM fleets WHERE "motherPlanetId"=$1', [planetId], (err, obj) => {
			if(err) { log(err, 'error'); return; }
			callback(obj.rows);
		});
	},
	findByPosition: (planetId,callback) => {
		serverClient.query('SELECT * FROM fleets WHERE position=$1', [planetId], (err, obj) => {
			if(err) { log(err, 'error'); return; }
			callback(obj.rows);
		});
	},
	findByTactic: (tid,callback) => {
		serverClient.query('SELECT * FROM fleets WHERE tactic=$1', [tid], (err, obj) => {
			if(err) { log(err, 'error'); return; }
			callback(obj.rows);
		});
	},
	update: (inputFleet,callback) => {
		const fleet = Object.assign({}, inputFleet);
		const id = fleet.id;
		delete fleet.id;

		let [query, values] = db.buildUpdateQuery('fleets', fleet);
		values.push(id);
		query += ' WHERE id = $' + values.length;

		serverClient.query(query, values, (err) => {
			if(err) { log(err, 'error'); return; }
			if(callback) {
				callback();
			}
		});
	},
	create: (fleet,callback) => {
		const [query, values] = db.buildInsertQuery('fleets', fleet);

		serverClient.query(query, values, (err) => {
			if(err) { log(err, 'error'); return; }
			if(callback) {
				callback(fleet);
			}
		});
	},
	remove: (id) => {
		serverClient.query('DELETE FROM fleets WHERE id=$1', [id], (err) => {
			if(err) { log(err, 'error'); return; }
		});
	},
	assignFleet: (fid, tid, callback) => {
		serverClient.query('UPDATE fleets SET tactic=$1 WHERE id=$2', [tid, fid], (err) => {
			if(err) { log(err, 'error'); return; }
			callback();
		});
	},
};