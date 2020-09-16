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
	find: async(tid) => {
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
	findByOwnerAndName: async(tactic) => {
		try {
			const tacticListQuery = (await serverClient.query('SELECT * FROM tactics WHERE owner=$1 AND name=$2', [tactic.owner, tactic.name])).rows;

			if(tacticListQuery.rows.length === 0) {
				return;
			}

			const foundTactic = tacticListQuery.rows[0];
			foundTactic.orders = await db.tacticsOrders.findByTactic(foundTactic.id);

			return foundTactic;
		} catch(err) {
			log(err, 'error');
		}
	},
	upsert: async(inputTactic) => {
		inputTactic.id = (inputTactic.id) ? inputTactic.id : '';

		try {
			await serverClient.query('BEGIN');

			const tactic = await db.tactics.find(inputTactic.id);
			if(!isset(tactic)) {
				await db.tactics.insert(inputTactic);

				const newTactic = await db.tactics.findByOwnerAndName(inputTactic);

				await db.tacticsOrders.upsertAll(inputTactic.orders, newTactic.id);
			} else if(tactic.name !== inputTactic.name) {
				await db.tactics.updateName(inputTactic);

				await db.tacticsOrders.upsertAll(inputTactic.orders, tactic.id);
			} else {
				await db.tacticsOrders.upsertAll(inputTactic.orders, tactic.id);
			}

			await serverClient.query('COMMIT');
		} catch(err) {
			log(err, 'error');
			await serverClient.query('ROLLBACK');
		}
	},
	insert: async(tactic) => {
		try {
			await serverClient.query('INSERT INTO tactics (name, owner) VALUES ($1, $2)', [tactic.name, tactic.owner]);
		} catch(err) {
			log(err, 'error');
		}
	},
	updateName: async(tactic) => {
		try {
			await serverClient.query('UPDATE tactics SET name=$1 WHERE id=$2', [tactic.name, tactic.id]);
		} catch(err) {
			log(err, 'error');
		}
	},
	delete: async(tid) => {
		try {
			await serverClient.query('BEGIN');

			await db.tacticsOrders.delete(tid);

			await serverClient.query('DELETE FROM tactics WHERE id=$1');

			await serverClient.query('COMMIT');
		} catch(err) {
			log(err, 'error');
			await serverClient.query('ROLLBACK');
		}
	},
};
