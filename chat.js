var db = require('./database');
var discord = require('./discord');
discord.connect();

module.exports = function() {
	this.chatAnalyse = function(data) {
		db.userGameId.find(data.id, function(userGameIdObj) {
			db.privilege.find(userGameIdObj[0].user_id, function(userPrivileges) {
				var reg=new RegExp("[ ,;]+", "g");
				var args=data.message.split(reg);
				data.message = textToSmileys(data.message);

				logname = data.username;
				logmsg = data.message;

				/* Controles de securité */
				data.send = true;
				console.info(userPrivileges);
				data.lvl = userPrivileges.user_privilege_lvl;
				data = chatprotect(data);

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
				var rank = "";
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

				var discordmsg = rank + data.username + ": " + data.message;
				data.username = "<span class=\"username\">" + data.username + "</span>";

				console.log(data.lvl);

				if(data.message.charAt(0)=="!" && data.lvl > 1) {
					data = chatSendCommand(data);
				} else if(data.message.charAt(0)=="@") { // Messages privés
					db.player.searchByName(args[0].substr(1).toLowerCase(), function(dataReturned) {
						if(dataReturned==undefined) { return; }
						var sid = dataReturned.sid;

						/* Recuperer le vrai message */
						data.newmessage = data.message.substr(args[0].length+1);
						data.message = args[0] + ": " + data.message.substr(args[0].length+1)

						/* Envoyer le PM */
						if(sid!=undefined && sid!="-1" && data.newmessage!="" && sid!=data.sid) {
							sendPM(data.sid,data.message,false);
							sendPM(sid,data.username + ": " + data.newmessage,true);
						} else if(args[0].substr(1).toLowerCase()==data.username) {
							sendSM(data.sid,"NO_PM_YOU");
						} else if(sid==undefined || sid!="-1") {
							sendSM(data.sid,"PLY_NOT_FOUND");
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
		    		// @ ADD : Ally messages
		    	}

			});
		});
	}
	this.chatprotect = function(data) {
		str = data.message;

		var replace = [
			['( . ) ( . )',''],
			['(.)(.)',''],
		];

		for(var i=0; i<replace.length; i++) {
			str = str.split(replace[i][0]).join(replace[i][1])
		}
		str = normalizeText(str);

		// Si message vide
		var empty = true;
		for(var i=0; i<str.length; i++) {
			if(str[i]!=" ") {
				empty = false
			 	break;
			}
		}	
		if(empty) { data.send = false; }

        /* Can the player send a message ? */
        if(data.lvl<2) {
        	data.send = false;
        	sendSM(data.sid,"NO_PERM");
        	// Kick it ...
        	io.to(data.sid).emit('server-kick');
        }
        /* Disable links */
        if(str!=str.replace('://','') || str!=str.replace('www.','')) {
        	data.send = false;
        	sendSM(data.sid,"NO_LINKS");
        }

        data.message = str;

        return data;
	}
	this.chatSendCommand = function(data) {
		var str = data.message;
		var reg=new RegExp("[ ,;]+", "g");
		var args=str.split(reg);
		var msg = "";
		data.noname = false;

		switch(args[0]) {
			case "!asay":
				SendGeneralMessage(str.substr(6));
				data.send = false;
				break;
			case "!kick":
				if(data.lvl<3) { return; } // Admin & Operators only
				
				db.player.searchByName(args[1], function(dataReturned) {
					if(!isset(dataReturned) || !isset(dataReturned.sid)) {
						sendSM(data.sid,"PLY_NOT_FOUND");
						console.log("Player not found");
					} else {	
						console.log("Kicked " + args[1]);
	        			sendSM(data.sid,"Kicked " + args[1]);

						io.to(dataReturned.sid).emit('server-kick',str.substr(args[0].length+args[1].length+1));
					}
				});
				
				data.send = false;
				break;
			case "!chatkick":
				// @ADD: Chat kick
				break;
			case "!ban":
				if(data.lvl<3) { return; } // Admin & Operators only
				// @ADD: Ban
				break;
			case "!chatban":
				// @ADD: Chat ban
				break;
			case "!maintenance":
				if(data.lvl<4) { return; } // Admin only
				io.emit('server-maintenance');
				msg = "MAINTENANCE";
				maintenance = true;
				data.noname = true;
			break;
			case "!help":
				sendSM(data.sid,"HELP");
				data.send = false;
			break;
			default:
				sendSM(data.sid,"COMMAND_NOT_FOUND");
				data.send = false;
		}

		data.message = msg;

		return data; // Needed For some commands ...
	}
	/* send private message to a specific player */
	this.sendPM = function(sid,msg,sound) {
		io.to(sid).emit("chat-message-private", {msg: msg,sound: sound});
	}
	/* send system message to a specific player */
	this.sendSM = function(sid,msg) {
		io.to(sid).emit("chat-message-system", msg);
	}
}