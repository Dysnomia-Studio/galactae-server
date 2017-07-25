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

	io.on('connection', function (socket) {

		// CHAT

	    /**
	    * Log de connexion et de déconnexion des utilisateurs
	    */
	    socket.on('game-connect', function (user) {
	    	if(isset(user)&&isset(user.username)&&isset(user.id)) {
	        	log(user.username+' ('+ user.id + ') connected');
	    	}
	    });

	    socket.on('game-disconnect', function (user) {
	    	if(isset(user)&&isset(user.username)&&isset(user.id)) {
	        	log(user.username+' ('+ user.id + ') disconnected');
	    	}
	    });

	    /**
	    * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
	    */
        socket.on('chat-send', function (data) {
        	if(isset(data)&&isset(data.username)&&isset(data.id)&&isset(data.message)) {
	            log(data.username+' ('+ data.id + ') : '+data.message);
	            
	            getLvl(data,chatAnalyse);
        	}
        });

        //Planet Data

		/**
		* Socket.io ask-planet-info event
		*/
		socket.on('ask-planet-info', function(dataInput) { 
			if(isset(dataInput) && isset(dataInput.id)) {
		    	getPlanetInfo(dataInput);
		    }
		});

		//Building
		socket.on('ask-build-ground', function(data) { 
			if(isset(data)&&isset(data.id)&&isset(data.username)&&isset(data.building)) {
		    	TryBuilding(data);
		    }
		});

		// Change name
		socket.on('planet-new-name', function(data) {
			if(isset(data)&&isset(data.id)&&isset(data.username)&&isset(data.planet)&&isset(data.name)&&data.name!="") {
		    	ChangePlanetName(data);
		    }
		});
	});
	/* SendMessageToClient
	INPUT: data
	OUTPUT: io connection ( array ) */
	this.SendMessageToClient = function(data) {
		io.emit("server-alert",data);
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