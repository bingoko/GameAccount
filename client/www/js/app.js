// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
define(function(){

  var starter = angular.module('starter', ['ionic', 'starter.services', 'ngMessages', 'ngCookies'])

  starter.run(function($ionicPlatform, $rootScope) {//, Auth, LiveUpdate, 
      console.log(10);
     
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      // LiveUpdate.update();

      // 检查是否被调用
      console.log(localStorage.getItem('openUrl'));
      var openUrl = localStorage.getItem('openUrl');
      localStorage.removeItem('openUrl');
      console.log(localStorage.getItem('openUrl'));
      if (openUrl !== null){
        var parsedUrl = purl(openUrl);
        Auth.ssoAuth(parsedUrl.param());
      }

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });
  });

  //角色配置
  (function(exports){
    var userRoles = {
        public: 1, // 001
        user:   2 // 010
    };
    exports.userRoles = userRoles;
    exports.accessLevels = {
        public: userRoles.public | // 11
                userRoles.user,
        user:   userRoles.user     // 10
    };
    })(typeof exports === 'undefined'? starter.routingConfig={}: exports);

  starter.config(function(RestangularProvider) {

      RestangularProvider.setDefaultHeaders({
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
      });
      RestangularProvider.setDefaultHttpFields({
        withCredentials: true
      });

      RestangularProvider.setBaseUrl('http://42.120.45.236:8485');
      // RestangularProvider.setBaseUrl('http://localhost:8485');

      // add a response intereceptor
      RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        var extractedData;      // .. to look for getList operations
        if (operation === "getList") {
          // .. and handle the data and meta data
          extractedData = data.splices;
          //extractedData.meta = data.data.meta;
        } else {
          extractedData = {'rawData': data};
        }
        return extractedData;
      });

  })

  //i18n
  starter.config(function(TranslationsProvider) {
      TranslationsProvider.translateConfig();
    })

  starter.controller("MainCtrl", function($scope) {//, Auth
    $scope.requestAuth = function(url) {
      var parsedUrl = purl(url);  
      console.log(JSON.stringify(parsedUrl.param()));
      Auth.ssoAuth(parsedUrl.param());
    };
  });

  return starter;
});


function handleOpenURL(url) {
    var body = document.getElementsByTagName("body")[0];
    var mainController = angular.element(body).scope();
    mainController.requestAuth(url);
}
