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
	 * Popularity of Topic
	 * @type {Number}
	 */
	popularity: {
		type: Number,
		default: 0
	},
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
		 * Reference of Content
		 * @type {String}
		 */
		reference: {
			type: String,
			required: 'Please fill Content reference'
		}
	},
	/**
	 * Poems of Topic
	 * @type {Array}
	 */
	poems: [{
		type: Schema.ObjectId,
		ref: 'Poem'
	}],
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