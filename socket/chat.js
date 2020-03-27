module.exports = function(socket) {
	/**
	* Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
	*/
	socket.on('chat-send', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.username, 'string') || !isset(data.id, 'string') || !isset(data.message, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, async(userData) => { // Verify identity
			data.ally = userData.ally;

			Chat.analyse(data);
		});
	});
};
