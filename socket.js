global.playerList = new Set();

module.exports = class Websocket {
	static init() {
		io.on('connection', function(socket) {
			/**
			* Log de connexion et de déconnexion des utilisateurs
			*/
			socket.on('game-connect', function(user) {
				// Vars
				if(!isset(user, 'object') || !isset(user.username, 'string') || !isset(user.id, 'string') || (!isset(user.pid, 'string') && user.pid !== '')) {
					return;
				}


				if(preventConnection) {
					Chat.sendSM(socket.id,preventConnectionMsg);
					io.to(socket.id).emit('server-kick');
					return;
				}

				// User
				user.sid = socket.id;
				// Log
				log(user.username + ' ('+socket.id+') connected');

				playerList.add(user.username);

				// Execution du code
				Player.connect(user);
			});

			socket.on('game-disconnect', function(user) {
				// Vars
				if(!isset(user, 'object') || !isset(user.name, 'string') || !isset(user.id, 'string')) {
					return;
				}


				if(!playerList.has(user.name)) {
					return;
				}

				// User
				user.sid = socket.id;
				Player.isValid(user,function(user) { // Verify identity
					if(!isset(user, 'object') || !isset(user.name, 'string') || !isset(user.id,'string')) {
						return;
					}


					playerList.delete(user.name);

					// Log
					log(user.username + ' (' + socket.id + ') disconnected');
					Player.disconnect(user);
				});
			});

			/**
			 * Security auto-disconnect
			 */
			socket.on('disconnect', function() {
				const data = {};
				data.sid = socket.id;

				db.player.searchBySid(data.sid, function(user) {
					if(!isset(user, 'object') || !isset(user.name, 'string') || !isset(user.id,'string')) {
						return;
					}


					if(!playerList.has(user.name)) {
						return;
					}

					playerList.delete(user.name);

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
				if(!isset(data, 'object') || !isset(data.username, 'string') || !isset(data.id, 'string') || !isset(data.message, 'string')) {
					return;
				}

				// User
				data.sid = socket.id;
				Player.isValid(data, async(data) => { // Verify identity
					data = await Player.getAlly(data);

					Chat.analyse(data);
				});
			});

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
				Player.isValid(data,function(data) { // Verify identity
					if(globalCfg.dev) {
						log('Asking planet');
					}

					Planet.refresh(data);
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
				Player.isValid(data,function(data) { // Verify identity
					if(globalCfg.dev) {
						log('Asking map');
					}

					Planet.getWholeSystem(data);
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
				Player.isValid(data,function(data) { // Verify identity
					Planet.build(data);
				});
			});

			// Change name
			socket.on('planet-rename', function(data) {
				// Vars
				if(!isset(data, 'object') || !isset(data.username, 'string') || !isset(data.id, 'string') || !isset(data.planet, 'string') || !isset(data.name, 'string') || data.name==='') {
					return;
				}

				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
					Planet.rename(data);
				});
			});

			// Research
			socket.on('research-change', function(data) {
				// Vars
				if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.pid, 'string') || !isset(data.username, 'string') || !isset(data.research, 'string')) {
					return;
				}

				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
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
				Player.isValid(data,function(data) { // Verify identity
					Research.sync(data);
				});
			});

			// Units
			socket.on('unit-type-create', function(data) {
				// Vars
				if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.ship, 'object') || !isset(data.username, 'string')) {
					return;
				}

				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
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
				Player.isValid(data,function(data) { // Verify identity
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
				Player.isValid(data,function(data) { // Verify identity
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

				Player.isValid(data,function(data) { // Verify identity
					Units.build(data);
				});
			});
			socket.on('units-ask-data', function(data) {
				if(globalCfg.dev) {
					log('Asking units');
				}

				// Vars
				if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.planet, 'string') || !isset(data.address, 'string')) {
					return;
				}

				// User
				data.sid = socket.id;

				Player.isValid(data,function(data) { // Verify identity
					Units.refresh(data);
					Fleets.refresh(data.address,data.sid);
					Tactics.refresh(data.id, data.sid);
				});
			});
			socket.on('fleet-set-priority', function(data) {
				// Vars
				if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.planet, 'string') || !isset(data.fleet, 'string')) {
					return;
				}

				// User
				data.sid = socket.id;

				Player.isValid(data,function(data) { // Verify identity
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

				Player.isValid(data,function(data) { // Verify identity
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
				Player.isValid(data,function(data) { // Verify identity
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
				Player.isValid(data,function(data) { // Verify identity
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
				Player.isValid(data,function(data) { // Verify identity
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
				Player.isValid(data,function(data) { // Verify identity
					Fleets.transferFuelBetweenFleets(data.from, data.to, data);
				});
			});

			socket.on('tactics-upsert', (data) => {
				// Vars
				if(!isset(data, 'object') || !isset(data.id) || !isset(data.username) || !isset(data.tactic, 'object')) {
					return;
				}

				// User
				data.sid = socket.id;
				Player.isValid(data,function(data) { // Verify identity
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
				Player.isValid(data,function(data) { // Verify identity
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
				Player.isValid(data,function(data) { // Verify identity
					Tactics.assign(data, data.fleetId, data.tacticId);
				});
			});

			// Daily Bonus
			socket.on('daily-bonus', function(data) {
				// Vars
				if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.choice, 'number') || !isset(data.pid, 'string') ) {
					return;
				}

				// User
				data.sid = socket.id;
				Player.isValid(data, function(user) { // Verify identity
					db.player.searchBySid(user.sid,function(dataReturned) {
						Player.dayBonus(dataReturned,user,data.choice);
					});
				});
			});

			// Tutorial Confirm
			socket.on('tutorial-confirm', function(data) {
				// Vars
				if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.tutorial, 'string')) {
					return;
				}

				// User
				data.sid = socket.id;
				Player.isValid(data, function(user) { // Verify identity
					db.player.searchBySid(user.sid,function(userReturned) {
						data.pid = userReturned.planetlist[0];

						Planet.refresh(data, (planetReturned) => {
							db.fleet.findByMotherPlanet(planetReturned.id, (fleetsList) => {
								db.unit.findByOwner(userReturned.id, (unitsList) => {
									if(!Tutorials.hasCompletedTutorial(data.tutorial, userReturned, planetReturned, fleetsList, unitsList , false)) {
										return;
									}

									userReturned.tutorials[data.tutorial] = true;

									db.player.update({
										id: data.id,
										tutorials: userReturned.tutorials,
									}, () => {
										Planet.refresh(data);
									});
								});
							});
						}, true);
					});
				});
			});

			// Ask a report
			socket.on('player-report-ask', (data) => {
				// Vars
				if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.reportId, 'string')) {
					return;
				}

				// User
				data.sid = socket.id;
				Player.isValid(data, async(user) => { // Verify identity
					const result = await db.battleLog.getFullBattleLog(data.reportId, data.id);

					io.to(data.sid).emit(
						'player-report-full',
						result
					);
				});
			});

			// Delete reports
			socket.on('player-report-delete', (data) => {
				// Vars
				if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.reports, 'array')) {
					return;
				}

				// User
				data.sid = socket.id;
				Player.isValid(data, async(user) => { // Verify identity
					await db.battleLogAccess.deleteReport(data.id, data.reports);

					Reports.refresh(data.id, data.sid);
				});
			});

			// Set reports as read
			socket.on('player-report-set-read', (data) => {
				// Vars
				if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.reports, 'array')) {
					return;
				}

				// User
				data.sid = socket.id;
				Player.isValid(data, async(user) => { // Verify identity
					await db.battleLogAccess.setReadStatus(data.id, data.reports, true);

					Reports.refresh(data.id, data.sid);
				});
			});

			// Set reports as unread
			socket.on('player-report-set-unread', (data) => {
				// Vars
				if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.reports, 'array')) {
					return;
				}

				// User
				data.sid = socket.id;
				Player.isValid(data, async(user) => { // Verify identity
					await db.battleLogAccess.setReadStatus(data.id, data.reports, false);

					Reports.refresh(data.id, data.sid);
				});
			});

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
	static beginMaintenance() {
		io.emit('server-maintenance');
		Websocket.SendGeneralMessage('MAINTENANCE');
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

	/**
	 * Restart server
	 */
	static restart(callback) {
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
