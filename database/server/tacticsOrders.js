module.exports = {
	findByTactic: async(id) => {
		try {
			return (await serverClient.query('SELECT * FROM tactics_orders WHERE tactic_id=$1', [id])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	upsertAll: async(orders, tid) => {
		await db.tacticsOrders.delete(tid);

		for(const order of orders) {
			order.tactic_id = tid;

			await db.tacticsOrders.insert(order);
		}
	},
	insert: async(order) => {
		try {
			await serverClient.query('INSERT INTO tactics_orders (tactic_id, unit, target, priority) VALUES ($1, $2, $3, $4)', [order.tactic_id, order.unit, order.target, order.priority]);
		} catch(err) {
			log(err, 'error');
			throw err;
		}
	},
	delete: async(tid) => {
		try {
			await serverClient.query('DELETE FROM tactics_orders WHERE tactic_id=$1', [tid]);
		} catch(err) {
			log(err, 'error');
			throw err;
		}
	},
};
