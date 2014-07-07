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

	/**
	 * Get Topics with unapprove poem count
	 */
	app.route('/admin/topics')
		.get(users.requiresLogin, users.hasAuthorization(['admin']), topics.list);

	// Finish by binding the Topic middleware
	app.param('topicId', topics.topicByID);
};