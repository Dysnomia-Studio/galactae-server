module.exports = {
	submit: async(currTime) => {
		try {
			await serverClient.query('INSERT INTO stats_connected (time, "plCount") VALUES ($1, $2)', [currTime, playerList.size]);

			const yesterday = new Date(currTime);
			yesterday.setDate(yesterday.getDate() - 1);

			const count = (await serverClient.query('SELECT COUNT(*) as count FROM users WHERE "lastConnected" > $1 OR "lastAction" > $1', [yesterday])).rows[0].count;

			await serverClient.query('INSERT INTO "stats_lastDay" (time, "plCount") VALUES ($1, $2)', [currTime, count]);
		} catch(err) {
			log(err, 'error');
		}
	},
};
