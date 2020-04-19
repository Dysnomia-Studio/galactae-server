global.playerList = new Set();

module.exports = class Websocket {
	static init() {
		io.on('connection', function(socket) {
			require('./socket/admin')(socket);
			require('./socket/alliance')(socket);
			require('./socket/chat')(socket);
			require('./socket/fleet')(socket);
			require('./socket/player')(socket);
			require('./socket/planet')(socket);
			require('./socket/research')(socket);
			require('./socket/report')(socket);
			require('./socket/tactic')(socket);
			require('./socket/unit')(socket);
		});
	}
	/**
	 * Sends a message to client.
	 *
	 * @class      SendMessageToClient (name)
	 * @param      {object}  data    The data
	 */
	static SendMessageToClient(data) {
		io.to(data.sid).emit('server-alert',data.message);
	}
	/**
	 * Sends a general message.
	 *
	 * @class      SendGeneralMessage (name)
	 * @param      {string}  msg     The message
	 */
	static SendGeneralMessage(msg) {
		io.emit('server-general-alert',msg);
		Discord.alert(msg);
	}

	/**
	 * Send notif to client
	 */
	static sendNotification(sid, type, args) {
		io.to(sid).emit('notification', { type, args });
	}

	static sendTutorial(user, tutorial) {
		io.to(user.sid).emit('tutorial', tutorial);
	}

	/**
	 * Begins a server maintenance
	 */
	static async beginMaintenance() {
		io.emit('server-maintenance');
		Websocket.SendGeneralMessage('MAINTENANCE');
		maintenance = true;

		const server = await db.server.find();
		server.server_maintenance = true;
		db.server.update(server);
	}
	/**
	 * Ends a server maintenance
	 */
	static async endMaintenance() {
		io.emit('server-maintenance-off');
		maintenance = false;

		const server = await db.server.find();
		server.server_maintenance = false;
		db.server.update(server);
	}

	/**
	 * Restart server
	 */
	static restart() {
		preventConnection = true;
		preventConnectionMsg = 'RESTARTING_SERVER';
		io.emit('server-reboot');
		Discord.alert('Restarting game server ...');

		let decompte = 3;

		setInterval(function() {
			if(preventRestarts > 0) {
				log('Wating simulations to end ...');
				return;
			}

			if(decompte > 0) {
				log('Restarting server in ' + decompte-- + ' seconds');
			} else {
				log('Restarting now !');
				db.closeConnections(function() {
					process.exit(0);
				});
			}
		},1000);
	}
};
