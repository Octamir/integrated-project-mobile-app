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
  $scope.showCannotConnectError = false;

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

    $scope.showForm = false;
    $scope.showCannotConnectError = false;

    var connectionErrorFunct =  () => {
      console.log('Error, could not get type');
      $scope.showCannotConnectError = true;
      $scope.showForm = true;
    };

    SkynetService.createAjaxCall('get-type', (data) => {
      var gotGoodType = true;
      switch(data.data.type.toLowerCase()) {
        case 'nao':
              $rootScope.robot = new RobotService.Nao();
              break;
        default:
              gotGoodType = false;
              connectionErrorFunct();
      }

      if (gotGoodType) {
        $state.go('home');
      }
    }, connectionErrorFunct);
  }
})

.controller('HomeController', function($scope, SkynetService, RobotService){

});
