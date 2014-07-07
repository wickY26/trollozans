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
angular.module('topics').directive('contentWrapper', ['$sce', '$location',
	function ($sce, $location) {
		// get iframe source by type and reference
		function getSource(content) {
			if (content.type === 'youtube') return '//www.youtube-nocookie.com/embed/' + content.reference + '?rel=0';
			if (content.type === 'dailymotion') return '//www.dailymotion.com/embed/video/' + content.reference + '?logo=0&info=0';
		}
		// get thumbnail source by type and reference
		function getImgSource(content) {
			if (content.type === 'youtube') return 'http://img.youtube.com/vi/' + content.reference + '/0.jpg';
			if (content.type === 'dailymotion') return 'http://www.dailymotion.com/thumbnail/video/' + content.reference;
			if (content.type === 'image') return content.reference;
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
						$scope.iframeSrc = $sce.trustAsResourceUrl(getSource($scope.topic.content));
						if (angular.isUndefined(iAttrs.editable)) {
							// stop watching
							topicWatcher();
						}
					}
				});
				// pageUrl of topic for social share
				$scope.pageUrl = $location.absUrl();
				// imgUrl of topic for social share
				$scope.imgUrl = getImgSource($scope.topic.content);
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
		}
	};
});

/**
 * menu content holder
 */
angular.module('topics').directive('contentMenuBox', function () {
	// get thumbnail source by type and reference
	function getSource(type, reference) {
		if (type === 'youtube') return 'http://img.youtube.com/vi/' + reference + '/0.jpg';
		if (type === 'dailymotion') return 'http://www.dailymotion.com/thumbnail/video/' + reference;
		if (type === 'image') return reference;
	}
	// Runs during compile
	return {
		templateUrl: 'modules/topics/views/templates/contentMenuBox-topic.client.view.html',
		scope: {
			topic: '='
		},
		replace: true,
		restrict: 'EA',
		link: function ($scope, iElm, iAttrs, controller) {
			$scope.thumbnailSrc = getSource($scope.topic.content.type, $scope.topic.content.reference);
		}
	};
});