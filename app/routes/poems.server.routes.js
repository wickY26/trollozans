'use strict';

module.exports = function (app) {
	var users = require('../../app/controllers/users');
	var poems = require('../../app/controllers/poems');
	var topics = require('../../app/controllers/topics');

	/**
	 *	Like Poem according to poemId user need to be logged in
	 */
	app.route('/poems/like/:poemId')
		.put(users.requiresLogin, poems.canLike, poems.update);

	/**
	 * Unlike Poem according to poemId user need to be logged in
	 */
	app.route('/poems/unlike/:poemId')
		.put(users.requiresLogin, poems.canUnlike, poems.update);

	/**
	 * Approve poem according to PoemId. Only user with admin role can approve
	 */
	app.route('/poems/approve/:poemId')
		.put(users.hasAuthorization(['admin']), poems.approve, poems.update);

	/**
	 * gets the poems those not approved. Only user with admin role can gets the list
	 */
	app.route('/poems/waitingForApproval')
		.get(users.hasAuthorization(['admin']), poems.getPoemsWaitingforApproval);

	/**
	 * Gets the poems accordign to topicId . poems those belongs the specific topic
	 * Create new Poem under the spesified topic
	 */
	app.route('/poems/:topicId')
		.get(poems.list)
		.post(users.requiresLogin, poems.create, topics.pushPoem);

	/**
	 * Update and delete the poem According the topic Id.
	 */
	app.route('/poems/:topicId/:poemId')
		.put(users.requiresLogin, poems.hasPermission, poems.hasAuthorization, poems.update)
		.delete(users.requiresLogin, poems.hasPermission, poems.hasAuthorization, poems.delete);

	/**
	 * If Route has poem Id or topic id gets the according poem or topic and puts the obj to req
	 */
	app.param('poemId', poems.poemByID);
	app.param('topicId', topics.topicByID);
};