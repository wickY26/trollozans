'use strict';

//Setting up route
angular.module('topics').config(['$stateProvider',
	function ($stateProvider) {
		// Topics state routing
		$stateProvider.
		state('mainTopics', {
			url: '/topics',
			templateUrl: 'modules/topics/views/main-topics.client.view.html'
		}).
		state('detail-topic', {
			url: '/topics/:topicId',
			templateUrl: 'modules/topics/views/detail-topic.client.view.html'
		}).
		state('listTopics', {
			url: '/admin/topics',
			templateUrl: 'modules/topics/views/list-topics.client.view.html'
		}).
		state('createTopic', {
			url: '/admin/topics/create',
			templateUrl: 'modules/topics/views/create-topic.client.view.html'
		}).
		state('viewTopic', {
			url: '/admin/topics/:topicId',
			templateUrl: 'modules/topics/views/view-topic.client.view.html'
		}).
		state('editTopic', {
			url: '/admin/topics/:topicId/edit',
			templateUrl: 'modules/topics/views/edit-topic.client.view.html'
		});
	}
]);