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
		const allyId = await db.alliance.create({
			name,
			description,
		});

		await db.player.joinAlly(
			userData.id,
			allyId
		);

		log(userData.name + ' has created an new alliance named "' + name + '".');

		Alliances.sendToPlayer(userData);
	}

	static async askToJoin(playerName, allyId) {
		db.alliance.askToJoin(playerName, allyId);
	}

	static async choiceAskToJoin(currPlayer, playerName, choice) {
		if(await db.alliance.askedToJoin(playerName, currPlayer.ally)) {
			const playerData = await db.player.findByName(playerName);

			if(choice) {
				await db.player.update({
					id: playerData.id,
					ally: currPlayer.ally,
				});
			}

			await db.alliance.removeJoinAsk(playerName);

			playerData.ally = await db.alliance.find(playerData.ally);

			Alliances.sendToPlayer(playerData);
		}
	}

	static async invite(playerName, allyId) {
		db.alliance.invite(playerName, allyId);
	}

	static async choiceInvite(currPlayer, allyId, choice) {
		if(await db.alliance.hasBeenInvited(currPlayer.id, allyId)) {
			if(choice) {
				await db.player.update({
					id: currPlayer.id,
					ally: allyId,
				});
			}

			await db.alliance.removeInvitations(currPlayer.name);

			currPlayer.ally = await db.alliance.find(currPlayer.ally);

			Alliances.sendToPlayer(currPlayer);
		}
	}
};
