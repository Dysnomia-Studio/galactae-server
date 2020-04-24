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
		if(!player.ally || !player.ally.name) {
			ally = {
				invitations: (await db.alliance.getPlayerInvitations(player.name)),
				askToJoin: (await db.alliance.getPlayerAskToJoin(player.name)),
			};
		} else {
			ally = await Alliances.buildAllyInfos(player.ally);
		}

		io.to(player.sid).emit('player-alliance-data', ally);
	}

	static async sendNotifToAllianceStaff(allyId, type, args, diplomacy=false) {
		const members = await db.alliance.getExtendedMemberList(allyId);

		for(const member of members) {
			if(member.founder || member.leader || (diplomacy && member.diplomacy)) {
				Websocket.sendNotification(
					member.sid,
					type,
					args
				);
			}
		}
	}

	static async sendNotifToAllianceMembers(allyId, type, args) {
		const members = await db.alliance.getExtendedMemberList(allyId);

		for(const member of members) {
			Websocket.sendNotification(
				member.sid,
				type,
				args
			);
		}
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
			Websocket.SendMessageToClient({
				sid,
				message: 'ALLIANCE_YOU_ALREADY_HAVE'
			});
			return;
		}

		name = filterUnwantedChars(name);
		description = filterUnwantedChars(description);

		const allyId = await db.alliance.create({
			name,
			description,
		});

		if(!allyId) {
			Websocket.SendMessageToClient({
				sid,
				message: 'ALLIANCE_CREATE_ERROR'
			});
			return;
		}

		await Alliances.addPlayerToAlliance(userData, allyId);

		await db.alliance.setPermissions(
			userData.id,
			true, false, false
		);

		userData.ally = {
			id: allyId,
			name,
			description,
		};

		log(userData.name + ' has created an new alliance named "' + name + '".');

		Alliances.sendToPlayer(userData);
	}

	static async askToJoin(userData, playerName, allyName) {
		if(userData.ally !== null) {
			Websocket.SendMessageToClient({
				sid: userData.sid,
				message: 'ALLIANCE_YOU_ALREADY_HAVE'
			});
			return;
		}

		const alliance = await db.alliance.findByName(allyName);

		if(!alliance) {
			Websocket.SendMessageToClient({
				sid: userData.sid,
				message: 'ALLIANCE_DOES_NOT_EXISTS'
			});
			return;
		}

		log(userData.name + ' asked to join alliance "' + alliance.id + '".');

		await db.alliance.askToJoin(playerName, alliance.id);

		Alliances.reSyncAllAllyMembers(alliance.id);

		Alliances.sendNotifToAllianceStaff(
			alliance.id,
			'ally_askToJoin',
			{ playerName }
		);

		Alliances.sendToPlayer(userData);
	}

	static async choiceAskToJoin(currPlayer, playerName, choice) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		const currAlly = await db.alliance.find(currPlayer.ally);

		if(await db.alliance.hasAskedToJoin(playerName, currPlayer.ally)) {
			const playerData = await db.player.findByName(playerName);

			if(choice) {
				await Alliances.addPlayerToAlliance(playerData, currPlayer.ally);

				log(playerName + ' was granted to join alliance "' + currPlayer.ally + '" by ' + currPlayer.name + '.');

				Websocket.sendNotification(
					currPlayer.sid,
					'ally_accepted',
					{ name: currAlly.name}
				);
			} else {
				log(playerName + ' wasn\'t granted to join alliance "' + currPlayer.ally + '" by ' + currPlayer.name + '.');

				Websocket.sendNotification(
					currPlayer.sid,
					'ally_refused',
					{ name: currAlly.name}
				);
			}

			await db.alliance.removeJoinAsk(playerName);

			playerData.ally = await db.alliance.find(playerData.ally);
		}

		Alliances.reSyncAllAllyMembers(currPlayer.ally);
	}

	static async removeAskToJoin(currPlayer, playerName, allyId) {
		log(playerName + ' no longer want to join alliance "' + allyId + '".');

		await db.alliance.removeJoinAsk(playerName, allyId);

		Alliances.reSyncAllAllyMembers(allyId);

		Alliances.sendToPlayer(currPlayer);
	}

	static async invite(currPlayer, invitedPlayerName, allyId) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		log(invitedPlayerName + ' was invited to join alliance "' + allyId + '" by ' + currPlayer.name + '.');

		await db.alliance.invite(invitedPlayerName, allyId);

		Alliances.reSyncAllAllyMembers(allyId);

		const targetPlayer = await db.player.findByName(invitedPlayerName);
		Alliances.sendToPlayer(targetPlayer);

		const currAlly = await db.alliance.find(currPlayer.ally);
		Websocket.sendNotification(
			currPlayer.sid,
			'ally_invited',
			{ name: currAlly.name}
		);
	}

	static async choiceInvite(currPlayer, allyId, choice) {
		if(currPlayer.ally !== null) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_YOU_ALREADY_HAVE'
			});
			return;
		}

		if(await db.alliance.hasBeenInvited(currPlayer.name, allyId)) {
			if(choice) {
				await Alliances.addPlayerToAlliance(currPlayer, allyId);

				log(currPlayer.name + ' accepted to join alliance "' + allyId + '.');

				Alliances.sendNotifToAllianceMembers(
					allyId,
					'ally_joined',
					{ playerName: currPlayer.name }
				);
			} else {
				log(currPlayer.name + ' refused to join alliance "' + allyId + '.');

				Alliances.sendNotifToAllianceStaff(
					allyId,
					'ally_refuse_join',
					{ playerName: currPlayer.name }
				);
			}

			await db.alliance.removeInvitations(currPlayer.name);

			currPlayer.ally = await db.alliance.find(currPlayer.ally);
		}

		Alliances.reSyncAllAllyMembers(allyId);
	}

	static async removeInvite(currPlayer, invitedPlayerName, allyId) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		log(invitedPlayerName + ' is no longer invited to join alliance "' + allyId + '" (removed by ' + currPlayer.name + ').');

		await db.alliance.removeInvitations(invitedPlayerName, allyId);

		Alliances.reSyncAllAllyMembers(allyId);
	}

	static async kick(currPlayer, targetPlayerName) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		const targetPlayer = await db.player.findByName(targetPlayerName);

		if(!(await Alliances.hasEnoughRightsOnTarget(currPlayer.id, targetPlayer.id))) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		log(targetPlayerName + ' was kicked from its alliance by ' + currPlayer.name);

		await Alliances.removePlayerFromAlliance(targetPlayer);

		Alliances.reSyncAllAllyMembers(currPlayer.ally);

		Alliances.sendNotifToAllianceMembers(
			currPlayer.ally,
			'ally_member_kicked',
			{ playerName: targetPlayerName, staffName: currPlayer.name }
		);

		const currAlly = await db.alliance.find(currPlayer.ally);
		Websocket.sendNotification(
			currPlayer.sid,
			'ally_kicked',
			{ name: currAlly.name, staffName: currPlayer.name }
		);

		Alliances.sendToPlayer(currPlayer);
	}

	static async editPermissions(currPlayer, targetPlayerName, founder, leader, diplomacy) {
		if((founder + leader + diplomacy) > 1) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_INVALID_PLAYER_PERMISSIONS'
			});
			return;
		}

		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		if((founder || leader) && !(await Alliances.hasFounderPermissions(currPlayer.id))) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		const targetPlayer = await db.player.findByName(targetPlayerName);

		if(!(await Alliances.hasEnoughRightsOnTarget(currPlayer.id, targetPlayer.id))) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
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

		const currAlly = await db.alliance.find(currPlayer.ally);
		Websocket.sendNotification(
			currPlayer.sid,
			'ally_newPerms',
			{}
		);
	}

	static async edit(currPlayer, newName, newDescription) {
		if(!(await Alliances.hasLeaderPermissions(currPlayer.id))) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		log(currPlayer.name + ' edited its alliance (' + newName + ', ' + newDescription + ')');

		await db.alliance.update(currPlayer.ally, newName, newDescription);

		Alliances.reSyncAllAllyMembers(currPlayer.ally);

		Alliances.sendNotifToAllianceMembers(
			currPlayer.ally,
			'ally_edited',
			{ playerName: currPlayer.name }
		);
	}

	static async leave(currPlayer, plyId) {
		if(await Alliances.hasFounderPermissions(plyId)) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		log(plyId + ' left its alliance.');

		const targetPlayer = await db.player.find(plyId);

		await Alliances.removePlayerFromAlliance(targetPlayer);

		Alliances.reSyncAllAllyMembers(targetPlayer.ally);

		Alliances.sendNotifToAllianceMembers(
			currPlayer.ally,
			'ally_member_leaved',
			{ playerName: currPlayer.name }
		);

		Alliances.sendToPlayer(currPlayer);
	}

	static async dissolve(currPlayer, plyId, allyId) {
		if(!(await Alliances.hasFounderPermissions(plyId))) {
			Websocket.SendMessageToClient({
				sid: currPlayer.sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		log(allyId + ' was dissolved.');

		await Alliances.sendNotifToAllianceMembers(
			allyId,
			'ally_dissolved',
			{ }
		);

		db.alliance.delete(allyId);

		Alliances.sendToPlayer(currPlayer);
	}

	static async askToPact(sid, plyId, allyId, otherAllyName) {
		if(!(await Alliances.hasDiplomacyPermissions(plyId))) {
			Websocket.SendMessageToClient({
				sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		const currAlly = await db.alliance.find(allyId);
		const alliance = await db.alliance.findByName(otherAllyName);

		if(!alliance) {
			Websocket.SendMessageToClient({
				sid,
				message: 'ALLIANCE_DOES_NOT_EXISTS'
			});
			return;
		}

		if(allyId === alliance.id) {
			Websocket.SendMessageToClient({
				sid,
				message: 'ALLIANCE_ERR_SAME_ALLY'
			});
			return;
		}

		await db.alliance.askPact(allyId, alliance.id);

		log(allyId + ' asked to pact with alliance ' + otherAllyName);

		Alliances.reSyncAllAllyMembers(allyId);
		Alliances.reSyncAllAllyMembers(alliance.id);

		Alliances.sendNotifToAllianceStaff(
			alliance.id,
			'ally_askToPact',
			{ name: currAlly.name }
		);
	}

	static async pactChoice(sid, plyId, allyId, otherAllyId, choice) {
		if(!(await Alliances.hasDiplomacyPermissions(plyId))) {
			Websocket.SendMessageToClient({
				sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		const currAlly = await db.alliance.find(allyId);
		const otherAlly = await db.alliance.find(otherAllyId);

		if(choice) {
			await db.alliance.acceptPact(allyId, otherAllyId);
			log(allyId + ' accepted pact with ' + otherAllyId);

			Alliances.sendNotifToAllianceStaff(
				currAlly.id,
				'ally_newPact',
				{ name: otherAlly.name }
			);

			Alliances.sendNotifToAllianceStaff(
				otherAlly.id,
				'ally_newPact',
				{ name: currAlly.name }
			);
		} else {
			await db.alliance.removePact(allyId, otherAllyId);
			log(allyId + ' refused pact with ' + otherAllyId);

			Alliances.sendNotifToAllianceStaff(
				currAlly.id,
				'ally_refusedPact',
				{ name: otherAlly.name }
			);

			Alliances.sendNotifToAllianceStaff(
				otherAlly.id,
				'ally_newPact',
				{ name: currAlly.name }
			);
		}

		Alliances.reSyncAllAllyMembers(allyId);
		Alliances.reSyncAllAllyMembers(otherAllyId);
	}

	static async cancelPactInvitation(sid, plyId, allyId, otherAllyId) {
		if(!(await Alliances.hasDiplomacyPermissions(plyId))) {
			Websocket.SendMessageToClient({
				sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		log(allyId + ' cancelled pact invitation with alliance ' + otherAllyId);

		await db.alliance.removePact(allyId, otherAllyId);

		Alliances.reSyncAllAllyMembers(allyId);
		Alliances.reSyncAllAllyMembers(otherAllyId);
	}

	static async stopPact(sid, plyId, allyId, otherAllyId) {
		if(!(await Alliances.hasDiplomacyPermissions(plyId))) {
			Websocket.SendMessageToClient({
				sid,
				message: 'ALLIANCE_NOT_ENOUGH_RIGHTS'
			});
			return;
		}

		log(allyId + ' stopped pact with alliance ' + otherAllyId);

		await db.alliance.removePact(allyId, otherAllyId);

		Alliances.reSyncAllAllyMembers(allyId);
		Alliances.reSyncAllAllyMembers(otherAllyId);

		// Notify them
		const currAlly = await db.alliance.find(allyId);
		const otherAlly = await db.alliance.find(otherAllyId);

		Alliances.sendNotifToAllianceStaff(
			currAlly.id,
			'ally_stopPact',
			{ name: otherAlly.name, otherStopped: false }
		);

		Alliances.sendNotifToAllianceStaff(
			otherAlly.id,
			'ally_stopPact',
			{ name: currAlly.name, otherStopped: true }
		);
	}
};
