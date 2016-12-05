angular.module('skynet.controllers', [])

    .controller('SideMenuController', function($scope, $state, SkynetService) {
      // Simple function to enable side menu items to change the current state
        $scope.goTo = function(state) {
          $state.go(state);
        };

      $scope.signOut = function() {
        SkynetService.clearAll();
        $state.go('ip');
      }
    })

.controller('IPController', function($scope, $rootScope, $state, SkynetService, RobotService) {
  // https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
  $scope.ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  $scope.showForm = true;

  // If we're reloading the app while the IP is still valid, it will be immediatly shown in the form
  if (SkynetService.isIpStillValid()) {
    $scope.ip = SkynetService.getIp();
    $scope.port = SkynetService.getPort();
  }

  $scope.addIpAndPort = function() {
    SkynetService.setAll({
      ip: $scope.ip,
      port: $scope.port,
      lastSetAt: moment().format(SkynetService.getDateTimeFormat())
    });

    $rootScope.showLoading = true;

    SkynetService.createAjaxCall('get-type', function(data) {
      var gotGoodType = true;
      switch(data.data.type.toLowerCase()) {
        case 'nao':
              $rootScope.robot = new RobotService.Nao();
              break;
        case 'pepper':
              $rootScope.robot = new RobotService.Pepper();
              break;
        case 'jibo':
              $rootScope.robot = new RobotService.Jibo();
              break;
        case 'buddy':
              $rootScope.robot = new RobotService.Buddy();
              break;
        default:
              gotGoodType = false;
              SkynetService.showCannotConnectError();
      }

      $rootScope.showLoading = false;

      if (gotGoodType) {
        $state.go('home');
      }
    }, function() {
      $rootScope.showLoading = false;
      SkynetService.showCannotConnectError();
    });
  }
})

.controller('HomeController', function($scope, SkynetService, RobotService){

});
