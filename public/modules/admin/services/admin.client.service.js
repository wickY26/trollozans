'use strict';

//Topics service used to communicate Topics REST endpoints
angular.module('admin').factory('Admin', ['Restangular',
	function (Restangular) {
		return Restangular.service('admin');
	}
]);