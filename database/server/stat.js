module.exports = {
	submit: async(currTime) => {
		try {
			await serverClient.query('INSERT INTO stats (time, "plCount") VALUES ($1, $2)', [currTime, playerList.size]);
		} catch(err) {
			log(err, 'error');
		}
	},
};
