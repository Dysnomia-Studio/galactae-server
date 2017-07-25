/* Game Files */
require('./resources')();
require('./chat')();
require('./console')();
require('./socket')();
require('./database')();
require('./misc')();

/* Connect to database */
dbconnect();

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 34269
 */
https.listen(34269, function () {
  log('Server is listening on *:34269');
});