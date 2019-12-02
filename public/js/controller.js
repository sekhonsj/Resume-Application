var app = angular.module('mainApp', ['ngRoute', 'ui.grid']);

app.controller('applicant', function ($scope, $http) {
    $scope.user = {};

    $http.get('/position').then(function (response) {
        console.log(`response success`, response.data);
        $scope.positions = response.data;
    })

    $scope.submit1 = function () {

        let data = {
            fname: $scope.user.fName,
            lname: $scope.user.lName,
            email: $scope.user.email,
            position: $scope.user.position.available_positions,
            resume: $scope.user.file
        }
        console.log(data);

        $http.post('/submit', data).then(function (response) {
            console.log(`response success`, response);
        })
    };

}
);

app.controller('signup', function ($scope, $http) {
    $scope.user = {};

    $scope.submit1 = function () {

        let data = {
            username: $scope.user.username,
            password: $scope.user.password
        };

        $http.post('/signup', data);
    };

}
);

app.controller('manager', function ($scope, $http) {
    $scope.user = {};

    $scope.submit1 = function () {

        let data = {
            username: $scope.user.username,
            password: $scope.user.password
        };
        console.log(data);

        $http.post('/login', data).then(function (response) {
            console.log('response success', response);
        })
    };

}
);

app.controller('dashboard', function ($scope, $http) {
    $scope.user = {};

    $scope.deleteRow = function(row) {
        var index = $scope.managerGrid.data.indexOf(row.entity);
        $scope.managerGrid.data.splice(index, 1);
      };

    $scope.managerGrid = {
        enableFiltering: true,
        data: [],
        columnDefs: [
            { field: 'first_name', displayName: 'First Name' },
            { displayName: 'Last Name', field: 'last_name' },
            { displayName: 'Email', field: 'email' },
            { displayName: 'Position', field: 'work_position' },
            { displayName: 'Delete', field: 'is_deleted', cellTemplate: '<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>', enableFiltering: false }
        ],
        onRegisterApi: function (gridApi) {
            $scope.managerGridApi = gridApi;
        }
    }

    $http.get('/access').then(function (response) {
        console.log(`response success`, response.data);
        $scope.managerGrid.data = response.data;
    })
}
);
