module.exports = {
	save: async(battleLog, players) => {
		try {
			await serverClient.query('BEGIN');

			let battleLogId = await serverClient.query('INSERT INTO "battleLog" ' +
				'(atk_user_id, atk_user_name, def_user_id, def_user_name, atk_fleet_id, atk_fleet_name, date, location, "defWins", "atkFleets", "defFleets") ' +
				'VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ' +
				'RETURNING "battleLog_id"',
			[battleLog.atk_user_id, battleLog.atk_user_name, battleLog.def_user_id, battleLog.def_user_name, battleLog.atk_fleet_id, battleLog.atk_fleet_name, battleLog.date, battleLog.location, battleLog.defWins, battleLog.atkFleets, battleLog.defFleets]
			);
			battleLogId = battleLogId.rows[0].battleLog_id;

			if(battleLog.logs.length > 0) {
				let battleLogActions = 'INSERT INTO "battleLogActions" ' +
					'("battleLog_id", "battleLog_ActionId", "fleetSource", "fleetDestination", "fleetDestinationId", "unitSource", "unitDestination", "unitDestinationId", damage, details) ' +
					'VALUES';

				let battleLogActionsParameters = [];
				let battleLogActionsId = 0;

				for(const currLogId in battleLog.logs) {
					const currLog = battleLog.logs[currLogId];

					battleLogActions += '($' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + ',$' + ++battleLogActionsId + '),';

					battleLogActionsParameters = battleLogActionsParameters.concat([
						battleLogId,
						currLogId,
						currLog.fleetSource,
						currLog.fleetDestination,
						currLog.fleetDestinationId,
						currLog.unitSource,
						currLog.unitDestination,
						currLog.unitDestinationId,
						currLog.damage,
						currLog.details,
					]);
				}

				battleLogActions = battleLogActions.substring(0, battleLogActions.length - 1);

				await serverClient.query(battleLogActions, battleLogActionsParameters);
			}

			await db.battleLogAccess.add(
				battleLogId,
				players
			);

			await serverClient.query('COMMIT');

			return battleLogId;

		} catch(err) {
			log(err, 'error');
			await serverClient.query('ROLLBACK');
		}
	},

	getFullBattleLog: async(battleLogId, userId) => {
		try {
			const access = (await serverClient.query(
				'SELECT "battleLogId", "read" FROM public."battleLogAccess" WHERE "battleLogId" = $1 AND "userId" = $2',
				[battleLogId, userId])).rows;

			// Check rights & battleLog exists
			if(access.length === 0) {
				return [];
			}

			const battleLog = (await serverClient.query(
				'SELECT * FROM "battleLog" WHERE "battleLog_id" = $1', [battleLogId]
			)).rows[0];

			battleLog.logs = (await serverClient.query(
				'SELECT "fleetSource", "fleetDestination", "fleetDestinationId", "unitSource", "unitDestination", "unitDestinationId", damage, details FROM "battleLogActions" WHERE "battleLog_id" = $1', [battleLogId]
			)).rows;

			serverClient.query('UPDATE public."battleLogAccess" SET read = true WHERE "battleLogId" = $1 AND "userId" = $2', [battleLogId, userId]);

			return battleLog;
		} catch(err) {
			log(err, 'error');
		}
	},
};
