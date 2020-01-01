module.exports = class Chat {
	static analyse(data) {
		db.userGameId.find(data.id, (userGameIdObj) => {
			data.game_id = userGameIdObj.game_id;
			data.user_id = userGameIdObj.user_id;

			Privileges.isBannedFromChat(data.game_id, (banned) =>{
				if(banned) {
					Chat.sendSM(data.sid,'ERR_CHAT_BANNED');
					return;
				}

				db.privilege.find(data.user_id, (userPrivileges) =>{
					data.message = textToSmileys(data.message);

					const logname = data.username;
					const logmsg = data.message;

					/* Controles de securité */
					data.send = true;
					data.lvl = 1;

					if(isset(userPrivileges, 'array') && isset(userPrivileges[0], 'object') && isset(userPrivileges[0].user_privilege_lvl, 'number')) {
						data.lvl = userPrivileges[0].user_privilege_lvl;
					}

					data = Chat.protect(data);

					if(!data.send) {
						log('(Blocked) [' + data.channel.substr(9) + '] '+logname+': ' +logmsg);
						return;
					}

					const rank = Privileges.getChatRank(data.lvl);

					const discordmsg = rank + data.username + ': ' + data.message;
					data.username = '<span class="username">' + data.username + '</span>';

					if(data.message.charAt(0) === '!' && data.lvl > 1) {
						data = Chat.sendCommand(data);
					} else if(data.message.charAt(0) === '@') { // Messages privés
						const words =data.message.split(new RegExp('[ ,;]+', 'g'));

						const playerTarget = await db.player.findByName(words[0].substr(1).toLowerCase());

						if(!issert(playerTarget, 'object')) {
							return;
						}

						const sid = playerTarget.sid;

						/* Recuperer le vrai message */
						data.newmessage = data.message.substr(words[0].length+1);
						data.message = words[0] + ': ' + data.message.substr(words[0].length+1);

						/* Envoyer le PM */
						if(sid !== undefined && sid !== '-1' && data.newmessage !== '' && sid !== data.sid) {
							Chat.sendPM(data.sid,data.message,false);
							Chat.sendPM(sid,data.username + ': ' + data.newmessage,true);
						} else if(words[0].substr(1).toLowerCase() === data.username) {
							Chat.sendSM(data.sid,'NO_PM_YOU');
						} else if(sid === undefined || sid !== '-1') {
							Chat.sendSM(data.sid,'PLY_NOT_FOUND');
						}

						data.send = false;
					} else { // Normal messages
						if(data.lvl > 1) {
							data.username = '<span class="staff">' + rank + ' ' + data.username + '</span>';
						}

						if(!data.noname) {
							data.message = '<strong>'+ data.username +' :</strong> '+ data.message;
						}
					}

					if(!data.send) {
						log('(Blocked) [' + data.channel.substr(9) + '] '+logname+': ' +logmsg);
						return;
					}
					if(data.message === '' || !isset(data.message, 'string')) {
						return;
					}

					if(data.channel !== 'hud-chat-ally') { // Normal chat
						log('[' + data.channel.substr(9) + '] '+logname+': ' +logmsg);
						io.emit('chat-message', { message: data.message, channel: data.channel });
						Discord.sendChatMessage(data.channel,discordmsg);
					} else if(data.ally !== undefined) { // Allies messages
						log('[' + data.channel.substr(9) + '] '+logname+': ' +logmsg);
						// @TODO : Ally messages
					}

				});
			});
		});
	}

	/**
	 * Protect message content => No security issue, no links, no out-of-rules messages, etc
	 */
	static protect(data) {
		let str = data.message;
		if(!str) {
			str = '';
		}

		str = filterUnwantedChars(str);
		str = normalizeText(str);

		// Empty message
		if(str.split(' ').join('') === '') {
			data.send = false;
		}

		/* Disable links */
		if(str !== str.split('://').join('') || str !== str.split('www.').join('')) {
			data.send = false;
			Chat.sendSM(data.sid,'NO_LINKS');
		}

		data.message = str;

		return data;
	}

	/**
	 * Search target to be use in a chat command
	 *
	 * @param	  {object}	currUser  The current user
	 * @param	  {string}	name	  The target name
	 * @param	  {Function}  callback  Callback function
	 */
	static async searchTarget(currUser, name, callback) {
		const dataReturned = await db.player.findByName(name);

		if(!isset(dataReturned, 'object') || !isset(dataReturned.sid, 'string')) {
			Chat.sendSM(currUser.sid,'PLY_NOT_FOUND');
			log('Player not found');
		} else {
			db.userGameId.find(dataReturned.id, (targetGameIdObj) => {
				db.privilege.find(targetGameIdObj.user_id, (targetPrivileges) => {
					let targetLvl = 1;
					if(isset(targetPrivileges[0], 'object') && isset(targetPrivileges[0].user_privilege_lvl, 'number')) {
						targetLvl = targetPrivileges[0].user_privilege_lvl;
					}

					console.log(currUser.lvl);

					if(currUser.lvl > targetLvl) {
						callback(dataReturned);
					} else {
						Chat.sendSM(currUser.sid,'PERMISSION_DENIED');
						log('Permission denied');
					}
				});
			});
		}
	}

	/**
	 * Chat commands calls
	 */
	static sendCommand(data) {
		const str = data.message;
		const args=str.split(new RegExp('[ ,;]+', 'g'));
		const msg = '';

		data.noname = false;
		data.send = false;

		switch(args[0]) {
			case '!asay':
				Websocket.SendGeneralMessage(str.substr(6));
				break;
			case '!ban':
				if(data.lvl<3) { // Admin & Operators only
					return data;
				}
				if(args.length<4) {
					return data;
				}

				Chat.searchTarget(data, args[1], (target) => {
					const banMessage = args.splice(3,args.length).join(' ');
					const banTime = parseChatTime(args[2]);
					if(banTime < 1) {
						log('Invalid Time');
						return;
					}
					const now = Date.now();

					log('Banned ' + banTime/TIME.SECONDS_TO_MS + ' seconds (' + args[2] + ') ' + target.name + ' for reason: ' + banMessage);
					Chat.sendSM(data.sid,'Banned ' + banTime/TIME.SECONDS_TO_MS + ' seconds (' + args[2] + ') ' + target.name + ' for reason: ' + banMessage);

					db.ban.create({
						user_id: target.id,
						server_name: globalCfg.serverGlobalName,
						ban_type: 2,
						ban_begin: now,
						ban_end: now + banTime,
						ban_reason: banMessage,
						admin: data.user_id,
					});

					io.to('' + target.sid).emit('server-kick', banMessage);

					target.sid = -1;
					db.player.update(target);
				});
				break;
			case '!mute':
				if(args.length<4) {
					return data;
				}

				Chat.searchTarget(data, args[1], (target) => {
					const muteMessage = args.splice(3,args.length).join(' ');
					const muteTime = parseChatTime(args[2]);
					if(muteTime < 1) {
						log('Invalid Time');
						return;
					}
					const now = Date.now();

					log('Banned ' + muteTime + ' seconds (' + args[2] + ') ' + target.name + ' for reason: ' + muteMessage);
					Chat.sendSM(data.sid,'Banned ' + muteTime + ' seconds (' + args[2] + ') ' + target.name + ' for reason: ' + muteMessage);

					db.ban.create({
						user_id: target.id,
						server_name: globalCfg['serverGlobalName'],
						ban_type: 1,
						ban_begin: now,
						ban_end: now + muteTime,
						ban_reason: muteMessage,
						admin: data.user_id,
					});

					io.to(target.sid).emit('chat-mute', {muteTime: muteTime, message: muteMessage});
				});
				break;
			case '!maintenance':
				if(data.lvl<4) { // Admin only
					break;
				}
				Websocket.beginMaintenance();
				data.send = true;
				break;
			case '!help':
				Chat.sendSM(data.sid,'HELP'); // @TODO (admin/staff), no translation to be safe
				break;
			default:
				Chat.sendSM(data.sid,'COMMAND_NOT_FOUND');
		}

		data.message = msg;

		return data; // Needed For some commands ...
	}
	/* send private message to a specific player */
	static sendPM(sid,msg,sound) {
		io.to(sid).emit('chat-message-private', {msg: msg,sound: sound});
	}
	/* send system message to a specific player */
	static sendSM(sid,msg) {
		io.to(sid).emit('chat-message-system', msg);
	}
};
