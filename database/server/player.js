module.exports = {
	findAll: (callback) => {
		serverClient.query('SELECT * FROM users', [], (err, objReturned) => {
			if(err) {
				log(err, 'error');
				return;
			}

			callback(objReturned.rows);
		});
	},
	find: async (id) => {
		try {
			return (await serverClient.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	findByName: async (name) => {
		try {
			return (await serverClient.query('SELECT * FROM users WHERE name = $1 LIMIT 1', [name])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	findByAlly: async(allyId) => {
		try {
			return (await serverClient.query('SELECT * FROM users WHERE ally = $1', [allyId])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	searchByName: (name,callback) => {
		serverClient.query('SELECT * FROM users WHERE name = $1 LIMIT 1', [name], (err, objReturned) => {
			if(err) {
				log(err, 'error');
				return;
			}

			callback(objReturned.rows[0]);
		});
	},
	searchBySid: (sid,callback) => {
		serverClient.query('SELECT * FROM users WHERE sid = $1 LIMIT 1', [sid], (err, objReturned) => {
			if(err) {
				log(err, 'error');
				return;
			}

			callback(objReturned.rows[0]);
		});
	},
	updateAlly: async(user) => {
		try {
			await serverClient.query('UPDATE users SET ally = $1 WHERE id = $2', [user.ally, user.id]);
		} catch(err) {
			log(err, 'error');
		}
	},
	update: (inputUser, callback) => {
		const user = Object.assign({}, inputUser);
		const id = user.id;
		delete user.id;

		delete user.sectorPointsAddresses;
		delete user.sectorPointsValue;
		delete user.sectorPointsPcount;
		delete user.ally;

		let [query, values] = db.buildUpdateQuery('users', user);
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
	joinAlly: async (userId, allyId) => {
		try {
			await serverClient.query(
				'UPDATE users SET ally = $2 WHERE id = $1',
				[userId, allyId]
			);
		} catch(err) {
			log(err, 'error');
		}
	},
	clearList: () => {
		log('Clearing player list ...');

		serverClient.query('UPDATE users SET sid = \'-1\'', [], (err) => {
			if(err) {
				log(err, 'error');
				return;
			}

			log('List cleared !') ;
		});
	},
	delPlanet: async (ply, planet) => {
		const player = await db.player.find(ply);
		player.planetlist = player.planetlist.filter((elt) => elt !== planet);

		if(player.planetlist === 0) {
			const planetAddress = db.player.assignNewPlanet(ply);
			player.planetlist = [planetAddress];
		}

		try {
			await serverClient.query('UPDATE users SET planetlist = $1 WHERE id = $2', [ply, player.planetlist]);
		} catch(err) {
			log(err, 'error');
		}
	},
	addPlanet: async (ply, planet) => {
		const player = await db.player.find(ply);
		player.planetlist = Array.from(new Set([...player.planetlist, planet]));

		try {
			await serverClient.query('UPDATE users SET planetlist = $1 WHERE id = $2', [ply, player.planetlist]);
		} catch(err) {
			log(err, 'error');
		}
	},
};
