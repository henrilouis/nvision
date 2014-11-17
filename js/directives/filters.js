(function(){

	var app = angular.module( 'filters', [] );
	
		app.directive( "stringFilter", function(){
			return{
				restrict: 'E',
				templateUrl: "templates/stringfilter.html",
				controller: function(){
					
				},
				controllerAs: "filterCtrl"
			};
		});


})();