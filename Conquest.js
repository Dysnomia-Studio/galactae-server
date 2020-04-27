module.exports = class Conquest extends require('./_shared/Conquest')._Conquest {
	static async syncPlayer(plyId, sid) {
		io.to(sid).emit(
			'player-conquest-list',
			await db.conquest.getConquestsByPlayer(plyId)
		);
	}

	static async refresh(sid, plyId, pid='') {
		const conquestList = await db.conquest.getActiveConquestsByPlayer(plyId);
		let   lastUpdatedPlanet = pid;

		for(const conquest of conquestList) {
			const prevOwner = await db.player.findByName(conquest.prevplayer);
			const newOwner = await db.player.findByName(conquest.newplayer);

			await db.conquest.setDone(conquest.planet);

			await db.planet.setOwner(conquest.planet, newOwner.id);

			await db.player.delPlanet(prevOwner.id, conquest.planet);
			await db.player.addPlanet(newOwner.id, conquest.planet);

			// @TODO: notif

			lastUpdatedPlanet = conquest.planet;
		}

		Planet.refresh({
			sid,
			id: plyId,
			pid: lastUpdatedPlanet,
		});
	}
};
