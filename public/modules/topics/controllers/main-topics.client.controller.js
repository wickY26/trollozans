'use strict';

angular.module('topics').controller('MainTopicsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Topics',
	function ($scope, $stateParams, $location, Authentication, Topics) {
		$scope.authentication = Authentication;

		// Initial Function of Controller
		$scope.init = function () {
			// Create new Topic Array
			$scope.topics = [];
			// Find First Five Topics to Show
			$scope.findTopics(0, 5);
		};

		// Find a list of Topics with top three Poems
		$scope.findTopics = function (start, offset) {
			// Query Object
			var query = {
				start: start,
				offset: offset
			};
			// Topics Promise Object for Loading Indicator
			$scope.topicsPromise = Topics.findTopics(query);
			$scope.topicsPromise.then(function (topics) {
				// Add New Topics to Current Topics
				$scope.topics = $scope.topics.concat(topics);
			});
		};

		// Like Topic
		$scope.likeTopic = function (topic) {
			Topics.likeTopic(topic._id);
			topic.usersLiked.push($scope.authentication.user._id);
		};

		// Unlike Topic
		$scope.unlikeTopic = function (topic) {
			Topics.unlikeTopic(topic._id);
			topic.usersLiked = _.without(topic.usersLiked, $scope.authentication.user._id);
		};
	}
]);