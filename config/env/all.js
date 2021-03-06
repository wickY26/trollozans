'use strict';

module.exports = {
	app: {
		title: 'Troll Ozanlar',
		description: 'Troll Ozans. Güncel konular üzerinden şiir yazarak geyik yapabileceğiniz platform',
		keywords: 'fun'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/select2/select2.css',
				'public/lib/select2-bootstrap-css/select2-bootstrap.css',
				'public/lib/angular-busy/dist/angular-busy.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.js',
				'public/lib/angular/angular.js',
				'public/lib/select2/select2.js',
				'public/lib/lodash/dist/lodash.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-ui-select2/src/select2.js',
				'public/lib/restangular/dist/restangular.js',
				'public/lib/lodash/dist/lodash.js',
				'public/lib/angular-busy/dist/angular-busy.js'
			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/assets/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js',
			'public/assets/js/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};