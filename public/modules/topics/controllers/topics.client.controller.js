'use strict';

// Topics controller
angular.module('topics').controller('TopicsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Topics', 'Constants',
	function ($scope, $stateParams, $location, Authentication, Topics, Constants) {
		$scope.authentication = Authentication;

		// Create new Topic
		$scope.create = function () {
			// set original values from select2 fields
			this.topic.content.type = Constants.convertFromSelect2(this.topic.content.type);

			Topics.post(this.topic).then(function (response) {
				$location.path('topics/' + response._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.topic = {};
		};

		// Create new Poem
		$scope.createPoem = function (topicId) {
			// set topic of poem
			this.poem.topic = topicId;

			Topics.one('poems').all(topicId).post(this.poem).then(function (response) {
				console.log(response);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.poem = {};
		};

		// Remove existing Topic
		$scope.remove = function (topic) {
			$scope.topic.remove().then(function () {
				$location.path('topics');
			});
		};

		// Update existing Topic
		$scope.update = function () {
			var topic = $scope.topic;

			// set original values from select2 fields
			topic.content.type = Constants.convertFromSelect2(topic.content.type);

			topic.put().then(function () {
				$location.path('topics/' + topic._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Topics
		$scope.find = function () {
			$scope.topics = Topics.getList().$object;
		};

		// Find Poems of Topic
		$scope.findPoems = function (index) {
			Topics.one('poems').one($scope.topics[index]._id).get().then(function (topic) {
				console.log(topic.poems);
				$scope.poems = topic.poems;
			});
		};

		// Find existing Topic
		$scope.findOne = function () {
			Topics.one($stateParams.topicId).get().then(function (topic) {
				topic.content.type = Constants.convertToSelect2(topic.content.type, 'contentTypes');
				$scope.topic = topic;
			});
		};

		$scope.setCurrentTopic = function (index) {
			$scope.currentTopic = index;
		};

		// Get full Topic
		$scope.getFullTopic = function () {
			Topics.one('full').one($stateParams.topicId).get().then(function (topic) {
				console.log(topic);
				$scope.topic = topic;

			});
		};

		// contentType select2 options
		$scope.contentTypeOptions = {
			placeholder: 'Select Content Type',
			data: Constants.createSelect2Data('contentTypes')
		};
	}
]);