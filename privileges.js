module.exports = class Privileges {
	static isBannedFromChat(userId, callback) {
		db.ban.find(userId, 1, function(banObj) {
			if(isset(banObj, 'object')) {
				for(let i=0; banObj.length; banObj++) {
					if(banObj[i].ban_end < Date.now()) {
						callback(true);
					}
				}
			}

			callback(false);
		});
	}

	static getChatRank(lvl) {
		/**
		 * Lvl:
		 * 1: member
		 * 2: moderator
		 * 3: operator
		 * 4: administrator
		 */
		let rank = '';
		switch(lvl) {
			case 2:
			case 3:
				rank = '[STAFF] ';
				break;
			case 4:
				rank = '[ADMIN] ';
				break;
			default:
		}

		return rank;
	}
};