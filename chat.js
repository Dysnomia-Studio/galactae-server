module.exports = function() {
	this.chatAnalyse = function(data) {
		/* Controles de securité */
		data.send = true;
		data = chatprotect(data);

		if(data.send) {
			// Chat Commands
			if(data.lvl>3 &&data.message.charAt(0)=="!") {
				data = chatSendCommand(data);
			}

			// Chat Normal messages
			if(data.message.charAt(0)!="!") {
				if(data.lvl>3) {
					data.username = "<span style=\"color: #b0291b;\">[ADMIN] "+ data.username +"</span>";
				}
				else if(data.lvl>2) {
					data.username = "<span style=\"color: #b0291b;\">[STAFF] "+ data.username +"</span>";
				}

				if(!data.noname) {
					data.message = "<strong>"+ data.username +" :</strong> "+ data.message;
				}
			}
		}

		// If the message ( or protected message ) is empty, don't send it ...
		if(data.message=="" && message.length > 0) { 
			data.send = false;
		}

	    if(data.send) {
        	io.emit('chat-message', data);
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
        	// @ADD MP to user to say he can't send a message because ...
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
				msg = "<span style=\"color: #d35400;\">SERVER_ALERT</span> "+str.substr(6);
				data.noname = true;
			break;
			case "!kickgame":
				// @ Add: return id with name ( arg[1] )
				// socket: server-kick
				// @ Add: PM to the admin who kicked
				msg = "";
			break;
			case "!maintenance":
				io.emit('server-maintenance');
				msg = "MAINTENANCE";
				data.noname = true;
			break;
			case "!help":
				// @ Add: PM commands permitted to this user
				msg = "";
			break;
			default:
				// @ Add: PM to user command not found
				msg = "";
		}

		data.message = msg;

		return data; // Needed For some commands ...
	}
}