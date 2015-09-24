var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var multer = require('multer');
var os = require('os');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = module.exports = loopback();
global.Promise = require('bluebird');
var upload = multer({ dest: 'client/admin/assets/images',
                    rename: function (fieldname, filename) {
        return filename+"_"+Date.now();
    } });
var staticPath = null;

var env = 'dev';
if (env !== 'prod') {
  staticPath = path.resolve(__dirname, '../client/');
  console.log("Running app in development mode");
} else {
  staticPath = path.resolve(__dirname, '../dist/');
  console.log("Running app in prodction mode");
}
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(loopback.static(staticPath));

app.post('/api/qr',function(req,res){
    var Product = app.models.product;
    console.log(req.body.qr);
    Product.findOne({where:{qrcode:req.body.qr}},function(err,product){
      if(err || product==null){
        res.status(500).send({status:500, message: 'QR code not found in database', type:'internal'}); 
        res.end();
      }
      else{
        product.status=200;
        res.json(product);
      }
    })
});

app.post('/img', upload.single('file'), function(req, res,next) {
    //console.log(req.file);
    var fullUrl = req.protocol + '://' + req.get('host')+'/' ;
    var temp_path = req.file.path;
    var dest = req.file.destination;
    var new_path = dest+'/'+req.file.originalname;
    var arr = new_path.split("/");
    arr.splice(0,1);
    arr = arr.join("/");
    arr = fullUrl+arr;
    //console.log(arr);
    fs.rename(temp_path,new_path,function(err){
      if(err){
        //console.log(err);
      }});
          res.setHeader('Content-Type', 'application/json');
    res.json({img:arr});
});
// app.use('/api/users/purchases',function(req,res){
//     var tokenId;
//     if(req.query && req.query.access_token) {
//       tokenId = req.query.access_token;
//       console.log(tokenId);
//     }

    
// })
app.use('/api/getRole',function(req,res,next){

  var currentuser={};
  var tokenId = false;
  if (req.query && req.query.access_token) {
    tokenId = req.query.access_token;
    //res.send(tokenId);
  }
  if (tokenId){
    var UserModel = app.models.User;

    // Logic borrowed from user.js -> User.logout()
    UserModel.relations.accessTokens.modelTo.findById(tokenId, function(err, accessToken) {
      if (err) next(err);
      if (!accessToken) {
        res.status(500).send({status:500, message: 'Invalid Access token', type:'internal'}); 
        res.end();
      }
      else{
        // Look up the user associated with the accessToken
        UserModel.findById(accessToken.userId, function (err, user) {
          if (err) {
            return next(err);
          }
          if (!user)  {
            res.status(500).send({status:500, message: 'Cannot find user', type:'internal'}); 
            res.end();
          }
          var roleMappingModel = app.models.RoleMapping;
          roleMappingModel.findOne({where:{principalId:user.id}},function(err,mappings){
            if(err) {
              next(err);
            }
            else{
              var roleModel = app.models.Role;
              roleModel.findOne({where:{id:mappings.id}},function(err,Role){
                if(err) console.log(err);
                else{
                  res.json(Role.name);
                }
              });
            }
          })
        });
      }
    });
  }

});

app.start = function() {
  // start the web server
  console.log(os.hostname());
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
