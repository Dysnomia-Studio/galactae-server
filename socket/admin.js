module.exports = function(socket) {
	// Admin panel
	socket.on('server-monitore-connect', function(data) {
		if(!isset(data, 'object') || !isset(data.username, 'string') || !isset(data.password, 'string')) {
			return;
		}


		const clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

		if(data.username ===  '***REMOVED***' &&
			data.password === '***REMOVED***') {

			adminSid = socket.id;
			log('Admin connected from ' + clientIpAddress);
		} else {
			log('Failed to connect to admin account from ' + clientIpAddress, 'error');
		}
	});

	socket.on('admin-request-cmd', function(data) {
		if(!isset(data, 'object') || !isset(data.cmd, 'string')) {
			return;
		}

		const clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

		if(socket.id===adminSid) {
			log('Executing admin command (' + data.cmd + ') from ' + clientIpAddress);

			switch(data.cmd) {
				case 'maintenanceOn':
					Websocket.beginMaintenance();
					break;
				case 'maintenanceOff':
					Websocket.endMaintenance();
					break;
				case 'restart':
					Websocket.restart();
					break;
				case 'start':
					// Can't do this now ... Waiting a way (@TODO)
					break;
				case 'stop':
					// Can't do this now ... Waiting a way (@TODO)
					break;
				default:
					log('Command ' + data.cmd + ' not found !');
			}
		} else {
			log('Failed to execute admin command from ' + clientIpAddress + ': ERR_NOT_LOGGED');
		}
	});
};
