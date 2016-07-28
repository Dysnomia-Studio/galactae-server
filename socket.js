module.exports = function() {
	/**
	* Modules npm
	*/
	var fs = require( 'fs' );
	var options = {
	    key: fs.readFileSync('./keys/spacegame.elanistudio.eu/privkey.pem'),
	    cert: fs.readFileSync('./keys/spacegame.elanistudio.eu/cert.pem'),
	    requestCert: true
	};
	var express = require('express');
	var app = express();
	var https = require('https').createServer(options, app);
	var io = require('socket.io')(https);

	io.on('connection', function (socket) {

		// CHAT

	    /**
	    * Log de connexion et de déconnexion des utilisateurs
	    */
	    socket.on('chat-connect', function (username) {
	        log(username+' connected');
	    });

	    socket.on('chat-disconnect', function (username) {
	        log(username+' disconected');
	    });

	    /**
	    * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
	    */
        socket.on('chat-send', function (data) {
            log(data.username+' : '+data.message);
            io.emit('chat-message', data);
        });

        //Planet Data

		/**
		* Socket.io ask-planet-info event
		*/
		socket.on('ask-planet-info', function(dataInput) { 
	    	getPlanetInfo(dataInput);
		});

		//Building
		socket.on('ask-build-ground', function(data) { 
	    	TryBuilding(data);
		});

	});
	/* SendMessageToClient
	INPUT: data
	OUTPUT: io connection ( array ) */
	this.SendMessageToClient = function(data) {
		io.emit("answer-to-client",data);
	}
	this.io = io;
	this.express = express;
	this.app = app;
	this.https = https;
};