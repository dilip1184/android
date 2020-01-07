colorAdminApp.controller('sendNoticeController', function ($scope, $rootScope, $http,$log, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {

    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.isSelectedAll = false;
    $scope.isByGroup = true;
    $scope.screenId = 189;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;
    $scope.userList = [];
    $scope.txtNotice = "";
  
    function getClassList(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.post($scope.webApiUrl + 'teacher/GetClassList', JSON.stringify({
            apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, employeeId: $scope.teacher.employeeId,
            applicationTypeId: $scope.applicationTypeId, version: $scope.version
        })).success(function (result) {
            if (result.status == true) {
                $scope.classList = result.data;
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

    $scope.classInstance = {};
    $scope.classOptions = DTOptionsBuilder.newOptions().withFnServerData(getClassList)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Class Found.",
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
    $scope.classColumns = [

        DTColumnBuilder.newColumn(null).withTitle('<input type="checkbox" ng-model="isSelectedAll" ng-click="toggleAll()">').notSortable()
            .renderWith(function (data, type, full, meta) {
                i = i + 1;
                return '<input type="checkbox" ng-model="classList[' + i + '].isSelected" ng-click="toggleOne()">';
            }).withClass("text-center"),
        DTColumnBuilder.newColumn("groupName", "Class").withClass("f-s-600 text-inverse").withTitle('Class').withOption('name', 'Class').renderWith(function (data, type, full) {
            return full.groupName;
        }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getClassList = function () {
        $scope.classInstance.rerender();
    };

    $scope.toggleAll = function () {
        angular.forEach($scope.classList, function (item, key) {
            item.isSelected = $scope.isSelectedAll;
        });
    }
    $scope.toggleOne = function () {
        if ($scope.classList.length === $scope.classList.filter(function (item) { return item.isSelected === true; }).length) {
            $scope.isSelectedAll = true;
        }
        else {
            $scope.isSelectedAll = false;
        }
    }
    function getUsers(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.post($scope.webApiUrl + 'teacher/GetUsers', JSON.stringify({
            apiKey: $scope.school.appKey, employeeId: $scope.teacher.employeeId, userName: $scope.userName, academicYearId: $scope.academicYear.academicYearId,
            applicationTypeId: $scope.applicationTypeId, version: $scope.version
        })).success(function (result) {
            if (result.status == true) {
                $scope.userList = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getUsers)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No User Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('createdRow', createdRow)
        .withOption('autoWidth', false)
        .withBootstrap()
    var i = -1;
    $scope.orderColumns = [

        DTColumnBuilder.newColumn(null).withTitle('<input type="checkbox" ng-model="isSelectedAll">').notSortable()
            .renderWith(function (data, type, full, meta) {
                i = i + 1;
                return '<input type="checkbox" ng-model="userList[' + i + '].isSelected" ng-click="toggleOne()">';
            }).withClass("text-center"),
        DTColumnBuilder.newColumn("fullName", "Name").withClass("f-s-600 text-inverse").withOption('name', 'Name').renderWith(function (data, type, full) {
            return full.fullName;
        }),
        DTColumnBuilder.newColumn("groupName", "Class").withClass("f-s-600 text-inverse").withTitle('Class').withOption('name', 'Class').renderWith(function (data, type, full) {
            return full.groupName;
        }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getUsers = function () {
        $scope.orderInstance.rerender();
    };

    function onSendNotice(buttonIndex) {
        debugger;
        if (buttonIndex == 1) {
            if ($scope.isByGroup) {
                var selectedGroups = $scope.classList.filter(function (item) { return item.isSelected == true; });
                var groupIds = selectedGroups.map(function (obj) { return obj.groupId; }).join(', ');
                if (groupIds == "") {
                    $scope.error("Please select any group");
                    return false;
                }
            }
            else {
                var selectedItems = $scope.userList.filter(function (item) { return item.isSelected == true; });
                var entityRoleIds = selectedItems.map(function (obj) { return obj.entityId + '|' + obj.roleId; }).join(', ');
                if (entityRoleIds == "") {
                    $scope.error("Please select any student");
                    return false;
                }
            }

            $http.post($scope.webApiUrl + 'teacher/SendNotice', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, employeeId: $scope.teacher.employeeId, entityRoleIds, groupIds, isByGroup: $scope.isByGroup, txtNotice: $scope.txtNotice,
                applicationTypeId: $scope.applicationTypeId, version: $scope.version
            })).success(function (result) {
                if (result.status == true) {

                    $scope.success("Notice has been sent Successfully");
                    $state.reload("app.notice.sendNotice");

                }
                else {
                    $scope.error(result.message);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
            });
        }
    }
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    $scope.sendNotice = function () {
        if (app) {
            navigator.notification.confirm(
                'Are you sure to send this notice!',
                onSendNotice,
                'Please confirm',
                ['OK', 'CANCEL']
            );
        }
        else {
            var conf = (confirm('Are you sure to send this notice?')) ? 1 : 0;
            onSendNotice(conf);
        }
    }
});
