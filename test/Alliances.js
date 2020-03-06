describe('• Alliances', () => {
	describe('# sendToPlayer()', () => {
		it('should work', () => {
			const allianceData = {
				id: 'MyId',
				name: 'name',
				description: 'description',
				members: [
					{ name: 'Elanis', founder: true, leader: false, diplomacy: false },
					{ name: 'Foo', founder: false, leader: false, diplomacy: false },
					{ name: 'Bar', founder: false, leader: true, diplomacy: false },
				],
			};

			db.alliance.getMembers = (allyId) => {
				return allianceData.members;
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.deepEqual(content, allianceData);
						}
					},
				};
			};

			Alliances.sendToPlayer({
				id: 'test',
				name: 'foo',
				ally: {
					id: 'MyId',
					name: 'name',
					description: 'description',
				},
				foo: 'bar'
			});
		});
	});

	describe('# search()', () => {
		db.alliance.search = (text) => {
			if(text === 'blah') {
				return [
					{ foo: 'bar' }
				];
			}

			return [];
		};

		it('should work', () => {
			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-search-results') {
							assert.deepEqual(content, [
								{ foo: 'bar' }
							]);
						}
					},
				};
			};

			Alliances.search('sid', 'blah');
		});

		it('should not work', () => {
			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-search-results') {
							assert.deepEqual(content, []);
						}
					},
				};
			};

			Alliances.search('sid', 'bleh');
		});
	});

	describe('create()', () => {
		it('should work', () => {
			let steps = 0;

			const allianceData = {
				id: 'MyId',
				name: 'name',
				description: 'description',
				members: [
					{ name: 'Elanis', founder: true, leader: false, diplomacy: false },
					{ name: 'Foo', founder: false, leader: false, diplomacy: false },
					{ name: 'Bar', founder: false, leader: true, diplomacy: false },
				],
			};

			const userData = {
				id: 'PlyId',
				name: 'PlyName',
				sid: 'sid',
				ally: allianceData,
			};

			db.alliance.create = (obj) => {
				assert.equal(obj.name, allianceData.name);
				assert.equal(obj.description, allianceData.description);

				steps++;

				return allianceData.id;
			};

			db.player.joinAlly = (userId, allyId) => {
				assert.equal(userId, userData.id);
				assert.equal(allyId, allianceData.id);

				steps++;
			};


			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.deepEqual(content, allianceData);
							assert.equal(steps, 2);
						}
					},
				};
			};

			Alliances.create(userData.sid, userData, allianceData.name, allianceData.description);
		});
	});

	describe('askToJoin()', () => {
		it('should work', () => {
			const playerId = 'plyId';
			const allianceId = 'allyId';

			db.alliance.askToJoin = (plyId, allyId) => {
				assert.equal(playerId, plyId);
				assert.equal(allianceId, allyId);
			};

			Alliances.askToJoin(playerId, allianceId);
		});
	});

	describe('choiceAskToJoin()', () => {
		it('should work (choice=true)', () => {
			let steps = 0;
			const playerName = 'myPlayerName';
			const currPlayer = {
				ally: 'MyAllyId',
			};

			db.alliance.askedToJoin = () => {
				steps++;
				return true;
			};

			db.player.findByName = (playerName) => {
				steps++;
				return {
					id: 'playerId',
				};
			};

			db.player.update = () => { steps++; };

			db.alliance.removeJoinAsk = () => { steps++; };

			db.alliance.find = () => {
				steps++;
				return {
					id: 'MyAllyId',
					name: 'MyAllyName',
					description: 'MyAllyDesc',
				};
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.equal(steps, 5);
						}
					},
				};
			};

			Alliances.choiceAskToJoin(currPlayer, playerName, true);
		});

		it('should work (choice=false)', () => {
			let steps = 0;
			const playerName = 'myPlayerName';
			const currPlayer = {
				ally: 'MyAllyId',
			};

			db.alliance.askedToJoin = () => {
				steps++;
				return true;
			};

			db.player.findByName = (playerName) => {
				steps++;
				return {
					id: 'playerId',
				};
			};

			db.player.update = () => { steps++; };

			db.alliance.removeJoinAsk = () => { steps++; };

			db.alliance.find = () => {
				steps++;
				return {
					id: 'MyAllyId',
					name: 'MyAllyName',
					description: 'MyAllyDesc',
				};
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.equal(steps, 4);
						}
					},
				};
			};

			Alliances.choiceAskToJoin(currPlayer, playerName, false);
		});

		it('should work (askedToJoin=false)', () => {
			db.alliance.askedToJoin = () => {
				return false;
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert(false);
						}
					},
				};
			};

			Alliances.choiceAskToJoin({}, 'ply', false);
		});
	});

	describe('invite()', () => {
		it('should work', () => {
			const playerId = 'plyId';
			const allianceId = 'allyId';

			db.alliance.invite = (plyId, allyId) => {
				assert.equal(playerId, plyId);
				assert.equal(allianceId, allyId);
			};

			Alliances.invite(playerId, allianceId);
		});
	});

	describe('choiceInvite()', () => {
		it('should work (choice=true)', () => {
			let steps = 0;
			const playerName = 'myPlayerName';
			const currPlayer = {
				ally: 'MyAllyId',
			};

			db.alliance.hasBeenInvited = () => {
				steps++;
				return true;
			};

			db.player.update = () => { steps++; };

			db.alliance.removeInvitations = () => { steps++; };

			db.alliance.find = () => {
				steps++;
				return {
					id: 'MyAllyId',
					name: 'MyAllyName',
					description: 'MyAllyDesc',
				};
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.equal(steps, 4);
						}
					},
				};
			};

			Alliances.choiceInvite(currPlayer, playerName, true);
		});

		it('should work (choice=false)', () => {
			let steps = 0;
			const playerName = 'myPlayerName';
			const currPlayer = {
				ally: 'MyAllyId',
			};

			db.alliance.hasBeenInvited = () => {
				steps++;
				return true;
			};

			db.player.update = () => { steps++; };

			db.alliance.removeInvitations = () => { steps++; };

			db.alliance.find = () => {
				steps++;
				return {
					id: 'MyAllyId',
					name: 'MyAllyName',
					description: 'MyAllyDesc',
				};
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.equal(steps, 3);
						}
					},
				};
			};

			Alliances.choiceInvite(currPlayer, playerName, false);
		});

		it('should work (hasBeenInvited=false)', () => {
			db.alliance.hasBeenInvited = () => {
				return false;
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert(false);
						}
					},
				};
			};

			Alliances.choiceInvite({}, 'allyId', false);
		});
	});
});
