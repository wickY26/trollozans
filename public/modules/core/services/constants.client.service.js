'use strict';

//Constant service used for managing  constants
angular.module('core').service('Constants', [
	function () {
		// Define content types
		this.contentTypes = [{
			'id': 'image',
			'text': 'Image'
		}, {
			'id': 'youtube',
			'text': 'Youtube'
		}, {
			'id': 'dailymotion',
			'text': 'Daily Motion'
		}, {
			'id': 'vimeo',
			'text': 'Vimeo'
		}, {
			'id': 'izlesene',
			'text': 'Izlesene'
		}];

		// Convert select2 selected object to desired one
		this.convertFromSelect2 = function (object, key) {
			// if no key provided set it to id
			key = key || 'id';
			// result
			var result;
			if (angular.isArray(object)) {
				// initilize result array
				result = [];
				// get every values of object with given key and push it into result array
				angular.forEach(object, function (value) {
					result.push(value[key]);
				});
				return result;
			} else if (angular.isObject(object)) {
				result = object[key];
				return result;
			}
		};
	}
]);