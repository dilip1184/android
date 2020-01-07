colorAdminApp.controller('headerController', function ($scope, $rootScope, $state, $http, $window) {
    $scope.userView = window.localStorage.getItem("userView") === null ? "1" : window.localStorage.getItem("userView");
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.selectedAcademicYear = { activeAcademicYear: null };
    $scope.selectedAcademicYear.activeAcademicYear = { text: $scope.academicYear.academicYearName, value: $scope.academicYear.academicYearId };
    $http.get($scope.webApiUrl + 'shared/GetAcademicYears?apiKey=' + $scope.school.appKey + '&academicYearId=' + $scope.academicYear.academicYearId + '&entityId=' + $scope.teacher.employeeId + '&roleId=' + $scope.teacher.roleId + "&applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version).success(function (result) {
        if (result == null) {
            $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
        }
        else {
            if (result.status == true) {

                $scope.academicYears = result.data;
                $scope.selectedAcademicYear.activeAcademicYear = { text: $scope.academicYear.academicYearName, value: $scope.academicYear.academicYearId };

            }
            else {
                $scope.error(result.message);
            }
        }
    }).error(function (error, status) {
        $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
    });
    $scope.changeAcademicYear = function (academicYear) {
        $http.get($scope.webApiUrl + 'teacher/ChangeAcademicYear?apiKey=' + $scope.school.appKey + '&academicYearId=' + $scope.academicYear.academicYearId + '&entityId=' + $scope.teacher.employeeId + '&roleId=' + $scope.teacher.roleId
            + '&changeAcademicYearId=' + academicYear.value + "&applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version).success(function (result) {
                if (result == null) {
                    $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
                }
                else {
                    if (result.status == true) {
                        window.localStorage.setItem("teacher", JSON.stringify(result.data));
                        window.localStorage.setItem("academicYear", JSON.stringify(result.data1));
                        window.localStorage.setItem("school", JSON.stringify(result.data2));

                        $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
                        $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
                        $scope.school = JSON.parse(window.localStorage.getItem("school"));
                        
                        $window.location.reload();
                    }
                    else {
                        $scope.error(result.message);
                    }
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
            });
    };

    $scope.setUserView = function (viewOption) {
        window.localStorage.setItem("userView", viewOption);
       
        $state.go("app.dashboard").then(function () {
            $window.location.reload();
        });
    };

    $scope.logOut = function () {
        navigator.app.exitApp();
        //$state.go('member.login');
    };
});
