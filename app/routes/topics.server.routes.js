'use strict';

module.exports = function (app) {
	var users = require('../../app/controllers/users');
	var topics = require('../../app/controllers/topics');
	var poems = require('../../app/controllers/poems');

	// Topics Routes
	app.route('/topics')
		.get(topics.list)
		.post(users.requiresLogin, topics.hasPermission, topics.validate, topics.create);

	app.route('/topics/:topicId')
		.get(topics.read)
		.put(users.requiresLogin, topics.hasPermission, topics.hasAuthorization, topics.validate, topics.update)
		.delete(users.requiresLogin, topics.hasPermission, topics.hasAuthorization, topics.delete);

	app.route('/topics/poems/:topicId')
		.get(poems.list)
		.post(users.requiresLogin, poems.create, topics.pushPoem);

	app.route('/topics/poems/:topicId/:poemId')
		.put(users.requiresLogin, poems.hasPermission, poems.hasAuthorization, poems.update)
		.delete(users.requiresLogin, poems.hasPermission, poems.hasAuthorization, poems.delete);

	app.route('/topics/like/:topicId')
		.put(users.requiresLogin, topics.canLike, topics.update);

	app.route('/topics/unlike/:topicId')
		.put(users.requiresLogin, topics.canUnlike, topics.update);

	// Finish by binding the Topic middleware
	app.param('topicId', topics.topicByID);
};