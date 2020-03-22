module.exports = {
	submit: (currTime) => {
		serverClient.query('INSERT INTO stats (time, "plCount") VALUES ($1, $2)', [currTime, playerList.size], (err) => {
			if(err) {
				log(err, 'error');
			}
		});
	},
};
