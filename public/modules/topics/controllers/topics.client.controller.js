'use strict';

// Topics controller
angular.module('topics').controller('TopicsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Topics', 'Tags',
	function ($scope, $stateParams, $location, Authentication, Topics, Tags) {
		$scope.authentication = Authentication;

		// Create new Topic
		$scope.create = function () {
			// Create new Topic object
			var topic = new Topics({
				title: this.title,
				content: this.content,
				tags: [this.tag],
				description: this.description
			});

			// Redirect after save
			topic.$save(function (response) {
				$location.path('topics/' + response._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.title = '';
			this.content = {};
			this.tag = '';
			this.description = '';
		};

		// Remove existing Topic
		$scope.remove = function (topic) {
			if (topic) {
				topic.$remove();

				for (var i in $scope.topics) {
					if ($scope.topics[i] === topic) {
						$scope.topics.splice(i, 1);
					}
				}
			} else {
				$scope.topic.$remove(function () {
					$location.path('topics');
				});
			}
		};

		// Update existing Topic
		$scope.update = function () {
			var topic = $scope.topic;

			topic.$update(function () {
				$location.path('topics/' + topic._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Topics
		$scope.find = function () {
			$scope.topics = Topics.query();
		};

		// Find existing Topic
		$scope.findOne = function () {
			$scope.topic = Topics.get({
				topicId: $stateParams.topicId
			});
		};

		// Find a list of Tags
		$scope.findTags = function () {
			$scope.tags = Tags.query();
		};
	}
]);