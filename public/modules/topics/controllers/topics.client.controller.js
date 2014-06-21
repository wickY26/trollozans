'use strict';

// Topics controller
angular.module('topics').controller('TopicsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Topics', 'Tags', 'Constants',
	function ($scope, $stateParams, $location, Authentication, Topics, Tags, Constants) {
		$scope.authentication = Authentication;

		// Create new Topic
		$scope.create = function () {
			// set original values of select2 fields
			this.topic.content.type = Constants.convertFromSelect2(this.topic.content.type);
			this.topic.tags = Constants.convertFromSelect2(this.topic.tags);

			Topics.post(this.topic).then(function (response) {
				$location.path('topics/' + response._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.topic = {};
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

			topic.content.type = Constants.convertFromSelect2(this.contentType);
			topic.tags = Constants.convertFromSelect2(this.topicTags);

			topic.$update(function () {
				$location.path('topics/' + topic._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Topics
		$scope.find = function () {
			$scope.topics = Topics.getList().$object;
		};

		// Find existing Topic
		$scope.findOne = function () {
			$scope.topic = Topics.one($stateParams.topicId).get().$object;
		};

		// Find a list of Tags
		$scope.findTags = function () {
			Tags.query(function (tags) {
				// set tag select option's data
				var data = [];
				angular.forEach(tags, function (tag) {
					data.push({
						id: tag._id,
						text: tag.title
					});
				});
				angular.extend($scope.tagOptions.data, data);
			});
		};

		// tag select2 options
		$scope.tagOptions = {
			placeholder: 'Select Tags',
			multiple: true,
			data: []
		};

		// contentType select2 options
		$scope.contentTypeOptions = {
			placeholder: 'Select Content Type',
			data: Constants.contentTypes
		};
	}
]);