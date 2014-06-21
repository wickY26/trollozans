'use strict';

// Setting up select2
angular.module('core').run(['uiSelect2Config',
	function (uiSelect2Config) {
		// init selection should be there even it is an empty function
		// otherwise select2 will throw error
		uiSelect2Config.initSelection = function () {};
		// defeault placeholder text
		uiSelect2Config.placeholder = 'Please Select';
		// single select is default
		uiSelect2Config.multiple = false;
	}
]);