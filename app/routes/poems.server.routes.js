'use strict';

module.exports = function (app) {
	var users = require('../../app/controllers/users');
	var poems = require('../../app/controllers/poems');
	var topics = require('../../app/controllers/topics');

	// Poems Routes
	app.route('/poems/:topicId')
		.get(poems.list)
		.post(users.requiresLogin, poems.create, topics.pushPoem);

	app.route('/poems/like/:poemId')
		.put(users.requiresLogin, poems.canLike, poems.update);

	app.route('/poems/unlike/:poemId')
		.put(users.requiresLogin, poems.canUnlike, poems.update);

	app.route('/poems/:topicId/:poemId')
		.put(users.requiresLogin, poems.hasPermission, poems.hasAuthorization, poems.update)
		.delete(users.requiresLogin, poems.hasPermission, poems.hasAuthorization, poems.delete);

	// Finish by binding the Poem middleware
	app.param('poemId', poems.poemByID);
	app.param('topicId', topics.topicByID);
};