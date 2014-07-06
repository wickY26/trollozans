'use strict';

// Poems controller
angular.module('poems').controller('PoemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Poems',
	function ($scope, $stateParams, $location, Authentication, Poems) {
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
			$scope.poem.$remove(function () {
				$location.path('poems');
			});
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
			$scope.poem = Poems.one($stateParams.poemId).get().$object;
		};

		// find poems those wating for an approval
		$scope.findUnapprovedPoems = function () {
			$scope.poemPromise = Poems.one('waitingForApproval').getList();
			$scope.poemPromise.then(function (poems) {
				$scope.poems = poems;
			});
		};

		$scope.approvePoem = function (poem, index) {
			$scope.poemPromise = Poems.one('approve').one(poem._id).put();
			$scope.poemPromise.then(function (response) {
				$scope.poems.splice(index, 1);
			});
		};
	}
]);