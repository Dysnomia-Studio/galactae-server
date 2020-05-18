const { Pool } = require('pg');

module.exports = {
	/**
	 * Used to connect to database
	 */
	connect: (callback) => {
		global.generalPool = new Pool(globalCfg.generalDb);
		global.serverPool = new Pool(globalCfg.serverDb);

		/**
		 * Events
		 */
		serverPool.connect((err, client, done) => {
			if (err) {
				log(err.message,'warn');
				callback(false);
				return;
			}

			if(globalCfg.dev) {
				const oldPoolQuery = client.query;
				client.query = (...args) => {
					let stack;

					try {
						throw new Error('');
					}
					catch (error) {
						stack = error.stack || '';
					}

					console.log('QUERY:', args, stack);

					return oldPoolQuery.apply(client, args);
				};
			}

			global.serverClient = client;

			log('Successfuly connected to server database.');
			callback(true);
		});

		generalPool.connect((err, client, done) => {
			if (err) {
				log(err.message,'warn');
				callback(false,true);
				return;
			}

			global.generalClient = client;

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
	alliance: require('./database/server/alliance'),
	battleLog: require('./database/server/battleLog'),
	battleLogAccess: require('./database/server/battleLogAccess'),
	conquest: require('./database/server/conquest'),
	fleet: require('./database/server/fleet'),
	player: require('./database/server/player'),
	planet: require('./database/server/planet'),
	stat: require('./database/server/stat'),
	unit: require('./database/server/unit'),
	tactics: require('./database/server/tactics'),
	tacticsOrders: require('./database/server/tacticsOrders'),

	getAttacksAgainstPlayer: async(playerId) => {
		try {
			return (await serverClient.query(
				'SELECT users.name as "player", fleets."motherPlanetAddress" as "origin", fleets.position as "destination", fleets."endMoveTime" as "endMoveTime" ' +
				'FROM fleets ' +
				'INNER JOIN planets ON planets.address = fleets.position ' +
				'INNER JOIN users ON users.id = fleets."ownerId" ' +
				'WHERE "orbitPosition" = 1 ' +
				'AND planets.owner = $1 ' +
				'AND fleets."endMoveTime" IS NOT NULL',
				[playerId]
			)).rows;
		} catch(err) {
			log(err, 'error');
		}

		return [];
	},

	/**
	 * General Server queries
	 */
	ban: require('./database/general/ban'),
	privilege: require('./database/general/privilege'),
	server: require('./database/general/server'),
	userGameId: require('./database/general/userGameId'),
};
