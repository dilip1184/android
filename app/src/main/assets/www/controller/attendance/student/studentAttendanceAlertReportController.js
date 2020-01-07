colorAdminApp.controller('studentAttendanceAlertReportController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.search = { startDate: $scope.formatDate(new Date()), endDate: $scope.formatDate(new Date()), group: { groupId: 0 }, alertCategory: { alertCategoryId: 0 } };
    $scope.screenId = 151;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

    $http.get($scope.webApiUrl + 'shared/GetAttendanceAlertCategories?apiKey=' + $scope.school.appKey + "&academicYearId=" + $scope.academicYear.academicYearId +
        "&applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version).success(function (result) {
            if (result.status == true) {
                $scope.alertCategories = result.data;
                $scope.alertCategories.unshift({ alertCategoryId: 0, alertCategoryName: "Select Category" });
            }
            else {
                $scope.error(result.message);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
        });


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


    function getStudentAttendanceAlertReport(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        if ($scope.search.group.groupId != 0) {
           
            $http.post($scope.webApiUrl + 'teacher/GetStudentAttendanceAlertReport', JSON.stringify({
                apiKey: $scope.school.appKey, employeeId: $scope.teacher.employeeId,
                studentName: $scope.studentName, alertCategoryId: $scope.search.alertCategory.alertCategoryId, groupId: $scope.search.group.groupId, academicYearId: $scope.academicYear.academicYearId,
                startDate: $scope.search.startDate, endDate: $scope.search.endDate, applicationTypeId: $scope.applicationTypeId,
                version: $scope.version
            })).success(function (result) {
                if (result.status == true) {
                    $scope.alertReport = result.data;

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
$scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getStudentAttendanceAlertReport)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Alert Found.",
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
        DTColumnBuilder.newColumn("groupName", "Class").withClass("none").withOption('name', 'Class').renderWith(function (data, type, full) {
            var html = full.groupName;
            return html;
        }),
        DTColumnBuilder.newColumn("alertDate", "Date").withClass("f-s-600 text-inverse").withOption('name', 'Date').renderWith(function (data, type, full) {
            return full.alertDate;
        }),

        DTColumnBuilder.newColumn("alertMessage", "Message").withOption('name', 'Message').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            var html = full.alertMessage;
            return html;
        }),

        DTColumnBuilder.newColumn("alertTime", "Time").withClass("none").withTitle('Time').withOption('name', 'Time').renderWith(function (data, type, full) {
            return full.alertTime;
        }),
        DTColumnBuilder.newColumn("deliveryDate", "Delivery Date").withClass("none").withOption('name', 'Delivery Date').renderWith(function (data, type, full) {

            return full.deliveryDate;
        }),
        DTColumnBuilder.newColumn("deliveryTime", "Delivery Time").withClass("none").withOption('name', 'Delivery Time').renderWith(function (data, type, full) {

            return full.deliveryTime;
        }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getStudentAttendanceAlertReport = function () {
        if ($scope.search.group.groupId != 0) {
            $scope.orderInstance.rerender();
        };
        
    };
});

