module.exports = {
	update: async(game_id, points, pcount, name, ally) => {
		generalClient.query('SELECT * FROM "globalRanks" WHERE game_id=$1 AND server_name=$2', [game_id,globalCfg.serverGlobalName], (err, obj) => {
			if(err) {
				log(err, 'error');
				return;
			}

			if(obj.rows.length > 0) {
				generalClient.query('UPDATE "globalRanks" SET points=$1, planets=$2, ally=$3 WHERE game_id=$4 AND server_name=$5',
					[points, pcount, ally, game_id, globalCfg.serverGlobalName], (updateErr) => {
						if(updateErr) {
							log(updateErr, 'error');
						}
					});
			} else {
				generalClient.query('INSERT INTO "globalRanks"(points,planets,ally,game_id,server_name,name) VALUES($1,$2,$3,$4,$5,$6)',
					[points, pcount, ally, game_id, globalCfg.serverGlobalName, name], (insertErr) => {
						if(insertErr) {
							log(insertErr, 'error');
						}
					});
			}
		});
	},
};
