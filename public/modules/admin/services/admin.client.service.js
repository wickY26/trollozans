'use strict';

/**
 * Restangular Service For Admin operations
 * @param  {[type]} Restangular) {		return    Restangular.service('admin');	}] [description]
 * @return {[type]}              [description]
 */
angular.module('admin').factory('Admin', ['Restangular',
	function (Restangular) {
		return Restangular.service('admin');
	}
]);