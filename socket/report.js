module.exports = function(socket) {
	// Ask a report
	socket.on('player-report-ask', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.reportId, 'string')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, async(user) => { // Verify identity
			const result = await db.battleLog.getFullBattleLog(data.reportId, data.id);

			io.to(data.sid).emit(
				'player-report-full',
				result
			);
		});
	});

	// Delete reports
	socket.on('player-report-delete', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.reports, 'array')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, async(user) => { // Verify identity
			await db.battleLogAccess.deleteReport(data.id, data.reports);

			Reports.refresh(data.id, data.sid);
		});
	});

	// Set reports as read
	socket.on('player-report-set-read', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.reports, 'array')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, async(user) => { // Verify identity
			await db.battleLogAccess.setReadStatus(data.id, data.reports, true);

			Reports.refresh(data.id, data.sid);
		});
	});

	// Set reports as unread
	socket.on('player-report-set-unread', (data) => {
		// Vars
		if(!isset(data, 'object') || !isset(data.id, 'string') || !isset(data.username, 'string') || !isset(data.reports, 'array')) {
			return;
		}

		// User
		data.sid = socket.id;
		Player.isValid(data, async(user) => { // Verify identity
			await db.battleLogAccess.setReadStatus(data.id, data.reports, false);

			Reports.refresh(data.id, data.sid);
		});
	});
};
