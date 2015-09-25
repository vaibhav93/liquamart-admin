'use strict';
/** 
  * Add new vendor directive.  
*/

app.directive('features',['$timeout',function($timeout){
	
	var directive = {};

	directive.restrict = 'E';
	directive.template = '<div class="form-group">'+
						

	return directive;

}])