'use strict';

angular.module('core').controller('FooterController', ['$scope', 'Topics',
	function ($scope, Topics) {
		// Find Popular Topics
		$scope.findPopularTopics = function () {
			// popular topics
			$scope.topics = Topics.popularTopics();
		};
	}
]);