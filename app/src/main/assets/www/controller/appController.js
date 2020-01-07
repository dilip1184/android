colorAdminApp.controller('appController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.applicationTypeId = 4;
    $scope.version = "1.0.3";
    $scope.backgroundImage = "images/background/mps.jpg";
    //$scope.webApiUrl = "http://localhost:1767/api/";
    $scope.webApiUrl = "http://mpsayodhya.rbstech.in/api/";

    $scope.$on('$includeContentLoaded', function () {
        handleSlimScroll();
    });
    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.$on('$stateChangeStart', function () {
        // reset layout setting
        $rootScope.setting.layout.pageSidebarMinified = false;
        $rootScope.setting.layout.pageFixedFooter = false;
        $rootScope.setting.layout.pageRightSidebar = false;
        $rootScope.setting.layout.pageTwoSidebar = false;
        $rootScope.setting.layout.pageTopMenu = false;
        $rootScope.setting.layout.pageBoxedLayout = false;
        $rootScope.setting.layout.pageWithoutSidebar = false;
        $rootScope.setting.layout.pageContentFullHeight = false;
        $rootScope.setting.layout.pageContentFullWidth = false;
        $rootScope.setting.layout.paceTop = false;
        $rootScope.setting.layout.pageLanguageBar = false;
        $rootScope.setting.layout.pageSidebarTransparent = false;
        $rootScope.setting.layout.pageWideSidebar = false;
        $rootScope.setting.layout.pageLightSidebar = false;
        $rootScope.setting.layout.pageWithFooter = false;
        $rootScope.setting.layout.pageMegaMenu = false;
        $rootScope.setting.layout.pageWithoutHeader = false;
        $rootScope.setting.layout.pageBgWhite = false;
        $rootScope.setting.layout.pageContentInverseMode = false;
        App.scrollTop();
        $('.pace .pace-progress').addClass('hide');
        $('.pace').removeClass('pace-inactive');
    });
    $scope.$on('$stateChangeSuccess', function () {
        Pace.restart();
        App.initPageLoad();
        App.initSidebarSelection();
        App.initSidebarMobileSelection();
        setTimeout(function () {
            App.initLocalStorage();
            App.initComponent();
        }, 0);
        if ($('#top-menu').length !== 0) {
            $('#top-menu').removeAttr('style');
        }
    });
    $scope.$on('$stateNotFound', function () {
        Pace.stop();
    });
    $scope.$on('$stateChangeError', function () {
        Pace.stop();
    });
   
    $scope.schoolName;
    $http.get($scope.webApiUrl + 'shared/GetSchoolDetail').success(function (result) {
        if (result == null) {
            $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
        }
        else {
            $scope.schoolName = result.data.schoolName;
            //$scope.backgroundImage = result.data.appBackgroundImagePath;
        }
    }).error(function (error, status) {
        $scope.error("An unhandled error has occured. Please try again, and contact your administrator if the problem persists.");
    });

   
    function showOffline() {
        $scope.error("There is no internet connection in your mobile. Please check your internet connection.")
    }

    function showOnline() {
        //$scope.success("You have proper internet connection. Go ahead and use the app.")
    }

    document.addEventListener("offline", showOffline, false);
    document.addEventListener("online", showOnline, false);

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        try {

            window.FirebasePlugin.onTokenRefresh(function(fcmToken) {
                console.log(fcmToken);
                //$scope.error("sbc");
                $scope.success(fcmToken);
            }, function(error) {
                console.error(error);
            });
        }
        catch (x) {
            $scope.error(x.message);
        }
        document.addEventListener("backbutton", function (e) {
            e.preventDefault();
        }, false);
    }

    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

    $scope.error = function (message) {
        if (app) {
            window.plugins.toast.showWithOptions(
                {
                    message: message,
                    duration: 4000, // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                    position: "top",
                    styling: {
                        backgroundColor: '#F44336',
                    }
                }
            );
        }
        else {
           alert(message);
        }
    }

    $scope.success = function (message) {
        if (app) {
            window.plugins.toast.showWithOptions(
                {
                    message: message,
                    duration: 4000, // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                    position: "top",
                    styling: {
                        backgroundColor: '#009688',
                    }
                }
            );
        }
        else {

            alert(message);
        }
    }

    $scope.warning = function (message) {
        if (app) {
            window.plugins.toast.showWithOptions(
                {
                    message: message,
                    duration: 4000, // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                    position: "top",
                    styling: {
                        backgroundColor: '#FFC107',
                    }
                }
            );
        }
        else {
            alert(message);
        }
    }
    $scope.teacher = JSON.parse(window.localStorage.getItem("teacher"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));


    $scope.formatDate = function (date) {
        month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }
}]);
