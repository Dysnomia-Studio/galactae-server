var discord = require('./discord');

module.exports = function() {
	/**
	* Modules npm
	*/
	var fs = require( 'fs' );
	var options = {
		key: fs.readFileSync(process.cwd() + '/keys/privkey.pem'),
		cert: fs.readFileSync(process.cwd() + '/keys/cert.pem'),
		requestCert: true
	};
	var express = require('express');
	var app = express();
	var https = require('https').createServer(options, app);
	var io = require('socket.io')(https);
	var db = require('./database');
	var preventConnection = false;
	var preventConnectionMsg = "";

	io.on('connection', function (socket) {
		/**
		* Log de connexion et de déconnexion des utilisateurs
		*/
		socket.on('game-connect', function (user) {
			// Vars
			if(!isset(user) || !isset(user.username) || !isset(user.id)) { return; }

			if(preventConnection==true) {
				sendSM(socket.id,preventConnectionMsg);
				io.to(socket.id).emit('server-kick');
				return;
			}

			// User
			user.sid = socket.id;
			// Log
			log(user.username+' ('+ user.id + ' | ' + socket.id +') connected');
			// Execution du code
			connectPlayer(user);
		});

		socket.on('game-disconnect', function (user) {
			// Vars
			if(!isset(user) || !isset(user.username) || !isset(user.id)) { return; }
			// User
			user.sid = socket.id;
			isValidUser(user,function(user) { // Verify identity
				// Log
				log(user.username+' ('+ user.id + ' | ' + socket.id +') disconnected');
				// Execution du code
				disconnectPlayer(user);
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
				log(user.name+' ('+ user.id + ' | ' + socket.id +') disconnected');
				// Execution du code
				disconnectPlayer(user);
			}); 
		});

		/**
		* Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
		*/
		socket.on('chat-send', function (data) {
			// Vars
			if(!isset(data) || !isset(data.message)) { return; }
			// User
			data.sid = socket.id;
			isValidUser(data,function(data) { // Verify identity
				// Execution du code
				getAlly(data, function() {
					getLvl(data,chatAnalyse); // Le serveur va verifier les droits de l'utilisateur puis lancer l'analyse du message et l'envoi si necessaire.
				});	
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
			isValidUser(data,function(data) { // Verify identity
				// Execution du code
			   	refreshUserPlanet(data,0);
			});
		});
		// Next/Prev planet
		socket.on('planet-ask-data-prev', function (data) {
			// Vars
			if(!isset(data)) { return; }
			// User
			data.sid = socket.id;
			isValidUser(data,function(data) { // Verify identity
				// Execution du code
			   	refreshUserPlanet(data,-1);
			}); 
		});
		socket.on('planet-ask-data-next', function (data) {
			// Vars
			if(!isset(data)) { return; }
			// User
			data.sid = socket.id;
			isValidUser(data,function(data) { // Verify identity
				// Execution du code
			   	refreshUserPlanet(data,1);
			}); 
		});

		//Building
		socket.on('planet-build', function(data) { 
			// Vars
			if(!isset(data) || !isset(data.building)) { return; }
			// User
			data.sid = socket.id;
			isValidUser(data,function(data) { // Verify identity
				// Execution du code
			   	planetBuild(data);
			}); 
		});

		// Change name
		socket.on('planet-rename', function(data) {
			// Vars
			if(!isset(data) || !isset(data.planet) || !isset(data.name) || data.name=="") { return; }
			// User
			data.sid = socket.id;
			isValidUser(data,function(data) { // Verify identity
				// Execution du code
			   	ChangePlanetName(data);
			}); 
		});

		// Research
		socket.on('research-change', function(data) {
			// Vars
			if(!isset(data) || !isset(data.id) || !isset(data.pid) || !isset(data.username) || !isset(data.research)) { return; }
			// User
			data.sid = socket.id;
			isValidUser(data,function(data) { // Verify identity
			    log(data.username + " wants to change research on " + data.pid + " to " + data.research,"info");
				// Execution du code
			   	ChangePlanetResearch(data,data.pid,data.research);
			});
		});
		socket.on('research-sync', function(data) {
			// Vars
			if(!isset(data) || !isset(data.id) || !isset(data.pid) || !isset(data.username)) { return; }
			// User
			data.sid = socket.id;
			isValidUser(data,function(data) { // Verify identity
				// Execution du code
			   	ResearchSync(data);
			});
		});

		// Units
		socket.on('unit-type-create', function(data) {
			// Vars
			if(!isset(data) || !isset(data.id) || !isset(data.ship) || !isset(data.username)) { return; }
			// User
			data.sid = socket.id;
			isValidUser(data,function(data) { // Verify identity
				// Execution du code
			   	CreateUnitType(data);
			});
		});

		// Daily Bonus
		socket.on('daily-bonus', function (data) {
			// Vars
			if(!isset(data) || !isset(data.user) || !isset(data.choice)) { return; }
			// User
			data.user.sid = socket.id;
			isValidUser(data.user,function(user) { // Verify identity
				// Execution du code
			   	db.player.searchBySid(user.sid,function(dataReturned) {
			   		dayBonus(dataReturned,user,data.choice);
			   	});
			}); 
		});

		// Admin panel
		socket.on('server-monitore-connect', function(data) {
			if(data.username=="***REMOVED***" && data.password=="***REMOVED***") {
				adminSid = socket.id;
				var clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
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

						break;
					case "maintenanceOff":

						break;
					case "restart":
						sendSM('RESTARTING_SERVER');
						preventConnection = true;
						preventConnection = 'RESTARTING_SERVER';
						io.emit('server-kick');

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

						break;
					case "stop":

						break;
					default:
						log("Command " + data.cmd + " not found !");
				}
			} else {
				log("Failed to execute admin command from " + clientIpAddress);
			}
		})
	});
	/* SendMessageToClient
	INPUT: data
	OUTPUT: io connection ( array ) */
	this.SendMessageToClient = function(data) {
		io.to(data.sid).emit("server-alert",data.message);
	}
	/* SendGeneralMessage
	INPUT: msg ( string )
	OUTPUT: io connection ( array ) */
	this.SendGeneralMessage = function(msg) {
		io.emit("server-general-alert",msg);
		discord.alert(msg);
	}
	this.io = io;
	this.express = express;
	this.app = app;
	this.https = https;
	this.adminSid = "-1";
};