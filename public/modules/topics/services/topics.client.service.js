'use strict';

//Topics service used to communicate Topics REST endpoints
angular.module('topics').factory('Topics', ['Restangular',
	function (Restangular) {
		// Popular Topics Holder
		var popularTopics;
		// Random Topics Holder
		var randomTopics;

		var TopicService = {
			createTopic: function (topic) {
				return Restangular.service('topics').post(topic);
			},
			findTopics: function (query) {
				return Restangular.service('topics').getList(query);
			},
			findTopic: function (topicId) {
				return Restangular.service('topics').one(topicId).get();
			},
			likeTopic: function (topicId) {
				return Restangular.service('topics/like').one(topicId).put();
			},
			unlikeTopic: function (topicId) {
				return Restangular.service('topics/unlike').one(topicId).put();
			},
			findTopicPoems: function (topicId) {
				return Restangular.service('topics/poems').one(topicId).getList();
			},
			createTopicPoem: function (topicId, poem) {
				return Restangular.service('topics/poems/' + topicId).post(poem);
			},
			popularTopics: function () {
				if (popularTopics) return popularTopics;
				else {
					popularTopics = this.findTopics({
						start: 0,
						offset: 6
					}).$object;
					return popularTopics;
				}
			}
		};
		return TopicService;
	}
]);