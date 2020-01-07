colorAdminApp.controller('helpRequestController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $q) {
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.startDate = $scope.formatDate(new Date());
    $scope.endDate = $scope.formatDate(new Date());
    $scope.isSubmitHelp = false;
    $scope.helpStatus;
    $scope.help = { entityId: $scope.teacher.employeeId, roleId: $scope.teacher.roleId, academicYearId: $scope.academicYear.academicYearId, apiKey: $scope.school.appKey };
    $scope.statusType = { selectedStatus: { statusId: 0 } };
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

    $http.get($scope.webApiUrl + 'shared/GetStatusType?apiKey=' + $scope.school.appKey + "&academicYearId=" + $scope.academicYear.academicYearId+ '&statusType=' +"Help"+
        "&applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version).success(function (result) {
            if (result.status == true) {
               
                $scope.helpStatus = result.data;
                $scope.helpStatus.unshift({ statusId: 0, statusName: "All" });

            }
            else {
                $scope.error(result.message);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
        });
    $scope.getHelps = function () {
        $http.get($scope.webApiUrl + 'teacher/GetHelpRequest?apiKey=' + $scope.school.appKey + '&employeeId=' + $scope.teacher.employeeId + "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate + '&searchStatusId=' + $scope.statusType.selectedStatus.statusId + "&applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version).success(function (result) {
                if (result.status == true) {
                    $scope.helps = result.data;

                }
                else {
                    $scope.error(result.message);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
            });
    }
    $scope.getHelpDetail = function (help) {
        //help.abc = "MKD";
        
        $http.get($scope.webApiUrl + 'teacher/GetHelpWorkFlow?apiKey=' + $scope.school.appKey + "&helpRequestId="+ help.helpRequestId +"&academicYearId=" + $scope.academicYear.academicYearId +
            "&applicationTypeId=" + $scope.applicationTypeId +  "&version=" + $scope.version).success(function (result) {
                if (result.status == true) {

                    help.detail = result.data;
                }
                else {
                    $scope.error(result.message);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
            });
    };
   
    //function createdRow(row, data, dataIndex) {
    //    $compile(angular.element(row).contents())($scope);
    //}
    $scope.getHelpRequest = function () {
        $scope.getHelps();
        //$scope.orderInstance.rerender();
    };
    $scope.getHelps();
    $scope.submitHelp = function (form) {
        
       
        if ($scope.helpForm.$invalid) {
            angular.forEach($scope.helpForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
            
        }

        if ($scope.helpForm.$valid) {

            var helpData = JSON.stringify($scope.help);
            $http.post($scope.webApiUrl + 'shared/CreateHelp?apiKey=' + $scope.school.appKey + '&academicYearId=' + $scope.academicYear.academicYearId + "&applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version, helpData).success(function (result) {
                if (result == null) {
                    $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
                }
                else {
                    if (result.status == true) {
                        $scope.success(result.message);
                        $scope.help = null;
                        $scope.isSubmitHelp = false;
                        $scope.getHelps();
                    }
                    else {
                        $scope.error(result.message);
                    }
                }
                
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
                
            });
        }
        
    }
    $scope.showSubmitHelp = function(){
        $scope.isSubmitHelp = true;
    }
    $scope.cancelHelp = function () {
        $scope.isSubmitHelp = false;
    }
});

