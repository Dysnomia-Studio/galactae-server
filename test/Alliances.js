describe('• Alliances', () => {
	describe('# sendToPlayer()', () => {
		it('should work', () => {
			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.deepEqual(content, {
								name: 'name',
								description: 'description',
							});
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
});