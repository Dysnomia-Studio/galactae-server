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
});

/**
 * Lancement du serveur en écoute
 */
https.listen(globalCfg["serverPort"], function () {
  log('Server is listening on *:'+globalCfg["serverPort"]);
});