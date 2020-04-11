module.exports = function(socket) {
	socket.on('fleet-set-priority', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.planet, 'string') || !isset(data.fleet, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;

		Player.isValid(data,function(userData) { // Verify identity
			Planet.setPriorityFleet(data.planet, data.fleet, data.sid);
		});
	});
	socket.on('fleet-move', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.fleetId, 'string') || !isset(data.destination, 'string') || !isset(data.moveType, 'number')) {
			return;
		}

		// User
		data.sid = socket.id;

		Player.isValid(data,function(userData) { // Verify identity
			Fleets.moveTo(data, data.fleetId, data.destination, data.moveType);
		});
	});
	socket.on('fleet-rename', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.fleetId, 'string') || !isset(data.fleetNewName, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Fleets.renameFleet(data);
		});
	});
	socket.on('fleet-merge', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.from, 'string') || !isset(data.to, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Fleets.mergeFleet(data.from, data.to, data);
		});
	});
	socket.on('fleet-units-transfer', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.from, 'string') || !isset(data.to, 'string') || !isset(data.unitId, 'string') || !isset(data.unitCount, 'number')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Fleets.transferSomeUnits(data.from, data.to, data);
		});
	});
	socket.on('fleet-transferFuel', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.from, 'string') || !isset(data.to, 'string') || !isset(data.fuelCount, 'number')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Fleets.transferFuelBetweenFleets(data.from, data.to, data);
		});
	});
};
