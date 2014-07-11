'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'Topics',
	function ($scope, Authentication, Menus, Topics) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function () {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function () {
			$scope.isCollapsed = false;
		});

		// Find Popular Topics
		$scope.findPopularTopics = function () {
			// popular topics
			$scope.topics = Topics.popularTopics();
		};
	}
]);