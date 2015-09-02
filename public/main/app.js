angular.module('app', [
        'ngRoute',
        'LocalStorageModule',

        'AuthService',
        'CrsFactory',
        'SlctFactory',

        'awesomeList',

        'appRoutes',
        'HomeCtrl',
        'LoginCtrl',
        'SignupCtrl',
    ])
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('studyplanApp')
            .setStorageType('sessionStorage')
            .setNotify(true, true)
    });