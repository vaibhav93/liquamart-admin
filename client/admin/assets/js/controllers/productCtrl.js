'use strict';
/** 
  * controllers used for the dashboard
*/
app.controller('ItemController',["$scope",function($scope){
//$scope.product.links={ebay:'',amazon:'',liqua:'',pdf:'',YT:''};
}]);

app.controller('productCtrl', ["$scope", "$filter","$timeout","$http", "Upload", "ngTableParams","$localStorage", "Product","Subcategory", "SweetAlert", function ($scope,$filter,$timeout, $http, $upload, ngTableParams,$localStorage, Product, Subcategory, SweetAlert) {
	
    //multiple parent subcategories
    $scope.subcategories=[];
    $scope.selectedSubategories=[];
    angular.element(document).ready(function(){Subcategory.find(function(subcategories){$scope.subcategories=subcategories},function(err){
        console.log(err)
    })});
    $scope.subcatClick= function(){console.log($scope.selectedSubategories)};
    //Show add subcat form

	$scope.addProductflag=-1;
    $scope.showForm = function(){
    	//console.log('hi');
        $scope.addProductflag=1;
    };

    //to get categories for select dropdown
    $scope.disabled = false;

    $scope.enable = function() {
    	$scope.disabled = false;
    };

    $scope.disable = function() {
    	$scope.disabled = true;
    };
    $scope.subcategoryparent={};
    $scope.category = {};
    $scope.parentCatId=-1;
    $scope.refreshCategories = function(category) {
    	var params = {category: category, sensor: false};
    	Category.find(function(categories){
    		$scope.categories = categories;
    	},function(err){
    		console.log(err);
    	})
    	};
    $scope.selected=function(parentCategory){$scope.parentCatId=parentCategory.id;console.log(parentCategory.name)};

    //file upload
    $scope.upload = function(files) {
    	$scope.files = files; 
    	$scope.progress = 0;
        $scope.imageurls = [];
        angular.forEach(files, function(file) {
        	if(file && !file.error){
        		$upload.upload({
        			url: '/img',
        			fields: {
        				'username': 'vaibhav'
        			},
        			file: file
        		}).progress(function(evt) {
        			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        			$scope.progress = progressPercentage;
        		}).success(function(data, status, headers, config) {
                    $scope.imageurls.push(data.img)
        		});
        	}
        });
        console.log($scope.imageurls)
    };

    //submit new category form function
    $scope.showQR = -1;
    $scope.encode='';
    $scope.prodQR='';
    $scope.url_links={};

    $scope.submitProduct = function(){
        if($scope.prodQR.length){
             $scope.encode =$scope.prodQR;
             $scope.qrname = $scope.prodName;
             $scope.showQR = 1;
             console.log($scope.canvasImage)
        }else{
            $scope.showQR=-1;
        }
        var url_links = {ebay:$scope.prodEbay,amazon:$scope.prodAmazon,liqua:$scope.prodLiqua,pdf:$scope.prodPdf,YT:$scope.prodYoutube};
    	
        Product.create({name:$scope.prodName,description:$scope.prodDesc,imgUrls:$scope.imageurls,qrcode:$scope.prodQR,
                        links:url_links,featured:$scope.prodFeatured,latest:$scope.prodLatest},
    		function(success){
                angular.forEach($scope.selectedSubategories,function(selectedSubcategory){
                    $http.put("http://app.liquamart.com/api/subcategories/" + 
                selectedSubcategory.id + "/products/rel/" + success.id+"?access_token="+$localStorage.accessToken)
                .success(function(response){
                    angular.forEach($scope.subcategories,function(subcategory){subcategory.ticked=false})});
                });
    			$scope.alertSuccess.val=1;
    			$scope.alertDanger.val=-1;
    			$scope.tableParams.reload();
    			$timeout(function(){
    				$scope.alertSuccess.val=-1,
    				$scope.prodName='';
    				$scope.prodDesc='';
                    $scope.prodQR='';
                    $scope.prodLatest=false;
                    $scope.prodFeatured=false;
    			},2000);
    			$timeout(function(){$scope.files=undefined;},3000);
    		},function(error){ console.log(error);
    			$scope.alertSuccess.val=-1;
    			$scope.alertDanger.val=1;})
    	}

    //update subcategory
    
    $scope.selected2 = function (model,newmodel){newmodel.catname=model.name}
    $scope.updateProduct = function(product){
    	console.log(product);
    	Product.prototype$updateAttributes({id:product.id},{name:product.name,description:product.description,links:{ebay:product.links.ebay,
            amazon:product.links.amazon,liqua:product.links.liqua,pdf:product.links.pdf,YT:product.links.YT},featured:product.featured,
            latest:product.latest},function(newProduct){
    		$scope.alertUpdate.val=1;
    		//$scope.tableParams.reload();
            //console.log($scope.alert.val);
            $timeout(function(){$scope.alertUpdate.val=-1},2000);
            $timeout(function(){$scope.editId=-1},3000);
        },function(err){
        	console.log(err);
        });
    }

    //alerts
    $scope.alertSuccess = {
    	val:-1,
    	type:'success',
    	msg:'Data saved successfully'
    };
    $scope.alertUpdate = {
    	val:-1,
    	type:'success',
    	msg:'Data updated successfully'
    };
    $scope.alertDanger = {
    	val:-1,
    	type:'danger',
    	msg:'Error! Check if this product name already exists'
    };

    //edit form
    $scope.editId=-1;
    $scope.setEditId = function (prodid) {
        $scope.editId = prodid;
        };
    //table

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: 30, // count per page
        filter: {

        },
    }, {
        total: 0, // length of data
        getData: function ($defer, params) {
            // use build-in angular filter
            
            Product.find(function(data){
                //success
                // angular.forEach(data,function(subcategory){
                // 	Subcategory.category({id:subcategory.id},function(response){
                //         subcategory.parent = response;
                //         subcategory.catname = response.name;
                //     });

                // });

                params.total(data.length);
                var orderedData = params.filter() ? $filter('filter')(data, params.filter()) : data;
                orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                $scope.categories = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                params.total(orderedData.length);
                // set total for recalc pagination
                $defer.resolve($scope.categories);
            },function(res){
                console.log(res);
            });

	}
	});

	        //Code for deleting subcategory
        $scope.deletePopUp = function (productId,productName) {
        SweetAlert.swal({
            title: "Are you sure?",
            text: "Your will not be able to "+productName +" product",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function (isConfirm) {
            if (isConfirm) {
                $http.get("http://app.liquamart.com:80/api/products/"+productId+"/subcategories").success(function(response){
                    angular.forEach(response,function(subcat){
                        $http.delete("http://app.liquamart.com/api/subcategories/" + 
                            subcat.id + "/products/rel/" + productId +"?access_token="+$localStorage.accessToken)
                        .success(function(response){console.log(response)});
                    });
                    Product.deleteById({id:productId},
                    function(success){console.log(productId);console.log('delete success' +productId)},
                    function(error){console.log('delete error :'+error)});
                    }
                });

                SweetAlert.swal({
                    title: "Deleted!", 
                    text: productName+" product has been deleted.", 
                    type: "success",
                    confirmButtonColor: "#007AFF"
                });
                $scope.tableParams.reload();

            } else {
                SweetAlert.swal({
                    title: "Cancelled", 
                    text: "Delete cancelled", 
                    type: "error",
                    confirmButtonColor: "#007AFF"
                });
            }
        });
    };


}]);