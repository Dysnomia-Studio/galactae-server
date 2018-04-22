module.exports = class chat {
	static analyse(data) {
		db.userGameId.find(data.id, function(userGameIdObj) {
			data.user_id = userGameIdObj[0].user_id;
			db.ban.find(data.user_id, 1, function(banObj) {
				if(isset(banObj)) {
					let now = Date.now();
					for(let i=0; banObj.length; banObj++) {
						if(banObj[i].ban_end < now) {
							chat.sendSM(data.sid,'ERR_CHAT_BANNED');
							return;
						}
					}
				}
				db.privilege.find(data.user_id, function(userPrivileges) {
					let reg=new RegExp("[ ,;]+", "g");
					let args=data.message.split(reg);
					data.message = textToSmileys(data.message);

					let logname = data.username;
					let logmsg = data.message;

					/* Controles de securité */
					data.send = true;

					if(isset(userPrivileges) && isset(userPrivileges[0]) && isset(userPrivileges[0].user_privilege_lvl)) {
						data.lvl = userPrivileges[0].user_privilege_lvl;
					} else {
						data.lvl = 1;
					}
					data = chat.protect(data);

					if(!data.send) { 
						log('(Blocked) [' + data.channel.substr(9) + '] '+logname+': ' +logmsg);
						return; 
					}

					/**
					 * Lvl:
					 * 1: member
					 * 2: moderator
					 * 3: operator
					 * 4: administrator
					 */
					let rank = "";
					switch(data.lvl) {
						case 2:
						case 3:
							rank = "[STAFF] ";
							break;
						case 4:
							rank = "[ADMIN] ";
							break;
						default:
					}

					let discordmsg = rank + data.username + ": " + data.message;
					data.username = "<span class=\"username\">" + data.username + "</span>";

					if(data.message.charAt(0)=="!" && data.lvl > 1) {
						data = chat.sendCommand(data);
					} else if(data.message.charAt(0)=="@") { // Messages privés
						db.player.searchByName(args[0].substr(1).toLowerCase(), function(dataReturned) {
							if(dataReturned==undefined) { return; }
							let sid = dataReturned.sid;

							/* Recuperer le vrai message */
							data.newmessage = data.message.substr(args[0].length+1);
							data.message = args[0] + ": " + data.message.substr(args[0].length+1)

							/* Envoyer le PM */
							if(sid!=undefined && sid!="-1" && data.newmessage!="" && sid!=data.sid) {
								chat.sendPM(data.sid,data.message,false);
								chat.sendPM(sid,data.username + ": " + data.newmessage,true);
							} else if(args[0].substr(1).toLowerCase()==data.username) {
								chat.sendSM(data.sid,"NO_PM_YOU");
							} else if(sid==undefined || sid!="-1") {
								chat.sendSM(data.sid,"PLY_NOT_FOUND");
							}
						});

						data.send = false;
					} else { // Normal messages
						data.username = "<span class=\"staff\">" + rank + " " + data.username + "</span>";

						if(!data.noname) {
							data.message = "<strong>"+ data.username +" :</strong> "+ data.message;
						}
					}

					if(!data.send) { 
						log('(Blocked) [' + data.channel.substr(9) + '] '+logname+': ' +logmsg);
						return; 
					}
					if(data.message=="" || !isset(data.message)) { return; }

				    if(data.channel !="hud-chat-ally") { // Normal chat
				    	log('[' + data.channel.substr(9) + '] '+logname+': ' +logmsg);
			        	io.emit('chat-message', { message: data.message, channel: data.channel });
			        	discord.sendChatMessage(data.channel,discordmsg);
			    	} else if(data.ally!=undefined) { // Allies messages
			    		log('[' + data.channel.substr(9) + '] '+logname+': ' +logmsg);
			    		// @ADD : Ally messages
			    	}

				});
			});
		});
	}
	static protect(data) {
		let str = data.message;

		let replace = [
			['( . )( . )',''],
			['( . ) ( . )',''],
			['(.) (.)',''],
			['(.)(.)',''],
		];

		for(let i=0; i<replace.length; i++) {
			str = str.split(replace[i][0]).join(replace[i][1])
		}
		str = normalizeText(str);

		// Si message vide
		let empty = true;
		for(let i=0; i<str.length; i++) {
			if(str[i]!=" ") {
				empty = false
			 	break;
			}
		}	
		if(empty) { data.send = false; }

        /* Disable links */
        if(str!=str.replace('://','') || str!=str.replace('www.','')) {
        	data.send = false;
        	chat.sendSM(data.sid,"NO_LINKS");
        }

        data.message = str;

        return data;
	}

	static searchTarget(currUser, name,callback) {
		db.player.searchByName(name, function(dataReturned) {
			if(!isset(dataReturned) || !isset(dataReturned.sid)) {
				chat.sendSM(currUser.sid,"PLY_NOT_FOUND");
				log("Player not found");
			} else {
				db.userGameId.find(dataReturned.id, function(targetGameIdObj) {
					db.privilege.find(targetGameIdObj[0].user_id, function(targetPrivileges) {
						let targetLvl = 1;
						if(isset(targetPrivileges[0]) && isset(targetPrivileges[0].user_privilege_lvl)) {
							targetLvl = targetPrivileges[0].user_privilege_lvl;
						}

						if(currUser.lvl > targetLvl) {
							callback(dataReturned);
						} else {
							chat.sendSM(currUser.sid,"PERMISSION_DENIED");
							log("Permission denied");
						}
					});
				});
			}
		});
	}
	static sendCommand(data) {
		let str = data.message;
		let reg=new RegExp("[ ,;]+", "g");
		let args=str.split(reg);
		let msg = "";
		data.noname = false;
		data.send = false;

		switch(args[0]) {
			case "!asay":
				websocket.SendGeneralMessage(str.substr(6));
				break;
			case "!ban":
				if(data.lvl<3) { return data; } // Admin & Operators only	
				if(args.length<4) { return data; }

				chat.searchTarget(data, args[1], function(target) {
					let banMessage = args.splice(3,args.length).join(" ");
					let banTime = parseChatTime(args[2]);
					if(banTime < 1) { log("Invalid Time"); return data; }
					let now = Date.now();

					log("Banned " + banTime + " seconds (" + args[2] + ") " + target.name + " for reason: " + banMessage);
					chat.sendSM(data.sid,"Banned " + banTime + " seconds (" + args[2] + ") " + target.name + " for reason: " + banMessage);

					db.ban.create({
						user_id: target.id,
						server_name: globalCfg["serverGlobalName"],
						ban_type: 2,
						ban_begin: now,
						ban_end: now + banTime,
						ban_reason: banMessage,
						admin: data.user_id
					});

					let sid = "" + target.sid;					
					io.to(sid).emit('server-kick', banMessage);

					target.sid = -1;
					db.player.update(target);
				});
				break;
			case "!mute":
				if(args.length<4) { return data; }

				chat.searchTarget(data, args[1], function(target) {
					let muteMessage = args.splice(3,args.length).join(" ");
					let muteTime = parseChatTime(args[2]);
					if(muteTime < 1) { log("Invalid Time"); return data; }
					let now = Date.now();

					log("Banned " + muteTime + " seconds (" + args[2] + ") " + target.name + " for reason: " + muteMessage);
					chat.sendSM(data.sid,"Banned " + muteTime + " seconds (" + args[2] + ") " + target.name + " for reason: " + muteMessage);

					db.ban.create({
						user_id: target.id,
						server_name: globalCfg["serverGlobalName"],
						ban_type: 1,
						ban_begin: now,
						ban_end: now + muteTime,
						ban_reason: muteMessage,
						admin: data.user_id
					});
					
					io.to(target.sid).emit('chat-mute', {muteTime: muteTime, message: muteMessage});
				});
				break;
			case "!maintenance":
				if(data.lvl<4) { return data; } // Admin only
				websocket.beginMaintenance();
				data.send = true;
			break;
			case "!help":
				chat.sendSM(data.sid,"HELP");
			break;
			default:
				chat.sendSM(data.sid,"COMMAND_NOT_FOUND");
		}

		data.message = msg;

		return data; // Needed For some commands ...
	}
	/* send private message to a specific player */
	static sendPM(sid,msg,sound) {
		io.to(sid).emit("chat-message-private", {msg: msg,sound: sound});
	}
	/* send system message to a specific player */
	static sendSM(sid,msg) {
		io.to(sid).emit("chat-message-system", msg);
	}
}