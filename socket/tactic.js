module.exports = function(socket) {
	socket.on('tactics-upsert', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id) || !isset(data.username) || !isset(data.tactic, 'object')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			if(isset(data.tactic.id)) {
				Tactics.update(data, data.tactic);
			} else {
				Tactics.create(data, data.tactic);
			}
		});
	});
	socket.on('tactics-delete', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id) || !isset(data.username) || !isset(data.tacticId)) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Tactics.delete(data, data.tacticId);
		});
	});
	socket.on('fleet-tactics-assign', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id) || !isset(data.username) || !isset(data.pid, 'string') || !isset(data.fleetId) || !isset(data.tacticId)) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Tactics.assign(data, data.fleetId, data.tacticId);
		});
	});
};
