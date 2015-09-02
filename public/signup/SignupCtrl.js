angular.module('SignupCtrl', []).controller('SignupController', ['$scope', '$location', 'AuthenticationService',
    function ($scope, $location, AuthService) {

        $scope.errorMsg = '';

        $scope.user = {};

        $scope.signup = function () {

            AuthService.signup($scope.user)
                .success(function () {
                    $scope.errorMsg = '';
                    $location.path('/login');
                })
                .error(function (err) {
                    $scope.errorMsg = err;
                });
        };
    }
]);