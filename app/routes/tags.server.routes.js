'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var tags = require('../../app/controllers/tags');

	// Tags Routes
	app.route('/tags')
		.get(tags.list)
		.post(users.requiresLogin, tags.create);

	app.route('/tags/:tagId')
		.get(tags.read)
		.put(users.requiresLogin, tags.hasAuthorization, tags.update)
		.delete(users.requiresLogin, tags.hasAuthorization, tags.delete);

	// Finish by binding the Tag middleware
	app.param('tagId', tags.tagByID);
};