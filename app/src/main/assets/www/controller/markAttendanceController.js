colorAdminApp.controller('markAttendanceController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.startDate = $scope.formatDate(new Date());
    $scope.endDate = $scope.formatDate(new Date());
    $scope.userGroups;
    $scope.userGroup = { selectedGroup: { groupId: 0 } };
    $scope.alertCategoryId = 6;
    $scope.screenId = 153;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;
    $scope.isSelectedAll = false;
    $scope.absentReport = [];
      

    $http.post($scope.webApiUrl + 'teacher/GetClassList', JSON.stringify({
        apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, employeeId: $scope.teacher.employeeId,
        applicationTypeId: $scope.applicationTypeId, version: $scope.version
    })).success(function (result) {
        if (result.status == true) {
            $scope.userGroups = result.data;
            $scope.userGroups.unshift({ groupId: 0, groupName: "Select Class" });

        }
        else {
            $scope.error(result.message);
        }
    }).error(function (error, status) {
        $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
    });


    function getAbsentList(sSource, aoData, fnCallback, oSettings) {
       
        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.post($scope.webApiUrl + 'teacher/GetStudentAbsentReport', JSON.stringify({
            apiKey: $scope.school.appKey, employeeId: $scope.teacher.employeeId, studentName: $scope.studentName, groupId: $scope.userGroup.selectedGroup.groupId, academicYearId: $scope.academicYear.academicYearId,
            startDate: $scope.startDate, endDate: $scope.endDate,  applicationTypeId: $scope.applicationTypeId,
            version: $scope.version
        })).success(function (result) {
                if (result.status == true) {
                    $scope.absentReport = result.data;
                    var records = {
                        'draw': draw,
                        'recordsTotal': result.recordsTotal,
                        'recordsFiltered': result.recordsFiltered,
                        'data': result.data

                    };
                    fnCallback(records);
                }
                else {
                    $scope.error(result.message);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
            });

    }

    $scope.orderInstance = {};
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getAbsentList)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Student Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                $scope.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
        })
        .withOption('createdRow', createdRow)
        .withOption('autoWidth', false)
        .withBootstrap()
    var i = -1;
    $scope.orderColumns = [

        DTColumnBuilder.newColumn(null).withTitle('<input type="checkbox" ng-model="isSelectedAll" ng-click="toggleAll()">').notSortable()
                .renderWith(function (data, type, full, meta) {
                    i = i + 1;
                    return '<input type="checkbox" ng-model="absentReport['+i+'].isSelected" ng-click="toggleOne()">';
                }).withClass("text-center"),

        DTColumnBuilder.newColumn("fullName", "Name").withOption('name', 'Name').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            var html = full.fullName;
            return html;

        }),

        DTColumnBuilder.newColumn("groupName", "Class").withClass("f-s-600 text-inverse").withOption('name', 'Class').renderWith(function (data, type, full) {
            return full.groupName;
        }),
        DTColumnBuilder.newColumn("enrollmentNo", "EnrollmentNo").withClass("f-s-600 text-inverse").withOption('name', 'EnrollmentNo').renderWith(function (data, type, full) {
            return full.enrollmentNo;
        }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getAbsentList = function () {
  
        $scope.orderInstance.rerender();
    };

    $scope.toggleAll = function () {
        angular.forEach($scope.absentReport, function (item, key) {
            item.isSelected = $scope.isSelectedAll;
        });
    }
    $scope.toggleOne = function () {
        if ($scope.absentReport.length === $scope.absentReport.filter(function (item) { return item.isSelected === true; }).length) {
            $scope.isSelectedAll = true;
        }
        else {
            $scope.isSelectedAll = false;
        }
    }


    $scope.markAttendance = function () {
      
        var selectedItems = $scope.absentReport.filter(function (item) { return item.isSelected == true; });
        var entityRoleIds = selectedItems.map(function (obj) { return obj.entityId + '|' + obj.roleId; }).join(', ');
        if (entityRoleIds == "") {
            $scope.error("Please select any student");
            return false;
        }
        else {
            
            $http.post($scope.webApiUrl + 'teacher/MarkStudentAttendance', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, alertCategoryId: $scope.alertCategoryId, employeeId: $scope.teacher.employeeId, entityRoleIds,
                applicationTypeId: $scope.applicationTypeId, version: $scope.version
            })).success(function (result) {
                if (result.status == true) {
                    $scope.success("Attendance has been processed Successfully");
                    $scope.orderInstance.rerender();
                }
                else {
                    $scope.error(result.message);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
            });
        }
    }
});