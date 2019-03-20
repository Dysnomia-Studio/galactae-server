const { Pool } = require('pg');
let generalPool,
	generalClient,
	serverPool,
	serverClient;

module.exports = {
	/**
	 * Used to connect to database
	 */
	connect: function(callback) {
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

	closeConnections: function(callback) {
		generalPool.end();
		serverPool.end();

		callback();
	},

	buildUpdateQuery: function(table, fields) {
		let query = 'UPDATE ' + table + ' SET';
		const values = [];

		for(const key in fields) {
			values.push(fields[key]);
			query += ' ' + key + ' = $' + values.length + ',';
		}

		query = query.substr(query.length-1);

		return [query, values];
	},

	/**
	 * PLAYERS
	 */
	player: {
		findAll: function(callback) {
			serverClient.query('SELECT * FROM users', [], (err, objReturned) => {
				if(err) { log(err); }
				callback(objReturned);
			});
		},
		searchByName: function(name,callback) {
			serverClient.query('SELECT * FROM users WHERE name = $1 LIMIT 1', [name.toLowerCase()], (err, objReturned) => {
				if(err) { log(err); }
				callback(objReturned);
			});
		},
		searchById: function(id,callback) {
			serverClient.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id], (err, objReturned) => {
				if(err) { log(err); }
				callback(objReturned);
			});
		},
		searchBySid: function(sid,callback) {
			serverClient.query('SELECT * FROM users WHERE sid = $1 LIMIT 1', [sid], (err, objReturned) => {
				if(err) { log(err); }
				callback(objReturned);
			});
		},
		update: function(user, callback) {
			const id = user.id;
			delete user.id;

			let [query, values] = this.buildUpdateQuery('users', user);
			values.push(id);
			query += ' WHERE id = $' + values.length;

			serverClient.query(query, values, (err) => {
				if(err) { log(err); }
				if(callback) {
					callback();
				}
			});
		},
		clearList: function() {
			log('Clearing player list ...');

			serverClient.query('UPDATE users SET sid = \'-1\'', [sid], (err) => {
				if(err) { log(err); }
				log('List cleared !') ;
			});
		},
	},

	/**
	 * PLANET
	 */
	planet: {
		find: function(addr,callback) {
			planets.findOne({address: addr}, function (err, planetReturned) {
				if(err) { log(err); }
				if(isset(planetReturned)) {
					callback(planetReturned);
				}
			});
		},
		update: function(data, callback) {
			const conditions = { _id: data._id },
				update = { $set: data },
				options = { multi: true };

			planets.update(conditions, update, options,function(error) {
				if(error) { log(error); }
				if(callback) { callback(); }
			});
		},
		findBySystemWithOwners: function(systemAddr, callback) {
			planets.find({ 'address': new RegExp('^' + systemAddr + '-', 'i') }, function(err, planetList) {
				if(err) { log(err); return; }

				const pList = [];

				let ended = 0;
				for(let i=0; i<planetList.length; i++) {
					const id = i;

					pList[id] = planetList[id].toJSON();

					db.player.searchById(planetList[id].owner, function(user) {
						if(isset(user)) {
							pList[id].ownerName = user.name;
							pList[id].ally = user.ally;
						} else {
							pList[id].ownerName = null;
							pList[id].ally = null;
						}

						ended++;

						if(ended === planetList.length) {
							callback(pList);
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
		create: function(data,callback) {
			data._id = new mongoose.Types.ObjectId();

			units.create(data, function(error) {
				if(error) { log(error); }
				if(callback) { callback(data); }
			});
		},
		find: function(id,callback) {
			units.findById(id, function (err, obj) {
				if(err) { log(err); }
				if(callback) {
					callback(obj);
				}
			});
		},
		findByOwner: function(id,callback) {
			units.find({ownerId: id}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		findAll: function(callback) {
			units.find({ }, function (err, objReturned) {
				if(err) { log(err); }
				callback(objReturned);
			});
		},
		update: function(data, callback) {
			const conditions = { _id: data._id },
				update = { $set: data },
				options = { multi: true };

			units.update(conditions, update, options,function(err) {
				if(err) { log(err); }
				else if(callback) {
					callback();
				}
			});
		},
		delete: function(id,callback) {
			units.findByIdAndRemove(id,function(err) {
				if(err) { log(err); }
				if(callback) { callback(); }
			});
		},
	},

	/**
	 * FLEETS
	 */
	fleet: {
		find: function(id,callback) {
			fleets.findById(id, function (err, obj) {
				if(err) { log(err); }
				if(isset(obj)) {
					callback(obj);
				}
			});
		},
		findAll: function(callback) {
			fleets.find({ }, function (err, objReturned) {
				if(err) { log(err); }
				callback(objReturned);
			});
		},
		findByOwner: function(id,callback) {
			fleets.find({ownerId: id}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		findByMotherPlanet: function(planetId,callback) {
			fleets.find({motherPlanetId: planetId}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		findByPosition: function(planetId,callback) {
			fleets.find({position: planetId}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		update: function(data,callback) {
			const conditions = { _id: data._id },
				update = { $set: data },
				options = { multi: true };

			fleets.update(conditions, update, options,function(error) {
				if(error) { log(error); }

				if(callback) {
					callback();
				}
			});
		},
		create: function(data,callback) {
			data._id = new mongoose.Types.ObjectId();

			fleets.create(data, function(error) {
				if(error) { log(error); }
				if(callback) { callback(data); }
			});
		},
		remove: function(doc, callback) {
			doc.remove(function(err, data) {
				if(err) { log(err); }
				if(callback) { callback(data); }
			});
		}
	},

	stat: {
		submit: function(currTime) {
			const data = {};
			data._id = new mongoose.Types.ObjectId();
			data.plCount = plCount;
			data.time = currTime;

			stats.create(data, function(error) {
				if(error) { log(error); }
			});
		},
	},

	privilege: {
		find: function(id,callback) {
			if(typeof id === 'string') {
				id = mongoose.Types.ObjectId(id);
			}

			privileges.find({user_id: id, server_name: globalCfg.serverGlobalName}, function (err, obj) {
				if(err) { log(err); }
				// DO NOT CHECK IF WE HAVE OBJECT, NOT EVERYONE IS REGISTERED IN THIS DATABASE
				callback(obj);
			});
		},
	},

	userGameId: {
		find: function(id,callback) {
			generalClient.query('SELECT * FROM "userGameIds" WHERE game_id = $1', [id], (err, obj) => {
				if(err) { log(err); }
				if(isset(obj)) {
					callback(obj);
				}
			});
		},
	},

	server: {
		find: function(callback) {
			generalClient.query('SELECT * FROM servers WHERE server_name = $1', [globalCfg.serverGlobalName], (err, obj) => {
				if(err) { log(err); }
				if(isset(obj)) {
					callback(obj.rows[0]);
				}
			});
		},
		update: function(serverData, callback) {
			const server_name = serverData.server_name;
			delete serverData.server_name;

			let [query, values] = this.buildUpdateQuery('servers', serverData);
			values.push(server_name);
			query += ' WHERE server_name = $' + values.length;

			serverClient.query(query, values, (err) => {
				if(err) { log(err); }
				if(callback) {
					callback();
				}
			});
		},
	},

	ban: {
		find: function(uid,type,callback) {
			bans.find({
				user_id: uid,
				server_name: globalCfg.serverGlobalName,
				ban_type: type,
			}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		create: function(data) {
			data._id = new mongoose.Types.ObjectId();

			bans.create(data, function(error) {
				if(error) { log(error); }
			});
		},
	},
	globalRank: {
		update: function(data) {
			// Chercher si l'utilisateur existe
			globalRanks.find({
				server_name: globalCfg.serverGlobalName,
				user_id: data.user_id,
			}, function(error, obj) {
				if(error) { log(error); }

				if(!isset(obj) || obj.length === 0) { // Si non creer
					data._id = new mongoose.Types.ObjectId();
					data.server_name = globalCfg.serverGlobalName;

					globalRanks.create(data, function(error) {
						if(error) { log(error); }
					});
				} else { // Sinon update
					const conditions = {
							server_name: globalCfg.serverGlobalName,
							user_id: data.user_id,
						},
						update = { $set: data },
						options = { multi: false };

					globalRanks.update(conditions, update, options,function(error) {
						if(error) { log(error); }
					});
				}
			});
		},
		findByUserId: function(uid, callback) {
			globalRanks.find({
				server_name: globalCfg.serverGlobalName,
				user_id: uid,
			}, function (err, obj) {
				if(err) { log(err); }
				if(isset(obj) && isset(obj[0])) { obj = obj[0]; }
				callback(obj);
			});
		},
		findBetweenPointsAndRanks: function(points, rank, callback) {
			globalRanks.find({
				points: { $lt: points },
				rank: { $lt: rank },
				server_name: globalCfg.serverGlobalName,
			}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		incrementInRange: function(min, max) {
			const conditions = {
					server_name: globalCfg.serverGlobalName,
					rank: { $gte: min,  $lte: max },
				},
				update = { $inc: {'rank': 1 } },
				options = { multi: true };

			globalRanks.update(conditions, update, options,function(error) {
				if(error) { log(error); }
			});
		},
		count: function(callback) {
			globalRanks.count({
				server_name: globalCfg.serverGlobalName,
			} , function(err, c) {
				if(err) { log(err); }
				callback(c);
			});
		},
		reSortRanks: function(user_id, points, pcount, name) {
			db.globalRank.findByUserId(user_id, function(user) {
				db.globalRank.count(function(MaxRank) {
					MaxRank++;
					let rank = MaxRank;

					if(isset(user) && isset(user.rank)) { rank = user.rank; }

					db.globalRank.findBetweenPointsAndRanks(points, rank, function(userList) {
						let min = rank;

						if(isset(userList) && isset(userList[0])) { // Changement(s) de rang à faire ?
							min = userList[0].rank;

							for(let i=1; i<userList.length; i++) {
								if(min > userList[i].rank) {
									min = userList[i].rank;
								}
							}
						}

						if(min < rank) {
							db.globalRank.incrementInRange(min, rank-1);
						}

						db.globalRank.update({
							user_id,
							rank: min,
							points,
							planets: pcount,
							name,
						});
					});
				});
			});
		},
	},

	sectorRank: {
		update: function(data) {
			// Chercher si l'utilisateur existe
			sectorRanks.find({
				server_name: globalCfg.serverGlobalName,
				user_id: data.user_id,
				sector: data.sector,
			}, function(error, obj) {
				if(error) { log(error); }

				if(!isset(obj) || obj.length === 0) { // Si non creer
					data._id = new mongoose.Types.ObjectId();
					data.server_name = globalCfg.serverGlobalName;

					sectorRanks.create(data, function(error) {
						if(error) { log(error); }
					});
				} else { // Sinon update
					const conditions = {
							server_name: globalCfg.serverGlobalName,
							user_id: data.user_id,
							sector: data.sector,
						},
						update = { $set: data },
						options = { multi: false };

					sectorRanks.update(conditions, update, options,function(error) {
						if(error) { log(error); }
					});
				}
			});
		},
		findByUserId: function(uid, sector, callback) {
			sectorRanks.find({
				sector: sector,
				server_name: globalCfg.serverGlobalName,
				user_id: uid,
			}, function (err, obj) {
				if(err) { log(err); }
				if(isset(obj) && isset(obj[0])) { obj = obj[0]; }
				callback(obj);
			});
		},
		findBetweenPointsAndRanks: function(sector, points, rank, callback) {
			sectorRanks.find({
				sector: sector,
				points: { $lt: points },
				rank: { $lt: rank },
				server_name: globalCfg.serverGlobalName,
			}, function (err, obj) {
				if(err) { log(err); }
				callback(obj);
			});
		},
		incrementInRange: function(sector, min, max) {
			const conditions = {
					sector: sector,
					server_name: globalCfg.serverGlobalName,
					rank: { $gte: min,  $lte: max },
				},
				update = { $inc: {'rank': 1 } },
				options = { multi: true };

			sectorRanks.update(conditions, update, options,function(error) {
				if(error) { log(error); }
			});
		},
		count: function(sector, callback) {
			sectorRanks.count({
				server_name: globalCfg.serverGlobalName,
				sector: sector,
			} , function(err, c) {
				if(err) { log(err); }
				callback(c);
			});
		},
		reSortRanks: function(user_id, sector, points, pcount, name) {
			db.sectorRank.findByUserId(user_id, sector, function(user) {
				db.sectorRank.count(sector, function(MaxRank) {
					MaxRank++;

					let rank = MaxRank;

					if(isset(user) && isset(user.rank)) { rank = user.rank; }
					db.sectorRank.findBetweenPointsAndRanks(sector, points, rank, function(userList) {
						let min = rank;

						if(isset(userList) && isset(userList[0])) { // Changement(s) de rang à faire ?
							min = userList[0].rank;

							for(let i=1; i<userList.length; i++) {
								if(min > userList[i].rank) {
									min = userList[i].rank;
								}
							}
						}

						if(min < rank) {
							db.sectorRank.incrementInRange(sector, min, rank-1);
						}

						db.sectorRank.update({
							user_id,
							sector: sector,
							rank: min,
							points,
							planets: pcount,
							name,
						});
					});
				});
			});
		},
	},
};