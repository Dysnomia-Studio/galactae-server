module.exports = class tutorials {
	/**
	 * Determines if the user has finished tutorials.
	 *
	 * @param      {<type>}   user    The user
	 * @return     {boolean}  True if has finished tutorials, False otherwise.
	 */
	static hasFinishedTutorials(user) {
		return (isset(user.currTutorial) && user.currTutorial >= tutorialList.length);
	}
}