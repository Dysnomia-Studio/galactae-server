module.exports = class websocket {
	static init() {
		io.on('connection', function(socket) {
			/**
			* Log de connexion et de déconnexion des utilisateurs
			*/
			socket.on('game-connect', function(user) {
				// Vars
				if(!isset(user) || !isset(user.username) || !isset(user.id)) { return; }

				if(preventConnection) {
					chat.sendSM(socket.id,preventConnectionMsg);
					io.to(socket.id).emit('server-kick');
					return;
				}

				// User
				user.sid = socket.id;
				// Log
				log(user.username + ' ('+socket.id+') connected');
				// Execution du code
				player.connect(user);
			});

			socket.on('game-disconnect', function(user) {
				// Vars
				if(!isset(user) || !isset(user.username) || !isset(user.id)) { return; }
				// User
				user.sid = socket.id;
				player.isValid(user,function(user) { // Verify identity
					// Log
					log(user.username + ' ('+socket.id+') disconnected');
					// Execution du code
					player.disconnect(user);
				}); 
			});

			/**
			 * Security auto-disconnect
			 */
			socket.on('disconnect', function() {
				var data = {};
				data.sid = socket.id;
				db.player.searchBySid(data.sid, function(user) {
					if(!isset(user) || !isset(user.name) || !isset(user.id)) { return; }
					// Log
					log(user.name + ' ('+socket.id+') disconnected');
					// Execution du code
					player.disconnect(user);
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
				player.isValid(data,function(data) { // Verify identity
					// Execution du code
					player.getAlly(data, chat.analyse);	
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
				player.isValid(data,function(data) { // Verify identity
					// Execution du code
				   	planet.refresh(data,0);
				});
			});
			// Next/Prev planet
			socket.on('planet-ask-data-prev', function(data) {
				// Vars
				if(!isset(data)) { return; }
				// User
				data.sid = socket.id;
				player.isValid(data,function(data) { // Verify identity
					// Execution du code
				   	planet.refresh(data,-1);
				}); 
			});
			socket.on('planet-ask-data-next', function(data) {
				// Vars
				if(!isset(data)) { return; }
				// User
				data.sid = socket.id;
				player.isValid(data,function(data) { // Verify identity
					// Execution du code
				   	planet.refresh(data,1);
				}); 
			});

			//Building
			socket.on('planet-build', function(data) { 
				// Vars
				if(!isset(data) || !isset(data.building)) { return; }
				// User
				data.sid = socket.id;
				player.isValid(data,function(data) { // Verify identity
					// Execution du code
				   	planet.build(data);
				}); 
			});

			// Change name
			socket.on('planet-rename', function(data) {
				// Vars
				if(!isset(data) || !isset(data.planet) || !isset(data.name) || data.name=="") { return; }
				// User
				data.sid = socket.id;
				player.isValid(data,function(data) { // Verify identity
					// Execution du code
				   	planet.rename(data);
				}); 
			});

			// Research
			socket.on('research-change', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.pid) || !isset(data.username) || !isset(data.research)) { return; }
				// User
				data.sid = socket.id;
				player.isValid(data,function(data) { // Verify identity
				    log(data.username + " wants to change research on " + data.pid + " to " + data.research,"info");
					// Execution du code
				   	research.ChangePlanetResearch(data,data.pid,data.research);
				});
			});
			socket.on('research-sync', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.pid) || !isset(data.username)) { return; }
				// User
				data.sid = socket.id;
				player.isValid(data,function(data) { // Verify identity
					// Execution du code
				   	research.sync(data);
				});
			});

			// Units
			socket.on('unit-type-create', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.ship) || !isset(data.username)) { return; }
				// User
				data.sid = socket.id;
				player.isValid(data,function(data) { // Verify identity
					// Execution du code
				   	units.createType(data);
				});
			});
			socket.on('unit-type-delete', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.unit) || !isset(data.username)) { return; }
				// User
				data.sid = socket.id;
				player.isValid(data,function(data) { // Verify identity
					// Execution du code
				   	units.deleteType(data);
				});
			});
			socket.on('unit-build', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.username) || !isset(data.planet) || !isset(data.unit) || !isset(data.count) || !isset(data.fleet)) { return; }
				// User
				data.sid = socket.id;

				player.isValid(data,function(data) { // Verify identity
					// Execution du code
				   	units.build(data);
				});
			});
			socket.on('fleet-move', function(data) {
				// Vars
				if(!isset(data) || !isset(data.id) || !isset(data.username) || !isset(data.fleetId) || !isset(data.destination)) { return; }
				// User
				data.sid = socket.id;

				player.isValid(data,function(data) { // Verify identity
					// Execution du code
				   	units.fleetMoveTo(data, data.fleetId, data.destination);
				});
			});

			// Daily Bonus
			socket.on('daily-bonus', function(data) {
				// Vars
				if(!isset(data) || !isset(data.user) || !isset(data.choice)) { return; }
				// User
				data.user.sid = socket.id;
				player.isValid(data.user,function(user) { // Verify identity
					// Execution du code
				   	db.player.searchBySid(user.sid,function(dataReturned) {
				   		player.dayBonus(dataReturned,user,data.choice);
				   	});
				}); 
			});

			// Admin panel
			socket.on('server-monitore-connect', function(data) {
				if(!isset(data) || !isset(data.username) || !isset(data.password)) { return; }

				var clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
				
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
				
				var clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

				if(socket.id==adminSid) {
					if(typeof(data.cmd) !== "string") {
						return;
					}

					log("Executing admin command (" + data.cmd + ") from " + clientIpAddress);

					switch(data.cmd) {
						case "maintenanceOn":
							websocket.beginMaintenance();
							break;
						case "maintenanceOff":
							websocket.endMaintenance();
							break;
						case "restart":
							preventConnection = true;
							preventConnection = 'RESTARTING_SERVER';
							io.emit('server-reboot');
							discord.alert('Restarting game server ...');

							var decompte = 15;
							
							setInterval(function() {
								if(decompte>0) {
									log('Restarting server in ' + decompte-- + ' seconds')
								} else {
									log('Restarting now !')
									process.exit(); // Well, the pm2 auto restart will do its work
								}
								
							},1000)
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
			})
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
		discord.alert(msg);
	}

	/**
	 * Begins a server maintenance
	 */
	static beginMaintenance() {
		io.emit('server-maintenance');
		websocket.SendGeneralMessage("MAINTENANCE");
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
		maintenance = false;

		db.server.find(function(server) {
			server.server_maintenance = false;
			db.server.update(server);
		});
	}
};