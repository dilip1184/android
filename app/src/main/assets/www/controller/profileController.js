colorAdminApp.controller('profileController', function ($scope, $rootScope, $http, $state, $location) {
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
   
    angular.element(document).ready(function () {
        
    });
});

