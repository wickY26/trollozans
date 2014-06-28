'use strict';

module.exports = function (app) {
	var users = require('../../app/controllers/users');
	var poems = require('../../app/controllers/poems');

	// Poems Routes
	app.route('/poems')
		.get(poems.list)
		.post(users.requiresLogin, poems.create);

	app.route('/poems/:poemId')
		.get(poems.read)
		.put(users.requiresLogin, poems.hasAuthorization, poems.update)
		.delete(users.requiresLogin, poems.hasAuthorization, poems.delete);

	// Finish by binding the Poem middleware
	app.param('poemId', poems.poemByID);
};