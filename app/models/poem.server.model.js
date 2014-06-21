'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Poem Schema
 */
var PoemSchema = new Schema({
	/**
	 * Content of Poem
	 * @type {String}
	 */
	content: {
		type: String,
		required: 'Please fill Poem content'
	},
	/**
	 * Topic of Poem
	 * @type {Object}
	 */
	topic: {
		type: Schema.ObjectId,
		ref: 'Topic',
		required: 'Please fill Poem topic'
	},
	/**
	 * Like Count of Poem
	 * @type {Number}
	 */
	likeCount: {
		type: Number,
		default: 0
	},
	/**
	 * Approve flag of Poem
	 * @type {Boolean}
	 */
	isApproved: {
		type: Boolean,
		default: false
	},
	/**
	 * Approver of Poem
	 * @type {Object}
	 */
	approver: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	/**
	 * Created date of Topic
	 * @type {Date}
	 */
	created: {
		type: Date,
		default: Date.now
	},
	/**
	 * Author of Poem
	 * @type {Object}
	 */
	author: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Poem', PoemSchema);