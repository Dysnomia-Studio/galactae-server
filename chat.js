module.exports = class Chat {
	static async analyse(data) {
		const userGameIdObj = await db.userGameId.find(data.id);

		data.game_id = userGameIdObj.game_id;
		data.user_id = userGameIdObj.user_id;

		Privileges.isBannedFromChat(data.game_id, async(banned) =>{
			if(banned) {
				Chat.sendSM(data.sid,'ERR_CHAT_BANNED');
				return;
			}

			const userPrivileges = await db.privilege.find(data.user_id);

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

			const discordmsg = '**' + rank + data.username + ':** ' + data.message;
			data.username = '<span class="username">' + data.username + '</span>';

			if(data.message.charAt(0) === '!' && data.lvl > 1) {
				data = await Chat.sendCommand(data);
			} else if(data.message.charAt(0) === '@') { // Messages privés
				const words = data.message.split(new RegExp('[ ,;]+', 'g'));

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
					data.message = '<strong>'+ data.username + ' :</strong> '+ data.message;
				}
			}

			if(!data.send) {
				log('(Blocked) [' + data.channel.substr(9) + '] ' + logname + ': ' + logmsg);
				return;
			}
			if(data.message === '' || !isset(data.message, 'string')) {
				return;
			}

			if(data.channel !== 'hud-chat-ally') { // Normal chat
				log('[' + data.channel.substr(9) + '] ' + logname + ': ' + logmsg);
				io.emit('chat-message', { message: data.message, channel: data.channel });
				Discord.sendChatMessage(data.channel,discordmsg);
			} else { // Allies messages
				let ally = data.ally;
				if(!data.ally) {
					data.ally = null;
					ally = 'N/A';
				}

				log('[' + data.channel.substr(9) + ' / ' + ally + '] '+logname+': ' +logmsg);

				const allyMembers = (await db.player.findByAlly(data.ally))
					.filter((ply) => ply.sid !== '-1');

				for(const member of allyMembers) {
					io.to(member.sid).emit('chat-message', { message: data.message, channel: data.channel });
				}
			}
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
	 */
	static async searchTarget(currUser, name) {
		const dataReturned = await db.player.findByName(name);

		if(!isset(dataReturned, 'object') || !isset(dataReturned.sid, 'string')) {
			Chat.sendSM(currUser.sid,'PLY_NOT_FOUND');
			log('Player not found');
		} else {
			const targetGameIdObj = await db.userGameId.find(dataReturned.id);
			const targetPrivileges = await db.privilege.find(targetGameIdObj.user_id);

			let targetLvl = 1;
			if(isset(targetPrivileges[0], 'object') && isset(targetPrivileges[0].user_privilege_lvl, 'number')) {
				targetLvl = targetPrivileges[0].user_privilege_lvl;
			}

			if(currUser.lvl > targetLvl) {
				return dataReturned;
			} else {
				Chat.sendSM(currUser.sid,'PERMISSION_DENIED');
				log('Permission denied');
			};
		}
	}

	/**
	 * Chat commands calls
	 */
	static async sendCommand(data) {
		const str = data.message;
		const args=str.split(new RegExp('[ ,;]+', 'g'));
		const msg = '';
		let target;

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

				target = await Chat.searchTarget(data, args[1]);

				if(target) {
					const banMessage = args.splice(3,args.length).join(' ');
					const banTime = parseChatTime(args[2]);
					if(banTime < 1) {
						log('Invalid Time');
						return;
					}
					const now = new Date();

					log('Banned ' + banTime/TIME.SECONDS_TO_MS + ' seconds (' + args[2] + ') ' + target.name + ' for reason: ' + banMessage);
					Chat.sendSM(data.sid,'Banned ' + banTime/TIME.SECONDS_TO_MS + ' seconds (' + args[2] + ') ' + target.name + ' for reason: ' + banMessage);

					await db.ban.create({
						user_id: target.id,
						server_name: globalCfg.serverGlobalName,
						ban_type: 2,
						ban_start: now,
						ban_end: new Date(now.getTime() + banTime),
						ban_reason: banMessage,
						admin_id: data.user_id,
					});

					io.to('' + target.sid).emit('server-kick', banMessage);

					target.sid = -1;
					await db.player.update(target);
				}
				break;
			case '!mute':
				if(args.length<4) {
					return data;
				}

				target = await Chat.searchTarget(data, args[1]);

				if(target) {
					const muteMessage = args.splice(3,args.length).join(' ');
					const muteTime = parseChatTime(args[2]);
					if(muteTime < 1) {
						log('Invalid Time');
						return;
					}
					const now = new Date();

					log('Muted ' + muteTime/TIME.SECONDS_TO_MS + ' seconds (' + args[2] + ') ' + target.name + ' for reason: ' + muteMessage);
					Chat.sendSM(data.sid,'Muted ' + muteTime/TIME.SECONDS_TO_MS + ' seconds (' + args[2] + ') ' + target.name + ' for reason: ' + muteMessage);

					await db.ban.create({
						user_id: target.id,
						server_name: globalCfg['serverGlobalName'],
						ban_type: 1,
						ban_start: now,
						ban_end: new Date(now.getTime() + muteTime),
						ban_reason: muteMessage,
						admin_id: data.user_id,
					});

					io.to(target.sid).emit('chat-mute', {muteTime: muteTime, message: muteMessage});
				}
				break;
			case '!maintenance':
				if(data.lvl<4) { // Admin only
					break;
				}
				Websocket.beginMaintenance();
				data.send = true;
				break;
			case '!help':
				let maintenance = '';

				if(data.lvl >= 4) {
					maintenance = '<li><b>!maintenance</b> Begins a maintenance</li>';
				}

				Chat.sendSM(data.sid,'Admin/Staff Commands:' +
					'<ul>' +
					'<li><b>!help</b> Display this help</li>' +
					'<li><b>!ban target time reason</b> Ban a player from the game</li>' +
					'<li><b>!mute target time reason</b> Mute a player from the chat</li>' +
					maintenance +
					'<li><b>!asay message</b> Create a system mewssage</li>' +
					'</ul>');
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
