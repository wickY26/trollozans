'use strict';

/**
 * Angular Client Rules for Admin Pages
 * @param  {[type]} $stateProvider) {				$stateProvider.		state('listTopics', {			url: '/admin/topics',			templateUrl: 'modules/topics/views/list-topics.client.view.html'		}).		state('createTopic', {			url: '/admin/topics/create',			templateUrl: 'modules/topics/views/create-topic.client.view.html'		}).		state('viewTopic', {			url: '/admin/topics/:topicId',			templateUrl: 'modules/topics/views/view-topic.client.view.html'		}).		state('editTopic', {			url: '/admin/topics/:topicId/edit',			templateUrl: 'modules/topics/views/edit-topic.client.view.html'		});	}] [description]
 * @return {[type]}                 [description]
 */
angular.module('admin').config(['$stateProvider',
	function ($stateProvider) {
		// Topics state routing
		$stateProvider.

		/**
		 * List Topics for admin users.
		 * @type {String}
		 */
		state('listTopics', {
			url: '/admin/topics',
			templateUrl: 'modules/admin/views/list-topics.client.view.html'
		}).
		state('createTopic', {
			url: '/admin/topics/create',
			templateUrl: 'modules/admin/views/create-topic.client.view.html'
		}).
		state('viewTopic', {
			url: '/admin/topics/:topicId',
			templateUrl: 'modules/admin/views/view-topic.client.view.html'
		}).
		state('editTopic', {
			url: '/admin/topics/:topicId/edit',
			templateUrl: 'modules/admin/views/edit-topic.client.view.html'
		});

	}
]);