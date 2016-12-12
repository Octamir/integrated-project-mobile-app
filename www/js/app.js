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

.run(($rootScope, $location) => {
    $rootScope.showLoading = false;

    $rootScope.$on('$stateChangeSuccess', () => {
        $rootScope.showMenu = $location.path() !== "/ip";
    });
})

//http://stackoverflow.com/questions/15266671/angular-ng-repeat-in-reverse
.filter('reverse', function() {
    return (items) => items.slice().reverse();
})

.config(($stateProvider, $urlRouterProvider) => {
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