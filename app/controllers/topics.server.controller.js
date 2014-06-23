'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Topic = mongoose.model('Topic'),
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
			message = 'Topic already exists';
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
 * Create a Topic
 */
exports.create = function (req, res) {
	var topic = new Topic(req.body);
	topic.creator = req.user;

	topic.save(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(topic);
		}
	});
};

/**
 * Show the current Topic
 */
exports.read = function (req, res) {
	res.jsonp(req.topic);
};

/**
 * Update a Topic
 */
exports.update = function (req, res) {
	var topic = req.topic;

	topic = _.extend(topic, req.body);

	topic.save(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(topic);
		}
	});
};

/**
 * Delete an Topic
 */
exports.delete = function (req, res) {
	var topic = req.topic;

	topic.remove(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(topic);
		}
	});
};

/**
 * List of Topics
 */
exports.list = function (req, res) {
	Topic.find().sort('-created').populate('creator', 'displayName').exec(function (err, topics) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(topics);
		}
	});
};

exports.getPoems = function (req, res) {
	Topic.findById(req.topic._id).populate('creator', 'displayName').populate('poems').exec(function (err, topic) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(topic);
		}
	});
};

exports.createPoem = function (req, res) {
	var poem = new Poem(req.body);
	poem.author = req.user;

	poem.save(function (err, poem) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			console.log('poem', poem);
			var topic = req.topic;
			topic.poems.push(poem);

			topic.save(function (err, topic) {
				if (err) {
					return res.send(400, {
						message: getErrorMessage(err)
					});
				} else {
					res.jsonp(topic);
				}
			});
		}
	});
};

/**
 * Topic middleware
 */
exports.topicByID = function (req, res, next, id) {
	Topic.findById(id).populate('creator', 'displayName').exec(function (err, topic) {
		if (err) return next(err);
		if (!topic) return next(new Error('Failed to load Topic ' + id));
		req.topic = topic;
		next();
	});
};

/**
 * Topic authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
	if (req.topic.creator.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};