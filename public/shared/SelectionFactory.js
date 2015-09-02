angular
    .module("SlctFactory", [])
    .factory("SelectionFactory", ["AuthenticationService", "$http",
        function (AuthenticationService, $http) {

            var token = AuthenticationService.getToken();
            return {
                getAll: function (userId) {
                    var req = {
                        url: '/api/selection/' + userId,
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token.token
                        }
                    }
                    return $http(req);
                },
                add: function (userId, courseId) {
                    var req = {
                        url: '/api/selection/' + userId + "/" + courseId,
                        method: 'POST',
                        headers: {
                            'Authorization': 'JWT ' + token.token
                        }
                    };
                    return $http(req);
                },
                remove: function (userId, courseId) {
                    var req = {
                        url: '/api/selection/' + userId + "/" + courseId,
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'JWT ' + token.token
                        }
                    };
                    return $http(req);
                }
            };
        }
    ]);