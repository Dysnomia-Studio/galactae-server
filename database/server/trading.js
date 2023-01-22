module.exports = {
	findAll: async(playerId) => {
		try {
			return (await serverClient.query('SELECT ' +
						'trading.id, ' +
						'prevUserTable.name AS prev_user, ' +
						'prevUserAlly.name AS prev_user_ally, ' +
						'newUserTable.name AS new_user, ' +
						'newUserAlly.name AS new_user_ally, ' +
						'date, prev_user_origin, prev_user_destination, new_user_origin, new_user_destination, resources_origin, accepted, repetition_interval, repetition_count, repetition_done, aborted, done, resources_destination ' +
						'FROM trading ' +
						'INNER JOIN users AS prevUserTable ON prevUserTable.id = trading.prev_user ' +
						'LEFT JOIN alliances AS prevUserAlly ON prevUserAlly.id = prevUserTable.ally ' +
						'LEFT JOIN users AS newUserTable ON newUserTable.id = trading.new_user ' +
						'LEFT JOIN alliances AS newUserAlly ON newUserAlly.id = newUserTable.ally ' +
						'WHERE (prev_user = $1 OR new_user = $1 OR (new_user IS NULL AND aborted = false))',
			[playerId])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
};