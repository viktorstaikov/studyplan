angular
    .module("CrsFactory", [])
    .factory("CourseFactory", ["AuthenticationService", "$http",
        function (AuthenticationService, $http) {

            var token = AuthenticationService.getToken();
            return {
                getAll: function () {
                    var req = {
                        url: '/api/course',
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token.token
                        }
                    }
                    return $http(req);
                },
                getById: function (id) {
                    var req = {
                        url: '/api/course/' + id,
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token.token
                        }
                    }
                    return $http(req);
                }
            };
        }
    ]);