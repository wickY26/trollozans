'use strict';

angular.module('core').directive('likeButton', function () {
	return {
		template: '<div data-ng-if="user">' +
			'<a class="btn btn-primary btn-xs backcolor" data-ng-click="like()" data-ng-if="!_canLike()"><i class="fa fa-thumbs-up"></i>Like</a>' +
			'<a class="btn btn-primary btn-xs backcolor" data-ng-click="unlike()" data-ng-if="_canLike()"><i class="fa fa-thumbs-down"></i>Unlike</a>' +
			'</div>' +
			'<div data-ng-if="!user">' +
			'<a class="btn btn-primary btn-xs backcolor" href="/#!/signin"><i class="fa fa-thumbs-up"></i>Like</a>' +
			'</div>',
		scope: {
			likeArray: '=',
			user: '=',
			like: '&',
			unlike: '&'
		},
		replace: false,
		restrict: 'EA',
		link: function postLink($scope, iElm, iAttrs, controller) {
			// can current user like this topic
			$scope._canLike = function () {
				return _.contains($scope.likeArray, $scope.user._id);
			};
		}
	};
});