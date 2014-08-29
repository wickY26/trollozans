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
        'ui.select2',
        'restangular',
        'cgBusy'
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
/**
 * Admin Module
 */
ApplicationConfiguration.registerModule('admin');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('poems');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('topics');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
/**
 * Angular Client Rules for Admin Pages
 */
angular.module('admin').config([
  '$stateProvider',
  function ($stateProvider) {
    // Topics state routing
    $stateProvider.state('listTopics', {
      url: '/admin/topics',
      templateUrl: 'modules/admin/views/list-topics.client.view.html'
    }).state('createTopic', {
      url: '/admin/topics/create',
      templateUrl: 'modules/admin/views/create-topic.client.view.html'
    }).state('viewTopic', {
      url: '/admin/topics/:topicId',
      templateUrl: 'modules/admin/views/view-topic.client.view.html'
    }).state('editTopic', {
      url: '/admin/topics/:topicId/edit',
      templateUrl: 'modules/admin/views/edit-topic.client.view.html'
    }).state('listPoems', {
      url: '/admin/poems',
      templateUrl: 'modules/admin/views/list-poems.client.view.html'
    });
  }
]);'use strict';
/**
 * Admin Controller for admin jobs.
 * @param  {[type]} $scope         [description]
 * @param  {[type]} $stateParams   [description]
 * @param  {[type]} $location      [description]
 * @param  {[type]} Authentication [description]
 * @param  {[type]} Admin          [description]
 * @return {[type]}                [description]
 */
angular.module('admin').controller('AdminController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Admin',
  'Poems',
  'Constants',
  function ($scope, $stateParams, $location, Authentication, Admin, Poems, Constants) {
    $scope.authentication = Authentication;
    /**
		 * Gets Topics for admins. Admin topics have unapprove poem counts
		 * @return {[type]} [description]
		 */
    $scope.findTopics = function () {
      $scope.topics = Admin.one('topics').getList().$object;
    };
    // Find existing Topic
    $scope.findOne = function () {
      Admin.one('topics', $stateParams.topicId).get().then(function (topic) {
        topic.content.type = Constants.convertToSelect2(topic.content.type, 'contentTypes');
        $scope.topic = topic;
      });
    };
    // contentType select2 options
    $scope.contentTypeOptions = {
      placeholder: 'Select Content Type',
      data: Constants.createSelect2Data('contentTypes')
    };
    // Create new Topic
    $scope.create = function () {
      // set original values from select2 fields
      this.topic.content.type = Constants.convertFromSelect2(this.topic.content.type);
      Admin.post(this.topic).then(function (response) {
        $location.path('topics/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      // Clear form fields
      this.topic = {};
    };
    // Update existing Topic
    $scope.update = function () {
      var topic = $scope.topic;
      // set original values from select2 fields
      topic.content.type = Constants.convertFromSelect2(topic.content.type);
      delete topic.poems;
      topic.save().then(function () {
        $location.path('topics/' + topic._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // find poems those wating for an approval
    $scope.findUnapprovedPoems = function () {
      $scope.poemPromise = Poems.one('waitingForApproval').getList();
      $scope.poemPromise.then(function (poems) {
        $scope.poems = poems;
      });
    };
    $scope.approvePoem = function (poem, index) {
      $scope.poemPromise = Poems.one('approve').one(poem._id).put();
      $scope.poemPromise.then(function (response) {
        $scope.poems.splice(index, 1);
      });
    };
  }
]);'use strict';
/**
 * Restangular Service For Admin operations
 * @param  {[type]} Restangular) {		return    Restangular.service('admin');	}] [description]
 * @return {[type]}              [description]
 */
angular.module('admin').factory('Admin', [
  'Restangular',
  function (Restangular) {
    return Restangular.one('admin');
  }
]);'use strict';
// Setting up restangular
angular.module('core').config([
  'RestangularProvider',
  function (RestangularProvider) {
    // set the id field to _id for mongoDB integration
    RestangularProvider.setRestangularFields({ id: '_id' });
    // using JSonp instead of the regular GET
    RestangularProvider.setDefaultRequestParams('jsonp', { callback: 'JSON_CALLBACK' });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/topics');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/topics/views/main-topics.client.view.html'
    });
  }
]);'use strict';
// Setting up select2
angular.module('core').run([
  'uiSelect2Config',
  function (uiSelect2Config) {
    // init selection should be there even it is an empty function
    // otherwise select2 will throw error
    uiSelect2Config.initSelection = function () {
    };
    // defeault placeholder text
    uiSelect2Config.placeholder = 'Please Select';
    // single select is default
    uiSelect2Config.multiple = false;
  }
]);'use strict';
angular.module('core').controller('FooterController', [
  '$scope',
  'Topics',
  function ($scope, Topics) {
    // Find Popular Topics
    $scope.findPopularTopics = function () {
      // popular topics
      $scope.topics = Topics.popularTopics();
    };
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  'Topics',
  function ($scope, Authentication, Menus, Topics) {
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
    // Find Popular Topics
    $scope.findPopularTopics = function () {
      // popular topics
      $scope.topics = Topics.popularTopics();
    };
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
angular.module('core').directive('likeButton', function () {
  return {
    template: '<div data-ng-if="user">' + '<a class="btn btn-primary btn-xs backcolor" data-ng-click="like()" data-ng-if="!_canLike()"><i class="fa fa-thumbs-up"></i>Like</a>' + '<a class="btn btn-primary btn-xs backcolor" data-ng-click="unlike()" data-ng-if="_canLike()"><i class="fa fa-thumbs-down"></i>Unlike</a>' + '</div>' + '<div data-ng-if="!user">' + '<a class="btn btn-primary btn-xs backcolor" href="/#!/signin"><i class="fa fa-thumbs-up"></i>Like</a>' + '</div>',
    scope: {
      likeArray: '=',
      user: '=',
      like: '&',
      unlike: '&'
    },
    replace: false,
    restrict: 'EA',
    link: function postLink($scope, iElm, iAttrs, controller) {
      // can current user like this topic
      $scope._canLike = function () {
        return _.contains($scope.likeArray, $scope.user._id);
      };
    }
  };
});'use strict';
function template(tmpl, context, filter) {
  return tmpl.replace(/\{([^\}]+)\}/g, function (m, key) {
    // If key don't exists in the context we should keep template tag as is
    return key in context ? filter ? filter(context[key]) : context[key] : m;
  });
}
angular.module('core').directive('ngSocialButtons', [
  '$compile',
  '$q',
  '$parse',
  '$http',
  function ($compile, $q, $parse, $http) {
    return {
      restrict: 'A',
      scope: {
        'url': '=',
        'title': '=',
        'description': '=',
        'image': '='
      },
      replace: true,
      transclude: true,
      template: '<ul ng-transclude></ul>',
      controller: [
        '$scope',
        '$q',
        '$http',
        function ($scope, $q, $http) {
          var ctrl = {
              init: function (scope, element, options) {
                if (options.counter) {
                  ctrl.getCount(scope.options).then(function (count) {
                    scope.count = count;
                  });
                }
              },
              link: function (options) {
                options = options || {};
                var urlOptions = options.urlOptions || {};
                urlOptions.url = $scope.url;
                urlOptions.title = $scope.title;
                urlOptions.image = $scope.image;
                urlOptions.description = $scope.description || '';
                return ctrl.makeUrl(options.clickUrl || options.popup.url, urlOptions);
              },
              clickShare: function (e, options) {
                if (e.shiftKey || e.ctrlKey) {
                  return;
                }
                e.preventDefault();
                var process = true;
                if (angular.isFunction(options.click)) {
                  process = options.click.call(this, options);
                }
                if (process) {
                  var url = ctrl.link(options);
                  ctrl.openPopup(url, options.popup);
                }
              },
              openPopup: function (url, params) {
                var left = Math.round(screen.width / 2 - params.width / 2), top = 0;
                if (screen.height > params.height) {
                  top = Math.round(screen.height / 3 - params.height / 2);
                }
                var win = window.open(url, 'sl_' + this.service, 'left=' + left + ',top=' + top + ',' + 'width=' + params.width + ',height=' + params.height + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');
                if (win) {
                  win.focus();
                } else {
                  location.href = url;
                }
              },
              getCount: function (options) {
                var def = $q.defer();
                var urlOptions = options.urlOptions || {};
                urlOptions.url = $scope.url;
                urlOptions.title = $scope.title;
                var url = ctrl.makeUrl(options.counter.url, urlOptions);
                if (options.counter.get) {
                  options.counter.get(url, def, $http);
                } else {
                  $http.jsonp(url).success(function (res) {
                    if (options.counter.getNumber) {
                      def.resolve(options.counter.getNumber(res));
                    } else {
                      def.resolve(res);
                    }
                  });
                }
                return def.promise;
              },
              makeUrl: function (url, context) {
                return template(url, context, encodeURIComponent);
              }
            };
          return ctrl;
        }
      ]
    };
  }
]);
angular.module('core').directive('ngSocialFacebook', function () {
  var options = {
      counter: {
        url: 'http://graph.facebook.com/fql?q=SELECT+total_count+FROM+link_stat+WHERE+url%3D%22{url}%22&callback=JSON_CALLBACK',
        getNumber: function (data) {
          return data.data[0].total_count;
        }
      },
      popup: {
        url: 'https://www.facebook.com/dialog/feed?app_id=145634995501895&display=popup&caption=An%20example%20caption&link=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdialogs%2F&redirect_uri=https://developers.facebook.com/tools/explorer',
        width: 600,
        height: 500
      }
    };
  return {
    restrict: 'C',
    require: '^?ngSocialButtons',
    scope: true,
    replace: true,
    transclude: true,
    template: '<li class="facebook">' + '<i class="fa fa-facebook"></i>' + '<div class="shaingstats">' + '<h5>{{count}}</h5>' + '<p>Shares</p>' + '</div>' + '<a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="link"></a>' + '</li>',
    controller: [
      '$scope',
      function ($scope) {
      }
    ],
    link: function (scope, element, attrs, ctrl) {
      element.addClass('ng-social-facebook');
      if (!ctrl) {
        return;
      }
      scope.options = options;
      scope.ctrl = ctrl;
      ctrl.init(scope, element, options);
    }
  };
});
angular.module('core').directive('ngSocialTwitter', function () {
  var options = {
      counter: {
        url: 'http://urls.api.twitter.com/1/urls/count.json?url={url}&callback=JSON_CALLBACK',
        getNumber: function (data) {
          return data.count;
        }
      },
      popup: {
        url: 'http://twitter.com/intent/tweet?url={url}&text={title}&related=trollozans&via=trollozans',
        width: 600,
        height: 450
      },
      click: function (options) {
        // Add colon to improve readability
        if (!/[\.:\-–—]\s*$/.test(options.pageTitle))
          options.pageTitle += ':';
        return true;
      }
    };
  return {
    restrict: 'C',
    require: '^?ngSocialButtons',
    scope: true,
    replace: true,
    transclude: true,
    template: '<li class="twitter">' + '<i class="fa fa-twitter"></i>' + '<div class="shaingstats">' + '<h5>{{count}}</h5>' + '<p>Tweets</p>' + '</div>' + '<a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="link"></a>' + '</li>',
    controller: [
      '$scope',
      function ($scope) {
      }
    ],
    link: function (scope, element, attrs, ctrl) {
      element.addClass('ng-social-twitter');
      if (!ctrl) {
        return;
      }
      scope.options = options;
      scope.ctrl = ctrl;
      ctrl.init(scope, element, options);
    }
  };
});'use strict';
angular.module('core').directive('stickyNav', [function () {
    return {
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        var s = jQuery('.stickynav');
        var pos = s.position();
        jQuery(window).scroll(function () {
          var windowpos = jQuery(window).scrollTop();
          if (windowpos >= pos.top) {
            s.addClass('stick');
          } else {
            s.removeClass('stick');
          }
        });
      }
    };
  }]);'use strict';
//Constant service used for managing  constants
angular.module('core').service('Constants', [function () {
    // Define content types
    this.contentTypes = {
      'image': 'Image',
      'youtube': 'Youtube',
      'dailymotion': 'Daily Motion'
    };
    // create select2 data array from given object reference 
    this.createSelect2Data = function (reference) {
      // select2 data array
      var data = [];
      // check object with given reference
      if (this[reference]) {
        angular.forEach(this[reference], function (value, key) {
          data.push({
            'id': key,
            'text': value
          });
        });
        return data;
      } else {
        console.error('No object with given reference');
        return data;
      }
    };
    // Convert select2 selected object to desired one
    this.convertFromSelect2 = function (object, key) {
      // if no key provided set it to id
      key = key || 'id';
      // result
      var result;
      // multiple selection
      if (angular.isArray(object)) {
        // initilize result array
        result = [];
        // get every values of object with given key and push it into result array
        angular.forEach(object, function (value) {
          result.push(value[key]);
        });
        return result;
      }  // single selection
      else if (angular.isObject(object)) {
        result = object[key];
        return result;
      }
    };
    // Convert value to select2 data object
    this.convertToSelect2 = function (value, reference) {
      if (this[reference] && this[reference][value]) {
        return {
          'id': value,
          'text': this[reference][value]
        };
      } else {
        console.error('No object with given reference or given key');
        return value;
      }
    };
  }]);'use strict';
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
    this.addMenu('topbar', false, [
      'author',
      'admin'
    ]);
  }]);'use strict';
// Configuring the Articles module
angular.module('poems').run([
  'Menus',
  function (Menus) {
  }
]);'use strict';
//Setting up route
angular.module('poems').config([
  '$stateProvider',
  function ($stateProvider) {
    // Poems state routing
    $stateProvider.state('createPoem', {
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
  function ($scope, $stateParams, $location, Authentication, Poems) {
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
      $scope.poem.$remove(function () {
        $location.path('poems');
      });
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
      $scope.poem = Poems.one($stateParams.poemId).get().$object;
    };
    // find poems those wating for an approval
    $scope.findUnapprovedPoems = function () {
      $scope.poemPromise = Poems.one('waitingForApproval').getList();
      $scope.poemPromise.then(function (poems) {
        $scope.poems = poems;
      });
    };
    $scope.approvePoem = function (poem, index) {
      $scope.poemPromise = Poems.one('approve').one(poem._id).put();
      $scope.poemPromise.then(function (response) {
        $scope.poems.splice(index, 1);
      });
    };
  }
]);'use strict';
//Poems service used to communicate Poems REST endpoints
angular.module('topics').factory('Poems', [
  'Restangular',
  function (Restangular) {
    return Restangular.service('poems');
  }
]);'use strict';
// Configuring the Articles module
angular.module('topics').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Admin-Topics', 'admin/topics', 'button', '/admin/topics', false, [
      'author',
      'admin'
    ]);
    Menus.addMenuItem('topbar', 'Admin-Poems', 'admin/poems', 'button', '/admin/poems', false, [
      'author',
      'admin'
    ]);
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Topics', 'topics', 'button', '/topics', true);
  }
]);'use strict';
//Setting up route
angular.module('topics').config([
  '$stateProvider',
  function ($stateProvider) {
    // Topics state routing
    $stateProvider.state('mainTopics', {
      url: '/topics',
      templateUrl: 'modules/topics/views/main-topics.client.view.html'
    }).state('detail-topic', {
      url: '/topics/:topicId',
      templateUrl: 'modules/topics/views/detail-topic.client.view.html'
    });
  }
]);'use strict';
angular.module('topics').controller('DetailTopicController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'UserProfile',
  'Topics',
  'Poems',
  function ($scope, $stateParams, $location, Authentication, UserProfile, Topics, Poems) {
    $scope.authentication = Authentication;
    $scope.userProfile = UserProfile;
    // Find existing Topic
    $scope.findTopic = function () {
      // topic promise object for loading indicator
      $scope.topicPromise = Topics.findTopic($stateParams.topicId);
      $scope.topicPromise.then(function (topic) {
        $scope.topic = topic;
      });
    };
    // Like Topic
    $scope.likeTopic = function (topic) {
      Topics.likeTopic(topic._id);
      topic.usersLiked.push($scope.authentication.user._id);
    };
    // Unlike Topic
    $scope.unlikeTopic = function (topic) {
      Topics.unlikeTopic(topic._id);
      topic.usersLiked = _.without(topic.usersLiked, $scope.authentication.user._id);
    };
    // Find a list of Poems of Topic
    $scope.findPoems = function () {
      $scope.poems = Topics.findTopicPoems($stateParams.topicId).$object;
    };
    // Create new Poem for Topic
    $scope.createPoem = function () {
      // topic promise object for loading indicator
      $scope.topicPromise = Topics.createTopicPoem($stateParams.topicId, this.poem);
      $scope.topicPromise.then(function (response) {
        console.log(response);
        alert('Your poem posted successfully...');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      // Clear form fields
      this.poem = {};
    };
  }
]);'use strict';
angular.module('topics').controller('MainTopicsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'UserProfile',
  'Topics',
  function ($scope, $stateParams, $location, Authentication, UserProfile, Topics) {
    $scope.authentication = Authentication;
    $scope.userProfile = UserProfile;
    // Initial Function of Controller
    $scope.init = function () {
      // Create new Topic Array
      $scope.topics = [];
      // Find First Five Topics to Show
      $scope.findTopics(0, 5);
    };
    // Find a list of Topics with top three Poems
    $scope.findTopics = function (start, offset) {
      // Query Object
      var query = {
          start: start,
          offset: offset
        };
      // Topics Promise Object for Loading Indicator
      $scope.topicsPromise = Topics.findTopics(query);
      $scope.topicsPromise.then(function (topics) {
        // Add New Topics to Current Topics
        $scope.topics = $scope.topics.concat(topics);
      });
    };
    // Like Topic
    $scope.likeTopic = function (topic) {
      Topics.likeTopic(topic._id);
      topic.usersLiked.push($scope.authentication.user._id);
    };
    // Unlike Topic
    $scope.unlikeTopic = function (topic) {
      Topics.unlikeTopic(topic._id);
      topic.usersLiked = _.without(topic.usersLiked, $scope.authentication.user._id);
    };
  }
]);'use strict';
// Topics controller
angular.module('topics').controller('TopicsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Topics',
  'Poems',
  'Constants',
  function ($scope, $stateParams, $location, Authentication, Topics, Poems, Constants) {
    $scope.authentication = Authentication;
    // Create new Poem
    $scope.createPoem = function (topicId) {
      // set topic of poem
      this.poem.topic = topicId;
      console.log(topicId);
      Topics.one('poems').all(topicId).post(this.poem).then(function (response) {
        console.log(response);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      // Clear form fields
      this.poem = {};
    };
    // Remove existing Topic
    $scope.remove = function (topic) {
      $scope.topic.remove().then(function () {
        $location.path('topics');
      });
    };
    // Update existing Topic
    $scope.update = function () {
      var topic = $scope.topic;
      // set original values from select2 fields
      topic.content.type = Constants.convertFromSelect2(topic.content.type);
      topic.put().then(function () {
        $location.path('topics/' + topic._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Topics
    $scope.find = function () {
      $scope.topics = Topics.getList().$object;
    };
    // Find Poems of Topic
    $scope.findPoems = function (index) {
      Topics.one('poems').one($scope.topics[index]._id).get().then(function (topic) {
        console.log(topic.poems);
        $scope.poems = topic.poems;
      });
    };
    $scope.setCurrentTopic = function (index) {
      $scope.currentTopic = index;
    };
    // Get full Topic
    $scope.getFullTopic = function () {
      Topics.one('full').one($stateParams.topicId).get().then(function (topic) {
        console.log(topic);
        $scope.topic = topic;
      });
    };
    // contentType select2 options
    $scope.contentTypeOptions = {
      placeholder: 'Select Content Type',
      data: Constants.createSelect2Data('contentTypes')
    };
  }
]);'use strict';
/**
 * content holder
 */
angular.module('topics').directive('contentBox', function () {
  // get thumbnail source by type and reference
  function getSource(type, reference) {
    if (type === 'youtube')
      return 'http://img.youtube.com/vi/' + reference + '/0.jpg';
    if (type === 'dailymotion')
      return 'http://www.dailymotion.com/thumbnail/video/' + reference;
    if (type === 'image')
      return reference;
  }
  // Runs during compile
  return {
    templateUrl: 'modules/topics/views/templates/contentBox-topic.client.view.html',
    scope: {
      topic: '=',
      user: '=',
      like: '&',
      unlike: '&'
    },
    replace: true,
    restrict: 'EA',
    link: function ($scope, iElm, iAttrs, controller) {
      $scope.thumbnailSrc = getSource($scope.topic.content.type, $scope.topic.content.reference);
    }
  };
});'use strict';
/**
 * menu content holder
 */
angular.module('topics').directive('contentMenuBox', function () {
  // get thumbnail source by type and reference
  function getSource(type, reference) {
    if (type === 'youtube')
      return 'http://img.youtube.com/vi/' + reference + '/0.jpg';
    if (type === 'dailymotion')
      return 'http://www.dailymotion.com/thumbnail/video/' + reference;
    if (type === 'image')
      return reference;
  }
  // Runs during compile
  return {
    templateUrl: 'modules/topics/views/templates/contentMenuBox-topic.client.view.html',
    scope: { topic: '=' },
    replace: true,
    restrict: 'EA',
    link: function ($scope, iElm, iAttrs, controller) {
      $scope.thumbnailSrc = getSource($scope.topic.content.type, $scope.topic.content.reference);
    }
  };
});'use strict';
/**
 * content detail wrapper
 */
angular.module('topics').directive('contentWrapper', [
  '$sce',
  '$location',
  function ($sce, $location) {
    // get iframe source by type and reference
    function getSource(content) {
      if (content.type === 'youtube')
        return '//www.youtube-nocookie.com/embed/' + content.reference + '?rel=0';
      if (content.type === 'dailymotion')
        return '//www.dailymotion.com/embed/video/' + content.reference + '?logo=0&info=0';
    }
    // get thumbnail source by type and reference
    function getImgSource(content) {
      if (content.type === 'youtube')
        return 'http://img.youtube.com/vi/' + content.reference + '/0.jpg';
      if (content.type === 'dailymotion')
        return 'http://www.dailymotion.com/thumbnail/video/' + content.reference;
      if (content.type === 'image')
        return content.reference;
    }
    // Runs during compile
    return {
      templateUrl: 'modules/topics/views/templates/contentWrapper-topic.client.view.html',
      scope: {
        topic: '=',
        user: '=',
        like: '&',
        unlike: '&'
      },
      replace: true,
      restrict: 'EA',
      link: function ($scope, iElm, iAttrs, controller) {
        // watch topic to resolve
        var topicWatcher = $scope.$watch('topic', function (topic) {
            if (topic) {
              $scope.iframeSrc = $sce.trustAsResourceUrl(getSource($scope.topic.content));
              if (angular.isUndefined(iAttrs.editable)) {
                // stop watching
                topicWatcher();
              }
            }
          });
        // pageUrl of topic for social share
        $scope.pageUrl = $location.absUrl();
        // imgUrl of topic for social share
        $scope.imgUrl = getImgSource($scope.topic.content);
      }
    };
  }
]);'use strict';
//Topics service used to communicate Topics REST endpoints
angular.module('topics').factory('Topics', [
  'Restangular',
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
          if (popularTopics)
            return popularTopics;
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
//User Profile Service
angular.module('users').factory('UserProfile', function () {
  return {
    getUserProfileImageSrc: function (user) {
      if (!user.additionalProvidersData)
        return '/modules/users/img/user.jpg';
      else if (user.additionalProvidersData.facebook)
        return 'http://graph.facebook.com/' + user.additionalProvidersData.facebook.id + '/picture?type=square';
      else if (user.additionalProvidersData.twitter)
        return user.additionalProvidersData.twitter.profile_image_url;
      else if (user.additionalProvidersData.google)
        return user.additionalProvidersData.google.picture;
    }
  };
});'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);