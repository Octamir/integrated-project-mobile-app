angular.module('skynet.controllers', [])

.controller('IPController', function($scope, SkynetService, $state) {
  // https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
  $scope.ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

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
    $state.go('home');
  }
})

.controller('HomeController', function($scope){

});
