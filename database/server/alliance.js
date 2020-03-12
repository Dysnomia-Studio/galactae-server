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
			await serverClient.query('DELETE FROM alliances_pacts WHERE first = $1 OR second = $1', [id]);
			await serverClient.query('DELETE FROM alliances_permissions WHERE ally = $1', [id]);

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
	/**
	 * Perms
	 */
	getMembers: async (id) => {
		try {
			return (await serverClient.query('SELECT users.name, founder, leader, diplomacy FROM alliances_permissions INNER JOIN users ON users.id = player WHERE users.ally = $1', [id])).rows;
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
	/**
	 * Join
	 */
	getAskToJoin: async(allyId) => {
		try {
			return (await serverClient.query('SELECT * FROM alliances_join WHERE alliance = $1', [allyId])).rows;
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
	removeJoinAsk: async (playerName, ally) => {
		try {
			if(!ally) {
				await serverClient.query('DELETE FROM alliances_join WHERE player = $1', [playerName]);
			} else {
				await serverClient.query('DELETE FROM alliances_join WHERE player = $1 AND alliance = $2', [playerName, ally]);
			}
		} catch(err) {
			log(err, 'error');
		}
	},
	/**
	 * Invitations
	 */
	getInvitations: async(allyId) => {
		try {
			return (await serverClient.query('SELECT * FROM alliances_invitations WHERE alliance = $1', [allyId])).rows;
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
	removeInvitations: async (playerName, ally) => {
		try {
			if(!ally) {
				await serverClient.query('DELETE FROM alliances_invitations WHERE player = $1', [playerName]);
			} else {
				await serverClient.query('DELETE FROM alliances_invitations WHERE player = $1 AND alliance = $2', [playerName, ally]);
			}
		} catch(err) {
			log(err, 'error');
		}
	},
	/**
	 * Pacts
	 */
	getPacts: async (allyId) => {
		try {
			return (await serverClient.query('SELECT alliances_pacts.*, a1.name as ally_1_name, a2.name as ally_2_name FROM alliances_pacts INNER JOIN alliances AS a1 ON a1.id = first INNER JOIN alliances AS a2 ON a2.id = second WHERE first = $1 OR second = $1', [allyId])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	askPact: async (allyId, otherAllyId) => {
		try {
			await serverClient.query('INSERT INTO alliances_pacts (first, second, accepted) VALUES ($1, $2, false)', [allyId, otherAllyId]);
		} catch(err) {
			log(err, 'error');
		}
	},
	acceptPact: async (allyId, otherAllyId) => {
		try {
			await serverClient.query('UPDATE alliances_pacts SET accepted = true WHERE ((first = $1 AND second = $2) OR (first = $2 AND second = $1))', [allyId, otherAllyId]);
		} catch(err) {
			log(err, 'error');
		}
	},
	removePact: async (allyId, otherAllyId) => {
		try {
			await serverClient.query('DELETE FROM alliances_pacts WHERE ((first = $1 AND second = $2) OR (first = $2 AND second = $1)', [allyId, otherAllyId]);
		} catch(err) {
			log(err, 'error');
		}
	},
};