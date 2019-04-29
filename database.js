const { Pool } = require('pg');
let generalPool,
	generalClient,
	serverPool,
	serverClient;

function rollback() {
	serverClient.query('ROLLBACK', (err) => {
		if(err) { log(err, 'error'); return; }
	});
}

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
	 * PLAYERS
	 */
	player: {
		findAll: (callback) => {
			serverClient.query('SELECT * FROM users', [], (err, objReturned) => {
				if(err) { log(err, 'error'); return; }
				callback(objReturned.rows);
			});
		},
		searchByName: (name,callback) => {
			serverClient.query('SELECT * FROM users WHERE name = $1 LIMIT 1', [name], (err, objReturned) => {
				if(err) { log(err, 'error'); return; }
				callback(objReturned.rows[0]);
			});
		},
		searchById: (id,callback) => {
			serverClient.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id], (err, objReturned) => {
				if(err) { log(err, 'error'); return; }
				callback(objReturned.rows[0]);
			});
		},
		searchBySid: (sid,callback) => {
			serverClient.query('SELECT * FROM users WHERE sid = $1 LIMIT 1', [sid], (err, objReturned) => {
				if(err) { log(err, 'error'); return; }
				callback(objReturned.rows[0]);
			});
		},
		update: (inputUser, callback) => {
			const user = Object.assign({}, inputUser);
			const id = user.id;
			delete user.id;

			delete user.sectorPointsAddresses;
			delete user.sectorPointsValue;
			delete user.sectorPointsPcount;

			let [query, values] = db.buildUpdateQuery('users', user);
			values.push(id);
			query += ' WHERE id = $' + values.length;

			serverClient.query(query, values, (err) => {
				if(err) { log(err, 'error'); return; }
				if(callback) {
					callback();
				}
			});
		},
		clearList: () => {
			log('Clearing player list ...');

			serverClient.query('UPDATE users SET sid = \'-1\'', [], (err) => {
				if(err) { log(err, 'error'); return; }
				log('List cleared !') ;
			});
		},
	},

	/**
	 * PLANET
	 */
	planet: {
		find: (addr,callback) => {
			serverClient.query('SELECT * FROM planets WHERE address = $1 LIMIT 1', [addr], (err, planetReturned) => {
				if(err) { log(err, 'error'); return; }
				if(isset(planetReturned, 'object') && isset(planetReturned.rows[0], 'object')) {
					callback(planetReturned.rows[0]);
				}
			});
		},
		update: (inputPlanet, callback) => {
			const planet = Object.assign({}, inputPlanet);
			const id = planet.id;
			delete planet.id;

			let [query, values] = db.buildUpdateQuery('planets', planet);
			values.push(id);
			query += ' WHERE id = $' + values.length;

			serverClient.query(query, values, (err) => {
				if(err) { log(err, 'error'); return; }
				if(callback) {
					callback();
				}
			});
		},
		findBySystemWithOwners: (systemAddr, callback) => {
			serverClient.query('SELECT * FROM planets WHERE address LIKE $1', [systemAddr + '%'], (err, planetList) => {
				if(err) { log(err, 'error'); return; }
				planetList = planetList.rows;

				let ended = 0;
				for(let i=0; i<planetList.length; i++) {
					const id = i;

					db.player.searchById(planetList[id].owner, (user) => {
						if(isset(user, 'object') && !user.name.includes('Colonisable')) {
							planetList[id].ownerName = user.name;
							planetList[id].ally = user.ally;
						} else {
							planetList[id].ownerName = null;
							planetList[id].ally = null;
						}

						ended++;

						if(ended === planetList.length) {
							callback(planetList);
						}
					});
				}

				if(planetList.length === 0) {
					callback(planetList);
				}
			});
		},
	},

	/**
	 * UNITS
	 */
	unit: {
		create: (unit,callback) => {
			const [query, values] = db.buildInsertQuery('units', unit);

			serverClient.query(query, values, (err) => {
				if(err) { log(err, 'error'); return; }
				if(callback) {
					callback(unit);
				}
			});
		},
		find: (id,callback) => {
			serverClient.query('SELECT * FROM units WHERE id=$1',[id], (err, obj) => {
				if(err) { log(err, 'error'); return; }
				if(callback) {
					callback(obj.rows[0]);
				}
			});
		},
		findByOwner: (id,callback) => {
			serverClient.query('SELECT * FROM units WHERE "ownerId"=$1',[id], (err, obj) => {
				if(err) { log(err, 'error'); return; }
				callback(obj.rows);
			});
		},
		findAll: (callback) => {
			serverClient.query('SELECT * FROM units', [], (err, obj) => {
				if(err) { log(err, 'error'); return; }
				callback(obj.rows);
			});
		},
		update: (inputUser, callback) => {
			const unit = Object.assign({}, inputUser);
			const id = unit.id;
			delete unit.id;

			let [query, values] = db.buildUpdateQuery('units', unit);
			values.push(id);
			query += ' WHERE id = $' + values.length;

			serverClient.query(query, values, (err) => {
				if(err) { log(err, 'error'); return; }
				if(callback) {
					callback();
				}
			});
		},
		delete: (id,callback) => {
			serverClient.query('DELETE FROM units WHERE id=$1',[id], (err) => {
				if(err) { log(err, 'error'); return; }
				if(callback) {
					callback();
				}
			});
		},
	},

	/**
	 * FLEETS
	 */
	fleet: {
		find: (id,callback) => {
			serverClient.query('SELECT * FROM fleets WHERE id=$1',[id], (err, obj) => {
				if(err) { log(err, 'error'); return; }
				if(callback) {
					const fleet = obj.rows[0];

					if(isset(fleet, 'object')) {
						fleet.fuel = parseInt(fleet.fuel);
						fleet.maxFuel = parseInt(fleet.maxFuel);

						if(Number.isNaN(fleet.fuel) || Number.isNaN(fleet.maxFuel)) {
							log('Can\'t parse fuel/maxFuel for fleet ' + fleet.name + '!', 'warn');
							return;
						}
					}

					callback(fleet);
				}
			});
		},
		findAll: (callback) => {
			serverClient.query('SELECT * FROM fleets', [], (err, obj) => {
				if(err) { log(err, 'error'); return; }
				callback(obj.rows);
			});
		},
		findByOwner: (id,callback) => {
			serverClient.query('SELECT * FROM fleets WHERE "ownerId"=$1', [id], (err, obj) => {
				if(err) { log(err, 'error'); return; }
				callback(obj.rows);
			});
		},
		findByMotherPlanet: (planetId,callback) => {
			serverClient.query('SELECT * FROM fleets WHERE "motherPlanetId"=$1', [planetId], (err, obj) => {
				if(err) { log(err, 'error'); return; }
				callback(obj.rows);
			});
		},
		findByPosition: (planetId,callback) => {
			serverClient.query('SELECT * FROM fleets WHERE position=$1', [planetId], (err, obj) => {
				if(err) { log(err, 'error'); return; }
				callback(obj.rows);
			});
		},
		update: (inputFleet,callback) => {
			const fleet = Object.assign({}, inputFleet);
			const id = fleet.id;
			delete fleet.id;

			let [query, values] = db.buildUpdateQuery('fleets', fleet);
			values.push(id);
			query += ' WHERE id = $' + values.length;

			serverClient.query(query, values, (err) => {
				if(err) { log(err, 'error'); return; }
				if(callback) {
					callback();
				}
			});
		},
		create: (fleet,callback) => {
			const [query, values] = db.buildInsertQuery('fleets', fleet);

			serverClient.query(query, values, (err) => {
				if(err) { log(err, 'error'); return; }
				if(callback) {
					callback(fleet);
				}
			});
		},
		remove: (id) => {
			serverClient.query('DELETE FROM fleets WHERE id=$1', [id], (err) => {
				if(err) { log(err, 'error'); return; }
			});
		},
		assignFleet: (fid, tid, callback) => {
			serverClient.query('UPDATE fleets SET tactic=$1 WHERE id=$2', [tid, fid], (err) => {
				if(err) { log(err, 'error'); return; }
				callback();
			});
		}
	},

	tactics: {
		find: (tid, callback) => {
			serverClient.query('SELECT * FROM tactics WHERE id=$1', [tid], (err, tacticListQuery) => {
				if(err) { log(err, 'error'); return; }

				if(tacticListQuery.rows.length === 0) {
					callback();
					return;
				}

				const tactic = tacticListQuery.rows[0];
				db.tacticsOrders.findByTactic(tactic.id, (orders) => {
					tactic.orders = orders;

					callback(tactic);
				});
			});
		},
		findByOwner: (owner, callback) => {
			serverClient.query('SELECT * FROM tactics WHERE owner=$1', [owner], (err, tacticListQuery) => {
				if(err) { log(err, 'error'); return; }

				const tacticList = tacticListQuery.rows;
				let todo = 0;
				let done = 0;
				for(const tactic of tacticList) {
					todo++;

					db.tacticsOrders.findByTactic(tactic.id, (orders) => {
						done++;
						tactic.orders = orders;

						if(todo === done) {
							callback(tacticList);
						}
					});
				}

				if(tacticList.length === 0) {
					callback([]);
				}
			});
		},
		upsert: (inputTactic, callback) => {
			inputTactic.id = (inputTactic.id) ? inputTactic.id : '';

			function innerCallback() {
				serverClient.query('COMMIT', (err) => {
					callback();
				});
			}

			serverClient.query('BEGIN', (err) => {
				if(err) { rollback(); }

				db.tactics.find(inputTactic.id, (tactic) => {
					if(!isset(tactic)) {
						db.tactics.insert(tactic, () => {
							db.tactics.findByOwnerAndName(tactic, (newTactic) => {
								db.tacticsOrders.upsertAll(tactic.orders, newTactic.id, innerCallback);
							});
						});
					} else if(tactic.name !== inputTactic.name) {
						db.tactics.updateName(tactic, () => db.tacticsOrders.upsertAll(tactic.orders, tactic.id, () => {
							db.tacticsOrders.upsertAll(tactic.orders, tactic.id, innerCallback);
						}));
					} else {
						db.tacticsOrders.upsertAll(tactic.orders, tactic.id, innerCallback);
					}
				});
			});

		},
		insert: (tactic, callback) => {
			serverClient.query('INSERT INTO tactics (name, owner) VALUES ($1, $2)', [tactic.name, tactic.owner], (err) => {
				if(err) { log(err, 'error'); return; }

				callback();
			});
		},
		updateName: (tactic, callback) => {
			serverClient.query('UPDATE tactics SET name=$1 WHERE id=$2', [tactic.name, tactic.id], (err) => {
				if(err) { log(err, 'error'); return; }

				callback();
			});
		},
		delete: (tid, callback) => {
			serverClient.query('DELETE FROM tactics WHERE id=$1', [tid], (err) => {
				if(err) { log(err, 'error'); return; }

				callback();
			});
		}
	},

	tacticsOrders: {
		find: (tid, unit, target, callback) => {
			serverClient.query('SELECT * FROM tactics_orders WHERE tactic_id=$1 AND unit=$2 AND target=$3', [tid, unit, target], (err, tacticOrdersQuery) => {
				if(err) { log(err, 'error'); return; }

				callback(tacticOrdersQuery.rows);
			});
		},
		findByTactic: (id, callback) => {
			serverClient.query('SELECT * FROM tactics_orders WHERE tactic_id=$1', [id], (err, tacticOrdersQuery) => {
				if(err) { log(err, 'error'); return; }

				callback(tacticOrdersQuery.rows);
			});
		},
		upsertAll: (orders, tid) => {
			db.tacticsOrders.delete(tid, () => {
				let done = 0;

				for(const order of orders) {
					order.tactic_id = tid;

					db.tacticsOrders.insert(order, () => {
						done++;
						if(orders.length === done) {
							callback();
						}
					});
				}
			});
		},
		insert: (order, callback) => {
			serverClient.query('INSERT INTO tactics_orders (tactic_id, unit, target, priority) VALUES ($1, $2)', [order.tactic_id, order.unit, order.target, order.priority], (err) => {
				if(err) { log(err, 'error'); rollback(); return; }

				callback();
			});
		},
		delete: (tid, callback) => {
			serverClient.query('DELETE FROM tactics_orders WHERE tactic_id=$1', [tid], (err) => {
				if(err) { log(err, 'error'); rollback(); return; }

				callback();
			});
		}
	},

	stat: {
		submit: (currTime) => {
			serverClient.query('INSERT INTO stats (time, "plCount") VALUES ($1, $2)', [currTime, plCount], (err) => {
				if(err) { log(err, 'error'); return; }
			});
		},
	},

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
};