angular
    .module('HomeCtrl', [])
    .controller('HomeController', ['$scope', '$route', '$q', 'AuthenticationService', 'CourseFactory', 'SelectionFactory',
        function ($scope, $route, $q, AuthService, CourseFactory, SelectionFactory) {
            $scope.authenticated = AuthService.authenticated();

            $scope.user = AuthService.getUser();

            if ($scope.user && $scope.authenticated) {
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
                    var start = 12;
                    var end = 12;
                    timetable.addLocations(["Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота", "Неделя"]);
                    for (var i = $scope.selectedCourses.length - 1; i >= 0; i--) {
                        var course = $scope.selectedCourses[i];
                        start = Math.min(start, parseInt(course.from));
                        end = Math.max(end, parseInt(course.to));
                        timetable.addEvent(course.name, course.day, new Date(2015, 7, 17, course.from, 0), new Date(2015, 7, 17, course.to, 0));
                    };
                    timetable.setScope(start, end);
                    var renderer = new Timetable.Renderer(timetable);
                    renderer.draw('.timetable'); // any css selector


                    $scope.addCourse = function (course) {
                        for (var i = $scope.selectedCourses.length - 1; i >= 0; i--) {
                            if ($scope.selectedCourses[i]._id == course._id) {
                                alert("This course is already added.");
                                return;
                            }
                        };
                        for (var i = $scope.selectedCourses.length - 1; i >= 0; i--) {
                            if ($scope.selectedCourses[i].day == course.day) {
                                if (($scope.selectedCourses[i].from <= course.to && course.to <= $scope.selectedCourses[i].to) ||
                                    $scope.selectedCourses[i].from <= course.from && course.from <= $scope.selectedCourses[i].to) {

                                    var confirm = window.confirm("The time of the course " + course.name + " overlapse with the course " +
                                        $scope.selectedCourses[i].name + ". Are you sure you want to add it?");

                                    if (!confirm) {
                                        return;
                                    }
                                }
                            }
                        };
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

                        timetable = new Timetable();
                        renderer = new Timetable.Renderer(timetable);
                        start = 8;
                        end = 18;
                        timetable.setScope(start, end);
                        timetable.addLocations(["Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота", "Неделя"]);
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
                        SelectionFactory.remove($scope.user._id, $scope.selectedCourses[index]._id);

                        $scope.selectedCourses.splice(index, 1);
                        timetable.setScope(start, end);

                        renderer.draw('.timetable'); // any css selector
                    }
                });
            }

            $scope.logout = function () {
                AuthService.logout();
                $route.reload();
            }
        }
    ]);