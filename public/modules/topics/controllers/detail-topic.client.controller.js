'use strict';

angular.module('topics').controller('DetailTopicController', ['$scope', '$stateParams', '$location', 'Authentication', 'UserProfile', 'Topics', 'Poems',
	function ($scope, $stateParams, $location, Authentication, UserProfile, Topics, Poems) {
		$scope.authentication = Authentication;
		$scope.userProfile = UserProfile;

		// Find existing Topic
		$scope.findTopic = function () {
			// topic promise object for loading indicator
			$scope.topicPromise = Topics.findTopic($stateParams.topicId);
			$scope.topicPromise.then(function (topic) {
				$scope.topic = topic;
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

		// Find a list of Poems of Topic
		$scope.findPoems = function () {
			$scope.poems = Topics.findTopicPoems($stateParams.topicId).$object;
		};

		// Create new Poem for Topic
		$scope.createPoem = function () {
			// topic promise object for loading indicator
			$scope.topicPromise = Topics.createTopicPoem($stateParams.topicId, this.poem);
			$scope.topicPromise.then(function (response) {
				console.log(response);
				alert('Your poem posted successfully...');
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.poem = {};
		};
	}
]);