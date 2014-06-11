'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Topic Schema
 */
var TopicSchema = new Schema({
	/**
	 * Title of Topic
	 * @type {String}
	 */
	title: {
		type: String,
		default: '',
		required: 'Please fill Topic title',
		trim: true
	},
	/**
	 * Description of Topic
	 * @type {String}
	 */
	description: {
		type: String,
		required: 'Please fill Topic description'
	},
	/**
	 * Like Count of Topic
	 * @type {Number}
	 */
	likeCount: {
		type: Number,
		default: 0
	},
	/**
	 * Popularity of Topic
	 * @type {Number}
	 */
	popularity: {
		type: Number,
		default: 0
	},
	/**
	 * Tags of Topic
	 * @type {Array}
	 */
	tags: [{
		type: Schema.ObjectId,
		ref: 'Tag'
	}],
	/**
	 * Content of Topic
	 * @type {Object}
	 */
	content: {
		/**
		 * Type of Content
		 * Available options are image youtube and dailymotion
		 * @type {String}
		 */
		type: {
			type: String,
			default: ' image',
			required: 'Please select a Content type',
		},
		/**
		 * URL of Content
		 * @type {String}
		 */
		url: {
			type: String,
			required: 'Please fill Content url'
		}
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
	 * Creator of Topic
	 * @type {Object}
	 */
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Topic', TopicSchema);