'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var topics = require('../../app/controllers/topics');

	// Topics Routes
	app.route('/topics')
		.get(topics.list)
		.post(users.requiresLogin, topics.create);

	app.route('/topics/:topicId')
		.get(topics.read)
		.put(users.requiresLogin, topics.hasAuthorization, topics.update)
		.delete(users.requiresLogin, topics.hasAuthorization, topics.delete);

	// Finish by binding the Topic middleware
	app.param('topicId', topics.topicByID);
};