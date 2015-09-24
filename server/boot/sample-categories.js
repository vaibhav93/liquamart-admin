module.exports = function(app) {
  var Category = app.models.category;

  // define a custom scope
  

  app.dataSources.mongo.autoupdate('category', function(err) {
    if (err) throw err;


    var categories = [
      {name: 'Purifier',orderId:'1'},
      {name: 'Balls',orderId:'2'},
      {name: 'Filters',orderId:'3'}
    ];


    categories.forEach(function(category) {
      Category.create(category, function(err, instance) {
        if (err)
          return console.log(err);

        console.log('Category created:', instance);

      });
    });
  });
};
