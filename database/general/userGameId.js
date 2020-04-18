module.exports = {
	find: async(id) => {
		try {
			return (await generalClient.query('SELECT * FROM "userGameIds" WHERE game_id = $1', [id])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
};
