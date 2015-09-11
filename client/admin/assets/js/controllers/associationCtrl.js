'use strict';
/** 
  * controllers used for the dashboard
*/
app.controller('ItemController',["$scope",function($scope){

}]);
app.controller('associationCtrl', ["$scope", "$filter","$http","$localStorage", "Upload", "Category","Subcategory", "Product", "SweetAlert", 
    function ($scope,$filter,$http,$localStorage, $upload, Category,Subcategory, Product, SweetAlert) {
	//flags
    $scope.hideAll=false;
    $scope.catSelected= false;
    $scope.subcatSelected = false;
    Category.find(function(categories){$scope.categories=categories;console.log(categories)},function(err){console.log('Error: '+err)});
    

    $scope.selectedSubcategory={};
    $scope.selectedProducts=[];
    $scope.catClick = function(data){
        if(data.ticked){
            $scope.hideAll=false;
            $scope.catSelected = data;
            console.log($scope.catSelected)
            Category.subcategories({id:data.id},function(subcategories){$scope.subcategories=subcategories},function(err){console.log(err)});
        }
    }
    $scope.subcatClick = function(data){
        $scope.subcatSelected = data;
        Product.find(function(products){

            Subcategory.products({id:data.id},
                function(productsfound){
                    //console.log(products);

                    angular.forEach(productsfound,function(productfound){
                        //find this product found in products and insert ticked:true
                        for(var i=0;i<products.length;i++){
                            if(productfound.id === products[i].id){
                                products[i].ticked=true;
                            }
                        }
                    });
                },
                function(err){console.log(err)});

            $scope.products=products;
            },
            function(err){console.log(err)}
            )

    }

    $scope.prodClick = function(data){
        if(data.ticked){
            //add relation
                $http.put("http://localhost:3000/api/subcategories/" + 
                $scope.subcatSelected.id + "/products/rel/" + data.id+"?access_token="+$localStorage.accessToken)
                .success(function(response){console.log(response)});
            } 
        else {
                $http.delete("http://localhost:3000/api/subcategories/" + 
                $scope.subcatSelected.id + "/products/rel/" + data.id +"?access_token="+$localStorage.accessToken)
                .success(function(response){console.log(response)});
            }
        console.log(data);
    }

    $scope.prodReset = function(){
        Subcategory.products.destroyAll({id:$scope.subcatSelected.id},function(response){console.log(response)},function(err){console.log(err)})
    }

    $scope.prodAll = function(){
        $scope.prodReset();
        angular.forEach($scope.products,function(product){
            $http.put("http://localhost:3000/api/subcategories/" + 
                $scope.subcatSelected.id + "/products/rel/" + product.id)
                .success(function(response){console.log(response)});
        })
    }

    $scope.catReset = function(){$scope.hideAll= true}
}]);