'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'trollozans';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ui.select2'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName) {
      // Create angular module
      angular.module(moduleName, []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('poems');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('tags');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('topics');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic || this.menus[menuId].isPublic,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Configuring the Articles module
angular.module('poems').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Poems', 'poems', 'dropdown', '/poems(/create)?');
    Menus.addSubMenuItem('topbar', 'poems', 'List Poems', 'poems');
    Menus.addSubMenuItem('topbar', 'poems', 'New Poem', 'poems/create');
  }
]);'use strict';
//Setting up route
angular.module('poems').config([
  '$stateProvider',
  function ($stateProvider) {
    // Poems state routing
    $stateProvider.state('listPoems', {
      url: '/poems',
      templateUrl: 'modules/poems/views/list-poems.client.view.html'
    }).state('createPoem', {
      url: '/poems/create',
      templateUrl: 'modules/poems/views/create-poem.client.view.html'
    }).state('viewPoem', {
      url: '/poems/:poemId',
      templateUrl: 'modules/poems/views/view-poem.client.view.html'
    }).state('editPoem', {
      url: '/poems/:poemId/edit',
      templateUrl: 'modules/poems/views/edit-poem.client.view.html'
    });
  }
]);'use strict';
// Poems controller
angular.module('poems').controller('PoemsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Poems',
  'Topics',
  'Tags',
  function ($scope, $stateParams, $location, Authentication, Poems, Topics, Tags) {
    $scope.authentication = Authentication;
    // Create new Poem
    $scope.create = function () {
      // Create new Poem object
      var poem = new Poems({
          content: this.content,
          topic: this.topic,
          title: this.title,
          tags: [this.tag]
        });
      // Redirect after save
      poem.$save(function (response) {
        $location.path('poems/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      // Clear form fields
      this.content = '';
      this.topic = '';
      this.title = '';
      this.tag = '';
    };
    // Remove existing Poem
    $scope.remove = function (poem) {
      if (poem) {
        poem.$remove();
        for (var i in $scope.poems) {
          if ($scope.poems[i] === poem) {
            $scope.poems.splice(i, 1);
          }
        }
      } else {
        $scope.poem.$remove(function () {
          $location.path('poems');
        });
      }
    };
    // Update existing Poem
    $scope.update = function () {
      var poem = $scope.poem;
      poem.$update(function () {
        $location.path('poems/' + poem._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Poems
    $scope.find = function () {
      $scope.poems = Poems.query();
    };
    // Find existing Poem
    $scope.findOne = function () {
      $scope.poem = Poems.get({ poemId: $stateParams.poemId });
    };
    // Find a list of Topics
    $scope.findTopics = function () {
      $scope.topics = Topics.query();
    };
    // Find a list of Tags
    $scope.findTags = function () {
      $scope.tags = Tags.query();
    };
  }
]);'use strict';
//Poems service used to communicate Poems REST endpoints
angular.module('poems').factory('Poems', [
  '$resource',
  function ($resource) {
    return $resource('poems/:poemId', { poemId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('tags').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Tags', 'tags', 'dropdown', '/tags(/create)?');
    Menus.addSubMenuItem('topbar', 'tags', 'List Tags', 'tags');
    Menus.addSubMenuItem('topbar', 'tags', 'New Tag', 'tags/create');
  }
]);'use strict';
//Setting up route
angular.module('tags').config([
  '$stateProvider',
  function ($stateProvider) {
    // Tags state routing
    $stateProvider.state('listTags', {
      url: '/tags',
      templateUrl: 'modules/tags/views/list-tags.client.view.html'
    }).state('createTag', {
      url: '/tags/create',
      templateUrl: 'modules/tags/views/create-tag.client.view.html'
    }).state('viewTag', {
      url: '/tags/:tagId',
      templateUrl: 'modules/tags/views/view-tag.client.view.html'
    }).state('editTag', {
      url: '/tags/:tagId/edit',
      templateUrl: 'modules/tags/views/edit-tag.client.view.html'
    });
  }
]);'use strict';
// Tags controller
angular.module('tags').controller('TagsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Tags',
  function ($scope, $stateParams, $location, Authentication, Tags) {
    $scope.authentication = Authentication;
    // Create new Tag
    $scope.create = function () {
      // Create new Tag object
      var tag = new Tags({
          title: this.title,
          description: this.description
        });
      // Redirect after save
      tag.$save(function (response) {
        $location.path('tags/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      // Clear form fields
      this.title = '';
      this.description = '';
    };
    // Remove existing Tag
    $scope.remove = function (tag) {
      if (tag) {
        tag.$remove();
        for (var i in $scope.tags) {
          if ($scope.tags[i] === tag) {
            $scope.tags.splice(i, 1);
          }
        }
      } else {
        $scope.tag.$remove(function () {
          $location.path('tags');
        });
      }
    };
    // Update existing Tag
    $scope.update = function () {
      var tag = $scope.tag;
      tag.$update(function () {
        $location.path('tags/' + tag._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Tags
    $scope.find = function () {
      $scope.tags = Tags.query();
    };
    // Find existing Tag
    $scope.findOne = function () {
      $scope.tag = Tags.get({ tagId: $stateParams.tagId });
    };
  }
]);'use strict';
//Tags service used to communicate Tags REST endpoints
angular.module('tags').factory('Tags', [
  '$resource',
  function ($resource) {
    return $resource('tags/:tagId', { tagId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('topics').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Topics', 'topics', 'dropdown', '/topics(/create)?');
    Menus.addSubMenuItem('topbar', 'topics', 'List Topics', 'topics');
    Menus.addSubMenuItem('topbar', 'topics', 'New Topic', 'topics/create');
  }
]);'use strict';
//Setting up route
angular.module('topics').config([
  '$stateProvider',
  function ($stateProvider) {
    // Topics state routing
    $stateProvider.state('listTopics', {
      url: '/topics',
      templateUrl: 'modules/topics/views/list-topics.client.view.html'
    }).state('createTopic', {
      url: '/topics/create',
      templateUrl: 'modules/topics/views/create-topic.client.view.html'
    }).state('viewTopic', {
      url: '/topics/:topicId',
      templateUrl: 'modules/topics/views/view-topic.client.view.html'
    }).state('editTopic', {
      url: '/topics/:topicId/edit',
      templateUrl: 'modules/topics/views/edit-topic.client.view.html'
    });
  }
]);'use strict';
// Topics controller
angular.module('topics').controller('TopicsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Topics',
  'Tags',
  function ($scope, $stateParams, $location, Authentication, Topics, Tags) {
    $scope.authentication = Authentication;
    // Create new Topic
    $scope.create = function () {
      // Create new Topic object
      var topic = new Topics({
          title: this.title,
          content: this.content,
          tags: [this.tag],
          description: this.description
        });
      // Redirect after save
      topic.$save(function (response) {
        $location.path('topics/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      // Clear form fields
      this.title = '';
      this.content = {};
      this.tag = '';
      this.description = '';
    };
    // Remove existing Topic
    $scope.remove = function (topic) {
      if (topic) {
        topic.$remove();
        for (var i in $scope.topics) {
          if ($scope.topics[i] === topic) {
            $scope.topics.splice(i, 1);
          }
        }
      } else {
        $scope.topic.$remove(function () {
          $location.path('topics');
        });
      }
    };
    // Update existing Topic
    $scope.update = function () {
      var topic = $scope.topic;
      topic.$update(function () {
        $location.path('topics/' + topic._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Topics
    $scope.find = function () {
      $scope.topics = Topics.query();
    };
    // Find existing Topic
    $scope.findOne = function () {
      $scope.topic = Topics.get({ topicId: $stateParams.topicId });
    };
    // Find a list of Tags
    $scope.findTags = function () {
      $scope.tags = Tags.query();
    };
  }
]);'use strict';
// Topics directive
angular.module('topics').directive('bindUnsafeHtml', [
  '$compile',
  function ($compile) {
    return function (scope, element, attrs) {
      scope.$watch(function (scope) {
        // watch the 'bindUnsafeHtml' expression for changes
        return scope.$eval(attrs.bindUnsafeHtml);
      }, function (value) {
        // when the 'bindUnsafeHtml' expression changes
        // assign it into the current DOM
        element.html(value);
        // compile the new DOM and link it to the current
        // scope.
        // NOTE: we only compile .childNodes so that
        // we don't get into infinite loop compiling ourselves
        $compile(element.contents())(scope);
      });
    };
  }
]);'use strict';
//Topics service used to communicate Topics REST endpoints
angular.module('topics').factory('Topics', [
  '$resource',
  function ($resource) {
    return $resource('topics/:topicId', { topicId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/signin.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function () {
      $scope.success = $scope.error = null;
      var user = new Users($scope.user);
      user.$update(function (response) {
        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);