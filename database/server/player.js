module.exports = {
	findAll: async() => {
		try {
			return (await serverClient.query('SELECT * FROM users', [])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	find: async(id) => {
		try {
			return (await serverClient.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	findByName: async(name) => {
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
	findBySid: async(sid) => {
		try {
			return (await serverClient.query('SELECT * FROM users WHERE sid = $1 LIMIT 1', [sid])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	updateAlly: async(user) => {
		try {
			await serverClient.query('UPDATE users SET ally = $1 WHERE id = $2', [user.ally, user.id]);
		} catch(err) {
			log(err, 'error');
		}
	},
	update: async(inputUser) => {
		const user = Object.assign({}, inputUser);
		const id = user.id;
		delete user.id;

		delete user.ally;

		let [query, values] = db.buildUpdateQuery('users', user);
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
	joinAlly: async(userId, allyId) => {
		try {
			await serverClient.query(
				'UPDATE users SET ally = $2 WHERE id = $1',
				[userId, allyId]
			);
		} catch(err) {
			log(err, 'error');
		}
	},
	clearList: async() => {
		log('Clearing player list ...');

		try {
			await serverClient.query(
				'UPDATE users SET sid = \'-1\'',
				[]
			);
		} catch(err) {
			log(err, 'error');
		}

		log('List cleared !') ;
	},
	delPlanet: async(ply, planet) => {
		const player = await db.player.find(ply);
		player.planetlist = player.planetlist.filter((elt) => elt !== planet);

		if(player.planetlist.length === 0) {
			const planetAddress = await db.planet.assignNewPlanet(ply);
			player.planetlist = [planetAddress];
		}

		try {
			await serverClient.query('UPDATE users SET planetlist = $2 WHERE id = $1', [ply, player.planetlist]);
		} catch(err) {
			log(err, 'error');
		}
	},
	addPlanet: async(ply, planet) => {
		const player = await db.player.find(ply);
		player.planetlist = Array.from(new Set([...player.planetlist, planet]));

		try {
			await serverClient.query('UPDATE users SET planetlist = $2 WHERE id = $1', [ply, player.planetlist]);
		} catch(err) {
			log(err, 'error');
		}
	},
};
