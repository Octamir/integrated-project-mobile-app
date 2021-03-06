angular.module('skynet.services', [])

.factory('SkynetService', ($rootScope, $localStorage, $http, $ionicPopup) => {
    const _webserviceIP = 'http://127.0.0.1:3000/';

    $localStorage = $localStorage.$default({
        ip: null,
        port: null,
        lastSetAt: null,
        previousIps: [],
        settings: {
            groupActionsByType: false
        }
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

    const _getPreviousIps = () => {
        return $localStorage.previousIps;
    };

    const _getSettings = () => {
        return $localStorage.settings;
    };

    const _getAll = () => {
        return {
            ip: _getIp(),
            port: _getPort(),
            lastSetAt: _getLastSetAt(),
            previousIps: _getPreviousIps(),
            settings: _getSettings()
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

    const _addPreviousIp = (ip) => {
        let tmp = [..._getPreviousIps()];

        if (tmp.indexOf(ip) == -1) {
            tmp.push(ip);
            if (tmp.length > 3) {
                tmp.shift();
            }
            $localStorage.previousIps = tmp;
        }
    };

    const _addCurrentIpAsPrevious = () => {
        _addPreviousIp(_getFullRobotAddress());
    };

    const _getDateTimeFormat = () => {
        return 'YYYY-MM-DD HH:mm:ss';
    };

    // If the IP and port were set more than 2 hours ago we will return null, which means it has to be set again
    const _getFullRobotAddress = () => {
        if (_getLastSetAt()) {
            const lastSetAtMoment = moment(_getLastSetAt(), _getDateTimeFormat());
            const hoursSinceLastSet = moment.duration(moment().diff(lastSetAtMoment)).asHours();

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

    const _createAjaxCall = (route, success, error) => {
        const tmpSuccess = (data) => {
            $rootScope.showLoading = false;
            success(data);
        };

        const tmpError = (err) => {
            $rootScope.showLoading = false;
            error(err);
        };

        const fullAddress = _getFullRobotAddress();
        if (fullAddress) {
            $rootScope.showLoading = true;
            $http.get(_webserviceIP + fullAddress + '/' + route).then(tmpSuccess, tmpError);
        } else {
            tmpError();
        }
    };

    const _createAjaxCallWithoutLoadingScreen = (route, success, error) => {
        const fullAddress = _getFullRobotAddress();
        console.log(fullAddress);
        if (fullAddress) {
            $http.get(_webserviceIP + fullAddress + '/' + route).then(success, error);
        } else {
            error();
        }
    };

    const _showError = (title, body) => {
        $ionicPopup.alert({
            title: title,
            template: body
        });
    };

    const _showCannotConnectError = () => {
        _showError('Error', 'Could not connect');
    };

    return {
        getIp: _getIp,
        getPort: _getPort,
        getLastSetAt: _getLastSetAt,
        getPreviousIps: _getPreviousIps,
        getSettings: _getSettings,
        getAll: _getAll,

        setIp: _setIp,
        setPort: _setPort,
        setLastSetAt: _setLastSetAt,
        setAll: _setAll,

        addPreviousIp: _addPreviousIp,
        addCurrentIpAsPrevious: _addCurrentIpAsPrevious,

        getDateTimeFormat: _getDateTimeFormat,
        getFullRobotAddress: _getFullRobotAddress,
        isIpStillValid: _isIpStillValid,
        clearAll: _clearAll,

        createAjaxCall: _createAjaxCall,
        createAjaxCallWithoutLoadingScreen: _createAjaxCallWithoutLoadingScreen,

        showError: _showError,
        showCannotConnectError: _showCannotConnectError
    }
})

.factory('RobotService', (SkynetService) => {
    class Robot {
        constructor() {
            this.canTalk = true;
            this.hasCamera = true;

            this.name = '';
            this.batteryLevel = 0;
            this.actions = [];

            this.getActions();
            this.getName();
            this.refreshData();
        }

        refreshData() {
            this.getBatteryLevel();
        }

        getIp() {
            return SkynetService.getFullRobotAddress();
        }

        getName() {
            SkynetService.createAjaxCallWithoutLoadingScreen('get-name', (data) => {
                this.name = data.data.name;
            }, () => console.log('Error, could not get name'))
        }

        getBatteryLevel() {
            SkynetService.createAjaxCallWithoutLoadingScreen('get-battery', (data) => {
                this.batteryLevel = data.data.batteryLevel;
            }, () => console.log('Error, could not get battery level'))
        }

        getActions() {
            SkynetService.createAjaxCall('get-actions', (data) => {
                console.log(data);
                this.actions = data.data;
            }, () => console.log('Error, could not get actions'))
        }
        speak(text) {
          SkynetService.createAjaxCall(`ask/${text}`, () => console.log("succes"), () => console.log("error"));
        }
    }

    class MoveableRobot extends Robot {
        constructor() {
            super();

            this.canMove = true;
        }

        move(x, y, d) {
            SkynetService.createAjaxCall(`move/${x}/${y}/${d}`, () => console.log("succes"), () => console.log("error"));
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
