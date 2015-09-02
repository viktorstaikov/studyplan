angular.module('app', [
        'ngRoute',
        'LocalStorageModule',

        'AuthService',
        // 'LvlFactory',
        // 'PrgrssFactory',

        // 'SokobanBoardDirective',

        'appRoutes',
        'HomeCtrl',
        // 'PlayCtrl',
        'LoginCtrl',
        'SignupCtrl',
    ])
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('studyplanApp')
            .setStorageType('sessionStorage')
            .setNotify(true, true)
    });