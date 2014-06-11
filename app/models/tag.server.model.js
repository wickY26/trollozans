'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tag Schema
 */
var TagSchema = new Schema({
	/**
	 * Title of Tag
	 * @type {Object}
	 */
	title: {
		type: String,
		default: '',
		required: 'Please fill Tag title',
		trim: true
	},
	/**
	 * Description of Tag
	 * @type {Object}
	 */
	description: {
		type: String,
		required: 'Please fill Tag description'
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
	 * Creator of Tag
	 * @type {Object}
	 */
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tag', TagSchema);