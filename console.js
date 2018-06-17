module.exports = function() {
	this.errorFile = fs.createWriteStream('../galactae.error.log', { flags: 'a' });
	process.stderr.pipe(this.errorFile);
	this.logFile = fs.createWriteStream('../galactae.log', { flags: 'a' });

	/**
	 * Color a text
	 *
	 * @param      {string}  string  The text to log
	 * @return     {string}  text		The colored text
	 */
	this.redText = function(str) {
		return '\u001b[31m' + str + '\u001b[39m';
	};
	this.greenText = function(str) {
		return '\u001b[32m' + str + '\u001b[39m';
	};
	this.yellowText = function(str) {
		return '\u001b[33m' + str + '\u001b[39m';
	};
	this.blueText = function(str) {
		return '\u001b[36m' + str + '\u001b[39m';
	};

	/**
	 * Write something in console
	 *
	 * @param      {string}  msg     	The text to log
	 * @param      {string}             type    The type of text (for color)
	 * @param      {boolean}            nodate  Activate the date log ?
	 */
	this.log = function (msg,type,nodate) {
		let text = msg;
		switch(type) {
			case "warn":
				text = redText('WARNING:') + yellowText(text);
				break;
			case "error":
				text = redText('ERROR:') + redText(text);
				break;
			case "fail":
				text = yellowText(text);
				break;
			case "success":
				text = blueText(text);
				break;
			case "info":
				text = greenText(text);
				break;
			default:
		}
		if(nodate==false||nodate==undefined) { text = logdate() + " " + text;}

		console.log(text);
		io.to(adminSid).emit('server-log', getDateTime() + " " + msg);
		logFile.write(getDateTime() + " " + msg + "\n");
	};

	/**
	 * Retourner la date en jaune
	 *
	 * @return     {string}  text		Date en jaune
	 */
	this.logdate = function() {
		return yellowText(getDateTime());
	};
};