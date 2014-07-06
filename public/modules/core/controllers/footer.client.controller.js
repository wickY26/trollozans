'use strict';

angular.module('core').controller('FooterController', ['$scope', 'Topics',
	function ($scope, Topics) {
		// Find a list of Topics with top three Poems
		$scope.findTopics = function () {
			// popular topics
			Topics.getList().then(function (topics) {
				$scope.topics = topics.splice(0, 6);
			});
		};
	}
]);