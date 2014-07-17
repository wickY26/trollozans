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
		});

	}
]);