'use strict';

// Setting up restangular
angular.module('core').config(['RestangularProvider',
	function (RestangularProvider) {
		// set the id field to _id for mongoDB integration
		RestangularProvider.setRestangularFields({
			id: '_id'
		});
	}
]);