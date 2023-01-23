module.exports = {
	create: async(unit) => {
		const [query, values] = db.buildInsertQuery('units', unit);

		try {
			await serverClient.query(query, values);

			return true;
		} catch(err) {
			log(err, 'error');

			return false;
		}
	},
	findById: async(id) => {
		try {
			return (await serverClient.query('SELECT * FROM units WHERE id=$1',[id])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	findByOwner: async(id) => {
		try {
			return (await serverClient.query('SELECT * FROM units WHERE "ownerId"=$1',[id])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	findAll: async() => {
		try {
			return (await serverClient.query('SELECT * FROM units')).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	update: async(inputUser) => {
		const unit = Object.assign({}, inputUser);
		const id = unit.id;
		delete unit.id;

		let [query, values] = db.buildUpdateQuery('units', unit);
		values.push(id);
		query += ' WHERE id = $' + values.length;

		try {
			await serverClient.query(query, values);

			return true;
		} catch(err) {
			log(err, 'error');

			return false;
		}
	},
	bulkUpdate: async(units) => {
		let query = 'UPDATE units SET ' +
			'owned = newUnits.owned ' +
			'FROM (VALUES ';

		let i = 0;
		const queryParameters = [];
		for(const unitId in units) {
			if (!units.hasOwnProperty(unitId)) {
				continue;
			}
			
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
	delete: async(id) => {
		try {
			await serverClient.query('DELETE FROM units WHERE id=$1',[id]);

			return true;
		} catch(err) {
			log(err, 'error');

			return false;
		}
	},
};
