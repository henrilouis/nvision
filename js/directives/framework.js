(function(){

	var app = angular.module( 'framework', ['ui-rangeSlider'] );

		app.controller('rangeSliderCtrl', ['$scope', function( $scope ){
			
		}]);
		
		app.directive( "dimensionList", function(){
			return{
				restrict: 'E',
				templateUrl: "templates/dimension-list.html",
			}
		} );

		app.directive( "dimensionDrop", function(){
			return{
				restrict: 'E',
				templateUrl: "templates/dimension-drop.html",
			}
		} );

})();