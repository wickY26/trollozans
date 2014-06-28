'use strict';

// Configuring the Articles module
angular.module('topics').run(['Menus',
	function (Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Admin', 'topics', 'dropdown', '/admin/topics(/create)?', false, ['author', 'admin']);
		Menus.addSubMenuItem('topbar', 'topics', 'List Topics', 'admin/topics');
		Menus.addSubMenuItem('topbar', 'topics', 'New Topic', 'admin/topics/create');

		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Topics', 'topics', 'button', '/topics', true);
	}
]);