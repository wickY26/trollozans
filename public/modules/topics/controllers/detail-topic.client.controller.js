'use strict';

angular.module('topics').controller('DetailTopicController', ['$scope', '$stateParams', '$location', 'Authentication', 'Topics', 'Poems',
	function ($scope, $stateParams, $location, Authentication, Topics, Poems) {
		$scope.authentication = Authentication;

		// Find existing Topic
		$scope.findTopic = function () {
			// topic promise object for loading indicator
			$scope.topicPromise = Topics.one($stateParams.topicId).get();
			$scope.topicPromise.then(function (topic) {
				$scope.topic = topic;
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
			topic.usersLiked = _.remove(topic.usersLiked, $scope.authentication.user._id);
		};

		// Find a list of Poems of Topic
		$scope.findPoems = function () {
			$scope.poems = Topics.one('poems').all($stateParams.topicId).getList().$object;
		};

		// Create new Poem for Topic
		$scope.createPoem = function () {
			// set topic of poem
			Topics.one('poems').all($stateParams.topicId).post(this.poem).then(function (response) {
				console.log(response);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.poem = {};
		};
	}
]);