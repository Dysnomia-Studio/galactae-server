module.exports = {
	find: async (id) => {
		try {
			return (await serverClient.query('SELECT * FROM alliances WHERE id = $1 LIMIT 1', [id])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	findByName: async (name) => {
		try {
			return (await serverClient.query('SELECT * FROM alliances WHERE name = $1 LIMIT 1', [name])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	create: async (ally) => {
		try {
			await serverClient.query('INSERT INTO alliances (name, desc) VALUES ($1, $2)', [ally.name, ally.desc]);
		} catch(err) {
			log(err, 'error');
		}
	},
	update: async (id, name, desc) => {
		try {
			await serverClient.query('UPDATE alliances SET desc = $1, name = $2 WHERE id = $3', [desc, name, id]);
		} catch(err) {
			log(err, 'error');
		}
	},
	delete: async (id) => {
		try {
			await serverClient.query('DELETE FROM alliances WHERE id = $2', [id]);
		} catch(err) {
			log(err, 'error');
		}
	},
	search: async (searchText) => {
		try {
			return (await serverClient.query('SELECT * FROM alliances WHERE name ILIKE $1', ['%' + searchText + '%'])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	getMembers: async (id) => {
		try {
			return (await serverClient.query('// ************** @TODO ************** \\', [id])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
};