/**
 * Npm libs
 */
global.fs = require('fs');
let options = {
	key: fs.readFileSync(process.cwd() + '/keys/privkey.pem'),
	cert: fs.readFileSync(process.cwd() + '/keys/cert.pem'),
};
let express = require('express');
let app = express();
global.https = require('https').createServer(options, app);
global.io = require('socket.io')(https);
io.set('transports', ['websocket','xhr-polling','polling']);

/**
 * Global vars
 */
global.preventConnection = false;
global.preventConnectionMsg = '';
global.maintenance = false;
global.plCount = 0;
global.preventRestarts = 0; //@ADD: Really prevent restarting server until this is set to 0
global.adminSid = '';

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
global.Discord   = require('./discord');
// Then include other classes
global.Chat      = require('./chat');
global.Combat    = require('./combat');
global.Fleet 	 = require('./fleet');
global.GameMap   = require('./map');
global.Planet    = require('./planet');
global.Player    = require('./player');
global.Research  = require('./research');
global.Tutorials = require('./tutorials');
global.Units     = require('./units');
// And that's in last
global.Websocket = require('./socket');

/**
 * Launch server !
 */
db.connect(function(success,general=false) {
	if(!success) {
		log('Failed to connect to db ! Blocking user connections ...','warn');
		preventConnection = true;
		return;
	}

	if(!general) {
		//db.player.clearList();
	}

	if(general) {
		db.server.find(function(server) {
			maintenance = server.server_maintenance;
		});
	}

	/**
	 * Stats Auto Submit to db
	 */
	let statsInterval = 5 * 60 * 1000;

	setTimeout(function() {
		db.stat.submit(Date.now() - Date.now()%statsInterval);

		setInterval(function() {
			db.stat.submit(Date.now() - Date.now()%statsInterval);
		},statsInterval);
	},statsInterval - Date.now()%statsInterval);

	if(!general) {
		/**
		 * Lancement du serveur en écoute
		 */
		https.listen(globalCfg.serverPort, function () {
			Websocket.init();
			Discord.connect();
			log('Server is listening on *:' + globalCfg.serverPort);
		});
	}
});

/**
 * Graceful stop
 */
process.on('SIGINT', function() {
    Websocket.restart();
});