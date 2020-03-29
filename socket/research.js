module.exports = function(socket) {
	socket.on('research-change', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.pid, 'string') || !isset(data.username, 'string') || !isset(data.research, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			log(data.username + ' wants to change research on ' + data.pid + ' to ' + data.research,'info');
			Research.ChangePlanetResearch(data,data.research);
		});
	});
	socket.on('research-sync', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.pid, 'string') || !isset(data.username, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data,function(userData) { // Verify identity
			Research.sync(data);
		});
	});
};
