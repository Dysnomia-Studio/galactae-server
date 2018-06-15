/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../../server-dev/misc')();

describe('• misc', function() {
	/**
	 * isset
	 */
	describe('# isset()', function() {
		it('isset(undefined)', function() {
			var test;
			assert.equal(
				isset(test),
				false
			);
		});
		it('isset(defined)', function() {
			var test = 1;
			assert.equal(
				isset(test),
				true
			);
		});
	});
	/**
	 * normalizeText
	 */
	describe('# normalizeText()', function() {
		it('normalizeText (normal text)', function() {
			assert.equal(
				normalizeText("test a tester e"),
				"test a tester e"
			);
		});
		it('normalizeText (text to normalized)', function() {
			assert.equal(
				normalizeText("test à tester é"),
				"test &agrave; tester &eacute;"
			);
		});
	});

	/**
	 * unNormalizeText
	 */
	describe('# unNormalizeText()', function() {
		it('unNormalizeText (normal text)', function() {
			assert.equal(
				unNormalizeText("test a tester e"),
				"test a tester e"
			);
		});
		it('unNormalizeText (normalized to text)', function() {
			assert.equal(
				unNormalizeText("test &agrave; tester &eacute;"),
				"test à tester é"
			);
		});
	});

	/**
	 * textToSmileys
	 */
	describe('# textToSmileys()', function() {
		it('textToSmileys (normal text)', function() {
			assert.equal(
				textToSmileys(": test )"),
				": test )"
			);
		});
		it('textToSmileys (text to smiley)', function() {
			assert.equal(
				textToSmileys(":D test :)"),
				"😃 test 🙂"
			);
		});
	});

	/**
	 * parseChatTime
	 */
	describe('# parseChatTime()', function() {
		it('parseChatTime (error)', function() {
			assert.equal(
				parseChatTime("aaa"),
				-1
			);
		});
		it('parseChatTime (1 day)', function() {
			assert.equal(
				parseChatTime("1d"),
				86400000
			);
		});
		it('parseChatTime (2 hour)', function() {
			assert.equal(
				parseChatTime("2h"),
				7200000
			);
		});
		it('parseChatTime (3 minutes)', function() {
			assert.equal(
				parseChatTime("3m"),
				180000
			);
		});
	});
});