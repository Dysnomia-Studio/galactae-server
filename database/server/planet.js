module.exports = {
	findbyAddress: async (addr) => {
		try {
			return (await serverClient.query('SELECT * FROM planets WHERE address = $1 LIMIT 1', [addr])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	find: (addr,callback) => {
		serverClient.query('SELECT * FROM planets WHERE address = $1 LIMIT 1', [addr], (err, planetReturned) => {
			if(err) {
				log(err, 'error');
				return;
			}

			if(isset(planetReturned, 'object') && isset(planetReturned.rows[0], 'object')) {
				callback(planetReturned.rows[0]);
			}
		});
	},
	findByOwner: (userId, callback) => {
		serverClient.query('SELECT * FROM planets WHERE owner = $1', [userId], (err, planetReturned) => {
			if(err) {
				log(err, 'error');
				return;
			}

			if(isset(planetReturned, 'object')) {
				callback(planetReturned.rows);
			}
		});
	},
	update: (inputPlanet, callback) => {
		const planet = Object.assign({}, inputPlanet);
		const id = planet.id;
		delete planet.id;

		let [query, values] = db.buildUpdateQuery('planets', planet);
		values.push(id);
		query += ' WHERE id = $' + values.length;

		serverClient.query(query, values, (err) => {
			if(err) {
				log(err, 'error');
				return;
			}

			if(callback) {
				callback();
			}
		});
	},
	findBySystemWithOwners: async (systemAddr, callback) => {
		let planetList;
		try {
			planetList =  (await serverClient.query('SELECT * FROM planets WHERE address LIKE $1', [systemAddr + '%'])).rows;
		} catch(err) {
			log(err, 'error');
			planetList = [];
		}

		for(let i=0; i<planetList.length; i++) {
			const user = await db.player.find(planetList[i].owner);

			planetList[i].ownerName = null;
			planetList[i].ally = '';

			if(isset(user, 'object') && !user.name.includes('Colonisable')) {
				planetList[i].ownerName = user.name;
				if(user.ally) {
					const ally = await db.alliance.find(user.ally);

					if(ally && ally.name) {
						planetList[i].ally = ally.name;
					}
				}
			}
		}
		callback(planetList);
	},
	setOwner: async(planet, owner) => {
		try {
			await serverClient.query('UPDATE planets SET owner = $1, "currResearch" = \'\' WHERE address = $2', [owner, planet]);
		} catch(err) {
			log(err, 'error');
		}
	},
	assignNewPlanet: async(plyId) => {
		try {
			await serverClient.query('BEGIN');

			const planetAddress = (await serverClient.query('SELECT * FROM planets WHERE "owner" = \'00000000-0000-0000-0000-000000000001\' LIMIT 1')).rows[0].address;

			await serverClient.query('UPDATE planets SET "lastResourcesUpdate" = NOW(), "lastUnitUpdate" = NOW(), owner = $1 WHERE address = $2', [plyId, planetAddress]);

			await serverClient.query('COMMIT');

			return planetAddress;
		} catch(err) {
			log(err, 'error');
			await serverClient.query('ROLLBACK');
		}
	},
};
