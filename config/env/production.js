'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/trollozans',
	assets: {
		lib: {
			css: [
				'public/lib/theme/css/bootstrap.css',
				'public/lib/select2/select2.css',
				'public/lib/select2-bootstrap-css/select2-bootstrap.css',
				'public/lib/theme/css/font-awesome.min.css',
				'public/lib/theme/css/style.css',
				'public/lib/angular-busy/dist/angular-busy.min.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular/angular.min.js',
				'public/lib/select2/select2.min.js',
				'public/lib/lodash/dist/lodash.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/angular-ui-select2/src/select2.js',
				'public/lib/restangular/dist/restangular.min.js',
				'public/lib/lodash/dist/lodash.min.js',
				'public/lib/angular-busy/dist/angular-busy.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '480284548773404',
		clientSecret: process.env.FACEBOOK_SECRET || 'bb416739210cde331c3721b0c252fed8',
		callbackURL: 'http://wwww.trollozans.com/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'JvwRhM936hotZ3G7LqvapZZ0a',
		clientSecret: process.env.TWITTER_SECRET || '1GWUkUk8ScNeyaR0zRQLqfXX7sK4YJRyQMMGTjYIylyFl3KgG9',
		callbackURL: 'http://wwww.trollozans.com/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '114200178611-q0cblb6p832rmumgt5eo3k2dg1744afm.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'hh7M_MSylCWtV4jNjx0P-5te',
		callbackURL: 'http://wwww.trollozans.com/auth/google/callback'
	}
};