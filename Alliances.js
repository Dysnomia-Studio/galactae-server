module.exports = class Alliances {
	static async buildAllyInfos(alliance) {
		return {
			id: alliance.id,
			name: alliance.name,
			description: alliance.description,
			askToJoin: (await db.alliance.getAskToJoin(alliance.id)),
			invitations: (await db.alliance.getInvitations(alliance.id)),
			members: (await db.alliance.getMembers(alliance.id)),
			pacts: (await db.alliance.getPacts(alliance.id)),
		};
	}

	static async reSyncAllAllyMembers(allyId) {
		const alliance = await db.alliance.find(allyId);
		if(!alliance) {
			return;
		}

		const players = await db.player.findByAlly(allyId);

		const ally = await Alliances.buildAllyInfos(alliance);

		for(const player of players) {
			io.to(player.sid).emit('player-alliance-data', ally);
		}
	}

	static async sendToPlayer(player) {
		let ally;
		if(!player.ally.name) {
			ally = {
				invitations: (await db.alliance.getPlayerInvitations(player.name)),
				askToJoin: (await db.alliance.getPlayerAskToJoin(player.name)),
			};
		} else {
			ally = await Alliances.buildAllyInfos(player.ally);
		}

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

		Alliances.reSyncAllAllyMembers(allyId);

		// @TODO: notify alliance staff
	}

	static async choiceAskToJoin(currPlayer, playerName, choice) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			return;
		}

		if(await db.alliance.hasAskedToJoin(playerName, currPlayer.ally)) {
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
		}

		Alliances.reSyncAllAllyMembers(currPlayer.ally);
	}

	static async removeAskToJoin(playerName, allyId) {
		log(playerName + ' no longer want to join alliance "' + allyId + '".');

		await db.alliance.removeJoinAsk(playerName, allyId);

		Alliances.reSyncAllAllyMembers(allyId);
	}

	static async invite(currPlayer, invitedPlayerName, allyId) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			return;
		}

		log(invitedPlayerName + ' was invited to join alliance "' + allyId + '" by ' + currPlayer.name + '.');

		db.alliance.invite(invitedPlayerName, allyId);

		Alliances.reSyncAllAllyMembers(allyId);

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

			// @TODO: notify alliance members
		}

		Alliances.reSyncAllAllyMembers(allyId);
	}

	static async removeInvite(currPlayer, invitedPlayerName, allyId) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			return;
		}

		log(invitedPlayerName + ' is no longer invited to join alliance "' + allyId + '" (removed by ' + currPlayer.name + ').');

		await db.alliance.removeInvitations(invitedPlayerName, allyId);

		Alliances.reSyncAllAllyMembers(allyId);
	}

	static async kick(currPlayer, targetPlayerName) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			return;
		}

		const targetPlayer = await db.player.findByName(targetPlayerName);

		if(!(await Alliances.hasEnoughRightsOnTarget(currPlayer.id, targetPlayer.id))) {
			return;
		}

		log(targetPlayerName + ' was kicked from its alliance by ' + currPlayer.name);

		Alliances.removePlayerFromAlliance(targetPlayer);

		Alliances.reSyncAllAllyMembers(currPlayer.ally);

		// @TODO: notify alliance members
		// @TODO: notify player and sync him
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

		log(currPlayer.name + ' edited ' + targetPlayerName + ' permissions (' + founder + ',' + leader + ',' + diplomacy + ')');

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

		Alliances.reSyncAllAllyMembers(currPlayer.ally);

		// @TODO: notify player
	}

	static async edit(currPlayer, newName, newDescription) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			return;
		}

		log(currPlayer.name + ' edited its alliance (' + newName + ', ' + newDescription + ')');

		db.alliance.update(currPlayer.ally, newName, newDescription);

		Alliances.reSyncAllAllyMembers(currPlayer.ally);

		// @TODO: notify player
	}

	static async leave(plyId) {
		if(await Alliances.hasFounderPermissions(plyId)) {
			return;
		}

		log(plyId + ' left its alliance.');

		const targetPlayer = await db.player.find(plyId);

		Alliances.removePlayerFromAlliance(targetPlayer);

		Alliances.reSyncAllAllyMembers(targetPlayer.ally);

		// @TODO: notify player & sync him
	}

	static async dissolve(plyId, allyId) {
		if(!(await Alliances.hasFounderPermissions(plyId))) {
			return;
		}

		log(allyId + ' was dissolved.');

		db.alliance.delete(allyId);

		// @TODO: notify alliance members & sync them
	}

	static async askToPact(plyId, allyId, otherAllyName) {
		if(!(await Alliances.hasDiplomacyPermissions(plyId))) {
			return;
		}

		const alliance = await db.alliance.findByName(otherAllyName);

		if(!alliance) {
			return;
		}

		if(allyId === alliance.id) {
			return;
		}

		db.alliance.askPact(allyId, alliance.id);

		log(allyId + ' asked to pact with alliance ' + otherAllyName);

		Alliances.reSyncAllAllyMembers(allyId);
		Alliances.reSyncAllAllyMembers(alliance.id);

		// @TODO: notify target staff
	}

	static async pactChoice(plyId, allyId, otherAllyId, choice) {
		if(!(await Alliances.hasDiplomacyPermissions(plyId))) {
			return;
		}

		if(choice) {
			db.alliance.acceptPact(allyId, otherAllyId);
			log(allyId + ' accepted pact with ' + otherAllyId);
		} else {
			db.alliance.removePact(allyId, otherAllyId);
			log(allyId + ' refused pact with ' + otherAllyId);
		}

		Alliances.reSyncAllAllyMembers(allyId);
		Alliances.reSyncAllAllyMembers(otherAllyId);

		// @TODO: notify both staff
	}

	static async cancelPactInvitation(plyId, allyId, otherAllyId) {
		if(!(await Alliances.hasDiplomacyPermissions(plyId))) {
			return;
		}

		log(allyId + ' cancelled pact invitation with alliance ' + otherAllyId);

		db.alliance.removePact(allyId, otherAllyId);

		Alliances.reSyncAllAllyMembers(allyId);
		Alliances.reSyncAllAllyMembers(otherAllyId);
	}

	static async stopPact(plyId, allyId, otherAllyId) {
		if(!(await Alliances.hasDiplomacyPermissions(plyId))) {
			return;
		}

		log(allyId + ' stopped pact with alliance ' + otherAllyId);

		db.alliance.removePact(allyId, otherAllyId);

		Alliances.reSyncAllAllyMembers(allyId);
		Alliances.reSyncAllAllyMembers(otherAllyId);

		// @TODO: notify both staff
	}
};
