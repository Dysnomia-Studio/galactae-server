function rollback() {
	serverClient.query('ROLLBACK', (err) => {
		if(err) {
			log(err, 'error');
			return;
		}
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
	find: async(tid, callback) => {
		if(tid === '' || !tid) {
			return;
		}

		try {
			const tactic = (await serverClient.query('SELECT * FROM tactics WHERE id=$1', [tid])).rows[0];

			tactic.orders = await db.tacticsOrders.findByTactic(tactic.id);

			return tactic;
		} catch(err) {
			log(err, 'error');
		}
	},
	findByOwner: async(owner) => {
		try {
			const tacticList = (await serverClient.query('SELECT * FROM tactics WHERE owner=$1', [owner])).rows;
			for(const tactic of tacticList) {
				tactic.orders = await db.tacticsOrders.findByTactic(tactic.id);
			}

			return tacticList;
		} catch(err) {
			log(err, 'error');
		}
	},
	findByOwnerAndName: (tactic, callback) => {
		serverClient.query('SELECT * FROM tactics WHERE owner=$1 AND name=$2', [tactic.owner, tactic.name], async(err, tacticListQuery) => {
			if(err) {
				log(err, 'error');
				return;
			}

			if(tacticListQuery.rows.length === 0) {
				callback();
				return;
			}

			const tactic = tacticListQuery.rows[0];
			tactic.orders = await db.tacticsOrders.findByTactic(tactic.id);

			callback(tactic);
		});
	},
	upsert: (inputTactic, callback) => {
		inputTactic.id = (inputTactic.id) ? inputTactic.id : '';

		function innerCallback() {
			serverClient.query('COMMIT', (err) => {
				callback();
			});
		}

		serverClient.query('BEGIN', async(err) => {
			if(err) {
				rollback();
			}

			const tactic = await db.tactics.find(inputTactic.id);
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

	},
	insert: (tactic, callback) => {
		serverClient.query('INSERT INTO tactics (name, owner) VALUES ($1, $2)', [tactic.name, tactic.owner], (err) => {
			if(err) {
				log(err, 'error');
				return;
			}

			callback();
		});
	},
	updateName: (tactic, callback) => {
		serverClient.query('UPDATE tactics SET name=$1 WHERE id=$2', [tactic.name, tactic.id], (err) => {
			if(err) {
				log(err, 'error');
				return;
			}

			callback();
		});
	},
	delete: (tid, callback) => {
		db.tacticsOrders.delete(tid, () => {
			serverClient.query('DELETE FROM tactics WHERE id=$1', [tid], (err) => {
				if(err) {
					log(err, 'error');
					return;
				}

				callback();
			});
		});
	},
};
