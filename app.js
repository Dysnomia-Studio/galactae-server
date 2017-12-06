/* Game Files */
require('./planet')();
require('./units')();
require('./research')();
require('./calcConstants')();
require('./chat')();
require('./config')();
require('./console')();
var discord = require('./discord');
require('./player')();
require('./socket')();
var db = require('./database');
require('./misc')();

/* Connect to database */
db.connect(function() {
	db.player.clearList();

	/**
	 * Stats Auto Submit to db
	 */
	var statsInterval = 5 * 60 * 1000;

	setTimeout(function() {
		db.stat.submit(Date.now()%statsInterval);

		setInterval(function() {
			db.stat.submit(Date.now()%statsInterval);
		},statsInterval)
	},statsInterval - Date.now()%statsInterval);
});

/**
 * Lancement du serveur en écoute
 */
https.listen(globalCfg["serverPort"], function () {
  log('Server is listening on *:'+globalCfg["serverPort"]);
});