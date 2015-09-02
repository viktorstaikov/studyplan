angular.module('AuthService', ['LocalStorageModule']).factory('AuthenticationService', ['$http', 'localStorageService', '$q',
    function ($http, localStorageService, $q) {
        var $cookies = localStorageService.cookie;

        function setUser(user) {
            $cookies.set('user', JSON.stringify(user));
        }

        function setToken(token) {
            $cookies.set('token', JSON.stringify(token));
        }

        return {
            getUser: function () {
                return $cookies.get('user');
            },
            getToken: function () {
                return $cookies.get('token');
            },
            authenticated: function () {
                var user = this.getUser();
                if (!user) return $q.reject('Not Authenticated');

                var token = this.getToken();
                if (!token) return $q.reject('Not Authenticated');
                if (token.expire && token.expire < Date.now()) return $q.reject('Not Authenticated');

                return true;
            },
            login: function (facNumber, password, success, error) {
                $http.post('/login', {
                        "facNumber": facNumber,
                        password: password
                    })
                    .success(function (data, status, headers, config) {
                        setUser(data.user);
                        setToken(data.token);

                        success();
                    }).error(function (data, status, headers, config) {
                        error(data);
                    });
            },
            signup: function (user, success, error) {
                return $http.post('/signup', user);
            },
            logout: function () {
                setUser(null);
                setToken(null);
                console.log("logout");
            }
        }
    }
]);