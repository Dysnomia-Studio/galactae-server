module.exports = class Reports {
	static async refresh(plyId, sid) {
		if(sid === '-1') {
			return;
		}

		const result = await db.battleLogAccess.fetchByPlayer(plyId);

		io.to(sid).emit('player-report-list', result);
	}
};
