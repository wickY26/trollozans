'use strict';

//Poems service used to communicate Poems REST endpoints
angular.module('topics').factory('Poems', ['Restangular',
	function (Restangular) {
		console.log('Restangular',Restangular.service('poems'));
		return Restangular.all('poems');
	}
]);