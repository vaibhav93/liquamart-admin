module.exports = function(app) {
  var cats = app.models.cat;

  // define a custom scope
  
  var cat = {name:'meooow'};
  app.dataSources.mongoDs.autoupdate('cat', function(err) {
    if (err) throw err;

      cats.create(cat,function(err,createdCat){
        if(err) throw err;
        console.log(createdCat);
      })
  });
};