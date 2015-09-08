var https = require('https');
var FB = require('fb');
var response={};
module.exports = function(User) {
	var dummy_pass ='@39?C5(nfMyRv2zW';
User.loginWithAccessTokenGoogle = function(uid,email,name,cb){
console.log('here');
	response.email = email;
	response.id = uid;
	response.first_name = name;
	var query = { email : response.email };
User.findOne({ where:query }, function(err,user){
	var defaultError = new Error('Login Failed');
	defaultError.statusCode = 401;

	if(err){
		cb(defaultError);
	}
	else if(!user){
		//create user here
		User.create({fname:response.first_name,email:query.email,username:response.id,password:dummy_pass},function(err,user){
			if(err){
				cb(defaultError);
			} else{
				console.log('User created: ' + query.email);
				User.login({email:query.email,password:dummy_pass},function(err,new_accessToken){
				cb(null,new_accessToken.id);	
			});	
			}
		});
	}
	//User found .. log him in
	else{
		console.log('User found: '+ query.email);
		User.login({email:query.email,password:dummy_pass},function(err,new_accessToken){
			if(err){
				cb(defaultError);
			}
			else{
				cb(null,new_accessToken.id);
			}
		});
	}

});
}
User.loginWithAccessTokenfb = function(accessToken, cb) {
	console.log('Token received: ' + accessToken);
	//response = 'hi ! i am responding';
	//cb(null,response);
		var ret ={};
		FB.setAccessToken(accessToken);

		FB.api('/me', { fields: ['id', 'first_name', 'last_name','email'] }, function (res) {
		  if(!res || res.error) {
		  	var err = new Error('Invalid Access Token');
		  	err.statusCode = 401;
		    console.log(!res ? 'error occurred' : res.error);
		    cb(err);
		    return;
		  }
		  response.id = res.id;
		  response.email = res.email;
		  response.first_name = res.first_name +' ' + res.last_name;
		  console.log(response.id);
		  console.log(response.first_name);
		  console.log(response.email);
		 

//Check if user with this email already exists. If yes, then login. If No, then create and login
var query = { email : response.email };
User.findOne({ where:query }, function(err,user){
	var defaultError = new Error('Login Failed');
	defaultError.statusCode = 401;

	if(err){
		cb(defaultError);
	}
	else if(!user){
		//create user here
		User.create({fname:response.first_name,email:query.email,username:response.id,password:dummy_pass},function(err,user){
			if(err){
				cb(defaultError);
			} else{
				console.log('User created: ' + query.email);
				User.login({email:query.email,password:dummy_pass},function(err,new_accessToken){
					ret.accessToken = new_accessToken.id;
					ret.email = query.email
				cb(null,ret.accessToken,query.email);	
			});	
			}
		});
	}
	//User found .. log him in
	else{
		console.log('User found: '+ query.email);
		User.login({email:query.email,password:dummy_pass},function(err,new_accessToken){
			if(err){
				cb(defaultError);
			}
			else{
				ret.accessToken = new_accessToken.id;
					ret.email = query.email
				cb(null,ret.accessToken,query.email);
				//cb(null,new_accessToken.id,query.email);
			}
		});
	}

});
});
};

User.remoteMethod(
    'loginWithAccessTokenfb', 
    {
       accepts: {arg: 'accessToken', type: 'string'},
       returns: [{arg: 'accessToken', type: 'string'},{arg: 'email', type: 'string'}],
       http: {path: '/loginWithFb', verb: 'POST'}
     }
);

User.remoteMethod(
	'loginWithAccessTokenGoogle',
	{
		accepts: [{arg: 'uid', type: 'string'},{arg: 'email',type:'string'},{arg:'name', type:'string'}],
		returns: {arg: 'accessToken', type: 'string'},
       	http: {path: '/loginWithGoogle', verb: 'POST'}
	}
);

};
