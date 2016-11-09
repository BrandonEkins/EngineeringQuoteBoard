angular.module('app', ['ngMaterial'])
    .controller('mainCtrl', ['$scope', '$mdDialog', '$http', function($scope, $mdDialog, $http) {
        $scope.CalendarName = "";
        $scope.calendar = [];
        $scope.currentMonth = {};
        $scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        // $scope.calendar = [
        //     { id: 0, name: "January", days: [], },
        //     { id: 1, name: "Febuary", days: [], },
        //     { id: 2, name: "March", days: [], },
        //     { id: 3, name: "April", days: [], },
        //     { id: 4, name: "May", days: [], },
        //     { id: 5, name: "June", days: [], },
        //     { id: 6, name: "July", days: [], },
        //     { id: 7, name: "August", days: [], },
        //     { id: 8, name: "September", days: [], },
        //     { id: 9, name: "October", days: [], },
        //     { id: 10, name: "November", days: [], },
        //     { id: 11, name: "December", days: [], }
        // ]
        // $scope.day = {
        //     date: 0,
        //     dayOfWeek: "",
        //     events: [] // work on this
        // }
        // $scope.daysInEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // $scope.currentDayOfWeek = 5;
        // $scope.calcDays = function() {
        //     for (var i = 0; $scope.calendar.length > i; i++) { //selects correct month
        //         for (var j = 0; $scope.currentDayOfWeek > j; j++) {
        //             $scope.calendar[i].days.push({
        //                 date: null,
        //                 dayOfWeek: j,
        //                 events: []
        //             });
        //         }
        //         for (var j = 1; $scope.daysInEachMonth[i] >= j; j++) {
        //             $scope.calendar[i].days.push({ // adds days to day array
        //                 date: j,
        //                 dayOfWeek: $scope.currentDayOfWeek,
        //                 events: []
        //             });
        //             if ($scope.currentDayOfWeek == 6) { // increments days of week
        //                 $scope.currentDayOfWeek = 0;
        //             } else {
        //                 $scope.currentDayOfWeek += 1;
        //             }
        //         }

        //     }
        // }
        // $scope.calcDays();
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
        $scope.showPrompt = function() {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('Calendar Name')
                .placeholder('Name')
                .textContent('This Application acts as a directory of calendars. Add events and save the calender and then reload the webpage and type in the same name to access the saved Calendar')
                .ariaLabel('Name')
                .ok('Submit');

            $mdDialog.show(confirm).then(function(result) {
                $scope.CalendarName = result;
                var url = "../getcalendar?q=" + result;
                $http.get(url)
                    .then(function(response) {
                        $scope.calendar = response.data;
                        $scope.setDate();
                    });
                // $.getJSON(url, function(data) {
                //         $scope.calendar = data;
                //         $scope.setDate();
                //     })
                //     .done(function() { console.log('getJSON request succeeded!'); })
                //     .fail(function(jqXHR, textStatus, errorThrown) {
                //         console.log('getJSON request failed! ' + textStatus);
                //         console.log("incoming " + jqXHR.responseText);
                //     })
                //     .always(function() {
                //         console.log('getJSON request ended!');
                //     })
                //     .complete(function() { console.log("complete"); 
                // });
            });
        };
        $scope.showPrompt();
        $scope.saveCalendar = function() {
            var inputUrl = "../savecalendar?q=" + $scope.CalendarName;
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
