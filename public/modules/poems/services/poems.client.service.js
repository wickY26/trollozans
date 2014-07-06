'use strict';

//Poems service used to communicate Poems REST endpoints
angular.module('topics').factory('Poems', ['Restangular',
	function (Restangular) {
		return Restangular.service('poems');
	}
]);