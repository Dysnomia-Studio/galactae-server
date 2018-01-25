// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = '***REMOVED***';

module.exports = {
	/**
	 * Connect to discord server, and listen messages
	 */
	connect: function(callback) {
		client.login(token);

		client.on('ready', function() {
			log('Connected to discord server bot');
			client.user.setActivity('Galactae: Space Age Dawn');
		});

		client.on('message', function(message) {
			if(message.author.username=="servers-chat") { return; }
			if(message.channel.name.substr(0,globalCfg["serverName"].length)==globalCfg["serverName"]) { // If it's a message for this server then send it to chat
				var msg = message.cleanContent;
				if(msg!=msg.replace('http','')) { return; }
				if(msg.length==0) { return; }

				var channel = "hud-chat-" + message.channel.name.substr((globalCfg["serverName"].length+1),message.channel.name.length);

				var data = {};
				data.channel = channel;
				data.username = "[Discord] <span class=\"username no-pm\">" + message.author.username + ": </span>";
				data.message = "<strong>"+ data.username +" :</strong> "+ msg;

				log('(Discord) [' + channel.substr(9) + '] '+message.author.username+': ' +msg);
				
				io.emit('chat-message',{ message: data.message, channel: data.channel });
			}
		});
	},
	/**
	 * Transmit a message to discord
	 *
	 * @param      {string}  channelName  The channel name
	 * @param      {string}  message      The message
	 */
	sendChatMessage: function(channelName,message) {
		channelName = globalCfg["serverName"] + "-" + channelName.substr(9);
		var channel = client.channels.find('name',channelName);
		channel.send(unNormalizeText(message));
	},
	/**
	 * Alert something on discord global chat of this server
	 *
	 * @param      {string}  message  The message
	 */
	alert: function(message) {
		var channelName = globalCfg["serverName"] + "-global";
		var channel = client.channels.find('name',channelName);
		channel.send("[SYSTEM MESSAGE] " + unNormalizeText(message));
	},
}