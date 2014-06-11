'use strict';

// Configuring the Articles module
angular.module('poems').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Poems', 'poems', 'dropdown', '/poems(/create)?');
		Menus.addSubMenuItem('topbar', 'poems', 'List Poems', 'poems');
		Menus.addSubMenuItem('topbar', 'poems', 'New Poem', 'poems/create');
	}
]);