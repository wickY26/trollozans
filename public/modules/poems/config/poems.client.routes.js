'use strict';

//Setting up route
angular.module('poems').config(['$stateProvider',
	function($stateProvider) {
		// Poems state routing
		$stateProvider.
		state('listPoems', {
			url: '/poems',
			templateUrl: 'modules/poems/views/list-poems.client.view.html'
		}).
		state('createPoem', {
			url: '/poems/create',
			templateUrl: 'modules/poems/views/create-poem.client.view.html'
		}).
		state('viewPoem', {
			url: '/poems/:poemId',
			templateUrl: 'modules/poems/views/view-poem.client.view.html'
		}).
		state('editPoem', {
			url: '/poems/:poemId/edit',
			templateUrl: 'modules/poems/views/edit-poem.client.view.html'
		});
	}
]);