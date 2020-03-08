/**
 * Npm libs
 */
global.fs = require('fs');

/**
 * Global vars
 */
global.preventConnection = false;
global.preventConnectionMsg = '';
global.maintenance = false;
global.preventRestarts = 0;
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
global.db         = require('./database');
global.Discord    = require('./discord');
// Then include other classes
global.Buildings  = require('./Buildings');
global.Chat       = require('./chat');
global.Combat     = require('./combat');
global.DependencyEngine = require('./DependencyEngine');
global.Fleets 	  = require('./Fleets');
global.GameMap    = require('./GameMap');
global.Planet     = require('./planet');
global.Player     = require('./player');
global.Privileges = require('./privileges');
global.Reports    = require('./Reports');
global.Research   = require('./research');
global.Resources  = require('./Resources');
global.Tactics    = require('./tactics');
global.Tutorials  = require('./Tutorials');
global.Units      = require('./Units');
// And that's in last
global.Websocket  = require('./socket');

/**
 * Launch server !
 */
db.connect(function(success,general=false) {
	if(!success) {
		log('Failed to connect to db ! Blocking user connections ...','warn');
		preventConnection = true;
		return;
	}

	if(!general && !globalCfg.dev) {
		db.player.clearList();
	}

	if(general) {
		db.server.find(function(server) {
			maintenance = server.server_maintenance;

			if(maintenance) {
				log('Server maintenance enabled by database configuration', 'warn');
			}
		});
	}

	if(!general) {
		if(!globalCfg.dev) {
			/**
			 * Stats Auto Submit to db
			 */
			const statsInterval = 0.5 * TIME.MINUTES_TO_MS;

			setTimeout(function() {
				db.stat.submit(new Date(Date.now() - Date.now()%statsInterval));

				setInterval(function() {
					db.stat.submit(new Date(Date.now() - Date.now()%statsInterval));
				},statsInterval);
			},statsInterval - Date.now()%statsInterval);
		}

		/**
		 * Socket.io server
		 */
		global.io = require('socket.io').listen(globalCfg.serverPort);
		io.set('transports', ['websocket']);

		/**
		 * Lancement du serveur en écoute
		 */
		Websocket.init();
		Discord.connect();
		log('Server is listening on *:' + globalCfg.serverPort);
	}
});

if(!globalCfg.dev) {
	/**
	 * Graceful stop
	 */
	process.on('SIGTERM', function() {
		Websocket.restart();
	});
	process.on('SIGINT', function() {
		Websocket.restart();
	});
}
