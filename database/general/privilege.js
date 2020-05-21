module.exports = {
	find: async(id) => {
		try {
			return (await generalClient.query('SELECT * FROM privileges WHERE user_id=$1 AND server_name=$2', [id, globalCfg.serverGlobalName])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
};
