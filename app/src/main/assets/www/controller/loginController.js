colorAdminApp.controller('loginController', function ($scope, $rootScope, $state, $http, $q) {
    $rootScope.setting.layout.pageWithoutHeader = true;
    $rootScope.setting.layout.paceTop = true;

    $scope.userName = window.localStorage.getItem("userName");
    $scope.password = window.localStorage.getItem("password");
    $scope.rememberMe = window.localStorage.getItem("rememberMe") == "true" ? true : false;
    $scope.mobileNo;
    $scope.isForgetCredential = false;
    $scope.isHelp = false;
    $scope.help = [];
    
    $scope.loginUser = function (form) {
        if ($scope.loginForm.$invalid) {
            angular.forEach($scope.loginForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
        }
        if ($scope.loginForm.$valid) {
            if ($scope.rememberMe == true) {
                window.localStorage.setItem("userName", $scope.userName);
                window.localStorage.setItem("password", $scope.password);
            }
            else {
                window.localStorage.removeItem("userName");
                window.localStorage.removeItem("password");
            }
            window.localStorage.setItem("rememberMe", $scope.rememberMe);
            $http.get($scope.webApiUrl + 'teacher/Login?loginId=' + $scope.userName + "&password=" + $scope.password + "&applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version)
                .success(function (result) {
                   
                    if (result == null) {
                       
                    $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");

                }
                else {
                    if (result.status == true) {
                    
                        window.localStorage.setItem("teacher", JSON.stringify(result.data));
                        window.localStorage.setItem("academicYear", JSON.stringify(result.data1));
                        window.localStorage.setItem("school", JSON.stringify(result.data2));

                        $state.go('app.dashboard');
                       
                    }
                    else {
                       
                        $scope.error(result.message);
                    }
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
                });
            
        }
    };
    $scope.forgetCredential = function (form) {
        if ($scope.loginForm.$invalid) {
            angular.forEach($scope.loginForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
        }

        if ($scope.loginForm.$valid) {
            $http.get($scope.webApiUrl + 'teacher/GetLoginCredential?mobileNo=' + $scope.mobileNo + "&applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version)
                .success(function (result) {
                if (result == null) {
                    $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
                }
                else {
                    if (result.status == true) {
                        $scope.success(result.message);
                    }
                    else {
                        $scope.error(result.message);
                    }
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
            });
        }
    };

    $scope.createHelp = function (form) {
        
        if ($scope.helpForm.$invalid) {
            angular.forEach($scope.helpForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
        }
        if ($scope.helpForm.$valid) {
            var helpData = {
                name: $scope.help.name,
                message: $scope.help.message,
                mobileNo: $scope.help.mobileNo,

            };


            helpData = JSON.stringify(helpData);
            $http.post($scope.webApiUrl + 'shared/CreateAnonymousHelp' + "?applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version, helpData).success(function (result) {
                if (result == null) {
                    $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
                }
                else {
                    if (result.status == true) {
                        $scope.success(result.message);
                        $scope.help = null;
                    }
                    else {
                        $scope.error(result.message);
                    }

                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
            });
        }
    };


});
