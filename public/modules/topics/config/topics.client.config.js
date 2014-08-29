'use strict';

// Configuring the Articles module
angular.module('topics').run(['Menus',
	function (Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Admin-Topics', 'admin/topics', 'button', '/admin/topics', false, ['author', 'admin']);
		Menus.addMenuItem('topbar', 'Admin-Poems', 'admin/poems', 'button', '/admin/poems', false, ['author', 'admin']);

		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Topics', 'topics', 'button', '/topics', true);
	}
]);