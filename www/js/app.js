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

    .run(function ($rootScope, $location) {
        $rootScope.$on('$stateChangeSuccess', function() {
            $rootScope.showMenu = $location.path() !== "/ip";
            console.log($location.path());
            console.log($rootScope.showMenu);
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('ip', {
                url: "/ip",
                templateUrl: "templates/skynet-ip.html"
            })
            .state('home', {
                url: "/home",
                templateUrl: "templates/skynet-home.html"
            });
        $urlRouterProvider.otherwise('/ip');
    });
