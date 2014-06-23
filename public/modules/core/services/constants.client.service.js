'use strict';

//Constant service used for managing  constants
angular.module('core').service('Constants', [

	function () {
		// Define content types
		this.contentTypes = {
			'image': 'Image',
			'youtube': 'Youtube',
			'dailymotion': 'Daily Motion',
			'vimeo': 'Vimeo',
			'izlesene': 'Izlesene',
		};

		// create select2 data array from given object reference 
		this.createSelect2Data = function (reference) {
			// select2 data array
			var data = [];
			// check object with given reference
			if (this[reference]) {
				angular.forEach(this[reference], function (value, key) {
					data.push({
						'id': key,
						'text': value
					});
				});
				return data;
			} else {
				console.error('No object with given reference');
				return data;
			}
		};

		// Convert select2 selected object to desired one
		this.convertFromSelect2 = function (object, key) {
			// if no key provided set it to id
			key = key || 'id';
			// result
			var result;
			// multiple selection
			if (angular.isArray(object)) {
				// initilize result array
				result = [];
				// get every values of object with given key and push it into result array
				angular.forEach(object, function (value) {
					result.push(value[key]);
				});
				return result;
			}
			// single selection
			else if (angular.isObject(object)) {
				result = object[key];
				return result;
			}
		};

		// Convert value to select2 data object
		this.convertToSelect2 = function (value, reference) {
			if (this[reference] && this[reference][value]) {
				return {
					'id': value,
					'text': this[reference][value]
				};
			} else {
				console.error('No object with given reference or given key');
				return value;
			}
		};
	}
]);