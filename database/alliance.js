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
	updateDesc: async (id, desc) => {
		try {
			await serverClient.query('UPDATE alliances SET desc = $1 WHERE id = $2', [desc, id]);
		} catch(err) {
			log(err, 'error');
		}
	},
	updateName: async (id, name) => {
		try {
			await serverClient.query('UPDATE alliances SET name = $1 WHERE id = $2', [name, id]);
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
};