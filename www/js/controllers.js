angular.module('skynet.controllers', [])

.controller('IPController', function($scope, SkynetService) {
  $scope.addIpAndPort = function() {
    SkynetService.setAll({
      ip: $scope.ip,
      port: $scope.port,
      lastSetAt: moment().format(SkynetService.getDateTimeFormat())
    });
  }
});
