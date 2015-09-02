angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'home/home.html',
                controller: 'HomeController'
            })
            .when('/login', {
                templateUrl: 'login/login.html',
                controller: 'LoginController'
            })
            .when('/signup', {
                templateUrl: 'signup/signup.html'
            })
            .otherwise({
                redirectTo: '/home'
            });

        //$locationProvider.html5Mode(true); // fix url to not contain '#'
    }
]).run(function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function (current, previous, rejection, message) {

        if (message === 'Not Authenticated') {
            $location.path('/login');
            $location.search('redirect_url', previous.$$route.originalPath);
        }
    })
})