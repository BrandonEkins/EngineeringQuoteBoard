angular.module('app', ['ngMaterial', 'textAngular'])
    .controller('mainCtrl', ['$scope', '$mdDialog', '$http', function($scope, $mdDialog, $http) {
        $scope.showAddDialog = function(ev) {
            $mdDialog.show({
                contentElement: '#AddDialog',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };
        $scope.hideDialog = function() {
            $mdDialog.hide();
            $scope.newQuote = {
                id: "",
                quote: "",
                users: "",
                date: ""
            };
        }
        $scope.newQuote = {
            id: "",
            quote: "",
            users: "",
            date: ""
        };
        $scope.getQuotes = function() {
            $http.get("../quote").then(function(response) {

                $scope.quotes = response.data;
                for (var i = 0; $scope.quotes.length > i; i++) {
                    $scope.quotes[i].date = new Date($scope.quotes[i].date);
                }
                $scope.quotes = $scope.quotes.slice().reverse();
            });
        }
        $scope.getQuotes();
        $scope.saveQuote = function(id) {
            var tempData;
            if (id == 'edit') {

                tempData = $scope.editQuote;

                var inputUrl = "../quote";
            } else if (id == 'new') {
                $scope.newQuote.date = Date();
                tempData = $scope.newQuote;
                var inputUrl = "../quote";
            }
            $http({
                method: "POST",
                url: inputUrl,
                data: tempData
            }).then(function mySuccess(response) {
                console.log(response);
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Success!')
                    .textContent('This Quote has been successfully saved!')
                    .ok('OK')
                );
            }, function myError(response) {
                console.log(response);
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error!')
                    .textContent('There was an error when trying to save this Quote!')
                    .ok('OK')
                );
            });
            $scope.getQuotes();
            $mdDialog.hide();
        }
        $scope.showEditDialog = function(id, ev) {
            $scope.editQuote = $scope.quotes[id];
            $mdDialog.show({
                contentElement: '#editDialog',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }
        $scope.deleteQuote = function(id, ev) {
            var inputUrl = "../quote?id=" + $scope.quotes[id]._id;

            $http({
                method: "DELETE",
                url: inputUrl,
                data: $scope.quotes[id]
            }).then(function mySuccess(response) {
                console.log(response);

            }, function myError(response) {
                console.log(response);

            });
            $scope.getQuotes();
        }
    }]);