(function(){

		var app = angular.module('nVision', ['framework','visualizations','ngDragDrop','filters']);

			/*-----------------------------------------------------*\
				This type of ubercontroller should be converted
				into ( perhaps multiple ) service factories. A 
				lot of the business logic is done in the
				controller which should only manipulate view
				logic.
			\*-----------------------------------------------------*/
			
		app.controller( 'dataController', [ '$http','$scope','$timeout', function( $http, $scope, $timeout ){ 

			self = this;
			self.data = [];
			self.dimensions = [];
			self.filterString = "";
			self.filteredData = [];
			self.dataUrl = "data_overheid.json";
			self.dataError = false;

			$scope.filteredData = self.filteredData;

			/*-----------------------------------------------------*\
				@desc
				This function filters the data based on the current
				filterString. Will use self.filterString and
				self.data. The output will go to
				$scope.filteredData because this one is watchable
				for Angular.
			\*-----------------------------------------------------*/
			var interval;

			self.filterData = function(delay){
				$timeout.cancel(interval);
				interval = $timeout(function(){
					if( self.filterString != '' ){
						var filtered = [];

						for( i=0; i<self.data.length; i++ ){
							var table = {};
								table.key = self.data[i].key;
							var values = [];

							for( j=0; j<self.data[i].values.length; j++ ){

								var found 			= false;
								var split 			= false;
								var countSplits 	= 0;
								var countFound 		= 0;

								angular.forEach(self.data[i].values[j], function( value,key ){

									if( self.filterString.indexOf("&") > -1 ){
										split = true;
										var splitstr = self.filterString.split("&");
										countSplits = splitstr.length;
										
										for( k=0; k<splitstr.length; k++ ){
											splitstr[k] = splitstr[k].trim();
										}
										for( l=0; l<splitstr.length; l++ ){
											if( findInData( value, key, splitstr[l] ) ){
												countFound++;
											}
										}

									}
									else if( findInData( value, key, self.filterString ) ){
										found = true;
									}
								});

								if( split && ( countSplits == countFound ) ){
									found = true;
								}

								if( found ){
									values.push( self.data[i].values[j] );
								}
							}
							table.values = values;
							filtered.push( table );
						}
						$scope.filteredData = filtered;
					}
					else{
						$scope.filteredData = self.data;
					}
				}, delay);
			}

			/*-----------------------------------------------------*\
				@desc
				This ugly if else loop is for looking if a given 
				string comparison exists in the data, for example: 
				year > 2012, or value = 20. Will return either true 
				or false.
				@param 
				value - the value that needs to be searched
				key - the key that needs to be searched aswell
				string - the search command
				@return 
				bool - succes or failure
			\*-----------------------------------------------------*/

			var findInData = function( value, key, string ){
				var found = false;
				
				if( string.indexOf("<=") > -1 ){
					var splitstr = string.split("<=");
					splitstr[0] = splitstr[0].trim();
					splitstr[1] = splitstr[1].trim();
					if( splitstr[0] == key && value <= parseInt( splitstr[1] ) ){
						found = true;
					}
				}
				else if( string.indexOf("<") > 0 ){
					var splitstr = string.split("<");
					splitstr[0] = splitstr[0].trim();
					splitstr[1] = splitstr[1].trim();
					if( splitstr[0] == key && value < parseInt( splitstr[1] ) ){
						found = true;
					}
				}
				else if( string.charAt(0) == '<'){
					if( value < parseInt( string.slice(1) ) ){
						found = true;
					}
				}
				if( string.indexOf(">=") > -1 ){
					var splitstr = string.split(">=");
					splitstr[0] = splitstr[0].trim();
					splitstr[1] = splitstr[1].trim();
					if( splitstr[0] == key && value >= parseInt( splitstr[1] ) ){
						found = true;
					}
				}
				else if( string.indexOf(">") > 0 ){
					var splitstr = string.split(">");
					splitstr[0] = splitstr[0].trim();
					splitstr[1] = splitstr[1].trim();

					if( splitstr[0] == key && value > parseInt( splitstr[1] ) ){
						found = true;
					}
				}
				else if( string.charAt(0) == '>'){
					if( value > parseInt( string.slice(1) ) ){
						found = true;
					}
				}
				if( string.indexOf("!=") > -1){
					var splitstr = string.split("!=");
					splitstr[0] = splitstr[0].trim();
					splitstr[1] = splitstr[1].trim();
					if( splitstr[0] == key && value != parseInt( splitstr[1] ) ){
						found = true;
					}
				}
				else if( string.indexOf("=") > -1 ){
					var splitstr = string.split("=");
					splitstr[0] = splitstr[0].trim();
					splitstr[1] = splitstr[1].trim();
					if( splitstr[0] == key && value == parseInt( splitstr[1] ) ){
						found = true;
					}
				}
				// Filter on exact found
				if( key == string ){
					found = true;
				}
				if( value == parseInt( string ) ){
					found = true;
				}
				return found;
			}

			/*-----------------------------------------------------*\
				@desc
				This function creates the filterstring from the
				sliders.
			\*-----------------------------------------------------*/
			var filterInterval;
			self.createFilterString = function(){
				var delay = 1;
				$timeout.cancel(filterInterval);
				filterInterval = $timeout(function(){
					var string = "";

					for( i=0; i<self.dimensions.length; i++ ){
						if( self.dimensions[i].min != self.dimensions[i].userMin ){
							
							if( string != "" ) string += " & ";
							string += self.dimensions[i].name;
							self.dimensions[i].userMin == self.dimensions[i].userMax? string+=" = ":string+=" >= ";
							string +=self.dimensions[i].userMin;
						}
						if( self.dimensions[i].max != self.dimensions[i].userMax && self.dimensions[i].userMin != self.dimensions[i].userMax ){
							
							if( string != "" ) string += " & ";
							string += self.dimensions[i].name;
							self.dimensions[i].userMin == self.dimensions[i].userMax? string+=" = ":string+=" <= ";
							string += self.dimensions[i].userMax;
						}
					}
					self.filterString = string;
					self.filterData(0);
				},delay);
				
			};

			self.resetFilters = function(){
				for( i=0; i<self.dimensions.length; i++ ){
					self.dimensions[i].userMin = self.dimensions[i].min;
					self.dimensions[i].userMax = self.dimensions[i].max;
				}
			}

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

			self.getMin = function(dimension){
				var min;
				var first = true;
				angular.forEach( self.data, function( table, key ){
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

			self.getMax = function(dimension){
				var max;
				var first = true;
				angular.forEach( self.data, function( table,key ){
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

			/*-----------------------------------------------------*\
				@desc
				The scope will watch the collection, when two-way
				binding a filter variable and then ng-repeating it
				it caused an infinite loop, so this is the current
				solution.
			\*-----------------------------------------------------*/

			$scope.$watchCollection( "filteredData", function( newValue, oldValue ){
				if( oldValue != newValue ){
					self.filteredData = $scope.filteredData;
				}
			});

			self.loadData = function(url){
				$http.get( url ).success( function( data ) {
					self.data = data;
					self.filteredData = data;
					self.dimensions = [];
					$.each( self.data[0]['values'][0], function( key, value ){
						var dimension = [];
							dimension.name 		= key;
							dimension.min 		= self.getMin( dimension.name );
							dimension.max 		= self.getMax( dimension.name );
							dimension.userMin 	= self.getMin( dimension.name );
							dimension.userMax 	= self.getMax( dimension.name );
						self.dimensions.push(dimension);
					});
					$scope.dimensions = self.dimensions;
					$scope.$broadcast('data-loaded');
					self.dataError = false;
				}).error(function(data){
					self.dataError = true;
				});
			}
			self.loadData( self.dataUrl );
		}]);
})();