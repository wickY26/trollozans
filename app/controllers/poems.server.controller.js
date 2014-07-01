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
exports.create = function (req, res, next) {
	var poem = new Poem(req.body);
	poem.author = req.user;

	poem.save(function (err, poem) {
		if (poem) {
			req.poem = poem;
		}
		next(err);
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
	Poem.find().sort('-created').populate('author', 'displayName').exec(function (err, poems) {
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
	Poem.findById(id).populate('author', 'displayName').exec(function (err, poem) {
		if (err) return next(err);
		if (!poem) return next(new Error('Failed to load Poem ' + id));
		req.poem = poem;
		next();
	});
};

/**u
 * Poem authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
	if (!_.contains(req.user.roles, 'admin') || req.poem.author.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};

/**
 * Poem permission middleware
 */
exports.hasPermission = function (req, res, next) {
	if (_.contains(req.user.roles, 'admin') || _.contains(req.user.roles, 'author')) {
		next();
	} else {
		return res.send(401, 'User has no permission');
	}
};

/**
 * Poem validation middleware
 */
exports.validate = function (req, res, next) {
	next();
};

/**
 * Poem canlike middleware if can like change the req poem
 */
exports.canLike = function (req, res, next) {

	var poem = req.poem;
	if (poem.usersLiked.indexOf(req.user._id) > -1) {
		return res.send(401, 'User has not permisson. Liked already');
	} else {
		poem.usersLiked.push(req.user._id);
	}
	next();
};

/**
 * Poem canlike middleware if can like change the req poem
 */
exports.canUnlike = function (req, res, next) {

	var poem = req.poem;
	if (poem.usersLiked.indexOf(req.user._id) > -1) {
		poem.usersLiked.pop(req.user._id);
	} else {
		return res.send(401, 'User has not permisson. UnLiked already');
	}
	next();
};

/**
 * Poem approve middleware change the req poem
 */
exports.approve = function (req, res, next) {

	var poem = req.poem;
	if (poem.isApproved) {
		return res.send(200, 'Already Approved No Need to approve Again');
	}

	poem.isApproved = true;

	next();
};