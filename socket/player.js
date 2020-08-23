module.exports = function(socket) {
	/**
	* Log de connexion et de déconnexion des utilisateurs
	*/
	socket.on('game-connect', function(user) {
		// Vars
		if(!isset(user, 'object') || !isset(user.username, 'string') || !isset(user.id, 'string') || (!isset(user.pid, 'string') && user.pid !== '')) {
			return;
		}

		if(preventConnection) {
			Chat.sendSM(socket.id,preventConnectionMsg);
			io.to(socket.id).emit('server-kick');
			return;
		}

		// User
		user.sid = socket.id;
		// Log
		log(user.username + ' ('+socket.id+') connected');

		playerList.add(user.username);

		// Execution du code
		Player.connect(user);
	});

	/**
	 * Automatic disconnecting
	 */
	socket.on('disconnect', async function() {
		const data = {};
		data.sid = socket.id;

		const user = await db.player.findBySid(data.sid);

		if(!isset(user, 'object') || !isset(user.name, 'string') || !isset(user.id,'string')) {
			return;
		}


		if(!playerList.has(user.name)) {
			return;
		}

		playerList.delete(user.name);

		// Log
		log(user.name + ' ('+socket.id+') disconnected');
		Player.disconnect(user);
	});

	// Daily Bonus
	socket.on('daily-bonus', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.choice, 'number') || !isset(data.pid, 'string') ) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, function(user) { // Verify identity
			Player.dayBonus(user,data,data.choice);
		});
	});

	// Tutorial Confirm
	socket.on('tutorial-confirm', function(data) {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.tutorial, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, function(userReturned) { // Verify identity
			data.pid = userReturned.planetlist[0];

			Planet.refresh(data, async(planetReturned) => {
				const fleetsList = await db.fleet.findByMotherPlanet(planetReturned.address);

				const unitsList = await db.unit.findByOwner(userReturned.id);
				if(!Tutorials.hasCompletedTutorial(data.tutorial, userReturned, planetReturned, fleetsList, unitsList , false)) {
					return;
				}

				userReturned.tutorials[data.tutorial] = true;

				if(await db.player.update({
					id: data.id,
					tutorials: userReturned.tutorials,
				})) {
					Planet.refresh(data);
				}
			}, true);
		});
	});
};
