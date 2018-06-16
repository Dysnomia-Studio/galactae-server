module.exports = class Websocket {
	static init() {
		io.on('connection', function(socket) {
			/**
			* Log de connexion et de déconnexion des utilisateurs
			*/
			socket.on('game-connect', function(user) {
				// Vars
				if(!isset(user) || !isset(user.username) || !isset(user.id)) { return; }

				if(preventConnection) {
					Chat.sendSM(socket.id,preventConnectionMsg);
					io.to(socket.id).emit('server-kick');
					return;
				}

				// User
				user.sid = socket.id;
				// Log
				log(user.username + ' ('+socket.id+') connected');
				// Execution du code
				Player.connect(user);
			});

			socket.on('game-disconnect', function(user) {
				// Vars
				if(!isset(user) || !isset(user.username) || !isset(user.id)) { return; }
				// User
				user.sid = socket.id;
				Player.isValid(user,function(user) { // Verify identity
					// Log
					log(user.username + ' ('+socket.id+') disconnected');
					Player.disconnect(user);
				}); 
			});

			/**
			 * Security auto-disconnect
			 */
			socket.on('disconnect', function() {
				let data = {};
				data.sid = socket.id;
				db.player.searchBySid(data.sid, function(user) {
					if(!isset(user) || !isset(user.name) || !isset(user.id)) { return; }
					// Log
					log(user.name + ' ('+socket.id+') disconnected');
					Player.disconnect(user);
				}); 
			});

			/**
			* Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
			*/
			socket.on('chat-send', function(data) {
				// Vars
				if(!isset(data) || !isset(data.username) || !isset(data.id) || !isset(data.message)) { return; }
				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
					Player.getAlly(data, Chat.analyse);	
				}); 	
			});

			/**
			* When a client ask for its planet data ...
			*/
			socket.on('planet-ask-data', function(data) { 
				// Vars
				if(!isset(data)) { return; }
				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
				   	Planet.refresh(data,0);
				});
			});
			// Next/Prev planet
			socket.on('planet-ask-data-prev', function(data) {
				// Vars
				if(!isset(data)) { return; }
				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
				   	Planet.refresh(data,-1);
				}); 
			});
			socket.on('planet-ask-data-next', function(data) {
				// Vars
				if(!isset(data)) { return; }
				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
				   	Planet.refresh(data,1);
				}); 
			});

			//Building
			socket.on('planet-build', function(data) { 
				// Vars
				if(!isset(data) || !isset(data.building)) { return; }
				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
				   	Planet.build(data);
				}); 
			});

			// Change name
			socket.on('planet-rename', function(data) {
				// Vars
				if(!isset(data) || !isset(data.planet) || !isset(data.name) || data.name=="") { return; }
				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
				   	Planet.rename(data);
				}); 
			});

			// Research
			socket.on('research-change', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.pid) || !isset(data.username) || !isset(data.research)) { return; }
				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
				    log(data.username + " wants to change research on " + data.pid + " to " + data.research,"info");
				   	Research.ChangePlanetResearch(data,data.pid,data.research);
				});
			});
			socket.on('research-sync', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.pid) || !isset(data.username)) { return; }
				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
				   	Research.sync(data);
				});
			});

			// Units
			socket.on('unit-type-create', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.ship) || !isset(data.username)) { return; }
				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
				   	Units.createType(data);
				});
			});
			socket.on('unit-type-rename', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.shipId) || !isset(data.shipNewName) || !isset(data.username)) { return; }
				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
				   	Units.renameType(data);
				});
			});
			socket.on('unit-type-delete', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.unit) || !isset(data.username)) { return; }
				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
				   	Units.deleteType(data);
				});
			});
			socket.on('unit-build', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.username) || !isset(data.planet) || !isset(data.unit) || !isset(data.count) || !isset(data.fleet)) { return; }
				// User
				data.sid = socket.id;

				Player.isValid(data,function(data) { // Verify identity
				   	Units.build(data);
				});
			});
			socket.on('fleet-move', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.username) || !isset(data.fleetId) || !isset(data.destination)) { return; }
				// User
				data.sid = socket.id;

				Player.isValid(data,function(data) { // Verify identity
				   	Units.fleetMoveTo(data, data.fleetId, data.destination);
				});
			});

			// Daily Bonus
			socket.on('daily-bonus', function(data) {
				// Vars
				if(!isset(data) || !isset(data.user) || !isset(data.choice)) { return; }
				// User
				data.user.sid = socket.id;
				Player.isValid(data.user,function(user) { // Verify identity
				   	db.player.searchBySid(user.sid,function(dataReturned) {
				   		Player.dayBonus(dataReturned,user,data.choice);
				   	});
				}); 
			});

			// Admin panel
			socket.on('server-monitore-connect', function(data) {
				if(!isset(data) || !isset(data.username) || !isset(data.password)) { return; }

				let clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
				
				if(data.username=="***REMOVED***" && data.password=="***REMOVED***") {
					adminSid = socket.id;
					log("Admin connected from " + clientIpAddress);
				} else {
					log("Failed to connect to admin account from " + clientIpAddress);
				}
			});

			socket.on('admin-request-cmd', function(data) {
				if(!isset(data) || !isset(data.cmd)) {
					return;
				}
				
				let clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

				if(socket.id==adminSid) {
					if(typeof(data.cmd) !== "string") {
						return;
					}

					log("Executing admin command (" + data.cmd + ") from " + clientIpAddress);

					switch(data.cmd) {
						case "maintenanceOn":
							Websocket.beginMaintenance();
							break;
						case "maintenanceOff":
							Websocket.endMaintenance();
							break;
						case "restart":
							preventConnection = true;
							preventConnection = 'RESTARTING_SERVER';
							io.emit('server-reboot');
							Discord.alert('Restarting game server ...');

							let decompte = 15;
							
							setInterval(function() {
								if(decompte>0) {
									log('Restarting server in ' + decompte-- + ' seconds');
								} else {
									log('Restarting now !');
									process.exit(); // Well, the pm2 auto restart will do its work
								}
								
							},1000);
							break;
						case "start":
							// Can't do this now ... Waiting a way (@ADD)
							break;
						case "stop":
							// Can't do this now ... Waiting a way (@ADD)
							break;
						default:
							log("Command " + data.cmd + " not found !");
					}
				} else {
					log("Failed to execute admin command from " + clientIpAddress + ": ERR_NOT_LOGGED");
				}
			});
		});
	}
	/**
	 * Sends a message to client.
	 *
	 * @class      SendMessageToClient (name)
	 * @param      {object}  data    The data
	 */
	static SendMessageToClient(data) {
		io.to(data.sid).emit("server-alert",data.message);
	}
	/**
	 * Sends a general message.
	 *
	 * @class      SendGeneralMessage (name)
	 * @param      {string}  msg     The message
	 */
	static SendGeneralMessage(msg) {
		io.emit("server-general-alert",msg);
		Discord.alert(msg);
	}

	/**
	 * Send notif to client
	 */
	static sendNotification(sid, type, args) {
		io.to(sid).emit("notification", { type, args });
	}

	/**
	 * Begins a server maintenance
	 */
	static beginMaintenance() {
		io.emit('server-maintenance');
		Websocket.SendGeneralMessage("MAINTENANCE");
		maintenance = true;

		db.server.find(function(server) {
			server.server_maintenance = true;
			db.server.update(server);
		});
	}
	/**
	 * Ends a server maintenance
	 */
	static endMaintenance() {
		io.emit('server-maintenance-off');
		maintenance = false;

		db.server.find(function(server) {
			server.server_maintenance = false;
			db.server.update(server);
		});
	}
};