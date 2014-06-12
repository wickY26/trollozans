'use strict';

// Poems controller
angular.module('poems').controller('PoemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Poems', 'Topics', 'Tags',
	function ($scope, $stateParams, $location, Authentication, Poems, Topics, Tags) {
		$scope.authentication = Authentication;

		// Create new Poem
		$scope.create = function () {
			// Create new Poem object
			var poem = new Poems({
				content: this.content,
				topic: this.topic,
				title: this.title,
				tags: [this.tag]
			});

			// Redirect after save
			poem.$save(function (response) {
				$location.path('poems/' + response._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.content = '';
			this.topic = '';
			this.title = '';
			this.tag = '';
		};

		// Remove existing Poem
		$scope.remove = function (poem) {
			if (poem) {
				poem.$remove();

				for (var i in $scope.poems) {
					if ($scope.poems[i] === poem) {
						$scope.poems.splice(i, 1);
					}
				}
			} else {
				$scope.poem.$remove(function () {
					$location.path('poems');
				});
			}
		};

		// Update existing Poem
		$scope.update = function () {
			var poem = $scope.poem;

			poem.$update(function () {
				$location.path('poems/' + poem._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Poems
		$scope.find = function () {
			$scope.poems = Poems.query();
		};

		// Find existing Poem
		$scope.findOne = function () {
			$scope.poem = Poems.get({
				poemId: $stateParams.poemId
			});
		};

		// Find a list of Topics
		$scope.findTopics = function () {
			Topics.query(function (response) {
				$scope.topics = response;
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