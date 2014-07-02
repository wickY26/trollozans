'use strict';

angular.module('core').directive('stickyNav', [

	function () {
		return {
			restrict: 'EA',
			link: function postLink(scope, element, attrs) {
				var s = jQuery(".stickynav");
				var pos = s.position();
				jQuery(window).scroll(function () {
					var windowpos = jQuery(window).scrollTop();

					if (windowpos >= pos.top) {
						s.addClass("stick");
					} else {
						s.removeClass("stick");
					}
				});
			}
		};
	}
]);