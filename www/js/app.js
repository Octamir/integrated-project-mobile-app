angular.module('skynet', ['ionic', 'skynet.controllers', 'skynet.services', 'ui.router', 'ngStorage'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('ip', {
        url: "/ip",

        views: {
          'ip': {
            templateUrl: "templates/skynet-ip.html",
            controller: 'IPController'
          }
        }
      })
      .state('home', {
        url: "/home",

        views: {
          'home': {
            templateUrl: "templates/skynet-home.html",
            controller: 'HomeController'
          }
        }
      });
    $urlRouterProvider.otherwise('/ip');
  });
