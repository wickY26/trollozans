'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Poem = mongoose.model('Poem'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function (err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
		case 11000:
		case 11001:
			message = 'Poem already exists';
			break;
		default:
			message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Poem
 */
exports.create = function (req, res) {
	var poem = new Poem(req.body);
	poem.author = req.user;

	poem.save(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(poem);
		}
	});
};

/**
 * Show the current Poem
 */
exports.read = function (req, res) {
	res.jsonp(req.poem);
};

/**
 * Update a Poem
 */
exports.update = function (req, res) {
	var poem = req.poem;

	poem = _.extend(poem, req.body);

	poem.save(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(poem);
		}
	});
};

/**
 * Delete an Poem
 */
exports.delete = function (req, res) {
	var poem = req.poem;

	poem.remove(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(poem);
		}
	});
};

/**
 * List of Poems
 */
exports.list = function (req, res) {
	Poem.find().sort('-created').populate('author').exec(function (err, poems) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(poems);
		}
	});
};

/**
 * Poem middleware
 */
exports.poemByID = function (req, res, next, id) {
	Poem.findById(id).populate('author').exec(function (err, poem) {
		if (err) return next(err);
		if (!poem) return next(new Error('Failed to load Poem ' + id));
		req.poem = poem;
		next();
	});
};

/**
 * Poem authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
	if (req.poem.author.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};