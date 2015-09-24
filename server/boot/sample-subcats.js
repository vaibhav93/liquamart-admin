module.exports = function(app) {
  var Subategory = app.models.subcategory;

  // define a custom scope
  

  app.dataSources.db.autoupdate('subcategory', function(err) {
    if (err) throw err;


    
      var subcategories = [
      {name:'Kent',categoryId:'1',orderId:'1'},
      {name:'Calcium',categoryId:'2',orderId:'2'},
      {name:'Porous',categoryId:'3',orderId:'3'}
      ];


      subcategories.forEach(function(subcategory) {
      Subategory.create(subcategory, function(err, instance) {
        if (err)
          return console.log(err);

        console.log('Sub category created:', instance);

      });
    });
  });
};