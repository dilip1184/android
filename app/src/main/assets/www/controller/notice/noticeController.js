colorAdminApp.controller('noticeController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.startDate = $scope.formatDate(new Date());
    $scope.endDate = $scope.formatDate(new Date());
    
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

  

    function getAlertReport(sSource, aoData, fnCallback, oSettings) {
     
        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'teacher/GetAlertReport?apiKey=' + $scope.school.appKey + '&employeeId=' + $scope.teacher.employeeId + "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate + '&alertCategoryId=37' + "&applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version).success(function (result) {
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

    $scope.orderInstance = {};
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getAlertReport)
    .withOption('processing', false)
    .withOption('oLanguage', {
        "sZeroRecords": "No Notice Found.",
    }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
    .withOption('serverSide', true)
    .withPaginationType('full_numbers')
    .withOption('createdRow', createdRow)
         .withOption('autoWidth', false)
    .withBootstrap()

    $scope.orderColumns = [

            DTColumnBuilder.newColumn("alertMessage", "Message").withOption('name', 'Message').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
                var html = full.alertMessage;
                return html;

            }),
        DTColumnBuilder.newColumn("alertDate", "Date").withClass("f-s-600 text-inverse").withOption('name', 'Date').renderWith(function (data, type, full) {
                return full.alertDate;
            }),
        DTColumnBuilder.newColumn("alertTime", "Time").withClass("f-s-600 text-inverse").withTitle('Time').withOption('name', 'Time').renderWith(function (data, type, full) {
                return full.alertTime;
            }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getAlertReport = function () {
        $scope.orderInstance.rerender();
    };
});

