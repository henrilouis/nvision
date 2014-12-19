(function(){

	var app = angular.module( 'sheets', [ ] );

	app.controller( "sheetController", ['$scope','$element','$compile','$timeout','visualizationList','dataService', function( $scope,$element,$compile,$timeout,visualizationList,dataService ){

		/*-------------------------------------------*\

			The Sheetcontroller controls the 
			dimensions, data and filters for each 
			sheet. It also appends all the visual.
			from visualizations.js to the sheet.

			Right now the dimensions are set to two,
			this should actually be dynamically
			changed based on the dimensions the 
			visualization can take. The vis
			dimensions can be obtained throuhg
			visualization.dimensions

		\*-------------------------------------------*/
		var data;
		this.visualizations = visualizationList;
		this.visualization = false;
		$scope.filters = []; //// the this call is causing the error in the refreshData function
		var vis = false;

		$scope.dimensions = {};

		var refreshData = function(){
			if( $scope.dimensionsSet ){
				data = dataService.filterData( dataService.filterData( dataService.getData(), dataService.getGlobalFilter() ), $scope.filters );
			}
			else{
				data = dataService.filterData( dataService.getData(), dataService.getGlobalFilter() );
			}
		}

		// Shows how the global filter effects the local one
		var adjustLocalLimit = function(){
			angular.forEach( dataService.getGlobalFilter(), function( dimension, key ){
				angular.forEach ( $scope.filters, function( d,k ){
					if( dimension.name == d.name ){
						d.limitMin = dimension.userMin;
						d.limitMax = dimension.userMax;
					}
				});
			});
		}

		var checkDimensions = function( dim ){
			var count = 0;
			var secondCount = 0;
			angular.forEach( vis.dimensions, function( dimension,key ){
				count++;
			});

   			angular.forEach(dim, function( dimension,key ){
   				if( key != "filter" ) // excluding the extra local filter in the dimension list
   					secondCount++;
   			});

   			if( secondCount >= count && count != 0 ){
   				$scope.dimensionsSet = true;
   				$scope.$broadcast('dimensionsSet');
   			}
   			else if( count == 0 && vis.dimensions.lenght == null ){
   				$scope.dimensionsSet = true;
   			}
   			else{
   				$scope.dimensionsSet = false;
   				$scope.$broadcast('dimensionsUnset');
   			}
		}

		this.getData = function(){
			return data;
		}
		
		this.selectVis = function( visualization ){
			this.visualization = visualization;
			vis = visualization;
			checkDimensions( $scope.dimensions );
		}

		this.removeDim = function( key ){
			delete $scope.dimensions[key];
			refreshData();
		}

		this.removeFilter = function( position ){
			$scope.filters.splice( position, 1 );
			refreshData();
		}

		this.filterChange = function(){
			var delay = 1;
			$timeout(function(){
				refreshData();
			}, delay);
		}

		/*---------------------------------*\
				
					Listeners

		\*---------------------------------*/

		$scope.$on( 'data-loaded', function(){
			refreshData();
			$scope.dimensions = {};
		});

		$scope.$on( 'filter-change', function(){
			refreshData();
			adjustLocalLimit();
		});

		$scope.$watchCollection('dimensions', function(newData,oldData){
   			if(newData != oldData){
   				checkDimensions( newData );
   				adjustLocalLimit();
   			}
		});

		/*---------------------------------*\
				
				 On Initialization:

		\*---------------------------------*/

		refreshData();
		// Here we dynamically append each visualization type to the sheet
		angular.forEach( visualizationList, function( visualization,key ){
			var el = $compile( visualization.directive )( $scope );
			$element.find('#visualization').append( el );
		});

	}]);

	app.directive( "sheet",function(){
		return{
			restruct: "E",
			templateUrl: "js/sheets/sheet.html"
		}
	});

	app.directive( "dimensionDrop", function(){
		return{
			restrict: 'E',
			templateUrl: "js/sheets/dimension-drop.html",
		}
	} );

	app.directive( "localFilters", function(){
		return{
			restrict: 'E',
			templateUrl: "js/sheets/local-filters.html",
		}
	} );

})();