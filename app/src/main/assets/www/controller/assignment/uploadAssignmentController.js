colorAdminApp.controller('uploadAssignmentController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $q) {
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.assignment = { assignmentDate: $scope.formatDate(new Date()), deadline: $scope.formatDate(new Date()), student: { studentId: 0 } };
    $scope.assignmentId = 0;
    $scope.screenId = 260;
    Dropzone.autoDiscover = false;

    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    if (app) {
        var permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);
    } 

    function checkPermissionCallback(status) {
        if (!status.hasPermission) {
            var errorCallback = function () {
                console.warn('Storage permission is not turned on');
            }
            permissions.requestPermission(
              permissions.READ_EXTERNAL_STORAGE,
              function (status) {
                  if (!status.hasPermission) {
                      errorCallback();
                  } else {
                      // continue with downloading/ Accessing operation 
                  }
              },
              errorCallback);
        }
    }

    $scope.dzOptions = {
        url: $scope.webApiUrl + 'teacher/UploadAssignmentFiles',
        autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 4,
        maxFilesize: 5,
        addRemoveLinks: true,
    };


    //Handle events for dropzone
    //Visit http://www.dropzonejs.com/#events for more events
    $scope.dzCallbacks = {
        'addedfile': function (file) {
            if ($scope.dzMethods.getAllFiles().length > 4) {
                $scope.error("We're sorry, but you can not upload more than 4 files.");
                $scope.dzMethods.removeFile(file);
            }
            var ext = file.name.split('.').pop();

            if (ext == "txt") {
                $(file.previewElement).find(".dz-image img").attr("src", "images/notepad-logo.png");
            } else if (ext.indexOf("doc") != -1) {
                $(file.previewElement).find(".dz-image img").attr("src", "images/word-logo.png");
            } else if (ext.indexOf("xls") != -1) {
                $(file.previewElement).find(".dz-image img").attr("src", "images/excel-logo.png");
            }
            else if (ext.indexOf("pdf") != -1) {
                $(file.previewElement).find(".dz-image img").attr("src", "images/pdf-logo.png");
            }
            $scope.newFile = file;
        },
        'success': function (file, xhr) {
            $scope.success("Assignment Files(s) has been uploaded Successfully");
            $state.go("app.assignment.viewAssignment");
        },
        'error': function (file, xhr) {
            $scope.success("An error occured uploading Assignment Files(s)");
        },
        'sending': function (file, xhr, formData) {
            if (formData.get("assignmentId") == null) {
                formData.append("assignmentId", $scope.assignmentId);
                formData.append("studentId", $scope.assignment.student.studentId);
                formData.append("employeeId", $scope.teacher.employeeId);
                formData.append("academicYearId", $scope.academicYear.academicYearId);
            }
        }
    };


    //Apply methods for dropzone
    //Visit http://www.dropzonejs.com/#dropzone-methods for more methods
    $scope.dzMethods = {};

    $http.post($scope.webApiUrl + 'teacher/GetClassList', JSON.stringify({
        apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, employeeId: $scope.teacher.employeeId,
        applicationTypeId: $scope.applicationTypeId, version: $scope.version
    })).success(function (result) {
        if (result.status == true) {
            $scope.userGroups = result.data;

        }
        else {
            $scope.error(result.message);
        }
    }).error(function (error, status) {
        $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
    });

    $scope.getSubjects = function () {
        $http.post($scope.webApiUrl + 'shared/GetClassSubjects', JSON.stringify({
            apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, classId: $scope.assignment.group.groupId,
            applicationTypeId: $scope.applicationTypeId, version: $scope.version
        })).success(function (result) {
            if (result.status == true) {
                $scope.subjects = result.data;
            }
            else {
                $scope.error(result.message);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
        });
        $scope.getStudents();
    }

    $scope.getStudents = function () {
        $http.post($scope.webApiUrl + 'shared/GetClassStudents', JSON.stringify({
            apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, classId: $scope.assignment.group.groupId,
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

    $scope.uploadAssignment = function (form) {
      
       
        if ($scope.assignmentForm.$invalid) {
            angular.forEach($scope.assignmentForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
           
        }
        if ($scope.assignmentForm.$valid) {

            $http.post($scope.webApiUrl + 'teacher/SaveAssignment', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, employeeId: $scope.teacher.employeeId,
                applicationTypeId: $scope.applicationTypeId, version: $scope.version,
                assignmentDate: $scope.assignment.assignmentDate, deadline: $scope.assignment.deadline, classId: $scope.assignment.group.groupId,
                studentId: $scope.assignment.student.studentId,
                subjectId: $scope.assignment.subject.subjectId, description: $scope.assignment.description
            })).success(function (result) {
                if (result.status == true) {
                    $scope.assignmentId = result.data;
                    $scope.success("Assignment has been created Successfully");
                    if ($scope.dzMethods.getAllFiles().length > 0) {
                        $scope.dzMethods.processQueue();
                    }
                    else {
                        
                        $state.go("app.assignment.viewAssignment");
                    }
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

