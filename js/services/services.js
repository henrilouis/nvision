(function(){

	var app = angular.module( 'services', [ ] );

	app.factory( 'dataService', ['$http','$rootScope', function( $http,$rootScope ){

		var data = [];
		var dimensions = [];
		var arrowsEnabled = false;
		var globalFilter;
		var dataLength;

		/*-----------------------------------------------------*\
			@desc
			These functions help determine the min and max in 
			the dataset for use in the sliders.
			@param 
			dimension - The string name of the dimension.
			@return 
			The max or min value of the dimension. If it is not
			numeric it will return 0 for now. It might be better
			to also add a dimension type to the dimension array
			later.
		\*-----------------------------------------------------*/

		var getMin = function( data, dimension ){
			var min;
			var first = true;
			angular.forEach( data, function( table, key ){
				for( i=0; i<table.values.length; i++ ){
					if( first ) { min = table.values[i][dimension]; first = false; }
					if( table.values[i][dimension] < min) min = table.values[i][dimension];
				}
			});
			if( isNaN( min ) || min == null ){
				min = 0;
			}
			return min;
		}

		var getMax = function( data, dimension ){
			var max;
			var first = true;
			angular.forEach( data, function( table,key ){
				for( i=0; i<table.values.length; i++ ){
					if( first ) { max = table.values[i][dimension]; first = false; }
					if( table.values[i][dimension] > max ) max = table.values[i][dimension];
				}
			});
			if( isNaN( max ) || max == null ){
				max = 0;
			}
			return max;
		}

		var loadData = function(url){
			$http.get( url ).success( function( d ) {
				data = d;
				dataLength = 0;
				dimensions = [];
				$.each( data[0]['values'][0], function( key, value ){
					var dimension = {};
						dimension.name 		= key;
						dimension.min 		= getMin( data, dimension.name );
						dimension.max 		= getMax( data, dimension.name );
						dimension.userMin 	= getMin( data, dimension.name );
						dimension.userMax 	= getMax( data, dimension.name );
						dimension.assigned  = "";
					dimensions.push(dimension);
				});

				angular.forEach( data, function( value, key ){
					dataLength += value.values.length;
				});

				$rootScope.$broadcast('data-loaded');
				return true;
			}).error(function(data){
				return false;
			});
		}

		/*-----------------------------------------------------*\
			@desc
			This function filters the dataset for the given
			input.
			@param 
			data: the dataset that needs to be filtered
			filter: actually this is the dimensions opbject
			containing the userMin and userMax values per
			dimension
			@return 
			The filtered array will be returned
		\*-----------------------------------------------------*/

		var filterData = function( data, filter ){
			
			// Check if a filter is given
			var count = 0;
			angular.forEach( filter, function( value, key ){
				if( value.min != value.userMin || value.max != value.userMax )
					count++;
			});

			if( count > 0 ){
				var filtered = [];
				for( i=0; i<data.length; i++ ){
					var table = {};
						table.key = data[i].key;
						if(data[i].color != null){
							table.color = data[i].color;
						}
					var values = [];

					for( j=0; j<data[i].values.length; j++ ){
						var meetsCriteria = true;
						angular.forEach( data[i].values[j], function( value,key ){
							angular.forEach( filter, function( v,k ) {
								if( key == v.name ){
									if( value < v.userMin || value > v.userMax ){
										meetsCriteria = false;
									}
								}
							});
						});
						if( meetsCriteria ){
							values.push( data[i].values[j] );
						}
					}
					table.values = values;
					filtered.push( table );
				}
				return filtered;
			}
			else{
				return data;
			}
		}

		var setGlobalFilter = function( filter ){
			globalFilter = filter;
			$rootScope.$broadcast('filter-change');
		}

		var setArrowsEnabled = function( bool ){
			arrowsEnabled = bool;
		}

		return{

			loadData: loadData,
			getData: function(){ return data; },
			getDimensions: function(){ return angular.copy(dimensions); },
			filterData: function( data, filter ){ return filterData( data, filter );},
			getGlobalFilter: function(){ return globalFilter;},
			setGlobalFilter: setGlobalFilter,
			getArrowsEnabled: function(){ return arrowsEnabled; },
			setArrowsEnabled: setArrowsEnabled,
			getDataLength: function(){ return dataLength; }
			
		}

	}]);
})();