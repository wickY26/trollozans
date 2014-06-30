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
		required: 'Please fill Poem Content'
	},

	/**
	 * users who liked this poem
	 * @type {Array}
	 */
	usersLiked: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
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