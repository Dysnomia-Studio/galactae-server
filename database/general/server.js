module.exports = {
	find: (callback) => {
		generalClient.query('SELECT * FROM servers WHERE server_name = $1', [globalCfg.serverGlobalName], (err, obj) => {
			if(err) {
				log(err, 'error');
				return;
			}
			if(isset(obj, 'object') && isset(obj.rows, 'array') && isset(obj.rows[0], 'object')) {
				callback(obj.rows[0]);
			}
		});
	},
	update: (inputServerData, callback) => {
		const serverData = Object.assign({}, inputServerData);
		const server_name = serverData.server_name;
		delete serverData.server_name;

		let [query, values] = db.buildUpdateQuery('servers', serverData);
		values.push(server_name);
		query += ' WHERE server_name = $' + values.length;

		serverClient.query(query, values, (err) => {
			if(err) {
				log(err, 'error');
				return;
			}
			if(callback) {
				callback();
			}
		});
	},
};
