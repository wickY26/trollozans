'use strict';

function template(tmpl, context, filter) {
	return tmpl.replace(/\{([^\}]+)\}/g, function (m, key) {
		// If key don't exists in the context we should keep template tag as is
		return key in context ? (filter ? filter(context[key]) : context[key]) : m;
	});
}

angular.module('core').directive('ngSocialButtons', ['$compile', '$q', '$parse', '$http',
	function ($compile, $q, $parse, $http) {
		return {
			restrict: 'A',
			scope: {
				'url': '=',
				'title': '=',
				'description': '=',
				'image': '='
			},
			replace: true,
			transclude: true,
			template: '<ul ng-transclude></ul>',
			controller: ['$scope', '$q', '$http',
				function ($scope, $q, $http) {
					var ctrl = {
						init: function (scope, element, options) {
							if (options.counter) {
								ctrl.getCount(scope.options).then(function (count) {
									scope.count = count;
								});
							}
						},
						link: function (options) {
							options = options || {};
							var urlOptions = options.urlOptions || {};
							urlOptions.url = $scope.url;
							urlOptions.title = $scope.title;
							urlOptions.image = $scope.image;
							urlOptions.description = $scope.description || '';
							return ctrl.makeUrl(options.clickUrl || options.popup.url, urlOptions);
						},
						clickShare: function (e, options) {
							if (e.shiftKey || e.ctrlKey) {
								return;
							}
							e.preventDefault();

							var process = true;
							if (angular.isFunction(options.click)) {
								process = options.click.call(this, options);
							}
							if (process) {
								var url = ctrl.link(options);
								ctrl.openPopup(url, options.popup);
							}
						},
						openPopup: function (url, params) {
							var left = Math.round(screen.width / 2 - params.width / 2),
								top = 0;
							if (screen.height > params.height) {
								top = Math.round(screen.height / 3 - params.height / 2);
							}

							var win = window.open(
								url,
								'sl_' + this.service,
								'left=' + left + ',top=' + top + ',' +
								'width=' + params.width + ',height=' + params.height + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1'
							);
							if (win) {
								win.focus();
							} else {
								location.href = url;
							}
						},
						getCount: function (options) {
							var def = $q.defer();
							var urlOptions = options.urlOptions || {};
							urlOptions.url = $scope.url;
							urlOptions.title = $scope.title;
							var url = ctrl.makeUrl(options.counter.url, urlOptions);
							if (options.counter.get) {
								options.counter.get(url, def, $http);
							} else {
								$http.jsonp(url).success(function (res) {
									if (options.counter.getNumber) {
										def.resolve(options.counter.getNumber(res));
									} else {
										def.resolve(res);
									}
								});
							}
							return def.promise;
						},
						makeUrl: function (url, context) {
							return template(url, context, encodeURIComponent);
						}
					};
					return ctrl;
				}
			]
		};
	}
]);

angular.module('core').directive('ngSocialFacebook', function () {
	var options = {
		counter: {
			url: 'http://graph.facebook.com/fql?q=SELECT+total_count+FROM+link_stat+WHERE+url%3D%22{url}%22&callback=JSON_CALLBACK',
			getNumber: function (data) {
				return data.data[0].total_count;
			}
		},
		popup: {
			url: 'https://www.facebook.com/dialog/feed?app_id=145634995501895&display=popup&caption=An%20example%20caption&link=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdialogs%2F&redirect_uri=https://developers.facebook.com/tools/explorer',
			width: 600,
			height: 500
		}
	};
	return {
		restrict: 'C',
		require: '^?ngSocialButtons',
		scope: true,
		replace: true,
		transclude: true,
		template: '<li class="facebook">' +
			'<i class="fa fa-facebook"></i>' +
			'<div class="shaingstats">' +
			'<h5>{{count}}</h5>' +
			'<p>Shares</p>' +
			'</div>' +
			'<a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="link"></a>' +
			'</li>',
		controller: function ($scope) {},
		link: function (scope, element, attrs, ctrl) {
			element.addClass('ng-social-facebook');
			if (!ctrl) {
				return;
			}
			scope.options = options;
			scope.ctrl = ctrl;
			ctrl.init(scope, element, options);
		}
	};
});

angular.module('core').directive('ngSocialTwitter', function () {
	var options = {
		counter: {
			url: 'http://urls.api.twitter.com/1/urls/count.json?url={url}&callback=JSON_CALLBACK',
			getNumber: function (data) {
				return data.count;
			}
		},
		popup: {
			url: 'http://twitter.com/intent/tweet?url={url}&text={title}&related=trollozans&via=trollozans',
			width: 600,
			height: 450
		},
		click: function (options) {
			// Add colon to improve readability
			if (!/[\.:\-–—]\s*$/.test(options.pageTitle)) options.pageTitle += ':';
			return true;
		}
	};
	return {
		restrict: 'C',
		require: '^?ngSocialButtons',
		scope: true,
		replace: true,
		transclude: true,
		template: '<li class="twitter">' +
			'<i class="fa fa-twitter"></i>' +
			'<div class="shaingstats">' +
			'<h5>{{count}}</h5>' +
			'<p>Tweets</p>' +
			'</div>' +
			'<a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="link"></a>' +
			'</li>',
		controller: function ($scope) {},
		link: function (scope, element, attrs, ctrl) {
			element.addClass('ng-social-twitter');
			if (!ctrl) {
				return;
			}
			scope.options = options;
			scope.ctrl = ctrl;
			ctrl.init(scope, element, options);
		}
	};
});