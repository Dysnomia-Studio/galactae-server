/* Game Files */
require('./resources')();
require('./console')();
require('./socket')();
require('./database')();
require('./time')();

/* Connect to database */
dbconnect();

/* 
Recurrence
Launch functions every 10 seconds
IN: -
OUT: - */
MongoDB.once('open', function() {
    setInterval(function(){ Recurrence(); }, 10000);
});

function Recurrence() {
	log("----------------------------------------------------","",true);
	log('Making reccurency task ...','info');
	ServerRessourceUpdate();
	log('Done !','info');
	log("----------------------------------------------------","",true);
}

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 34269
 */
https.listen(34269, function () {
  log('Server is listening on *:34269');
});