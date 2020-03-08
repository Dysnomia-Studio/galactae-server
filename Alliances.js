module.exports = class Alliances {
	static async sendToPlayer(player) {
		const ally = {
			id: player.ally.id,
			name: player.ally.name,
			description: player.ally.description,
			members: (await db.alliance.getMembers(player.ally.id)),
		};

		io.to(player.sid).emit('player-alliance-data', ally);
	}

	/**
	 * Permissions
	 */
	static async hasFounderPermissions(targetPlayerId) {
		const permissions = await db.alliance.getPermissions(targetPlayerId);

		return permissions.founder;
	}

	static async hasLeaderPermissions(targetPlayerId) {
		const permissions = await db.alliance.getPermissions(targetPlayerId);

		return permissions.founder || permissions.leader;
	}

	static async hasDiplomacyPermissions(targetPlayerId) {
		const permissions = await db.alliance.getPermissions(targetPlayerId);

		return permissions.founder || permissions.leader || permissions.diplomacy;
	}

	static async hasEnoughRightsOnTarget(currPlayerId, targetPlayerId) {
		const currPermissions = await db.alliance.getPermissions(currPlayerId);
		const targetPermissions = await db.alliance.getPermissions(targetPlayerId);

		if(currPermissions.founder) {
			return true;
		}

		if(currPermissions.leader && !(targetPermissions.founder || targetPermissions.leader)) {
			return true;
		}

		return false;
	}

	/**
	 * Member management
	 */
	static async addPlayerToAlliance(targetPlayer, allyId) {
		await db.player.updateAlly({
			id: targetPlayer.id,
			ally: allyId,
		});

		await db.alliance.createPermissions(
			targetPlayer.id,
			allyId,
		);
	}

	static async removePlayerFromAlliance(targetPlayer) {
		await db.player.updateAlly({
			id: targetPlayer.id,
			ally: null,
		});

		await db.alliance.dropPermissions(
			targetPlayer.id
		);
	}

	/**
	 * Orders from socket events
	 */
	static async search(sid, searchText) {
		const alliances = await db.alliance.search(searchText);

		io.to(sid).emit('player-search-results', alliances);
	}

	static async create(sid, userData, name, description) {
		if(userData.ally !== null) {
			return;
		}

		const allyId = await db.alliance.create({
			name,
			description,
		});

		Alliances.addPlayerToAlliance(userData, allyId);

		userData.ally = {
			id: allyId,
			name,
			description,
		};

		log(userData.name + ' has created an new alliance named "' + name + '".');

		Alliances.sendToPlayer(userData);
	}

	static async askToJoin(userData, playerName, allyId) {
		if(userData.ally !== null) {
			return;
		}

		log(userData.name + ' asked to join alliance "' + allyId + '".');

		db.alliance.askToJoin(playerName, allyId);

		// @TODO: notify alliance staff
	}

	static async choiceAskToJoin(currPlayer, playerName, choice) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			return;
		}

		if(await db.alliance.askedToJoin(playerName, currPlayer.ally)) {
			const playerData = await db.player.findByName(playerName);

			if(choice) {
				Alliances.addPlayerToAlliance(playerData, currPlayer.ally);

				log(playerName + ' was granted to join alliance "' + currPlayer.ally + '" by ' + currPlayer.name + '.');
			} else {
				log(playerName + ' wasn\'t granted to join alliance "' + currPlayer.ally + '" by ' + currPlayer.name + '.');
			}

			// @TODO: notify player

			await db.alliance.removeJoinAsk(playerName);

			playerData.ally = await db.alliance.find(playerData.ally);

			Alliances.sendToPlayer(playerData);
		}
	}

	static async invite(currPlayer, invitedPlayerName, allyId) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			return;
		}

		log(invitedPlayerName + ' was invited to join alliance "' + allyId + '" by ' + currPlayer.name + '.');

		db.alliance.invite(invitedPlayerName, allyId);

		// @TODO: notify player
	}

	static async choiceInvite(currPlayer, allyId, choice) {
		if(currPlayer.ally !== null) {
			return;
		}

		if(await db.alliance.hasBeenInvited(currPlayer.id, allyId)) {
			if(choice) {
				Alliances.addPlayerToAlliance(currPlayer, allyId);

				log(currPlayer.name + ' accepted to join alliance "' + allyId + '.');
			} else {
				log(currPlayer.name + ' refused to join alliance "' + allyId + '.');
			}

			await db.alliance.removeInvitations(currPlayer.name);

			currPlayer.ally = await db.alliance.find(currPlayer.ally);

			Alliances.sendToPlayer(currPlayer);

			// @TODO: notify alliance members
		}
	}

	static async kick(currPlayer, targetPlayerName) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			return;
		}

		const targetPlayer = await db.player.findByName(targetPlayerName);

		if(!(await Alliances.hasEnoughRightsOnTarget(currPlayer.id, targetPlayer.id))) {
			return;
		}

		Alliances.removePlayerFromAlliance(targetPlayer);

		// @TODO: notify alliance members
	}

	static async editPermissions(currPlayer, targetPlayerName, founder, leader, diplomacy) {
		if((founder + leader + diplomacy) > 1) {
			return;
		}

		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			return;
		}

		if((founder || leader) && !(await Alliances.hasFounderPermissions(currPlayer.id))) {
			return;
		}

		const targetPlayer = await db.player.findByName(targetPlayerName);

		if(!(await Alliances.hasEnoughRightsOnTarget(currPlayer.id, targetPlayer.id))) {
			return;
		}

		await db.alliance.setPermissions(
			targetPlayer.id,
			founder, leader, diplomacy
		);

		// Remove founder perms from current player if assigning a new founder
		if(founder) {
			await db.alliance.setPermissions(
				currPlayer.id,
				false, true, false
			);
		}

		// @TODO: notify player
	}
};
