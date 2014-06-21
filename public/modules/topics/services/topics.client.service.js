'use strict';

//Topics service used to communicate Topics REST endpoints
angular.module('topics').factory('Topics', ['Restangular',
	function (Restangular) {
		return Restangular.service('topics');
	}
]);