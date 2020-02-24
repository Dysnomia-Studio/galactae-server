module.exports = {
	find: (uid,type,callback) => {
		generalClient.query('SELECT * FROM bans WHERE user_id=$1 AND server_name=$2 AND ban_type=$3', [uid, globalCfg.serverGlobalName, type], (err, obj) => {
			if(err) {
				log(err, 'error');
				return;
			}
			callback(obj.rows);
		});
	},
	create: (bans) => {
		const [query, values] = db.buildInsertQuery('bans', bans);

		generalClient.query(query, values, (err) => {
			if(err) {
				log(err, 'error');
				return;
			}
		});
	},
};
