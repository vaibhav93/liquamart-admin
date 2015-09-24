var app = require('../../server/server');
var moment = require('moment');
module.exports = function(Purchase) {
	Purchase.beforeRemote('create',function(ctx,unused,next){
		var now = moment(new Date());
		var date = now.format("D MMM YYYY");
		console.log(date);
		var UserModel = app.models.User;
		UserModel.relations.accessTokens.modelTo.findById(ctx.req.accessToken.id,function(err,accessToken){
			console.log(ctx.args.data);
			ctx.args.data.userId = accessToken.userId;
			var productModel = app.models.product;
			productModel.findById(ctx.args.data.productId,function(err,Product){
				if(Product.imgUrls){
					ctx.args.data.imgUrl = Product.imgUrls[0];
				}
				ctx.args.data.date = date;
				ctx.args.data.name = Product.name;
				next();
			})
			
			// if(err || ctx.args.data.userId!=accessToken.userId){
			// 	next(new Error('userId and token mismatch.'));
			// }
			// else{
			// 	next();
			// }
		});
		
	})
};
