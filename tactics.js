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

	static checkTactic(tactic, user) {
		// Check variables types:
		// Keep only "name": string, "id": string or null or undefined, owner: string or null or undefined, orders: array
		for(const key in tactic) {
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
			log(user.username + ' failed to create/update tactic because it has too much orders.');
			Websocket.SendMessageToClient({ sid: user.sid, message: 'TACTIC_TOO_MUCH_ORDERS' });
			return false;
		}
		if(tactic.orders === 0) {
			log(user.username + ' failed to create/update tactic because it has no orders.');
			Websocket.SendMessageToClient({ sid: user.sid, message: 'TACTIC_NO_ORDERS' });
			return false;
		}

		// Check orders content
		for(const order of tactic.orders) {
			if( !isset(order.unit, 'string') ||
				!isset(order.target, 'string') ||
				!isset(order.priority, 'number')) { return false; }

			if(order.unit.includes('SHIP_WEP_MINES')) { return false; }
		}

		return true;
	}

	static checkFleetUsage(tid, user, callback) {
		db.fleet.findByTactic(tid, (list) => {
			if(list.length === 0) {
				callback();
			} else {
				log(user.username + ' failed to delete tactic because it\'s used by some fleets.');
				Websocket.SendMessageToClient({ sid: user.sid, message: 'TACTIC_USED_BY_FLEETS' });
			}
		});
	}

	static create(user, tactic) {
		if(!Tactics.checkTactic(tactic, user)) { return; }

		db.tactics.upsert(tactic, () => {
			log(user.username + ' has created a new tactic named ' + tactic.name);
			Websocket.SendMessageToClient('TACTIC_CREATED');
			Tactics.refresh(user.id, user.sid);
		});
	}

	static update(user, tactic) {
		if(!Tactics.checkTactic(tactic, user)) { return; }

		Tactics.checkOwner(user.id, tactic.id, () => {
			db.tactics.upsert(tactic, () => {
				log(user.username + ' has updated his tactic named ' + tactic.name);
				Websocket.SendMessageToClient('TACTIC_UPDATED');
				Tactics.refresh(user.id, user.sid);
			});
		});
	}

	static delete(user, tacticId) {
		Tactics.checkFleetUsage(tacticId, user, () => {
			Tactics.checkOwner(user.id, tacticId, () => {
				db.tactics.delete(tacticId, () => {
					log(user.username + ' has deleted his tactic ' + tacticId);
					Websocket.SendMessageToClient('TACTIC_DELETED');
					Tactics.refresh(user.id, user.sid);
				});
			});
		});
	}

	static assign(user, fleetId, tacticId) {
		Tactics.checkOwner(user.id, tacticId, () => {
			Fleets.checkOwner(user.id, fleetId, (fleet) => {
				if(tacticId === '-1') { tacticId = null; }

				db.fleet.assignFleet(fleetId, tacticId, () => {
					log(user.username + ' has assigned his tactic ' + tacticId + ' to fleet ' + fleetId);
					Websocket.SendMessageToClient('TACTIC_ASSIGNED');
					Fleets.refresh(fleet.position, user.sid);
				});
			});
		});
	}
};