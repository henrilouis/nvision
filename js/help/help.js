(function(){

	var app = angular.module( 'help', [ ] );

	app.controller('helpController', ['$scope', function($scope){
		this.enabled = false;
	}]);

	app.directive( "helpButton", function(){
		return{
			restrict: 'E',
			templateUrl: "js/help/help-button.html"
		}
	});

	app.directive( "helpOverlay", function(){
		return{
			restrict: 'E',
			templateUrl: "js/help/help-overlay.html"
		}
	});

})();