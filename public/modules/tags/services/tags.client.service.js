'use strict';

//Tags service used to communicate Tags REST endpoints
angular.module('tags').factory('Tags', ['$resource',
	function($resource) {
		return $resource('tags/:tagId', { tagId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);