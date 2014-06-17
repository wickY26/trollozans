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
				tags: this.topicTags,
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
			this.content = '';
			this.topicTags = '';
			this.description = '';
		};

		// Remove existing Topic
		$scope.remove = function (topic) {
			$scope.topic.$remove(function () {
				$location.path('topics');
			});
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
			Tags.query(function (response) {
				$scope.tags = response;
			});
		};
	}
]);