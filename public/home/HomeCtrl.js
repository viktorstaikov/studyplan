angular.module('HomeCtrl', []).controller('HomeController', ['$scope', '$route', 'AuthenticationService', 'CourseFactory',
    function ($scope, $route, AuthService, CourseFactory) {
        $scope.authenticated = AuthService.authenticated();

        $scope.user = AuthService.getUser();

        if ($scope.authenticated) {
            CourseFactory.getAll().success(function (resp) {
                var courses = resp.result;

                var options = {
                    // item: '<li><h3 class="name"></h3><p class="city"></p></li>'
                    item: "hacker-item",
                    page: 10,
                    plugins: [
                        ListPagination({})
                    ]
                };

                var hackerList = new List('hacker-list', options, courses);
            });
        }

        $scope.logout = function () {
            AuthService.logout();
            $route.reload();
        }
    }
]);