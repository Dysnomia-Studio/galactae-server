describe('• Reports', () => {
	describe('# refresh()', () => {
		it('should work with valid sid', (done) => {
			const result = [
				1,2,3
			];

			db.battleLogAccess.fetchByPlayer = () => {
				return result;
			};

			const timeout = setTimeout(() => {
				assert(false);
				done();
			},100);

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-report-list') {
							assert.deepEqual(content, result);
							clearTimeout(timeout);
							done();
						}
					},
				};
			};

			Reports.refresh('user1', 'sid1');
		});

		it('should work with invalid sid', (done) => {
			const result = [
				1,2,3
			];

			db.battleLogAccess.fetchByPlayer = () => {
				return result;
			};

			const timeout = setTimeout(() => {
				assert(true);
				done();
			},100);

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-report-list') {
							assert(false);
							clearTimeout(timeout);
							done();
						}
					},
				};
			};

			Reports.refresh('user1', '-1');
		});
	});
});
