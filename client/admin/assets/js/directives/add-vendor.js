'use strict';
/** 
  * Add new vendor directive.  
*/

app.directive('features',['$timeout',function($timeout){
	
	var directive = {};

	directive.restrict = 'E';
	directive.template = '<span>{{test}}</span>'

	return directive;

}])