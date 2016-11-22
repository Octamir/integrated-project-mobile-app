angular.module('skynet.services', [])

  .factory('SkynetService', function($localStorage) {
    $localStorage = $localStorage.$default({
      ip: null,
      port: null,
      lastSetAt: null
    });

    var _getIp = function() {
      return $localStorage.ip;
    };

    var _getPort = function() {
      return $localStorage.port;
    };

    var _getLastSetAt = function() {
      return $localStorage.lastSetAt;
    };

    var _getAll = function () {
      return {
        ip: _getIp(),
        port: _getPort(),
        lastSetAt: _getLastSetAt()
      }
    };

    var _setIp = function(value) {
      $localStorage.ip = value;
    };

    var _setPort = function(value) {
      $localStorage.port = value;
    };

    var _setLastSetAt = function(value) {
      $localStorage.lastSetAt = value;
    };

    var _setAll = function(value) {
      _setIp(value.ip);
      _setPort(value.port);
      _setLastSetAt(value.lastSetAt);
    };

    var _getDateTimeFormat = function() {
      return 'YYYY-MM-DD HH:mm:ss';
    };

    // If the IP and port were set more than 2 hours ago we will return null, which means it has to be set again
    var _getFullRobotAddress = function() {
      if (_getLastSetAt()) {
        var lastSetAtMoment = moment(_getLastSetAt(), _getDateTimeFormat());
        var hoursSinceLastSet = moment.duration(moment().diff(lastSetAtMoment)).asHours();

        if (hoursSinceLastSet <= 2) {
          return _getIp() + ':' + _getPort();
        }
      }
      return null;
    };

    var _isIpStillValid = function() {
      return _getFullRobotAddress() != null;
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
      isIpStillValid: _isIpStillValid
    }
  });
