'use strict';

angular.module('topics').controller('MainTopicsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Topics',
	function ($scope, $stateParams, $location, Authentication, Topics) {
		$scope.authentication = Authentication;

		// Find a list of Topics with top three Poems
		$scope.findTopics = function () {
			$scope.topics = Topics.getList().$object;
		};
	}
]);