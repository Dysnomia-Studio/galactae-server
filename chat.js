var db = require('./database');
var discord = require('./discord');
discord.connect();

module.exports = function() {
	this.chatAnalyse = function(data) {
		var reg=new RegExp("[ ,;]+", "g");
		var arg=data.message.split(reg);
		data.message = textToSmileys(data.message);
		logname = data.username;
		logmsg = data.message;

		/* Controles de securité */
		data.send = true;
		data = chatprotect(data);

		/* Prepare message */
		if(data.send) {
			// Chat Commands
			if(data.lvl>3 &&data.message.charAt(0)=="!") {
				data = chatSendCommand(data);
			} else if(data.message.charAt(0)=="@") { // Messages privés
				db.player.searchByName(arg[0].substr(1).toLowerCase(), function(dataReturned) {
					if(dataReturned==undefined) { return; }
					var sid = dataReturned.sid;

					/* Ajout de la div d'utilisateur */
					data.username = "<span class=\"username\">" + data.username + "</span>";

					/* Rank before name */
					if(data.lvl>3) {
						data.username = "[ADMIN] "+ data.username;
					}
					else if(data.lvl>2) {
						data.username = "[STAFF] "+ data.username;
					}

					/* Recuperer le vrai message */
					data.newmessage = data.message.substr(arg[0].length+1);
					data.message = arg[0] + ": " + data.message.substr(arg[0].length+1)

					/* Envoyer le PM */
					if(sid!=undefined && sid!="-1" && data.newmessage!="" && sid!=data.sid) {
						sendPM(data.sid,data.message,false);
						sendPM(sid,data.username + ": " + data.newmessage,true);
					} else if(arg[0].substr(1).toLowerCase()==data.username) {
						sendSM(data.sid,"NO_PM_YOU");
					} else if(sid==undefined||sid!="-1") {
						sendSM(data.sid,"PLY_NOT_FOUND");
					}
				});

				data.send = false;
			} else { // Chat Normal messages
			    var discordmsg = data.username + ": " + data.message;

			    /* Ajout de la div d'utilisateur */
				data.username = "<span class=\"username\">" + data.username + "</span>";

				/* Rank before name */
				if(data.lvl>3) {
					data.username = "<span class=\"staff\">[ADMIN] "+ data.username +"</span>";
				}
				else if(data.lvl>2) {
					data.username = "<span class=\"staff\">[STAFF] "+ data.username +"</span>";
				}

				if(!data.noname) {
					data.message = "<strong>"+ data.username +" :</strong> "+ data.message;
				}
			}

		}

		// If the message is empty, don't send it ...
		if(data.message=="" || !isset(data.message)) { 
			data.send = false;
		}

		// Log
		if(data.send) {
			log('[' + data.channel.substr(9) + '] '+logname+': ' +logmsg);
		} else {
			log('(Blocked) [' + data.channel.substr(9) + '] '+logname+': ' +logmsg);
		}

	    if(data.send && data.channel !="hud-chat-ally") { // Normal chat
        	io.emit('chat-message', { message: data.message, channel: data.channel });
        	discord.sendChatMessage(data.channel,discordmsg);
    	} else if(data.send && data.channel =="hud-chat-ally" && data.ally!=undefined) { // Allies messages
    		// @ ADD : Ally messages
    	}
	}
	this.chatprotect = function(data) {
		str = data.message;

		var replace = [
			['<',''],
			['>',''],
			['( . ) ( . )',''],
			['(.)(.)',''],
		];

		for(var i=0; i<replace.length; i++) {
			str = str.split(replace[i][0]).join(replace[i][1])
		}

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
        if(str!=str.replace('http://','') || str!=str.replace('https://','') || str!=str.replace('www.','')) {
        	data.send = false;
        	sendSM(data.sid,"NO_LINKS");
        }

        data.message = str;

        return data;
	}
	this.chatSendCommand = function(data) {
		var str = data.message;
		var reg=new RegExp("[ ,;]+", "g");
		var arg=str.split(reg);
		var msg = "";
		data.noname = false;

		switch(arg[0]) {
			case "!asay":
				SendGeneralMessage(str.substr(6));
				data.send = false;
			break;
			case "!kickgame":
				db.player.searchByName(arg[1], function(dataReturned) {
					var sid = dataReturned.sid;

					if(sid==undefined) {
						sendSM(data.sid,"PLY_NOT_FOUND");
						console.log("Player not found");
					} else {	
						console.log("Kicked " + arg[1]);
	        			sendSM(data.sid,"Kicked " + arg[1]);

						io.to(sid).emit('server-kick',str.substr(arg[0].length+arg[1].length+1));
					}
				});
				
				data.send = false;
			break;
			// @ADD: Ban
			case "!maintenance":
				io.emit('server-maintenance');
				msg = "MAINTENANCE";
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