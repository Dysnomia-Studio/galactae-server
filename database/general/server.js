module.exports = {
	find: async() => {
		try {
			return (await generalClient.query('SELECT * FROM servers WHERE server_name = $1', [globalCfg.serverGlobalName])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	update: async(inputServerData) => {
		const serverData = Object.assign({}, inputServerData);
		const server_name = serverData.server_name;
		delete serverData.server_name;

		let [query, values] = db.buildUpdateQuery('servers', serverData);
		values.push(server_name);
		query += ' WHERE server_name = $' + values.length;

		try {
			await generalClient.query(query, values);
		} catch(err) {
			log(err, 'error');
		}
	},
};
