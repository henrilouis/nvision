(function(){

	var app = angular.module( 'sidebar', [ ] );

	app.controller( "sidebarController", [ '$scope','$timeout','dataService', function( $scope, $timeout, dataService ){

		this.dataService = dataService;
		sbc = this;
		sbc.dimensions = [];
		sbc.filters = [];
		sbc.filterString = "";
		sbc.dataError = false;
		sbc.dataUrl = "data_cars.json";

		/*-----------------------------------------------------*\
			@desc
			Create the filter from the filters. This just
			passes the dimensions object which contains 
			the values
		\*-----------------------------------------------------*/

		this.createFilter = function(){
			delay = 1;
			$timeout(function(){
				dataService.setGlobalFilter( sbc.filters );
			}, delay);
		}

		this.removeFilter = function( position ){
			sbc.filters.splice( position,1 );
			dataService.setGlobalFilter( sbc.filters );
		}

		sbc.resetFilter = function(){
			for( i=0; i<sbc.dimensions.length; i++ ){
				sbc.dimensions[i].userMin = sbc.dimensions[i].min;
				sbc.dimensions[i].userMax = sbc.dimensions[i].max;
			}
		}

		// This function calculates how many items are left after the filter and the previous filters are applied.
		// It is useful for determining the 'model clarification' data flow.
		this.calculateFilterPercentage = function( number ){
			
			var count = 0;
			var tempFilter = [];
			var percentage;
			
			for( i=sbc.filters.length-1; i>=number; i-- ){
				tempFilter.push(sbc.filters[i]);
			}

			angular.forEach( dataService.filterData( dataService.getData(), tempFilter ),function( value,key ){
				count += value.values.length;
			});

			percentage = (count/dataService.getDataLength()) * 100; 

			return percentage;
		}

		$scope.$on('data-loaded',function(){
			sbc.dimensions = dataService.getDimensions();
			sbc.filters = [];
		});

		this.loadData = function(url){
			dataService.loadData(url);
		}

		this.loadData( sbc.dataUrl );
	}]);

	app.directive( "dimensionList", function(){
		return{
			restrict: 'E',
			templateUrl: "js/sidebar/dimension-list.html"
		}
	});

	app.directive( "globalFilters", function(){
		return{
			restrict: 'E',
			templateUrl: "js/sidebar/global-filters.html"
		}
	});

	app.directive( "jsonLoader", function(){
		return{
			restrict: 'E',
			templateUrl: "js/sidebar/json-loader.html"
		}
	});

})();