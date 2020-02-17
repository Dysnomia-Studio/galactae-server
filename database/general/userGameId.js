module.exports = {
	find: (id,callback) => {
		generalClient.query('SELECT * FROM "userGameIds" WHERE game_id = $1', [id], (err, obj) => {
			if(err) {
				log(err, 'error');
				return;
			}
			if(isset(obj, 'object') && isset(obj.rows, 'array') && isset(obj.rows[0], 'object')) {
				callback(obj.rows[0]);
			}
		});
	},
};
