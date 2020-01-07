colorAdminApp.controller('changePasswordController', function ($scope, $rootScope, $state, $http) {
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.userName = window.localStorage.getItem("userName");
    $scope.password = window.localStorage.getItem("password");
    $scope.user;

    $scope.changePassword = function () {
        if ($scope.changePasswordForm.$invalid) {
            angular.forEach($scope.changePasswordForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
        }
        if ($scope.changePasswordForm.$valid) {
            if ($scope.user.oldPassword != $scope.password)
            {
                $scope.error("Wrong old password.");
                return;
            }
            if ($scope.user.newPassword != $scope.user.confirmNewPassword) {
                $scope.error("New password and confirm password do not match.");
                return;
            }
            $http.get($scope.webApiUrl + 'shared/ChangePassword?apiKey=' + $scope.school.appKey + '&academicYearId=' + $scope.academicYear.academicYearId + '&entityId=' + $scope.teacher.employeeId + '&roleId=' + $scope.teacher.roleId
                     + '&password=' + $scope.user.newPassword + "&applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version).success(function (result) {
                         if (result == null) {
                    $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");

                }
                else {
                    if (result.status == true) {
                        $scope.success(result.message);
                        $state.go('member.login');
                       
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
