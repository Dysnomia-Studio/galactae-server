var db = require('./database');

module.exports = function() {
	this.chatAnalyse = function(data) {
		var reg=new RegExp("[ ,;]+", "g");
		var arg=data.message.split(reg);

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
						sendPM(data.sid,"NO_PM_YOU",false);
					} else if(sid==undefined||sid!="-1") {
						sendSM(data.sid,"PLY_NOT_FOUND");
					}
				});

				data.send = false;
			} else { // Chat Normal messages
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

	    if(data.send && data.channel !="hud-chat-ally") { // Normal chat
        	io.emit('chat-message', data);
    	} else if(data.send && data.channel =="hud-chat-ally" && data.ally!=undefined) { // Allies messages
    		// @ ADD : Ally messages
    	}
	}
	this.chatprotect = function(data) {
		str = data.message;

		/* Suppression des balises html */
        str = str.replace('<','');
        str = str.replace('>','');

        /* Can the player send a message ? */
        if(data.lvl<2) {
        	data.send = false;
        	sendSM(data.sid,"NO_PERM");
        	// Kick it ...
        	io.to(data.sid).emit('server-kick');
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