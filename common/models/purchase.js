var app = require('../../server/server');
module.exports = function(Purchase) {
	Purchase.beforeRemote('create',function(ctx,unused,next){
		//console.log(ctx.args);
		var UserModel = app.models.User;
		UserModel.relations.accessTokens.modelTo.findById(ctx.req.accessToken.id,function(err,accessToken){
			if(err || ctx.args.data.userId!=accessToken.userId){
				next(new Error('userId and token mismatch.'));
			}
			else{
				next();
			}
		});
		
	})
};;
