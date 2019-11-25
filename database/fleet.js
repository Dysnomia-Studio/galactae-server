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
	findAll: async(callback) => {
		try {
			return (await serverClient.query('SELECT * FROM fleets')).rows;
		} catch(err) {
			log(err, 'error');
		}
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
	findByPosition: (address,callback) => {
		serverClient.query('SELECT * FROM fleets WHERE position=$1', [address], (err, obj) => {
			if(err) { log(err, 'error'); return; }
			callback(obj.rows);
		});
	},
	findAllFleetReferingToPosition: (address,callback) => {
		serverClient.query('SELECT * FROM fleets WHERE position=$1 OR "motherPlanetAddress"=$1', [address], (err, obj) => {
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
	bulkUpdate: async(fleets) => {
		let query = 'UPDATE fleets SET ' +
			'"endMoveTime" = -1, ' +
			'points = newFleets.points, ' +
			'population = newFleets.population, ' +
			'units = newFleets.units ' +
			'FROM (VALUES ';

		let i = 0;
		const queryParameters = [];
		for(const fleet of fleets) {
			query += '($' + (++i) + '::real, $' + (++i) + '::integer, $' + (++i) + '::json, $' + (++i) + '::uuid), ';

			queryParameters.push(fleet.points);
			queryParameters.push(fleet.population);
			queryParameters.push(fleet.units);
			queryParameters.push(fleet.id);
		}
		query = query.substring(0, query.length - 2);

		query += ' ) as newFleets(points, population, units, id) ';
		query += 'WHERE fleets.id = newFleets.id';

		try {
			await serverClient.query(query, queryParameters);

			await serverClient.query('DELETE FROM fleets WHERE units::text = \'{}\'::text; AND "inBuilding" = false');
		} catch(err) {
			log(err, 'error');
		}
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