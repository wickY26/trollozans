'use strict';

angular.module('topics').controller('MainTopicsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Topics',
	function ($scope, $stateParams, $location, Authentication, Topics) {
		$scope.authentication = Authentication;

		// Find a list of Topics with top three Poems
		$scope.findTopics = function () {
			// topics promise object for loading indicator
			$scope.topicsPromise = Topics.getList();
			$scope.topicsPromise.then(function (topics) {
				$scope.topics = topics;
			});
		};
		// Like Topic
		$scope.likeTopic = function (topic) {
			Topics.one('like').one(topic._id).put();
			topic.usersLiked.push($scope.authentication.user._id);
		};
		// Unlike Topic
		$scope.unlikeTopic = function (topic) {
			Topics.one('unlike').one(topic._id).put();
			topic.usersLiked = _.without(topic.usersLiked, $scope.authentication.user._id);
		};
	}
]);