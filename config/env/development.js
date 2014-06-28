'use strict';

module.exports = {
	db: 'mongodb://localhost/trollozans-dev',
	app: {
		title: 'trollozans - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '480284548773404',
		clientSecret: process.env.FACEBOOK_SECRET || 'bb416739210cde331c3721b0c252fed8',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'JvwRhM936hotZ3G7LqvapZZ0a',
		clientSecret: process.env.TWITTER_SECRET || '1GWUkUk8ScNeyaR0zRQLqfXX7sK4YJRyQMMGTjYIylyFl3KgG9',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '114200178611-q0cblb6p832rmumgt5eo3k2dg1744afm.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'hh7M_MSylCWtV4jNjx0P-5te',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	}
};