angular.module('skynet.services', [])

  .factory('SkynetService', function ($localStorage, $http, $ionicPopup) {

    var _webserviceIP = 'http://127.0.0.1:3000/';

    $localStorage = $localStorage.$default({
      ip: null,
      port: null,
      lastSetAt: null
    });

    var _getIp = function () {
      return $localStorage.ip;
    };

    var _getPort = function () {
      return $localStorage.port;
    };

    var _getLastSetAt = function () {
      return $localStorage.lastSetAt;
    };

    var _getAll = function () {
      return {
        ip: _getIp(),
        port: _getPort(),
        lastSetAt: _getLastSetAt()
      }
    };

    var _setIp = function (value) {
      $localStorage.ip = value;
    };

    var _setPort = function (value) {
      $localStorage.port = value;
    };

    var _setLastSetAt = function (value) {
      $localStorage.lastSetAt = value;
    };

    var _setAll = function (value) {
      _setIp(value.ip);
      _setPort(value.port);
      _setLastSetAt(value.lastSetAt);
    };

    var _getDateTimeFormat = function () {
      return 'YYYY-MM-DD HH:mm:ss';
    };

    // If the IP and port were set more than 2 hours ago we will return null, which means it has to be set again
    var _getFullRobotAddress = function () {
      if (_getLastSetAt()) {
        var lastSetAtMoment = moment(_getLastSetAt(), _getDateTimeFormat());
        var hoursSinceLastSet = moment.duration(moment().diff(lastSetAtMoment)).asHours();

        if (hoursSinceLastSet <= 2) {
          return _getIp() + ':' + _getPort();
        }
      }
      return null;
    };

    var _isIpStillValid = function () {
      return _getFullRobotAddress() != null;
    };

    var _clearAll = function () {
      _setIp(null);
      _setPort(null);
      _setLastSetAt(null);
    };

    var _createAjaxCall = function (route, succes, error) {
      var fullAddress = _getFullRobotAddress();
      if (fullAddress) {
        $http.get(_webserviceIP + fullAddress + '/' + route).then(succes, error);
      } else {
        error();
      }
    };

    var _showCannotConnectError = function() {
      $ionicPopup.alert({
        title: 'Error',
        template: 'Could not connect'
      });
    };

    return {
      getIp: _getIp,
      getPort: _getPort,
      getLastSetAt: _getLastSetAt,
      getAll: _getAll,

      setIp: _setIp,
      setPort: _setPort,
      setLastSetAt: _setLastSetAt,
      setAll: _setAll,

      getDateTimeFormat: _getDateTimeFormat,
      getFullRobotAddress: _getFullRobotAddress,
      isIpStillValid: _isIpStillValid,
      clearAll: _clearAll,

      createAjaxCall: _createAjaxCall,

      showCannotConnectError: _showCannotConnectError
    }
  })

  .factory('RobotService', function (SkynetService) {
    class Robot {
      constructor() {
        this.getName();
        this.getBatteryLevel();
      }

      getName() {
        SkynetService.createAjaxCall('get-name', (data) => {
          this.name = data.data.name;
        }, () => console.log('Error, could not get name'))
      }

      getBatteryLevel() {
        SkynetService.createAjaxCall('get-battery', (data) => {
          this.batteryLevel = data.data.level;
        }, () => console.log('Error, could not get name'))
      }
    }

    class Nao extends Robot {
      // Nao specific methods should go here
    }

    return {
      Nao: Nao
    }
  });
