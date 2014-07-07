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
angular.module('admin').controller('AdminController', ['$scope', '$stateParams', '$location', 'Authentication', 'Admin',
	function ($scope, $stateParams, $location, Authentication, Admin) {
		$scope.authentication = Authentication;

		/**
		 * Gets Topics for admins. Admin topics have unapprove poem counts
		 * @return {[type]} [description]
		 */
		$scope.findTopics = function () {

			$scope.topics = Admin.one('topics').getList().$object;

		};

	}
]);