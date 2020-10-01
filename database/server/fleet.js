module.exports = {
	find: async(id) => {
		try {
			const dbObj = await serverClient.query('SELECT * FROM fleets WHERE id=$1',[id]);

			const fleet = dbObj.rows[0];

			if(isset(fleet, 'object')) {
				fleet.fuel = parseInt(fleet.fuel);
				fleet.maxFuel = parseInt(fleet.maxFuel);

				if(Number.isNaN(fleet.fuel) || Number.isNaN(fleet.maxFuel)) {
					log('Can\'t parse fuel/maxFuel for fleet ' + fleet.name + '!', 'warn');
					return;
				}
			}

			return fleet;
		} catch(err) {
			log(err, 'error');
		}
	},
	findAll: async() => {
		try {
			return (await serverClient.query('SELECT * FROM fleets')).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	findByMotherPlanet: async(address) => {
		try {
			return (await serverClient.query('SELECT * FROM fleets WHERE "motherPlanetAddress"=$1', [address])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	findByPosition: async(address) => {
		try {
			return (await serverClient.query('SELECT * FROM fleets WHERE position=$1', [address])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	findAllFleetReferingToPosition: async(address) => {
		try {
			const fleetList = (await serverClient.query('SELECT * FROM fleets WHERE position=$1 OR "motherPlanetAddress"=$1', [address])).rows;

			for(const fleet of fleetList) {
				fleet.owner = await db.player.find(fleet.ownerId);
			}

			return fleetList;
		} catch(err) {
			log(err, 'error');
		}
	},
	findByTactic: async(tid) => {
		try {
			return (await serverClient.query('SELECT * FROM fleets WHERE tactic=$1', [tid])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	getNextFleetToSync: async() => {
		try {
			return (await serverClient.query('SELECT * FROM fleets ORDER BY "endMoveTime" ASC NULLS LAST LIMIT 1')).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	endMove: async(fleetId) => {
		try {
			await serverClient.query('UPDATE fleets SET "endMoveTime" = NULL WHERE id = $1', [fleetId]);
		} catch(err) {
			log(err, 'error');
		}
	},
	update: async(inputFleet) => {
		const fleet = Object.assign({}, inputFleet);
		const id = fleet.id;
		delete fleet.id;
		delete fleet.points;

		let [query, values] = db.buildUpdateQuery('fleets', fleet);
		values.push(id);
		query += ' WHERE id = $' + values.length;

		try {
			await serverClient.query(query, values);

			return true;
		} catch(err) {
			log(err, 'error');
			return false;
		}
	},
	bulkUpdate: async(fleets) => {
		let query = 'UPDATE fleets SET ' +
			'"endMoveTime" = NULL, ' +
			'population = newFleets.population, ' +
			'units = newFleets.units, ' +
			'"orbitPosition" = newFleets."orbitPosition" ' +
			'FROM (VALUES ';

		let i = 0;
		const queryParameters = [];
		for(const fleet of fleets) {
			query += '($' + (++i) + '::integer, $' + (++i) + '::json, $' + (++i) + '::integer, $' + (++i) + '::uuid), ';

			queryParameters.push(fleet.population);
			queryParameters.push(fleet.units);
			queryParameters.push(fleet.orbitPosition);
			queryParameters.push(fleet.id);
		}
		query = query.substring(0, query.length - 2);

		query += ' ) as newFleets(population, units, "orbitPosition", id) ';
		query += 'WHERE fleets.id = newFleets.id';

		try {
			await serverClient.query(query, queryParameters);

			await serverClient.query('DELETE FROM fleets WHERE units::text = \'{}\'::text AND "inBuilding" = false');
		} catch(err) {
			log(err, 'error');
		}
	},
	create: async(fleet) => {
		const [query, values] = db.buildInsertQuery('fleets', fleet);

		try {
			await serverClient.query(query, values);

			return fleet;
		} catch(err) {
			log(err, 'error');
		}
	},
	remove: async(id) => {
		try {
			await serverClient.query('DELETE FROM fleets WHERE id=$1', [id]);
		} catch(err) {
			log(err, 'error');
		}
	},
	assignFleet: async(fid, tid) => {
		try {
			await serverClient.query('UPDATE fleets SET tactic=$1 WHERE id=$2', [tid, fid]);
		} catch(err) {
			log(err, 'error');
		}
	},
	getAlliedForces: async(plyId, allyId) => {
		try {
			let fleets = [];

			if(allyId !== null) {
				const members = await db.alliance.getMemberIdList(allyId);

				for(const member of members) {
					const currFleets = (await serverClient.query('SELECT position, population FROM fleets WHERE "ownerId" = $1', [member.id])).rows || [];
					fleets = [...fleets, ...currFleets];
				}
			} else {
				fleets = (await serverClient.query('SELECT position, population FROM fleets WHERE "ownerId" = $1', [plyId])).rows || [];
			}

			const forces = {};
			for(const fleet of fleets) {
				const system = GameMap.getSystemFromAdress(fleet.position);

				if(!forces[system]) {
					forces[system] = 0;
				}

				forces[system] += fleet.population;
			}

			return forces;
		} catch(err) {
			log(err, 'error');
			return {};
		}
	}
};
