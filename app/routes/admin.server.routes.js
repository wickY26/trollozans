'use strict';

/**
 * Admin Server Routes. All route has to have two mandotaroy filters users.requiresLogin and users.hasAuthorization(['admin'])
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
module.exports = function (app) {
	var users = require('../../app/controllers/users');
	var topics = require('../../app/controllers/topics');
	var poems = require('../../app/controllers/poems');

	app.route('/admin/topics/:topicId')
		.get(topics.read)
		.put(users.requiresLogin, users.hasAuthorization(['admin']), topics.validate, topics.update)
		.delete(users.requiresLogin, users.hasAuthorization(['admin']), topics.delete);

	/**
	 * Get Topics with unapprove poem count
	 */
	app.route('/admin/topics')
		.get(users.requiresLogin, users.hasAuthorization(['admin']), topics.listByUnapproveCount);

	app.route('/admin')
		.post(users.requiresLogin, users.hasAuthorization(['admin']), topics.create);

	// Finish by binding the Topic middleware
	app.param('topicId', topics.topicByID);
};