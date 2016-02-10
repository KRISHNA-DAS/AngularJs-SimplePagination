var myApp = angular.module('myApp', []);
myApp.controller('myController', ['$scope', '$http', function ($scope, $http) {
    var vm = this;

    $scope.slicedData = []; //this array we will get from slicing whole data & to be used in ng-repeat for showing
    $scope.itemsPerPage = 5; //number of items per page
    $scope.paginationList = []; //dynamic list of page numbers, will change by clicking page number, next or last button
    $scope.currentPage = 1; //currently selected page
    $scope.itemsPerPageList = [5, 20, 50, 100]; //number of items per page options list 
    $scope.pageListLength = 20; //this is the maximum length of page number selection list

    $scope.pageListLengthChange = function () {
            getPaginationList();
        } //change the length of page list and get new paging list array

    $scope.itemsPerPageChange = function () {
        totalPages = Math.ceil(totalItems / $scope.itemsPerPage);
        if ($scope.currentPage > totalPages) {
            $scope.currentPage = totalPages;
        }
        getPaginationList();
        sliceData();
    };

/*Page controlling functions-------------------------------*/
    
    $scope.lastPage = function () {
        $scope.currentPage = totalPages;
        getPaginationList();
        sliceData();
    }
    $scope.nextPage = function () {
        if ($scope.currentPage < totalPages) {
            $scope.currentPage += 1;
            getPaginationList();
            sliceData();
        }
        /*else {
                   $scope.currentPage = totalPages;
               }*/
    }
    $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage -= 1;
            getPaginationList();
            sliceData();
        }
        /*else {
                   $scope.currentPage = 1;
               }*/
    }
    $scope.toPage = function (selected) {
        $scope.currentPage = parseInt(selected);
        sliceData();
    }
    $scope.firstPage = function (selected) {
        $scope.currentPage = 1;
        getPaginationList();
        sliceData();
    }
/*---------------------------------------------------------------------*/
    
    var empData = []; //the whole json will come here
    var totalItems = 0; //total objects or items present in the json data
    var totalPages = 0; //total pages= total items / no. of items per page

    vm.init = function () {
            vm.getEmpData();
        } //get whole json on controller loading

    vm.getEmpData = function () {
            $http.get("Employee_data.json").then(function (response) {
                empData = response.data;
                totalItems = empData.length;
                totalPages = Math.ceil(totalItems / $scope.itemsPerPage);
                getPaginationList();
                sliceData();
            });
        } //For loading the whole data & inside of it, that gets sliced & page list created also

    var sliceData = function () {
            var sliceStart = (parseInt($scope.currentPage - 1) * parseInt($scope.itemsPerPage));
            var sliceEnd = sliceStart + parseInt($scope.itemsPerPage);
            $scope.slicedData = empData.slice(sliceStart, sliceEnd);
        } //This function will slice out the large data into small sets according to the selected page number and number of items per page value

    var getPaginationList = function () {
        $scope.paginationList = [];
        if ($scope.currentPage <= $scope.pageListLength) {

            var startVal = 1;
            generatePaginationList(startVal);
        } else {
            if (($scope.currentPage % $scope.pageListLength) == 0) {

                var startVal = ($scope.currentPage - ($scope.pageListLength - 1));
                generatePaginationList(startVal);
            } else {

                var startVal = (Math.floor($scope.currentPage / $scope.pageListLength) * $scope.pageListLength) + 1;
                generatePaginationList(startVal);
            }

        }
    }

    var generatePaginationList = function (startVal) {
            var k = startVal;
            for (i = 0; i < $scope.pageListLength; i++) {
                $scope.paginationList.push(k);
                k++;
                if (k > totalPages) {
                    break;
                }
            }
        }
        /*
        getPaginationList() & generatePaginationList() both are for generating the pagination list dynamically. generatePaginationList() is nested into the former one.
        generatePaginationList(startVal) will take the starting value of the array to be generated and, until conditions- that is not exceeds the paging list length value or total pages value, it will get incremented & pushed into array
    
        the starting value of the array is is found out by the  getPaginationList() function according to some logic
        */
    vm.init(); //initialises the controller
}]);