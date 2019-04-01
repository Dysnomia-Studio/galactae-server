const charList = [
	// a
	['à','&agrave;'],
	['á','&aacute;'],
	['â','&acirc;'],
	['ã','&atilde;'],
	['ä','&auml;'],
	['å','&aring;'],
	['æ','&aelig;'],
	// c
	['ç','&ccedil;'],
	// e
	['è','&egrave;'],
	['é','&eacute;'],
	['ê','&ecirc;'],
	['ë','&euml;'],
	// i
	['ì','&igrave;'],
	['í','&iacute;'],
	['î','&icirc;'],
	['ï','&iuml;'],
	// n
	['ñ','&ntilde;'],
	// o
	['ò','&ograve;'],
	['ó','&oacute;'],
	['ô','&ocirc;'],
	['õ','&otilde;'],
	['ö','&ouml;'],
	// u
	['ù','&ugrave;'],
	['ú','&uacute;'],
	['û','&ucirc;'],
	['ü','&uuml;'],
	// y
	['ý','&yacute;'],
	['ÿ','&yuml;'],
	//math
	['÷','&divide;'],
	['×','&times;'],
	['±','&plusmn;'],
	['¼','&frac14;'],
	['½','&frac12;'],
	['¾','&frac34;'],
	['¹','&sup1;'],
	['²','&sup2;'],
	['³','&sup3;'],
	// others
	['€','&euro;'],
	['¢','&cent;'],
	['£','&pound;'],
	['ß','&szlig;'],
	['¿','&iquest;'],
	['µ','&micro;'],
	['©','&copy;'],
	['°','&deg;'],
	['¨','&uml;'],
	['§','&sect;'],
	['¤','&curren;'],
	['¦','&brvbar;'],
	['<','&lsaquo;'],
	['>','&rsaquo;'],
];

const smileys = [
	[':D','😃'],
	[':-D','😃'],

	['xD','😆'],
	['XD','😆'],
	['xd','😆'],
	['Xd','😆'],

	['X(','😣'],
	['x(','😣'],

	['XP','😝'],
	['Xp','😝'],
	['xP','😝'],
	['xp','😝'],

	[':p','😛'],
	[':P','😛'],

	[';)','😉'],
	[';D','😉'],

	[':)','🙂'],

	[':(','🙁'],

	['^^','😄'],

	['<3','😍'],
];

module.exports = function() {
	/**
	 * Gets the date time.
	 *
	 * @return	 {string}  The date time.
	 */
	this.getDateTime = function(date = new Date()) {

		let hour = date.getHours();
		hour = (hour < 10 ? '0' : '') + hour;

		let min  = date.getMinutes();
		min = (min < 10 ? '0' : '') + min;

		let sec  = date.getSeconds();
		sec = (sec < 10 ? '0' : '') + sec;

		const year = date.getFullYear();

		let month = date.getMonth() + 1;
		month = (month < 10 ? '0' : '') + month;

		let day  = date.getDate();
		day = (day < 10 ? '0' : '') + day;

		return day + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;
	};

	/**
	  * Check if a variable is set
	  *
	  * @param	  {anything}  variable  The variable needs to be tested
	  * @return	 {boolean}   True if the variable is set, False otherwise
	  */
    this.isset = function(variable, type='') {
        let array = (type === 'array');
        if(array) { type = 'object'; }

        if(variable === null ||
            typeof variable === 'undefined') {
            return false;
        }

        if(type !== '' && typeof variable !== type) {
            return false;
        }

        if(type === '') {
			type = typeof variable;
			array = Array.isArray(variable);
        }

        if(type === 'string') {
            return variable.split(' ').join('') !== '';

        } else if(type === 'number') {
            // Do nothing

        } else if(type === 'object') {
            if(array && (!Array.isArray(variable) || variable.length === 0)) { 
                return false;
            } else if(!array && Array.isArray(variable)) {
                return false;
            } else if(!array) {
                let empty = true;
                for(const key in variable) {
                    if(variable.hasOwnProperty(key)) {
                        empty = false;
                    }
                }

                if(empty) {
                    return false;
                }
            }

        } else if(type === 'boolean') {
            // Do nothing

        } /*else if(type === 'symbol') {

        }*/

        return true;
    };

	/**
	 * Normalize a text to be compatible with sockets
	 *
	 * @param	  {string}  str	 Raw text
	 * @return	 {string}  normalized text
	 */
	this.normalizeText = function(str) {
		for(let i=0; i<charList.length; i++) {
			str = str.split(charList[i][0]).join(charList[i][1]);
		}

		return str;
	};
	/**
	 * Unnormalize a text
	 *
	 * @param	  {string}  str	 Raw text
	 * @return	 {string}  normalized text
	 */
	this.unNormalizeText = function(str) {
		for(let i=0; i<charList.length; i++) {
			str = str.split(charList[i][1]).join(charList[i][0]);
		}

		return str;
	};
	/**
	 * Parse smileys in text
	 *
	 * @param	  {string}  str	 Raw text
	 * @return	 {string}  parsed text
	 */
	this.textToSmileys = function(str) {
		for(let i=0; i<smileys.length; i++) {
			str = str.split(smileys[i][0]).join(smileys[i][1]);
		}

		return str;
	};

	this.filterUnwantedChars = function(str) {
		for(let i=0; i<unwantedCharAndString.length; i++) {
			str = str.split(unwantedCharAndString[i][0]).join(unwantedCharAndString[i][1]);
		}
		return str;
	};

	/**
	 * Parse text given in a chat command
	 *
	 * @param	  {string}  str	 The time to parse
	 * @return	 {number}  Time parsed in seconds
	 */
	this.parseChatTime = function(str) {
		const unit = str.charAt(str.length-1).toLowerCase();
		const count = parseInt(str.substr(0,str.length-1));

		if(typeof count !== 'number' || Number.isNaN(count)) {
			return -1; // Send error code
		}

		switch(unit) {
		case 'd': // Days
			return TIME.DAY_TO_MS*count;
		case 'h': // Hour
			return TIME.HOUR_TO_MS*count;
		case 'm': // Minutes
			return TIME.MINUTES_TO_MS*count;
		case 's': // Seconds
			return TIME.SECONDS_TO_MS*count;
		default: // Wrong unit
			return -1;
		}
	};
};