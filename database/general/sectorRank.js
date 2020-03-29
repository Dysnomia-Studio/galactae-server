module.exports = {
	update: async(game_id, sector, points, pcount, name, ally) => {
		generalClient.query('SELECT * FROM "sectorRanks" WHERE game_id=$1 AND server_name=$2 AND sector=$3',
			[game_id,globalCfg.serverGlobalName,sector], (err, obj) => {
				if(err) {
					log(err, 'error');
					return;
				}

				if(obj.rows.length > 0) {
					generalClient.query('UPDATE "sectorRanks" SET points=$1, planets=$2, ally=$3 WHERE game_id=$4 AND server_name=$5 AND sector=$6',
						[points, pcount, ally, game_id, globalCfg.serverGlobalName, sector], (updateErr) => {
							if(updateErr) {
								log(updateErr, 'error');
							}
						});
				} else {
					generalClient.query('INSERT INTO "sectorRanks"(points,planets,ally,game_id,server_name,name,sector) VALUES($1,$2,$3,$4,$5,$6,$7)',
						[points, pcount, ally, game_id, globalCfg.serverGlobalName, name, sector], (insertErr) => {
							if(insertErr) {
								log(insertErr, 'error');
							}
						});
				}
			});
	},
};
