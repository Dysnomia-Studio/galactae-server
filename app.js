/**
 * Npm libs
 */
var fs = require('fs');
var options = {
	key: fs.readFileSync(process.cwd() + '/keys/privkey.pem'),
	cert: fs.readFileSync(process.cwd() + '/keys/cert.pem')
};
var express = require('express');
var app = express();
var https = require('https').createServer(options, app);
var io = require('socket.io')(https);

/**
 * Global vars
 */
var preventConnection = preventConnection || false;
var preventConnectionMsg = "";
var maintenance = false;
var plCount = 0;
var adminSid = "-1";

/**
 * Configs & Constants
 */
require('./calcConstants')();
require('./config')();

require('./misc')();
require('./console')(fs, io, adminSid);

/**
 * Libs
 */
// Include that before, instead, that could pose some problems
var db        = require('./database'),
	discord   = require('./discord'),
	// Then include other classes
	chat      = require('./chat'),
	combat    = require('./combat'),
	planet    = require('./planet'),
	player    = require('./player'),
	research  = require('./research'),
	units     = require('./units'),
	// And that's in last
	websocket = require('./socket');

/**
 * Launch server !
 */
db.connect(function(success,general=false) {
	if(!success) {
		log('Failed to connect to db ! Blocking user connections ...',"warn");
		preventConnection = true;
		return;
	}

	if(!general) {
		db.player.clearList();
	}

	/**
	 * Stats Auto Submit to db
	 */
	var statsInterval = 5 * 60 * 1000;

	setTimeout(function() {
		db.stat.submit(Date.now() - Date.now()%statsInterval);

		setInterval(function() {
			db.stat.submit(Date.now() - Date.now()%statsInterval);
		},statsInterval)
	},statsInterval - Date.now()%statsInterval);

	if(!general) {
		/**
		 * Lancement du serveur en écoute
		 */
		https.listen(globalCfg["serverPort"], function () {
			websocket.init(io);
			discord.connect();
			log('Server is listening on *:' + globalCfg["serverPort"]);
		});
	}
});