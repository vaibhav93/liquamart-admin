module.exports = function(app) {
   var Product = app.models.product;

  // define a custom scope
  

  app.dataSources.db.automigrate('product', function(err) {
    if (err) throw err;


      var products =[
      {name:'RO'},
      {name:'Calco'},
      {name:'Porcelain Asia'},
      {name:'Samsung s6'},
      {name:'Apple iphne 6'}
      ];


      products.forEach(function(product) {
      Product.create(product, function(err, instance) {
        if (err)
          return console.log(err);

        console.log('Product created:', instance);

      });
    });
  });
};