const { Pool } = require('pg');
let generalPool,
	generalClient;
global.serverPool;
global.serverClient;

module.exports = {
	/**
	 * Used to connect to database
	 */
	connect: (callback) => {
		generalPool = new Pool({
			user: '***REMOVED***',
			host: '***REMOVED***',
			database: 'galactae',
			password: '***REMOVED***',
			port: 5432,
		});

		serverPool = new Pool(globalCfg.db);

		/**
		 * Events
		 */
		serverPool.connect((err, client, done) => {
			if (err) {
				log(err.message,'warn');
				callback(false);
				return;
			}

			serverClient = client;

			log('Successfuly connected to server database.');
			callback(true);
		});

		generalPool.connect((err, client, done) => {
			if (err) {
				log(err.message,'warn');
				callback(false,true);
				return;
			}

			generalClient = client;

			log('Successfuly connected to general database.');
			callback(true,true);
		});
	},

	closeConnections: (callback) => {
		generalPool.end();
		serverPool.end();

		callback();
	},

	buildUpdateQuery: (table, fields) => {
		let query = 'UPDATE "' + table + '" SET';
		const values = [];

		for(const key in fields) {
			values.push(fields[key]);
			query += ' "' + key + '" = $' + values.length + ',';
		}

		query = query.substr(0, query.length-1);

		return [query, values];
	},

	buildInsertQuery: (table, fields) => {
		let query = 'INSERT INTO "' + table + '"(';
		let columns = '';
		let valueStr = '';
		const values = [];

		for(const key in fields) {
			values.push(fields[key]);

			columns += '"' + key + '",';
			valueStr += '$' + values.length + ',';
		}

		columns = columns.substr(0, columns.length - 1);
		valueStr = valueStr.substr(0, valueStr.length - 1);

		query += columns + ') VALUES (' + valueStr + ')';

		return [query, values];
	},

	/**
	 * Game Server queries
	 */
	fleet: require('./database/fleet'),
	player: require('./database/player'),
	planet: require('./database/planet'),
	unit: require('./database/unit'),
	tactics: require('./database/tactics'),
	tacticsOrders: require('./database/tacticsOrders'),

	stat: {
		submit: (currTime) => {
			serverClient.query('INSERT INTO stats (time, "plCount") VALUES ($1, $2)', [currTime, playerList.size], (err) => {
				if(err) { log(err, 'error'); return; }
			});
		},
	},

	/**
	 * General Server queries
	 */
	privilege: {
		find: (id,callback) => {
			generalClient.query('SELECT * FROM privileges WHERE user_id=$1 AND server_name=$2', [id, globalCfg.serverGlobalName], (err, obj) => {
				if(err) { log(err, 'error'); return; }
				// DO NOT CHECK IF WE HAVE OBJECT, NOT EVERYONE IS REGISTERED IN THIS DATABASE
				callback(obj.rows);
			});
		},
	},

	userGameId: {
		find: (id,callback) => {
			generalClient.query('SELECT * FROM "userGameIds" WHERE game_id = $1', [id], (err, obj) => {
				if(err) { log(err, 'error'); return; }
				if(isset(obj, 'object') && isset(obj.rows, 'array') && isset(obj.rows[0], 'object')) {
					callback(obj.rows[0]);
				}
			});
		},
	},

	server: {
		find: (callback) => {
			generalClient.query('SELECT * FROM servers WHERE server_name = $1', [globalCfg.serverGlobalName], (err, obj) => {
				if(err) { log(err, 'error'); return; }
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
				if(err) { log(err, 'error'); return; }
				if(callback) {
					callback();
				}
			});
		},
	},

	ban: {
		find: (uid,type,callback) => {
			generalClient.query('SELECT * FROM bans WHERE user_id=$1 AND server_name=$2 AND ban_type=$3', [uid, globalCfg.serverGlobalName, type], (err, obj) => {
				if(err) { log(err, 'error'); return; }
				callback(obj.rows);
			});
		},
		create: (bans) => {
			const [query, values] = db.buildInsertQuery('bans', bans);

			generalClient.query(query, values, (err) => {
				if(err) { log(err, 'error'); return; }
				if(callback) {
					callback(bans);
				}
			});
		},
	},
	globalRank: {
		update: (game_id, points, pcount, name) => {
			generalClient.query('SELECT * FROM "globalRanks" WHERE game_id=$1 AND server_name=$2', [game_id,globalCfg.serverGlobalName], (err, obj) => {
				if(err) { log(err, 'error'); return; }

				if(obj.rows.length > 0) {
					generalClient.query('UPDATE "globalRanks" SET points=$1, planets=$2 WHERE game_id=$3 AND server_name=$4',
						[points,pcount,game_id,globalCfg.serverGlobalName], (err) => {
							if(err) { log(err, 'error'); return; }
						});
				} else {
					generalClient.query('INSERT INTO "globalRanks"(points,planets,game_id,server_name,name) VALUES($1,$2,$3,$4,$5)',
						[points,pcount,game_id,globalCfg.serverGlobalName,name], (err) => {
							if(err) { log(err, 'error'); return; }
						});
				}
			});
		},
	},

	sectorRank: {
		update: (game_id, sector, points, pcount, name) => {
			generalClient.query('SELECT * FROM "sectorRanks" WHERE game_id=$1 AND server_name=$2 AND sector=$3',
				[game_id,globalCfg.serverGlobalName,sector], (err, obj) => {
					if(err) { log(err, 'error'); return; }

					if(obj.rows.length > 0) {
						generalClient.query('UPDATE "sectorRanks" SET points=$1, planets=$2 WHERE game_id=$3 AND server_name=$4 AND sector=$5',
							[points,pcount,game_id,globalCfg.serverGlobalName,sector], (err) => {
								if(err) { log(err, 'error'); return; }
							});
					} else {
						generalClient.query('INSERT INTO "sectorRanks"(points,planets,game_id,server_name,name,sector) VALUES($1,$2,$3,$4,$5,$6)',
							[points,pcount,game_id,globalCfg.serverGlobalName,name,sector], (err) => {
								if(err) { log(err, 'error'); return; }
							});
					}
				});
		},
	},

	battleLog: {
		save: async (battleLog) => {
			try {
				await serverClient.query('BEGIN');

				let battleLogId = await serverClient.query('INSERT INTO "battleLog" ' +
					'(atk_user_id, atk_user_name, def_user_id, def_user_name, atk_fleet_id, atk_fleet_name, date, location, "defWins") ' +
					'VALUES($1,$2,$3,$4,$5,$6,$7,$8, $9) ' +
					'RETURNING "battleLog_id"',
				[battleLog.atk_user_id, battleLog.atk_user_name, battleLog.def_user_id, battleLog.def_user_name, battleLog.atk_fleet_id, battleLog.atk_fleet_name, battleLog.date, battleLog.location, battleLog.defWins]
				);
				battleLogId = battleLogId.rows[0].battleLog_id;

				let battleLogActions = 'INSERT INTO "battleLogActions" ' +
					'("battleLog_id", "battleLog_ActionId", "fleetSource", "fleetDestination", "unitSource", "unitDestination", "playerSource", "playerDestination", damage, details) ' +
					'VALUES';

				let battleLogActionsParameters = [];
				let battleLogActionsId = 0;

				for(const currLogId in battleLog.logs) {
					const currLog = battleLog.logs[currLogId];

					battleLogActions += '($' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + '),';

					battleLogActionsParameters = battleLogActionsParameters.concat([
						battleLogId,
						currLogId,
						currLog.fleetSource,
						currLog.fleetDestination,
						currLog.unitSource,
						currLog.unitDestination,
						currLog.playerSource,
						currLog.playerDestination,
						currLog.damage,
						currLog.details
					]);
				}

				battleLogActions = battleLogActions.substring(0, battleLogActions.length - 1);

				await serverClient.query(battleLogActions, battleLogActionsParameters);

				await serverClient.query('COMMIT');
			} catch(err) {
				log(err, 'error');
				await serverClient.query('ROLLBACK');
			}
		},
	},
};