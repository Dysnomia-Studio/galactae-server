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

	io.on('connection', function (socket) {
		/**
		* Log de connexion et de déconnexion des utilisateurs
		*/
		socket.on('game-connect', function (user) {
			// Vars
			if(!isset(user) || !isset(user.username) || !isset(user.id)) { return; }
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
			var user = {};
			user.sid = socket.id;
			disconnectPlayer(user);
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
				// Log
				log('[' + data.channel.substr(9) + '] '+data.username+': ' +data.message);
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
	}
	this.io = io;
	this.express = express;
	this.app = app;
	this.https = https;
};