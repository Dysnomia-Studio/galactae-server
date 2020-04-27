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
			await db.conquest.setDone(conquest.planet);

			await db.planet.setOwner(conquest.planet, conquest.newOwner);

			await db.player.delPlanet(conquest.prevOwner, conquest.planet);
			await db.player.addPlanet(conquest.newOwner, conquest.planet);

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
