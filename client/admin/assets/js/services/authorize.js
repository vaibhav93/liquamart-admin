'use strict';
app.service('ngAuthorize',["$localStorage","$http",function($localStorage,$http){
	var string = 'hello jiii';
	this.printString = function(){
		console.log(string);
	}
	this.getRole = function(deferred){
		var access_token = $localStorage.accessToken;
		return $http.get('http://localhost:3000/api/getRole?access_token='+access_token).then(function(res){
			if(res.data==='admin'){
				console.log('Authorized');
				deferred.resolve();
			}
			else{
				console.log('Unauthorized');
				deferred.reject();
			}
		});
	}
}])