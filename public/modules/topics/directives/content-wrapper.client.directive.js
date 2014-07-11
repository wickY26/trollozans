'use strict';

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