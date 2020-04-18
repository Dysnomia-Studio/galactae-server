module.exports = {
	find: async (uid, type) => {
		try {
			return (await generalClient.query('SELECT * FROM bans WHERE user_id=$1 AND server_name=$2 AND ban_type=$3', [uid, globalCfg.serverGlobalName, type])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	create: async (bans) => {
		const [query, values] = db.buildInsertQuery('bans', bans);

		try {
			await generalClient.query(query, values);
		} catch(err) {
			log(err, 'error');
		}
	},
};
