module.exports = function(socket) {
	/**
	* When a client ask for its planet data ...
	*/
	socket.on('planet-ask-data', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.username, 'string') || !isset(data.id, 'string') || !isset(data.pid, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			if(globalCfg.dev) {
				log('Asking planet');
			}

			Planet.refresh(data);
		});
	});

	// Conquest
	socket.on('conquest-ask-refresh', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.username, 'string') || !isset(data.id, 'string') || !isset(data.pid, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			if(globalCfg.dev) {
				log('Asking conquest refresh');
			}

			Conquest.refresh(data.sid, data.id, data.pid);
		});
	});

	// Map
	socket.on('system-ask-mapData', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.username, 'string') || !isset(data.id, 'string') || !isset(data.systemAddress, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			if(globalCfg.dev) {
				log('Asking map');
			}

			Planet.getWholeSystem(data);
		});
	});

	// Map influence zones
	socket.on('global-ask-influenceData', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.username, 'string') || !isset(data.id, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			if(globalCfg.dev) {
				log('Asking influence zones data');
			}

			GameMap.syncPlayer(data.id, data.sid);
		});
	});

	//Building
	socket.on('planet-build', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.username, 'string') || !isset(data.id, 'string') || !isset(data.building, 'number') || !isset(data.planet, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Planet.build(data);
		});
	});

	// Change name
	socket.on('planet-rename', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.username, 'string') || !isset(data.id, 'string') || !isset(data.pid, 'string') || !isset(data.name, 'string') || data.name==='') {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Planet.rename(data);
		});
	});
};
