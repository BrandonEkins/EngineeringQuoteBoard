angular.module('app', ['ngMaterial'])
    .controller('mainCtrl', ['$scope', '$mdDialog', '$http', function($scope, $mdDialog, $http) {
        $scope.CalendarName = "";
        $scope.calendar = [];
        $scope.currentMonth = {};
        $scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.tempCalendarName = "";
        $scope.setDate = function() {
            var my_date = new Date();
            $scope.currentMonth = $scope.calendar[my_date.getMonth()];
            $scope.curMonthInt = my_date.getMonth();
        }

        $scope.forwardMonth = function() {
            $scope.curMonthInt += 1;
            $scope.currentMonth = $scope.calendar[$scope.curMonthInt]
        }
        $scope.backMonth = function() {
            $scope.curMonthInt -= 1;
            $scope.currentMonth = $scope.calendar[$scope.curMonthInt]
        }
        $scope.isToday = function(date) {
            var today = new Date();
            return date == today.getDate() && $scope.currentMonth.id == today.getMonth();
        }
        $scope.compareHide = function(value) {
            if (value == "end") {
                if ($scope.currentMonth.id > 10)
                    return true;
                else
                    return false;
            } else {
                if ($scope.currentMonth.id < 1)
                    return true;
                else
                    return false;
            }
        }
        $scope.addEvent = function() {
            $scope.selected_event = {};
            $scope.currentMonth.days[$scope.selected_date].events.push($scope.selected_event);
        }
        $scope.deleteEvent = function() {
            var index = $scope.currentMonth.days[$scope.selected_date].events.indexOf($scope.selected_event);
            $scope.currentMonth.days[$scope.selected_date].events.splice(index, 1);
            $scope.selected_event = null;
        }
        $scope.showBeginDialog = function() {
            var confirm = $mdDialog.confirm()
                .title('Welcome to the MEAN Calendar Web App')
                .textContent('This application uses the MEAN stack to impliment a calendar choose wether you would like to access a previously created calendar or make a new one')
                .ok('New Calendar')
                .cancel('Select Saved Calendar')
            $mdDialog.show(confirm).then(function() {
                $scope.showNewPrompt();
            }, function() {
                $scope.CalendarName = '-1';
                //hides dialog and then make the main page just display a drop down if there is no calendar information.
            });
        }
        $scope.showBeginDialog();
        $scope.showNewPrompt = function() {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('Calendar Name')
                .placeholder('Name')
                .textContent('Enter a name for this calendar')
                .ariaLabel('Name')
                .ok('Submit');

            $mdDialog.show(confirm).then(function(result) {
                $scope.CalendarName = result;
                var url = "../calendar?q=" + result;
                $http.get(url)
                    .then(function(response) {
                        $scope.calendar = response.data;
                        $scope.setDate();
                    });
            });
        };

        $http.get("../names").then(function(response) {
            $scope.names = response.data;
        });

        $scope.selectCalendar = function() {
            console.log($scope.tempCalendarName);
            $scope.CalendarName = $scope.tempCalendarName;
            var url = "../calendar?q=" + $scope.tempCalendarName;
            $http.get(url)
                .then(function(response) {
                    $scope.calendar = response.data;
                    $scope.setDate();

                });
        }
        $scope.saveCalendar = function() {
            var inputUrl = "../calendar?q=" + $scope.CalendarName;
            $http({
                method: "POST",
                url: inputUrl,
                data: $scope.calendar
            }).then(function mySucces(response) {
                console.log(response);
            }, function myError(response) {
                console.log(response);
            });
        }

    }]);
