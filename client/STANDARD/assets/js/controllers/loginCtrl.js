'use strict';
/** 
  * Controller for login
*/
app.controller('LoginCtrl', ["User","$scope","$state","$rootScope","$localStorage", function (User,$scope,$state,$rootScope,$localStorage) {
	
	$scope.credentials = {
    email: '',
    password: ''
  	};

	$scope.login = function (){
		$scope.loginResult = User.login($scope.credentials,
			function(res) {
			$rootScope.user = res.user; 
			$localStorage.user = res.user;
        	$state.go('app.dashboard');
      }, function(res) {
        $state.go('login.signin');
      });		
	};

	
}]);