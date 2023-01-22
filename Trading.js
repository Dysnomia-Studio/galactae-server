module.exports = class Trading extends require('./_shared/Trading')._Trading {
	static async syncPlayer(plyId, sid) {
		if(sid === null || sid === '-1') {
			return;
		}

		io.to(sid).emit(
			'trading-list',
			await db.trading.findAll(plyId)
		);
	}
};
