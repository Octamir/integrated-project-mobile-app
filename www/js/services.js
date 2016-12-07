angular.module('skynet.services', [])

.factory('SkynetService', ($localStorage, $http, $ionicPopup) => {
    const _webserviceIP = 'http://127.0.0.1:3000/';

    $localStorage = $localStorage.$default({
        ip: null,
        port: null,
        lastSetAt: null
    });

    const _getIp = () => {
        return $localStorage.ip;
    };

    const _getPort = () => {
        return $localStorage.port;
    };

    const _getLastSetAt = () => {
        return $localStorage.lastSetAt;
    };

    const _getAll = () => {
        return {
            ip: _getIp(),
            port: _getPort(),
            lastSetAt: _getLastSetAt()
        }
    };

    const _setIp = (value) => {
        $localStorage.ip = value;
    };

    const _setPort = (value) => {
        $localStorage.port = value;
    };

    const _setLastSetAt = (value) => {
        $localStorage.lastSetAt = value;
    };

    const _setAll = (value) => {
        _setIp(value.ip);
        _setPort(value.port);
        _setLastSetAt(value.lastSetAt);
    };

    const _getDateTimeFormat = () => {
        return 'YYYY-MM-DD HH:mm:ss';
    };

    // If the IP and port were set more than 2 hours ago we will return null, which means it has to be set again
    const _getFullRobotAddress = () => {
        if (_getLastSetAt()) {
            var lastSetAtMoment = moment(_getLastSetAt(), _getDateTimeFormat());
            var hoursSinceLastSet = moment.duration(moment().diff(lastSetAtMoment)).asHours();

            if (hoursSinceLastSet <= 2) {
                return _getIp() + ':' + _getPort();
            }
        }
        return null;
    };

    const _isIpStillValid = () => {
        return _getFullRobotAddress() != null;
    };

    const _clearAll = () => {
        _setIp(null);
        _setPort(null);
        _setLastSetAt(null);
    };

    const _createAjaxCall = (route, succes, error) => {
        var fullAddress = _getFullRobotAddress();
        if (fullAddress) {
            $http.get(_webserviceIP + fullAddress + '/' + route).then(succes, error);
        } else {
            error();
        }
    };

    const _showCannotConnectError = () => {
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

.factory('RobotService', (SkynetService) => {
    class Robot {
        constructor() {
            this.canTalk = true;
            this.hasCamera = true;

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

    class MoveableRobot extends Robot {
        constructor() {
            super();

            this.canMove = true;
        }

        move(x, y, d) {
            console.log('The general move method is not implemented');
        }
    }

    class Nao extends MoveableRobot {
        constructor() {
            super();

            this.canWalk = true;
        }
    }

    class Pepper extends MoveableRobot {
        constructor() {
            super();

            this.canRide = true;
            this.hasTablet = true;
            this.canGuessAge = true;
            this.canRide = true;
        }
    }

    class Jibo extends Robot {
        constructor() {
            super();

            this.canMoveHead = true;
            this.hasDisplay = true;
        }
    }

    class Buddy extends Robot {
        constructor() {
            super();
        }
    }

    // ES syntax
    // This will get compiled to Nao: Nao, etc.
    return {
        Nao,
        Pepper,
        Jibo,
        Buddy
    }
});