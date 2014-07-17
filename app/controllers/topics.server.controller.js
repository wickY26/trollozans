'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Topic = mongoose.model('Topic'),
	User = mongoose.model('User'),
	Poem = mongoose.model('Poem'),
	async = require('async'),
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
 * Save topic to db
 */
var save = function (topic, res) {
	topic.save(function (err, topic) {
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
 * Create a Topic
 */
exports.create = function (req, res) {
	var topic = new Topic(req.body);
	topic.creator = req.user;
	// save topic
	save(topic, res);
};

/**
 * Show the current Topic
 */
exports.read = function (req, res) {
	Topic.findById(req.topic._id)
		.populate('creator', 'displayName')
		.populate({
			path: 'poems',
			match: {
				isApproved: true
			},
			sort: '-created'
		})
		.lean(true)
		.exec(function (err, topic) {
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
 * Update a Topic
 */
exports.update = function (req, res) {
	var topic = req.topic;
	topic = _.extend(topic, req.body);
	// save topic
	save(topic, res);
};

/**
 * Push poem to topic.
 */
exports.pushPoem = function (req, res) {
	var topic = req.topic;
	var poem = req.poem;
	topic.poems.push(poem);
	// save topic
	save(topic, res);
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
	Topic.find()
		.sort('-created')
		.skip(req.query.start)
		.limit(req.query.offset)
		.populate('creator', 'displayName')
		.lean(true)
		.exec(function (err, topics) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				Poem.populate(topics, {
					path: 'poems',
					match: {
						isApproved: true
					},
					sort: '-created',
					options: {
						limit: 3
					}
				}, function (err, topics) {
					if (err) {
						return res.send(400, {
							message: getErrorMessage(err)
						});
					} else {
						User.populate(topics, {
							path: 'poems.author'
						}, function (err, topics) {
							if (err) {
								return res.send(400, {
									message: getErrorMessage(err)
								});
							} else {
								_.forEach(topics, function (topic) {
									if (_.size(topic.poems) > 3) {
										topic.poems = topic.poems.slice(0, 3);
									}
								});
								res.jsonp(topics);
							}
						});
					}
				});

			}
		});
};

exports.listByUnapproveCount = function (req, res) {
	Topic.find()
		.sort('-created')
		.skip(req.query.start)
		.limit(req.query.offset)
		.populate('creator', 'displayName')
		.populate({
			path: 'poems',
			match: {
				isApproved: false
			},
			sort: '-created',
		})
		.lean(true)
		.exec(function (err, topics) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				res.jsonp(topics);
			}
		});
};

/**
 * Topic middleware
 */
exports.topicByID = function (req, res, next, id) {
	Topic.findById(id)
		.populate('creator', 'displayName')
		.exec(function (err, topic) {
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
	if (!_.contains(req.user.roles, 'admin') || req.topic.creator.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	} else {
		next();
	}
};

/**
 * Topic permission middleware
 */
exports.hasPermission = function (req, res, next) {
	if (_.contains(req.user.roles, 'admin') || _.contains(req.user.roles, 'author')) {
		next();
	} else {
		return res.send(403, 'User has no permission');
	}
};

/**
 * Topic validation middleware
 */
exports.validate = function (req, res, next) {
	next();
};

/**
 * Topic canlike middleware if can like change the req poem
 */
exports.canLike = function (req, res, next) {

	var topic = req.topic;
	if (topic.usersLiked.indexOf(req.user._id) > -1) {
		return res.send(401, 'User has not permisson. Liked already');
	} else {
		topic.usersLiked.push(req.user._id);
		next();
	}
};

/**
 * Topic canlike middleware if can like change the req poem
 */
exports.canUnlike = function (req, res, next) {

	var topic = req.topic;
	if (topic.usersLiked.indexOf(req.user._id) > -1) {
		topic.usersLiked.pop(req.user._id);
		next();
	} else {
		return res.send(401, 'User has not permisson. UnLiked already');
	}
};