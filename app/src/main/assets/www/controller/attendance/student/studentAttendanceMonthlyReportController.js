colorAdminApp.controller('studentAttendanceMonthlyReportController', function ($scope,$rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.search = { startDate: $scope.formatDate(new Date()), endDate: $scope.formatDate(new Date()), group: { groupId: 0 } };
    $scope.screenId = 170;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;


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

    function getStudentList(sSource, aoData, fnCallback, oSettings) {
        var draw = aoData[0].value;
        $scope.draw = draw;
        if ($scope.search.group.groupId != 0) {
            $http.post($scope.webApiUrl + 'teacher/GetStudentList', JSON.stringify({
                apiKey: $scope.school.appKey, employeeId: $scope.teacher.employeeId,
                studentName: $scope.studentName, groupId: $scope.search.group.groupId, academicYearId: $scope.academicYear.academicYearId,
                applicationTypeId: $scope.applicationTypeId,
                version: $scope.version
            })).success(function (result) {
                if (result.status == true) {
                    $scope.studentList = result.data;
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
    }

    $scope.orderInstance = {};
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getStudentList)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Student Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('createdRow', createdRow)
        .withOption('autoWidth', false)
        .withBootstrap()
    
    $scope.orderColumns = [

        DTColumnBuilder.newColumn("fullName", "Name").withClass("f-s-600 text-inverse").withOption('name', 'Name').renderWith(function (data, type, full) {
            var html = full.fullName;
            return html;
        }),

        DTColumnBuilder.newColumn("className", "Class").withClass("f-s-600 text-inverse").withOption('name', 'Class').renderWith(function (data, type, full) {
            var html = full.className;
            return html;
        }),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(function (data, type, full, meta) {
                return '<button class="btn btn-primary" ng-click="viewReport(' +data.studentId+ ')">' + ' <i class="fa fa-eye"></i>' + "View" + '</button>';
            })
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getStudentList = function () {
        if ($scope.search.group.groupId != 0) {
            $scope.orderInstance.rerender();
        };
    };


    $scope.viewReport = function (id) {
        $state.go('app.attendance.student.viewMonthlyReport', { studentId: id });
    }


});

