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

		await db.player.joinAlly(
			userData.id,
			allyId
		);

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
		// @TODO: check if is leader

		if(await db.alliance.askedToJoin(playerName, currPlayer.ally)) {
			const playerData = await db.player.findByName(playerName);

			if(choice) {
				await db.player.update({
					id: playerData.id,
					ally: currPlayer.ally,
				});

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
		// @TODO: check if is leader

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
				await db.player.update({
					id: currPlayer.id,
					ally: allyId,
				});

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
};
