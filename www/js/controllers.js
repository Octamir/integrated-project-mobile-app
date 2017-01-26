angular.module('skynet.controllers', [])

.controller('SideMenuController', ($scope, $state, SkynetService) => {
    // Simple function to enable side menu items to change the current state
    $scope.goTo = (state) => {
        $state.go(state);
        $scope.titleBar = $state.current.name;
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
    } else {
        // The RAL is a Flask service, which defaults to port 5000
        $scope.port = 5000;
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
                $state.go('actions');
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

.controller('ActionsController', ($scope, $rootScope, SkynetService) => {
    // Init for safety
    $scope.groupedActions = {};

    const changeActionsGrouping = (grouped) => {
        if (grouped) {
            // Group by type using Lodash
            $scope.groupedActions = _.groupBy($rootScope.robot.actions, 'type');
        } else {
            // Make one big empty (as in the name) type
            $scope.groupedActions = {
                '': $rootScope.robot.actions
            };
        }
    };
    changeActionsGrouping($rootScope.settings.groupActionsByType);

    // Listen for a change in this setting, to change the way actions are displayed accordingly
    $rootScope.$watch('settings.groupActionsByType', changeActionsGrouping);

    $scope.doAction = (route) => {
        SkynetService.createAjaxCall(
            route,
            (data) => console.log(data),
            () => SkynetService.showError('Error', 'Could not execute this action')
        );
    };
})

.controller('MoveController', ($scope) => {
    $scope.x = 0;
    $scope.y = 0;
    $scope.d = 0;
})

.controller('LiveController', ($scope, $rootScope, SkynetService) => {
    $scope.currentFrameBase64 = '';
    const getCurrentFrame = () => {
        if ($rootScope.shouldLoadLiveFeed) {
            SkynetService.createAjaxCallWithoutLoadingScreen('get-picture', (data) => {
                $scope.currentFrameBase64 = data.data.image;
                setTimeout(getCurrentFrame, 1000); // Let it rest for a little bit so the memory won't overflow and stuff
            }, () => console.log('error error error'));
        }
    };
    getCurrentFrame();
})

.controller('SpeakController', ($scope, SkynetService) => {
    $scope.text = "";
})

.controller('SettingsController', ($scope) => {

})

.controller('GuessAgeController', ($scope) => {
    // Mock data
    $scope.age = Math.floor((Math.random() * (75 - 65)) + 65);
    $scope.gender = 'male';
    $scope.mood = 'presidential';
});
