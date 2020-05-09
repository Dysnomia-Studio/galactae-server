module.exports = function(socket) {
	socket.on('unit-type-create', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.ship, 'object') || !isset(data.username, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Units.createType(data);
		});
	});
	socket.on('unit-type-rename', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.shipId, 'string') || !isset(data.shipNewName, 'string') || !isset(data.username, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Units.renameType(data);
		});
	});
	socket.on('unit-type-delete', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.unit, 'string') || !isset(data.username, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Units.deleteType(data);
		});
	});
	socket.on('unit-build', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.planet, 'string') || !isset(data.unit, 'string') || !isset(data.count, 'number') || !isset(data.fleet)) {
			return;
		}

		// User
		data.sid = socket.id;

		Player.isValid(data,function(userData) { // Verify identity
			Units.build(data);
		});
	});
	socket.on('units-ask-data', function(data) {
		if(globalCfg.dev) {
			log('Asking units');
		}

		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.planet, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;

		Player.isValid(data,function(userData) { // Verify identity
			Units.refresh(data);
			Fleets.refresh(data.planet,data.sid);
			Tactics.refresh(data.id, data.sid);
		});
	});
};
