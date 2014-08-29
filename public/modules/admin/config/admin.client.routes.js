'use strict';

/**
 * Angular Client Rules for Admin Pages
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
		}).

		/**
		 * List Unapproved Peoms for admin users.
		 * @type {String}
		 */
		state('listPoems', {
			url: '/admin/poems',
			templateUrl: 'modules/admin/views/list-poems.client.view.html'
		});

	}
]);