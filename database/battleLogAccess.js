module.exports = {
	add: async (battleLogId, players) => {
		let query = 'INSERT INTO public."battleLogAccess"' +
			'("battleLogId", "userId", "read") VALUES ';

		let i = 1;
		for(const player of players) {
			query += '($1,$' + ++i + ',false),';
		}

		query = query.substring(0, query.length - 1);

		await serverClient.query(
			query,
			[battleLogId, ...players],
		);
	},
	fetchByPlayer: async(playerId) => {
		try {
			return (await serverClient.query(
				'SELECT "battleLogId", "read", atk_user_name, def_user_name, atk_fleet_name, location, date, "defWins" ' +
				'FROM "battleLogAccess" ' +
				'INNER JOIN "battleLog" ON "battleLogAccess"."battleLogId" = "battleLog"."battleLog_id" ' +
				'WHERE "userId" = $1',
				[playerId]
			)).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	deleteReport: async(playerId, battleLogIdList) => {
		try {
			let battleLogIdsStr = '(';
			const sqlParameters = [playerId];
			for(const battleLogId of battleLogIdList) {
				sqlParameters.push(battleLogId);

				battleLogIdsStr += '$' + sqlParameters.length + ',';
			}
			battleLogIdsStr = battleLogIdsStr.substring(0, battleLogIdsStr.length-1) + ')';

			await serverClient.query(
				'DELETE FROM "battleLogAccess" ' +
				'WHERE "userId" = $1' +
				'AND "battleLogId" IN ' + battleLogIdsStr,
				sqlParameters
			);
		} catch(err) {
			log(err, 'error');
		}
	},
	setReadStatus: async(playerId, battleLogIdList, read) => {
		try {
			let battleLogIdsStr = '(';
			const sqlParameters = [playerId];
			for(const battleLogId of battleLogIdList) {
				sqlParameters.push(battleLogId);

				battleLogIdsStr += '$' + sqlParameters.length + ',';
			}
			battleLogIdsStr = battleLogIdsStr.substring(0, battleLogIdsStr.length-1) + ')';

			sqlParameters.push(read);

			await serverClient.query(
				'UPDATE "battleLogAccess" ' +
				'SET "read"=$' + (sqlParameters.length) + ' ' +
				'WHERE "userId" = $1' +
				'AND "battleLogId" IN ' + battleLogIdsStr,
				sqlParameters
			);
		} catch(err) {
			log(err, 'error');
		}
	},
};