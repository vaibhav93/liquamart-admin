var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var multer = require('multer');
var os = require('os');
var fs = require('fs');
var app = module.exports = loopback();
var upload = multer({ dest: 'client/STANDARD/assets/images',
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

app.use(loopback.static(staticPath));

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
    console.log(arr);
    fs.rename(temp_path,new_path,function(err){
      if(err){
        console.log(err);
      }});
          res.setHeader('Content-Type', 'application/json');
    res.json({img:arr});
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
