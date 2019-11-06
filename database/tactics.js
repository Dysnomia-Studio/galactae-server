function rollback() {
	serverClient.query('ROLLBACK', (err) => {
		if(err) { log(err, 'error'); return; }
	});
}

module.exports = {
	findAll: async() => {
		try {
			const tacticList = (await serverClient.query('SELECT * FROM tactics')).rows;

			for(const tactic of tacticList) {
				tactic.orders = (await serverClient.query('SELECT * FROM tactics_orders WHERE tactic_id=$1', [tactics.id])).rows;
			}

			return tacticList;
		} catch(err) {
			log(err, 'error');
		}
	},
	find: (tid, callback) => {
		if(tid === '') {
			callback();
			return;
		}

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
	findByOwnerAndName: (tactic, callback) => {
		serverClient.query('SELECT * FROM tactics WHERE owner=$1 AND name=$2', [tactic.owner, tactic.name], (err, tacticListQuery) => {
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
					db.tactics.insert(inputTactic, () => {
						db.tactics.findByOwnerAndName(inputTactic, (newTactic) => {
							db.tacticsOrders.upsertAll(inputTactic.orders, newTactic.id, innerCallback);
						});
					});
				} else if(tactic.name !== inputTactic.name) {
					db.tactics.updateName(inputTactic, () =>
						db.tacticsOrders.upsertAll(inputTactic.orders, tactic.id, innerCallback)
					);
				} else {
					db.tacticsOrders.upsertAll(inputTactic.orders, tactic.id, innerCallback);
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
		db.tacticsOrders.delete(tid, () => {
			serverClient.query('DELETE FROM tactics WHERE id=$1', [tid], (err) => {
				if(err) { log(err, 'error'); return; }

				callback();
			});
		});
	},
};