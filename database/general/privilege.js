module.exports = {
	find: (id,callback) => {
		generalClient.query('SELECT * FROM privileges WHERE user_id=$1 AND server_name=$2', [id, globalCfg.serverGlobalName], (err, obj) => {
			if(err) {
				log(err, 'error');
				return;
			}
			// DO NOT CHECK IF WE HAVE OBJECT, NOT EVERYONE IS REGISTERED IN THIS DATABASE
			callback(obj.rows);
		});
	},
};
