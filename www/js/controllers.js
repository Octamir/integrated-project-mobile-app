angular.module('skynet.controllers', [])

.controller('SideMenuController', ($scope, $state, SkynetService) => {
    // Simple function to enable side menu items to change the current state
    $scope.goTo = (state) => {
        $state.go(state);
    };

    $scope.signOut = () => {
        SkynetService.clearAll();
        $state.go('ip');
    }
})

.controller('IPController', ($scope, $rootScope, $state, SkynetService, RobotService) => {
    // https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    $scope.ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    $scope.showForm = true;

    $scope.previousIps = SkynetService.getPreviousIps();

    // If we're reloading the app while the IP is still valid, it will be immediatly shown in the form
    if (SkynetService.isIpStillValid()) {
        $scope.ip = SkynetService.getIp();
        $scope.port = SkynetService.getPort();
    }

    const setConnectionData = (ip, port) => {
        SkynetService.setAll({
            ip: ip,
            port: port,
            lastSetAt: moment().format(SkynetService.getDateTimeFormat())
        });
    };

    const connect = () => {
        SkynetService.createAjaxCall('get-type', (data) => {
            let gotGoodType = true;
            switch (data.data.type.toLowerCase()) {
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

            //$rootScope.showLoading = false;

            if (gotGoodType) {
                SkynetService.addCurrentIpAsPrevious();
                $state.go('home');
            }
        }, () => {
            SkynetService.showCannotConnectError();
        });
    };

    $scope.connectFromForm = () => {
        setConnectionData($scope.ip, $scope.port);
        connect();
    };

    $scope.connectFromList = (address) => {
        const splitAddress = address.split(':');
        setConnectionData(splitAddress[0], parseInt(splitAddress[1]));

        connect();
    };
})

.controller('HomeController', ($scope, SkynetService, RobotService) => {

});
