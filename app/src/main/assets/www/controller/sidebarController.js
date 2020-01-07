colorAdminApp.controller('sidebarController', function ($scope, $rootScope, $state, $http) {
    $scope.userView = window.localStorage.getItem("userView") === null ? "1" : window.localStorage.getItem("userView");
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.isAttendanceModule = $scope.school.schoolModules.filter(function (item) { return item == 1; }).length > 0;
    $scope.isFeeModule = $scope.school.schoolModules.filter(function (item) { return item == 2; }).length > 0;
    $scope.isExaminationModule = $scope.school.schoolModules.filter(function (item) { return item == 3; }).length > 0;
    $scope.isTransportModule = $scope.school.schoolModules.filter(function (item) { return item == 4; }).length > 0;
    $scope.isGPSModule = $scope.school.schoolModules.filter(function (item) { return item == 5; }).length > 0;
    $scope.isLibraryModule = $scope.school.schoolModules.filter(function (item) { return item == 9; }).length > 0;
    $scope.isAssignmentModule = $scope.school.schoolModules.filter(function (item) { return item == 12; }).length > 0;
    $scope.isCertificateModule = $scope.school.schoolModules.filter(function (item) { return item == 14; }).length > 0;

    angular.element(document).ready(function () {
        App.initSidebar();
    });
    $scope.logOut = function () {
        navigator.app.exitApp();
        //$state.go('member.login');
    };
});