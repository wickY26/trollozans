'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Tag = mongoose.model('Tag'),
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
			message = 'Tag already exists';
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
 * Create a Tag
 */
exports.create = function (req, res) {
	var tag = new Tag(req.body);
	tag.creator = req.user;

	tag.save(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tag);
		}
	});
};

/**
 * Show the current Tag
 */
exports.read = function (req, res) {
	res.jsonp(req.tag);
};

/**
 * Update a Tag
 */
exports.update = function (req, res) {
	var tag = req.tag;

	tag = _.extend(tag, req.body);

	tag.save(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tag);
		}
	});
};

/**
 * Delete an Tag
 */
exports.delete = function (req, res) {
	var tag = req.tag;

	tag.remove(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tag);
		}
	});
};

/**
 * List of Tags
 */
exports.list = function (req, res) {
	Tag.find().sort('-created').populate('creator', 'displayName').exec(function (err, tags) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tags);
		}
	});
};

/**
 * Tag middleware
 */
exports.tagByID = function (req, res, next, id) {
	Tag.findById(id).populate('creator', 'displayName').exec(function (err, tag) {
		if (err) return next(err);
		if (!tag) return next(new Error('Failed to load Tag ' + id));
		req.tag = tag;
		next();
	});
};

/**
 * Tag authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
	if (req.tag.creator.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};