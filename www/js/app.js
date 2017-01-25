angular.module('skynet', ['ionic', 'skynet.controllers', 'skynet.services', 'ui.router', 'ngStorage'])

.run(($ionicPlatform) => {
    $ionicPlatform.ready(() => {
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

.run(($rootScope, $location, SkynetService) => {
    $rootScope.showLoading = false;

    // By doing this the settings shall be automatically saved whenever they are changed
    $rootScope.settings = SkynetService.getSettings();

    $rootScope.$on('$stateChangeSuccess', () => {
        $rootScope.showMenu = $location.path() !== '/ip';
        $rootScope.shouldLoadLiveFeed = $location.path() == '/live'; // The live feed must only load while on the live screen
    });
})

//http://stackoverflow.com/questions/15266671/angular-ng-repeat-in-reverse
.filter('reverse', function() {
    return (items) => items.slice().reverse();
})

  // http://stackoverflow.com/questions/30207272/capitalize-the-first-letter-of-string-in-angularjs
.filter('capitalize', function() {
  return function(input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
})

.config(($ionicConfigProvider) => {
    $ionicConfigProvider.views.transition('none');
})

.config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
        .state('ip', {
            url: '/ip',
            templateUrl: 'templates/skynet-ip.html'
        })
        .state('actions', {
            url: '/actions',
            templateUrl: 'templates/skynet-actions.html'
        })
        .state('move', {
            url: '/move',
            templateUrl: 'templates/skynet-move.html'
        })
        .state('live', {
            url: '/live',
            templateUrl: 'templates/skynet-live.html'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'templates/skynet-settings.html'
        });
    $urlRouterProvider.otherwise('/ip');
});
