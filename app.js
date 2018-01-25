/**
 * Npm libs
 */
global.fs = require('fs');
var options = {
	key: fs.readFileSync(process.cwd() + '/keys/privkey.pem'),
	cert: fs.readFileSync(process.cwd() + '/keys/cert.pem')
};
var express = require('express');
var app = express();
global.https = require('https').createServer(options, app);
global.io = require('socket.io')(https);

/**
 * Global vars
 */
global.preventConnection = false;
global.preventConnectionMsg = "";
global.maintenance = false;
global.plCount = 0;
global.adminSid = "-1";

/**
 * Configs & Constants
 */
require('./calcConstants')();
require('./config')();

require('./misc')();
require('./console')();

/**
 * Libs
 */
// Include that before, instead, that could pose some problems
global.db        = require('./database');
global.discord   = require('./discord');
// Then include other classes
global.chat      = require('./chat');
global.combat    = require('./combat');
global.planet    = require('./planet');
global.player    = require('./player');
global.research  = require('./research');
global.units     = require('./units');
// And that's in last
global.websocket = require('./socket');

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