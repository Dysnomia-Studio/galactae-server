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
	findByName: async (id) => {
		try {
			return (await serverClient.query('SELECT * FROM users WHERE name = $1 LIMIT 1', [id])).rows[0];
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
};
