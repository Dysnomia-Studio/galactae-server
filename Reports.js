module.exports = class Reports extends require('./_shared/Reports')._Reports {
	/**
	 * Refresh player reports list and send it to him
	 *
	 * @param      {string}   plyId   The player identifier
	 * @param      {string}   sid     The socket identifier
	 * @return     {Promise}
	 */
	static async refresh(plyId, sid) {
		if(sid === '-1') {
			return;
		}

		const result = await db.battleLogAccess.fetchByPlayer(plyId);

		io.to(sid).emit('player-report-list', result);
	}
};
