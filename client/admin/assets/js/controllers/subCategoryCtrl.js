'use strict';
/** 
  * controllers used for the dashboard
*/
app.controller('subCategoryCtrl', ["$scope", "$filter","$timeout", "Upload", "ngTableParams", "Category", "Subcategory", "SweetAlert", function ($scope,$filter,$timeout, $upload, ngTableParams, Category, Subcategory, SweetAlert) {
	//Show add subcat form

	$scope.addSubcategoryflag=-1;
    $scope.showForm = function(){
    	console.log('hi');
        $scope.addSubcategoryflag=1;
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
    $scope.upload = function(file) {
    	$scope.f = file; 
    	$scope.progress = 0;
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
    			console.log(data.img);
    			$scope.imageurl = data.img;
    		});
    	}
    };

    //submit new category form function
    $scope.submitSubcategory = function(){
    	Category.subcategories.create({id:$scope.parentCatId},{name:$scope.subcatName,description:$scope.subcatDesc,orderId:$scope.subcatorderId,imgUrl:$scope.imageurl},
    		function(success){
    			console.log('success');
    			$scope.alertSuccess.val=1;
    			$scope.alertDanger.val=-1;
    			$scope.tableParams.reload();
    			$timeout(function(){
    				$scope.alertSuccess.val=-1,
    				$scope.subcatName='';
    				$scope.subcatDesc='';
    				$scope.subcatorderId='';
    				$scope.category.selected=undefined;
    			},2000);
    			$timeout(function(){$scope.f=undefined;},3000);
    		},function(error){ console.log(error);
    			$scope.alertSuccess.val=-1;
    			$scope.alertDanger.val=1;})
    	}

    //update subcategory
    
    $scope.selected2 = function (model,newmodel){newmodel.catname=model.name}
    $scope.updatesubCategory = function(subcategory){
    	console.log(subcategory);
    	Subcategory.prototype$updateAttributes({id:subcategory.id},{name:subcategory.name,description:subcategory.description,orderId:subcategory.orderdId,categoryId:subcategory.parent.id},function(newCategory){
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
    	msg:'Error! Check if this subcategory name or orderId already exists'
    };

    //edit form
    $scope.editId=-1;
    $scope.setEditId = function (subcatid) {
        $scope.editId = subcatid;
        };
    //table

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: 20, // count per page
        filter: {

        },
    }, {
        total: 0, // length of data
        getData: function ($defer, params) {
            // use build-in angular filter
            
            Subcategory.find(function(data){
                //success
                angular.forEach(data,function(subcategory){
                	Subcategory.category({id:subcategory.id},function(response){
                        subcategory.parent = response;
                        subcategory.catname = response.name;
                    });

                });

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
        $scope.deletePopUp = function (subcatId,subcatName) {
        SweetAlert.swal({
            title: "Are you sure?",
            text: "Your will not be able to "+subcatName +" subcategory",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function (isConfirm) {
            if (isConfirm) {
                Subcategory.deleteById({id:subcatId},
                    function(success){console.log('delete success')},
                    function(error){console.log('delete error :'+error)});
                SweetAlert.swal({
                    title: "Deleted!", 
                    text: subcatName+" subcategory has been deleted.", 
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