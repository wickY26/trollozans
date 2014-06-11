'use strict';

//Poems service used to communicate Poems REST endpoints
angular.module('poems').factory('Poems', ['$resource',
	function($resource) {
		return $resource('poems/:poemId', { poemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);