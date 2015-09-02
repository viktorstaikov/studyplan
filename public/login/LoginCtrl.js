angular.module('LoginCtrl', []).controller('LoginController', ['$scope', '$location', 'AuthenticationService',
    function ($scope, $location, AuthService) {

        $scope.errorMsg = '';

        $scope.facNumber = '';
        $scope.password = '';

        $scope.login = function () {


            AuthService.login($scope.facNumber, $scope.password, function () {
                $scope.errorMsg = '';

                var queryParams = $location.search();

                var url = '/';
                if (queryParams && queryParams['redirect_url']) {
                    url = decodeURIComponent(queryParams['redirect_url']);
                }


                $location.search('redirect_url', null);
                $location.path(url);
            }, function (err) {
                $scope.errorMsg = err;
            });
        };
    }
]);