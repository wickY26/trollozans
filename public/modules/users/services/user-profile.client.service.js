'use strict';

//User Profile Service
angular.module('users').factory('UserProfile',
	function () {
		return {
			getUserProfileImageSrc: function (user) {
				if (!user.additionalProvidersData) return '/modules/users/img/user.jpg';
				else if (user.additionalProvidersData.facebook) return 'http://graph.facebook.com/' + user.additionalProvidersData.facebook.id + '/picture?type=square';
				else if (user.additionalProvidersData.twitter) return user.additionalProvidersData.twitter.profile_image_url;
				else if (user.additionalProvidersData.google) return user.additionalProvidersData.google.picture;
			}
		};
	});