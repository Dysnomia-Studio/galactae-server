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
			await serverClient.query('BEGIN');

			await serverClient.query('DELETE FROM alliances_join WHERE alliance = $1', [id]);
			await serverClient.query('DELETE FROM alliances_invitations WHERE alliance = $1', [id]);
			await serverClient.query('DELETE FROM alliances_perms WHERE ally = $1', [id]);

			await serverClient.query('DELETE FROM alliances WHERE id = $1', [id]);

			await serverClient.query('COMMIT');
		} catch(err) {
			await serverClient.query('ROLLBACK');
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
			return (await serverClient.query('SELECT * FROM alliances_permissions INNER JOIN users ON users.id = player WHERE ally = $1', [id])).rows;
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
	createPermissions: async (playerId, allyId) => {
		try {
			await serverClient.query(
				'INSERT INTO alliances_permissions (ally, player, founder, leader, diplomacy) VALUES ($1, $2, 0, 0, 0)',
				[allyId, playerId]
			);
		} catch(err) {
			log(err, 'error');
		}
	},
	getPermissions: async (playerId) => {
		try {
			return (await serverClient.query('SELECT * FROM alliances_permissions WHERE player = $1', [playerId])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	setPermissions: async (playerId, founder, leader, diplomacy) => {
		try {
			await serverClient.query('UPDATE alliances_permissions SET founder = $2, leader = $3, diplomacy = $4 WHERE player = $1', [playerId, founder, leader, diplomacy]);
		} catch(err) {
			log(err, 'error');
		}
	},
	dropPermissions: async (playerId) => {
		try {
			return await serverClient.query('DELETE FROM alliances_permissions WHERE player = $1', [playerId]);
		} catch(err) {
			log(err, 'error');
		}
	},
};