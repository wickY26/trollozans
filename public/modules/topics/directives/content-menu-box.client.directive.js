'use strict';

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