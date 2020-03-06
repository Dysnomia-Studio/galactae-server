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
	askToJoin: async (playerName, allyId) => {
		try {
			await serverClient.query('INSERT INTO alliances_join (player, alliance) VALUES ($1, $2)', [playerName, allyId]);
		} catch(err) {
			log(err, 'error');
		}
	},
	askedToJoin: async (playerName, allyId) => {
		try {
			return (await serverClient.query('SELECT * FROM alliances_join WHERE player = $1 AND alliance = $2', [playerName, allyId]).rows.length > 0);
		} catch(err) {
			log(err, 'error');
		}
	},
	removeJoinAsk: async (playerName) => {
		try {
			await serverClient.query('DELETE FROM alliances_join WHERE player = $1', [playerName]);
		} catch(err) {
			log(err, 'error');
		}
	},
	invite: async (playerName, allyId) => {
		try {
			await serverClient.query('INSERT INTO alliances_invitations (player, alliance) VALUES ($1, $2)', [playerName, allyId]);
		} catch(err) {
			log(err, 'error');
		}
	},
	hasBeenInvited: async (playerId, allyId) => {
		try {
			return (await serverClient.query('SELECT * FROM alliances_invitations WHERE player = $1 AND alliance = $2', [playerId, allyId]).rows.length > 0);
		} catch(err) {
			log(err, 'error');
		}
	},
	removeInvitations: async (playerName) => {
		try {
			await serverClient.query('DELETE FROM alliances_invitations WHERE player = $1', [playerName]);
		} catch(err) {
			log(err, 'error');
		}
	},
};