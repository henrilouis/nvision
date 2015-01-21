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
		this.dataService = dataService;
		this.visualizations = visualizationList;
		this.visualization = false;
		$scope.filters = [];
		var vis = false;

		$scope.dimensions = {};

		var refreshData = function(){
			if( $scope.dimensionsSet ){
				data = dataService.filterData( dataService.filterData( dataService.getData(), dataService.getGlobalFilter() ), $scope.filters );
			}
			else{
				data = dataService.filterData( dataService.getData(), dataService.getGlobalFilter() );
			}
			adjustLocalLimit();
		}

		// Shows how the global filter effects the local one
		var adjustLocalLimit = function(){

			angular.forEach( $scope.filters, function(d,k){
				var bool = false;
				angular.forEach( dataService.getGlobalFilter(), function( dimension, key ){
					if( dimension.name == d.name ){
						bool = true;
						d.limitMin = dimension.userMin;
						d.limitMax = dimension.userMax;
					}
				});
				if(!bool){
					d.limitMin = d.min;
					d.limitMax = d.max;
				}
			});

		};

		var checkDimensions = function( dim ){
			var count = 0;
			var secondCount = 0;

			angular.forEach( vis.dimensions, function( dimension,key ){
				count++;
			});

   			angular.forEach(dim, function( dimension,key ){
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

			// for fixing the bug with drag and drop acceptance
			// it rerenders the dimension-drop directive
			// $scope.$broadcast('refresh');
			// console.log('yes');

			// Delay hack
			var delay = 1;
			$timeout(function(){
				$scope.$broadcast('refresh');
			}, delay);

			
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

		// This function calculates how many items are left after the filter and the previous filters are applied.
		// It is useful for determining the 'model clarification' data flow.
		this.calculateFilterPercentage = function( number ){

			var count = 0;
			var tempFilter = [];
			var percentage;
			
			for(i=0; i<=number; i++){
				tempFilter.push($scope.filters[i]);
			}

			angular.forEach( dataService.filterData( dataService.filterData( dataService.getData(), dataService.getGlobalFilter() ), tempFilter ),function( value,key ){
				count += value.values.length;
			});

			percentage = ( count/dataService.getDataLength() ) * 100; 
			
			return percentage;
			
		}

		/*---------------------------------*\
				
					Listeners

		\*---------------------------------*/

		$scope.$on( 'data-loaded', function(){
			refreshData();
			$scope.dimensions = {};
			$scope.filters = [];
		});

		$scope.$on( 'filter-change', function(){
			refreshData();
		});

		$scope.$watchCollection('dimensions', function(newData,oldData){
   			if(newData != oldData){
   				checkDimensions( newData );
   			}
		});

		$scope.$watchCollection('filters',function(newData,oldData){
			if(newData != oldData){
				adjustLocalLimit();
				refreshData();
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