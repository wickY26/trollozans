'use strict';

/**
 * Admin Controller for admin jobs.
 * @param  {[type]} $scope         [description]
 * @param  {[type]} $stateParams   [description]
 * @param  {[type]} $location      [description]
 * @param  {[type]} Authentication [description]
 * @param  {[type]} Admin)         {		$scope.authentication = Authentication;				$scope.findTopics = function () {			$scope.topics = Admin.one('topics').getList().$object;		};	}] [description]
 * @return {[type]}                [description]
 */
angular.module('admin').controller('AdminController', ['$scope', '$stateParams', '$location', 'Authentication', 'Admin', 'Constants',

	function ($scope, $stateParams, $location, Authentication, Admin, Constants) {
		$scope.authentication = Authentication;

		/**
		 * Gets Topics for admins. Admin topics have unapprove poem counts
		 * @return {[type]} [description]
		 */
		$scope.findTopics = function () {

			$scope.topics = Admin.one('topics').getList().$object;

		};

		// Find existing Topic
		$scope.findOne = function () {
			Admin.one('topics').one($stateParams.topicId).get().then(function (topic) {
				topic.content.type = Constants.convertToSelect2(topic.content.type, 'contentTypes');
				$scope.topic = topic;
			});
		};
		// contentType select2 options
		$scope.contentTypeOptions = {
			placeholder: 'Select Content Type',
			data: Constants.createSelect2Data('contentTypes')
		};

		// Create new Topic
		$scope.create = function () {
			// set original values from select2 fields
			this.topic.content.type = Constants.convertFromSelect2(this.topic.content.type);

			Admin.post(this.topic).then(function (response) {
				$location.path('topics/' + response._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.topic = {};
		};
	}
]);