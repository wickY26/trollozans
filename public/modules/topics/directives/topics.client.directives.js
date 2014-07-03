'use strict';

// Topics directive
angular.module('topics').directive('bindUnsafeHtml', ['$compile',
	function ($compile) {
		return function (scope, element, attrs) {
			scope.$watch(
				function (scope) {
					// watch the 'bindUnsafeHtml' expression for changes
					return scope.$eval(attrs.bindUnsafeHtml);
				},
				function (value) {
					// when the 'bindUnsafeHtml' expression changes
					// assign it into the current DOM
					element.html(value);

					// compile the new DOM and link it to the current
					// scope.
					// NOTE: we only compile .childNodes so that
					// we don't get into infinite loop compiling ourselves
					$compile(element.contents())(scope);
				}
			);
		};
	}
]);

/**
 * content detail wrapper
 */
angular.module('topics').directive('contentWrapper', ['$sce',
	function ($sce) {
		// get iframe source by type and reference
		function getSource(type, reference) {
			if (type === 'youtube') return '//www.youtube-nocookie.com/embed/' + reference + '?rel=0';
			if (type === 'dailymotion') return '//www.dailymotion.com/embed/video/' + reference + '?logo=0&info=0';
		}
		// Runs during compile
		return {
			templateUrl: 'modules/topics/views/templates/contentWrapper-topic.client.view.html',
			scope: {
				topic: '=',
				user: '=',
				like: '&',
				unlike: '&'
			},
			replace: true,
			restrict: 'EA',
			link: function ($scope, iElm, iAttrs, controller) {
				// watch topic to resolve
				var topicWatcher = $scope.$watch('topic', function (topic) {
					if (topic) {
						$scope.iframeSrc = $sce.trustAsResourceUrl(getSource($scope.topic.content.type, $scope.topic.content.reference));
						if (angular.isUndefined(iAttrs.editable)) {
							// stop watching
							topicWatcher();
						}
					}
				});
				// can current user like this topic
				$scope._canLike = function () {
					return _.contains($scope.topic.usersLiked, $scope.user._id);
				};
			}
		};
	}
]);

/**
 * content holder
 */
angular.module('topics').directive('contentBox', function () {
	// get thumbnail source by type and reference
	function getSource(type, reference) {
		if (type === 'youtube') return 'http://img.youtube.com/vi/' + reference + '/0.jpg';
		if (type === 'dailymotion') return 'http://www.dailymotion.com/thumbnail/video/' + reference;
		if (type === 'image') return reference;
	}
	// Runs during compile
	return {
		templateUrl: 'modules/topics/views/templates/contentBox-topic.client.view.html',
		scope: {
			topic: '=',
			user: '=',
			like: '&',
			unlike: '&'
		},
		replace: true,
		restrict: 'EA',
		link: function ($scope, iElm, iAttrs, controller) {
			$scope.thumbnailSrc = getSource($scope.topic.content.type, $scope.topic.content.reference);
			// can current user like this topic
			$scope._canLike = function () {
				return _.contains($scope.topic.usersLiked, $scope.user._id);
			};
		}
	};
});