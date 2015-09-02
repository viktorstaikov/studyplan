angular
    .module('HomeCtrl', [])
    .controller('HomeController', ['$scope', '$route', '$q', 'AuthenticationService', 'CourseFactory', 'SelectionFactory',
        function ($scope, $route, $q, AuthService, CourseFactory, SelectionFactory) {
            $scope.authenticated = AuthService.authenticated();

            $scope.user = AuthService.getUser();

            if ($scope.authenticated) {
                $q.all([
                    CourseFactory.getAll(),
                    SelectionFactory.getAll($scope.user._id)
                ]).then(function (values) {

                    var courseResp = values[0].data;
                    var selectionResp = values[1].data;

                    $scope.courses = courseResp.result.map(function (el) {
                        // to be able to search on those frields
                        el.from = el.from + "";
                        el.to = el.to + "";
                        return el;
                    });
                    $scope.selectedCourses = $scope.courses.filter(function (el) {
                        for (var i = 0; i < selectionResp.result.length; i++) {
                            if (selectionResp.result[i].courseId == el._id) {
                                return true;
                            }
                        }
                        return false;
                    });

                    var timetable = new Timetable();
                    var start = 8;
                    var end = 18;
                    timetable.setScope(start, end); // optional, only whole hours between 0 and 23
                    timetable.addLocations(["Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота", "Неделя"]);
                    for (var i = $scope.selectedCourses.length - 1; i >= 0; i--) {
                        var course = $scope.selectedCourses[i];
                        timetable.addEvent(course.name, course.day, new Date(2015, 7, 17, course.from, 0), new Date(2015, 7, 17, course.to, 0));
                    };
                    var renderer = new Timetable.Renderer(timetable);
                    renderer.draw('.timetable'); // any css selector


                    $scope.addCourse = function (course) {
                        start = Math.min(start, parseInt(course.from));
                        end = Math.max(end, parseInt(course.to));

                        timetable.setScope(start, end);
                        timetable.addEvent(course.name, course.day, new Date(2015, 7, 17, course.from, 0), new Date(2015, 7, 17, course.to, 0));
                        renderer.draw('.timetable'); // any css selector

                        $scope.selectedCourses.push(course);
                        SelectionFactory.add($scope.user._id, course._id);
                    }

                    $scope.removeCourse = function (course) {
                        var index = -1;

                        for (var i = $scope.selectedCourses.length - 1; i >= 0; i--) {
                            var c = $scope.selectedCourses[i];
                            if (c._id != course._id) {
                                start = Math.min(start, parseInt(c.from));
                                end = Math.max(end, parseInt(c.to));

                                timetable.addEvent(c.name, c.day, new Date(2015, 7, 17, c.from, 0), new Date(2015, 7, 17, c.to, 0));
                            } else {
                                index = i;
                            }
                        };

                        $scope.selectedCourses.splice(index, 1);
                        timetable.setScope(start, end);
                        renderer.draw('.timetable'); // any css selector
                    }
                });
            } else {
                $scope.logout = function () {
                    AuthService.logout();
                    $route.reload();
                }
            }
        }
    ]);