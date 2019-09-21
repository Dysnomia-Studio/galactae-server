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
};