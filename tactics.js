module.exports = class Tactics {
	static refresh(uid, sid) {
		db.tactics.findByOwner(uid, (obj) => {
			io.to(sid).emit('tactics-recieve-data', obj);
		});
	}

	static checkOwner(uid, tacticId, callback) {
		if(tacticId === '-1') {
			callback();
			return;
		}

		db.tactics.find(tacticId, (obj) => {
			if(obj.owner === uid) {
				callback();
			}
		});
	}

	static checkTactic(tactic, sid) {
		// Check variables types:
		// Keep only "name": string, "id": string or null or undefined, owner: string or null or undefined, orders: array
		for(const key of tactic) {
			switch(key) {
				case 'name':
					if(!isset(tactic[key],'string')) { return false; }
					break;
				case 'id':
				case 'owner':
					if(isset(tactic[key]) && typeof tactic[key] !== 'string') { return false; }
					break;
				case 'orders':
					if(!isset(tactic[key], 'array')) { return false; }
					break;
				default:
					return false;
			}
		}

		// Check max orders
		if(tactic.orders.length > TACTIC_MAX_ORDERS) {
			Websocket.SendMessageToClient({ sid: sid, message: 'TACTIC_TOO_MUCH_ORDERS' });
			return false;
		}
		if(tactic.orders === 0) {
			Websocket.SendMessageToClient({ sid: sid, message: 'TACTIC_NO_ORDERS' });
			return false;
		}

		// Check orders content
		for(const key in tactic.orders) {
			const order = tactic.orders[key];

			if((!!order.tactic_id && !isset(order.tactic, 'string')) ||
				!isset(order.unit, 'string') ||
				!isset(order.target, 'string') ||
				!isset(order.priority, 'number')) { return false; }
		}

		return true;
	}

	static create(uid, sid, tactic) {
		if(!Tactics.checkTactic(tactic, sid)) { return; }

		db.tactics.upsert(tactic, () => {
			Tactics.refresh(uid, sid);
		});
	}

	static update(uid, sid, tactic) {
		if(!Tactics.checkTactic(tactic)) { return; }

		Tactics.checkOwner(uid, tactic.id, () => {
			db.tactics.upsert(tactic, () => {
				Tactics.refresh(uid, sid);
			});
		});
	}

	static delete(uid, sid, tacticId) {
		Tactics.checkOwner(uid, tactic.id, () => {
			db.tactics.delete(tacticId, () => {
				Tactics.refresh(uid, sid);
			});
		});
	}

	static assign(uid, sid, fleetId, tacticId) {
		Tactics.checkOwner(uid, tacticId, () => {
			Fleets.checkOwner(uid, fleetId, () => {
				db.fleets.assignFleet(fleetId, tacticId, () => {
					Fleets.refresh();
				});
			});
		});
	}
};