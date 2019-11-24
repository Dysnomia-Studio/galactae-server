module.exports = {
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
	findAll: async() => {
		try {
			return (await serverClient.query('SELECT * FROM units')).rows;
		} catch(err) {
			log(err, 'error');
		}
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
	bulkUpdate: async(units) => {
		let query = 'UPDATE units SET ' +
			'owned = newUnits.owned ' +
			'FROM (VALUES ';

		let i = 0;
		const queryParameters = [];
		for(const unitId in units) {
			const unit = units[unitId];

			query += '($' + (++i) + '::integer, $' + (++i) + '::uuid), ';

			queryParameters.push(Math.ceil(unit.owned));
			queryParameters.push(unit.id);
		}
		query = query.substring(0, query.length - 2);

		query += ' ) as newUnits(owned, id) ';
		query += 'WHERE units.id = newUnits.id';

		try {
			await serverClient.query(query, queryParameters);
		} catch(err) {
			log(err, 'error');
		}
	},
	delete: (id,callback) => {
		serverClient.query('DELETE FROM units WHERE id=$1',[id], (err) => {
			if(err) { log(err, 'error'); return; }
			if(callback) {
				callback();
			}
		});
	},
};