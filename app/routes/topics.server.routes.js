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

	// Finish by binding the Topic middleware
	app.param('topicId', topics.topicByID);
};