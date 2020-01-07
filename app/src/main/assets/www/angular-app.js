/*
Template Name: Color Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.7 & Bootstrap 4.0.0-Alpha 6
Version: 3.0.0
Author: Sean Ngu
Website: http://www.seantheme.com/color-admin-v3.0/admin/angularjs/
*/

var colorAdminApp = angular.module('colorAdminApp', [
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad',
    'datatables', 'datatables.bootstrap', 'thatisuday.dropzone'
]);

colorAdminApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/member/login');

    $stateProvider
        .state('app', {
            url: '/app',
            templateUrl: 'template/app.html',
            abstract: true
        })

        .state('app.dashboard', {
            url: '/dashboard',
            templateUrl: 'views/dashboard.html',
            data: { pageTitle: 'Dashboard' }
        })

        .state('app.notice', {
            url: '/notice',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.notice.viewNotice', {
            url: '/notice',
            data: { pageTitle: 'Notice' },
            templateUrl: 'views/notice/notice.html',

        })
        .state('app.notice.sendNotice', {
            url: '/send-notice',
            data: { pageTitle: 'Notice' },
            templateUrl: 'views/notice/sendNotice.html',

        })

  .state('app.markAttendance', {
            url: '/markAttendance',
            data: { pageTitle: 'Mark Attendance' },
            templateUrl: 'views/markAttendance.html',

        })

        .state('app.attendance.studentList', {
            url: '/studentList',
            data: { pageTitle: 'Student List' },
            templateUrl: 'views/attendance/studentList.html',

        })

        .state('app.attendance.viewStudentDetail', {
            url: '/student-detail/:studentId',
            data: { pageTitle: 'Student Detail' },
            templateUrl: 'views/attendance/studentDetail.html',

        })

        .state('app.timeTable', {
            url: '/time-table',
            data: { pageTitle: 'Time Table' },
            templateUrl: 'views/timeTable.html',

        })

        .state('app.assignment', {
            url: '/assignment',
            template: '<div ui-view></div>',
            abstract: true

        })
        .state('app.assignment.uploadAssignment', {
            url: '/upload',
            data: { pageTitle: 'Upload Assignment' },
            templateUrl: 'views/assignment/uploadAssignment.html',

        })
        .state('app.assignment.viewAssignment', {
            url: '/view',
            data: { pageTitle: 'View Assignment' },
            templateUrl: 'views/assignment/viewAssignment.html',

        })
        .state('app.alert', {
            url: '/alert',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.alert.alertReport', {
            url: '/alert-report',
            data: { pageTitle: 'Alert Report' },
            templateUrl: 'views/alert/alertReport.html',

        })

        .state('app.attendance', {
            url: '/attendance',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.attendance.alertReport', {
            url: '/alert-report',
            data: { pageTitle: 'Attendance Alert Report' },
            templateUrl: 'views/attendance/attendanceAlertReport.html',

        })
        .state('app.attendance.holidayCalendar', {
            url: '/holiday-calendar',
            data: { pageTitle: 'Holiday Calendar' },
            templateUrl: 'views/attendance/holidayCalendar.html',

        })
        .state('app.attendance.attendanceInOut', {
            url: '/in-out-report',
            data: { pageTitle: 'Attendance In Out Report' },
            templateUrl: 'views/attendance/attendanceInOutReport.html',

        })
        .state('app.attendance.attendanceReport', {
            url: '/attendance-report',
            data: { pageTitle: 'Attendancet Report' },
            templateUrl: 'views/attendance/attendanceReport.html',

        })
        .state('app.attendance.absentReport', {
            url: '/absent-report',
            data: { pageTitle: 'Absent Report' },
            templateUrl: 'views/attendance/absentReport.html',

        })
                .state('app.attendance.monthlyReport', {
                    url: '/monthly-report',
                    data: { pageTitle: 'Attendance Monthly Report' },
                    templateUrl: 'views/attendance/attendanceMonthlyReport.html',
                    resolve: {
                        service: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                files: [
                                    'assets/plugins/bootstrap-calendar/css/bootstrap_calendar.css',
                                    'assets/plugins/bootstrap-calendar/js/bootstrap_calendar.js',
                                ]
                            });
                        }]
                    }
                })

        .state('app.attendance.student', {
            url: '/attendance',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.attendance.student.alertReport', {
            url: '/alert-report',
            data: { pageTitle: 'Attendance Alert Report' },
            templateUrl: 'views/attendance/student/studentAttendanceAlertReport.html',

        })
        .state('app.attendance.student.holidayCalendar', {
            url: '/holiday-calendar',
            data: { pageTitle: 'Holiday Calendar' },
            templateUrl: 'views/attendance/student/studentHolidayCalendar.html',

        })
        .state('app.attendance.student.attendanceInOut', {
            url: '/in-out-report',
            data: { pageTitle: 'Attendance In Out Report' },
            templateUrl: 'views/attendance/student/studentAttendanceInOutReport.html',

        })
        .state('app.attendance.student.attendanceReport', {
            url: '/attendance-report',
            data: { pageTitle: 'Attendancet Report' },
            templateUrl: 'views/attendance/student/studentAttendanceReport.html',

        })
        .state('app.attendance.student.absentReport', {
            url: '/absent-report',
            data: { pageTitle: 'Absent Report' },
            templateUrl: 'views/attendance/student/studentAbsentReport.html',

        })

        .state('app.attendance.student.monthlyReport', {
            url: '/monthly-report',
            data: { pageTitle: 'Monthly Report' },
            templateUrl: 'views/attendance/student/studentAttendanceMonthlyReport.html',

        })
      
        .state('app.attendance.student.viewMonthlyReport', {
            url: '/view-monthly-report/:studentId',
            data: { pageTitle: 'Monthly Report' },
            templateUrl: 'views/attendance/student/viewAttendanceMonthlyReport.html',
            resolve: {
                service: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            'assets/plugins/bootstrap-calendar/css/bootstrap_calendar.css',
                            'assets/plugins/bootstrap-calendar/js/bootstrap_calendar.js',
                        ]
                    });
                }]
            }
        })

        .state('app.profile', {
            url: '/profile',
            data: { pageTitle: 'Profile' },
            templateUrl: 'views/profile.html',
            resolve: {
                service: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'assets/plugins/superbox/css/superbox.min.css',
                            'assets/plugins/lity/dist/lity.min.css',
                            'assets/plugins/superbox/js/jquery.superbox.min.js',
                            'assets/plugins/lity/dist/lity.min.js',
                        ]
                    })
                }]
            }
        })
        .state('app.changePassword', {
            url: '/change-password',
            data: { pageTitle: 'Change Password' },
            templateUrl: 'views/changePassword.html',

        })

        .state('error', {
            url: '/error',
            data: { pageTitle: '404 Error' },
            templateUrl: 'views/extra_404_error.html'
        })
        .state('member', {
            url: '/member',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('member.login', {
            url: '/login',
            data: { pageTitle: 'Login' },
            templateUrl: 'views/login.html',
        })

        .state('app.helpRequest', {
            url: '/help-request',
            data: { pageTitle: 'Help Request' },
            templateUrl: 'views/help/helpRequest.html',

        })
   
}]);

colorAdminApp.run(['$rootScope', '$state', 'setting', function ($rootScope, $state, setting) {
    $rootScope.$state = $state;
    $rootScope.setting = setting;
}]);