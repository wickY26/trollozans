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

angular.module('topics').directive('contentWrapper', ['$compile',
	function ($compile) {
		// get templates by type and reference
		function getTemplate(type, reference) {
			if (type === 'youtube') return '<div class="videoWrapper"><iframe ng-src="//www.youtube-nocookie.com/embed/' + reference + '?rel=0" frameborder="0" allowfullscreen></iframe></div>';
			if (type === 'dailymotion') return '<div class="videoWrapper"><iframe src="//www.dailymotion.com/embed/video/' + reference + '?logo=0&info=0" frameborder="0" allowfullscreen></iframe></div>';
			if (type === 'vimeo') return '<div class="videoWrapper"><iframe src="//player.vimeo.com/video/' + reference + '?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=999999" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
			if (type === 'izlesene') return '<div class="videoWrapper"><iframe src="http://www.izlesene.com/embedplayer/' + reference + '" frameborder="0" allowfullscreen></iframe></div>';
			if (type === 'image') return '<div class="imgWrapper"><img ng-src="{{reference}}"/></div>';
		}
		// Runs during compile
		return {
			scope: {
				type: '=',
				reference: '='
			},
			restrict: 'EA',
			link: function ($scope, iElm, iAttrs, controller) {
				// watch type changes and compile new content
				var typeWatcher = $scope.$watch('type', function (type) {
					if (type) {
						iElm.html(getTemplate(type, $scope.reference));
						$compile(iElm.contents())($scope);
						if (angular.isUndefined(iAttrs.editable)) {
							typeWatcher();
						}
					}
				});
				// watch reference changes and compile new content
				var referenceWatcher = $scope.$watch('reference', function (reference) {
					if (reference) {
						iElm.html(getTemplate($scope.type, reference));
						$compile(iElm.contents())($scope);
						if (angular.isUndefined(iAttrs.editable)) {
							referenceWatcher();
						}
					}
				});
			}
		};
	}
]);

/**
 * content holder
 */
angular.module('topics').directive('contentBox', function () {
	// get thumbnails by type and reference
	function getSource(type, reference) {
		if (type === 'youtube') return 'http://img.youtube.com/vi/' + reference + '/0.jpg';
		if (type === 'dailymotion') return 'http://www.dailymotion.com/thumbnail/video/' + reference;
		if (type === 'image') return reference;
	}
	// Runs during compile
	return {
		template: '<div class="videobox2">' +
			'<figure>' +
			'<!-- Content Thumbnail Start -->' +
			'<a href="/#!/topics/{{topic._id}}">' +
			'<img data-ng-src="{{thumbnailSrc}}" class="img-responsive hovereffect" alt="">' +
			'</a>' +
			'<!-- Content Thumbnail End -->' +
			'<!-- Content Info Start -->' +
			'<div class="vidopts">' +
			'<ul>' +
			'<li><i class="fa fa-heart"></i>{{topic.usersLiked.length}}</li>' +
			'<li data-ng-if="!_canLike()"><a class="btn btn-primary btn-xs backcolor" data-ng-click="like()"><i class="fa fa-thumbs-up"></i>Like</a></li>' +
			'<li data-ng-if="_canLike()"><a class="btn btn-primary btn-xs backcolor" data-ng-click="unlike()"><i class="fa fa-thumbs-down"></i>Unlike</a></li>' +
			'</ul>' +
			'<div class="clearfix"></div>' +
			'</div>' +
			'<!-- Content Info End -->' +
			'</figure>' +
			'<!-- Content Title Start -->' +
			'<h4><a href="/#!/topics/{{topic._id}}">{{topic.title}}</a></h4>' +
			'<!-- Content Title End -->' +
			'</div>',
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