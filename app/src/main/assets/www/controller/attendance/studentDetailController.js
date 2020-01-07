colorAdminApp.controller('studentDetailController', function ($scope, $rootScope, $http, $state, $stateParams,$compile) {
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));

    $scope.getStudentDetail = function () {
     
        $http.post($scope.webApiUrl + 'teacher/GetStudentDetail', JSON.stringify({
            apiKey: $scope.school.appKey, studentId: $stateParams.studentId,
            academicYearId: $scope.academicYear.academicYearId,
            applicationTypeId: $scope.applicationTypeId,
            version: $scope.version
        })).success(function (result) {
            if (result.status == true) {
               
                $scope.studentDetail = result.data;
                var records = {
                    'recordsTotal': result.recordsTotal,
                    'recordsFiltered': result.recordsFiltered,
                    'data': result.data
                };
            }
            else {
                $scope.error(result.message);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
        });
    }
    $scope.getStudentDetail();
});

