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

		// Find a list of Topics with top three Poems
		$scope.findTopics = function () {
			// popular topics
			Topics.getList().then(function (topics) {
				$scope.topics = topics.splice(0, 6);
			});
		};
	}
]);