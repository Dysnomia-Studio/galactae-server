module.exports = function(socket) {
	// Search Alliance
	socket.on('alliance-search', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.searchText, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, async(user) => { // Verify identity
			Alliances.search(data.sid, data.searchText);
		});
	});

	// Create Alliance
	socket.on('alliance-create', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.name, 'string') || !isset(data.description, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, async(user) => { // Verify identity
			Alliances.create(data.sid, user, data.name, data.description);
		});
	});

	// Ask to join Alliance
	socket.on('alliance-join-ask', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.allyName, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, async(user) => { // Verify identity
			Alliances.askToJoin(user, user.name, data.allyName);
		});
	});

	// Accept/Refuse join Alliance
	socket.on('alliance-join-choice', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.plyName, 'string') || !isset(data.choice, 'boolean')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, async(user) => { // Verify identity
			Alliances.choiceAskToJoin(user, data.plyName, data.choice);
		});
	});

	// Remove join alliance request
	socket.on('alliance-join-remove', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.allyId, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, async(user) => { // Verify identity
			Alliances.removeAskToJoin(user, user.name, data.allyId);
		});
	});

	// Invite player
	socket.on('alliance-invite-ask', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.playerName, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.invite(user, data.playerName, user.ally);
		});
	});

	// Accept/Refuse invitation
	socket.on('alliance-invite-choice', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.allyId, 'string') || !isset(data.choice, 'boolean')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.choiceInvite(user, data.allyId, data.choice);
		});
	});

	// Remove invitation
	socket.on('alliance-invite-remove', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.playerName, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.removeInvite(user, data.playerName, user.ally);
		});
	});

	// Kick member
	socket.on('alliance-members-kick', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.playerName, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.kick(user, data.playerName);
		});
	});

	// Edit member permissions
	socket.on('alliance-members-permissionsEdit', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.playerName, 'string') || !isset(data.founder, 'boolean') || !isset(data.leader, 'boolean') || !isset(data.diplomacy, 'boolean')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.editPermissions(user, data.playerName, data.founder, data.leader, data.diplomacy);
		});
	});

	// Edit alliance informations
	socket.on('alliance-edit', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.name, 'string') || !isset(data.description, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.edit(user, data.name, data.description);
		});
	});

	// Leave alliance
	socket.on('alliance-leave', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.leave(user, data.id);
		});
	});

	// Dissolve alliance
	socket.on('alliance-disslove', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.dissolve(user, user.id, user.ally);
		});
	});

	// Ask for pact
	socket.on('alliance-pact-ask', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.allyName, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.askToPact(data.sid, data.id, user.ally, data.allyName);
		});
	});

	// Accept/Refuse pact
	socket.on('alliance-pact-choice', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.allyId, 'string') || !isset(data.choice, 'boolean')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.pactChoice(data.sid, data.id, user.ally, data.allyId, data.choice);
		});
	});

	// Cancel pact invitation
	socket.on('alliance-pact-cancelInvite', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.allyId, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.cancelPactInvitation(data.sid, data.id, user.ally, data.allyId);
		});
	});

	// Stop pact
	socket.on('alliance-pact-stop', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.allyId, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, (user) => { // Verify identity
			Alliances.stopPact(data.sid, data.id, user.ally, data.allyId);
		});
	});
};
