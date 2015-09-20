var app = require('../../server/server');
var moment = require('moment');
module.exports = function(Purchase) {
	Purchase.beforeRemote('create',function(ctx,unused,next){
		var now = moment(new Date());
		var date = now.format("D MMM YYYY");
		console.log(date);
		var UserModel = app.models.User;
		UserModel.relations.accessTokens.modelTo.findById(ctx.req.accessToken.id,function(err,accessToken){
			ctx.args.data.userId = accessToken.userId;
			ctx.args.data.date = date;
			next();
			// if(err || ctx.args.data.userId!=accessToken.userId){
			// 	next(new Error('userId and token mismatch.'));
			// }
			// else{
			// 	next();
			// }
		});
		
	})
};;
