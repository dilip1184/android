colorAdminApp.controller('viewAssignmentController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.search = { startDate: $scope.formatDate(new Date()), endDate: $scope.formatDate(new Date()), group: { groupId: 0 }, student: { studentId: 0 } };
    $scope.screenId = 260;
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

    $scope.getStudents = function () {
        $http.post($scope.webApiUrl + 'shared/GetClassStudents', JSON.stringify({
            apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, classId: $scope.search.group.groupId,
            applicationTypeId: $scope.applicationTypeId, version: $scope.version
        })).success(function (result) {
            if (result.status == true) {
                $scope.students = result.data;
                $scope.students.unshift({ studentId: 0, fullName: "Select Name" });
            }
            else {
                $scope.error(result.message);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
        });
    }

    function getAssignments(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'teacher/GetAssignments?apiKey=' + $scope.school.appKey + '&employeeId=' + $scope.teacher.employeeId + "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.search.startDate + '&endDate=' + $scope.search.endDate + '&classId=' + $scope.search.group.groupId + '&studentId=' + $scope.search.student.studentId + "&applicationTypeId=" + $scope.applicationTypeId + "&version=" + $scope.version).success(function (result) {
                if (result.status == true) {
                    $scope.assignment = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getAssignments)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Record Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('createdRow', createdRow)
        .withOption('autoWidth', false)
        .withBootstrap()

    $scope.orderColumns = [
        DTColumnBuilder.newColumn("assignmentTypeName", "Type").withOption('name', 'Assignment Type').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            var html = full.assignmentTypeName;
            return html;

        }),
        DTColumnBuilder.newColumn("assignmentTypeName", "Class/Student").withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            var html = full.assignmentTypeId == 1 ? full.className : full.fullName;
            return html;

        }),
        DTColumnBuilder.newColumn("assignmentDate", "Date").withClass("none").withOption('name', 'Date').renderWith(function (data, type, full) {
            return $filter('date')(full.assignmentDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
        DTColumnBuilder.newColumn("subjectName", "Subject").withOption('name', 'Subject').withClass("none").renderWith(function (data, type, full) {
            var html = full.subjectName;
            return html;

        }),
        DTColumnBuilder.newColumn("deadline", "Deadline").withClass("none").withOption('name', 'Deadline').renderWith(function (data, type, full) {
            return $filter('date')(full.deadline.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
        DTColumnBuilder.newColumn("description", "Description").withOption('name', 'Description').withClass("none").renderWith(function (data, type, full) {
            var html = full.description;
            return html;

        }),

        DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Download Assignment').renderWith(function (data, type, full) {
            var html = "<table>";
            angular.forEach(full.assignmentDocuments, function (item) {
                html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item.assignmentFilePath + "'>here</a> to download.</i></td></tr>";
            });
            html = html + "</table>";
            return html;
        }),
        DTColumnBuilder.newColumn(null).withTitle().withClass("f-s-600 text-inverse").notSortable()
            .renderWith(function (data, type, full, meta) {
                return '<button class="btn btn-danger btn-icon btn-circle btn-sm" ng-click="deleteAssignment(' + data.assignmentId + ',' + data.assignmentTypeId + ')">' + ' <i class="fa fa-times"></i></button>';
            })

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getAssignments = function () {
        $scope.orderInstance.rerender();
    };

    function onConfirmDelete(buttonIndex, asmId, asmTypeId) {
     
        if(buttonIndex==1)
        {
            $http.post($scope.webApiUrl + 'teacher/DeleteAssignment', JSON.stringify({
                apiKey: $scope.school.appKey, employeeId: $scope.teacher.employeeId,
                assignmentId: asmId, assignmentTypeId: asmTypeId, academicYearId: $scope.academicYear.academicYearId,
                applicationTypeId: $scope.applicationTypeId,
                version: $scope.version
            })).success(function (result) {
                if (result.status == true) {
                    $scope.success("Assignment has been deleted successfully");
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

    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

    $scope.deleteAssignment = function (asmId, asmTypeId) {
      
        if (app) {
            navigator.notification.confirm(
                'Are you sure to delete this assignment!',
                function (buttonIndex) {
                    onConfirmDelete(buttonIndex, asmId, asmTypeId);
                },
                'Please confirm',
                ['OK', 'CANCEL']
            );
        }
        else {
            var conf = confirm(' Are you sure to delete this assignment?') ? 1 : 0;
            onConfirmDelete(conf, asmId, asmTypeId);
        }
    }
});

