angular.module('skynet.controllers', [])

.controller('IndexController', function($scope, $state, SkynetService) {

  var ipWithPort = SkynetService.getFullRobotAddress();
  console.log(ipWithPort);

  if (!ipWithPort) {
    $state.go('ip');
  }

  $scope.goToIp = function() {
    $state.go('ip');
  }
})

.controller('IPController', function($scope, SkynetService) {
  $scope.addIpAndPort = function() {
    SkynetService.setAll({
      ip: $scope.ip,
      port: $scope.port,
      lastSetAt: moment().format(SkynetService.getDateTimeFormat())
    });
  }
});
