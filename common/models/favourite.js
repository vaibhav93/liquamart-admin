var app = require('../../server/server');
module.exports = function(Favourite) {
		Favourite.beforeRemote('create',function(ctx,unused,next){
		var UserModel = app.models.User;
		UserModel.relations.accessTokens.modelTo.findById(ctx.req.accessToken.id,function(err,accessToken){
			ctx.args.data.userId = accessToken.userId;
			next();
		});
		
	})

};
