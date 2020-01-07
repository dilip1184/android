colorAdminApp.controller('studentHolidayCalendarController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.search = { startDate: $scope.formatDate(new Date()), endDate: $scope.formatDate(new Date()), group: { groupId: 0 } };
    $scope.screenId = 151;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

    $http.post($scope.webApiUrl + 'teacher/GetClassList', JSON.stringify({
        apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, employeeId: $scope.teacher.employeeId,
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

    function getStudentHolidayCalendar(sSource, aoData, fnCallback, oSettings) {
    
        var draw = aoData[0].value;
        $scope.draw = draw;
        if ($scope.search.group.groupId != 0) {

            $http.post($scope.webApiUrl + 'teacher/GetStudentHolidayCalendar', JSON.stringify({
                apiKey: $scope.school.appKey, employeeId: $scope.teacher.employeeId, studentName: $scope.studentName, groupId: $scope.search.group.groupId, academicYearId: $scope.academicYear.academicYearId,
                startDate: $scope.search.startDate, endDate: $scope.search.endDate, applicationTypeId: $scope.applicationTypeId,
                version: $scope.version
            })).success(function (result) {
                if (result.status == true) {
                    $scope.holidayCalendar = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getStudentHolidayCalendar)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Calendar Found.",
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

        DTColumnBuilder.newColumn("calendarDate", "Date").withClass("f-s-600 text-inverse").withOption('name', 'Date').renderWith(function (data, type, full) {
            return $filter('date')(full.calendarDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),

        DTColumnBuilder.newColumn("reason", "Reason").withClass("f-s-600 text-inverse").withOption('name', 'Reason').renderWith(function (data, type, full) {
            var html = full.reason;
            return html;

        }),

        DTColumnBuilder.newColumn("groupName", "Class").withOption('name', 'Class').renderWith(function (data, type, full) {
            var html = full.groupName;
            return html;
        }),
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getStudentHolidayCalendar = function () {
        if ($scope.search.group.groupId != 0) {
            $scope.orderInstance.rerender();
        };
    };
});

