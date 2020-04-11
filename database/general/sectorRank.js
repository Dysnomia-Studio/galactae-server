module.exports = {
	update: async(game_id, sector, points, pcount, name, ally) => {
		try {
			const obj = await generalClient.query(
				'SELECT * FROM "sectorRanks" WHERE game_id=$1 AND server_name=$2 AND sector=$3',
				[game_id,globalCfg.serverGlobalName,sector]
			);

			if(obj.rows.length > 0) {
				await generalClient.query(
					'UPDATE "sectorRanks" SET points=$1, planets=$2, ally=$3 WHERE game_id=$4 AND server_name=$5 AND sector=$6',
					[points, pcount, ally, game_id, globalCfg.serverGlobalName, sector]
				);
			} else {
				await generalClient.query(
					'INSERT INTO "sectorRanks"(points,planets,ally,game_id,server_name,name,sector) VALUES($1,$2,$3,$4,$5,$6,$7)',
					[points, pcount, ally, game_id, globalCfg.serverGlobalName, name, sector]
				);
			}
		} catch(err) {
			log(err, 'error');
		}
	},
};
