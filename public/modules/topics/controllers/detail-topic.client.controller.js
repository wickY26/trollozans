'use strict';

angular.module('topics').controller('DetailTopicController', ['$scope', '$stateParams', '$location', 'Authentication', 'Topics', 'Poems',
	function ($scope, $stateParams, $location, Authentication, Topics, Poems) {
		$scope.authentication = Authentication;

		// Find existing Topic
		$scope.findTopic = function () {
			$scope.topic = Topics.one($stateParams.topicId).get().$object;
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