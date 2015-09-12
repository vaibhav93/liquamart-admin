'use strict';
/** 
  * Controller for login
*/
app.controller('LoginCtrl', ["User","$scope","$state","$rootScope","$localStorage","toaster", 
	function (User,$scope,$state,$rootScope,$localStorage,toaster) {
	    $scope.toaster = {
        type: 'error',
        title: 'Invalid login',
        text: 'Unauthorized access'
    };

	$scope.credentials = {
    email: '',
    password: ''
  	};
  	$rootScope.$on('$stateChangePermissionDenied',function(){
  		console.log('i am fireed');
  		toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
  	});

	$scope.login = function (){
		$scope.loginResult = User.login($scope.credentials,
			function(res) {
			$localStorage.accessToken = res.id;
			$rootScope.user = res.user; 
			$localStorage.user = res.user;
        	$state.go('app.dashboard');
      }, function(res) {
        $state.go('login.signin');
      });		
	};

	
}]);