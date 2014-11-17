(function(){

	var app = angular.module( 'visualizations', [ ] );

		app.controller('visualizations', function(){

			visu = this;
			/*-----------------------------------------------------*\
				@desc
				This function will select the current visualization
				and create it in the view. Only one can be selected
				simultaneously and if more visualizations are added
				these should be added here as well. The individual
				directives should watch for the variable to become
				true in the index.html. Also each visualization
				should watch it to refresh; this is only necessary
				if they are hidden using ng-show or ng-hide.
				@param 
				visname - the name of the visualization as put in
				the array.
			\*-----------------------------------------------------*/
			this.visualizations = [
				{ 
					name: 			'Scatter Chart',
					enabled: 		true,
					iconUrl: 		'img/scatterchart.svg',
				},
				{
					name: 			'Line Chart',
					enabled:		false,
					iconUrl: 		'img/linechart.svg',
				},
				{
					name: 			'Stacked Area Chart',
					enabled:		false,
					iconUrl: 		'img/areachart.svg',
				},
				{
					name: 			'Bar Chart',
					enabled:		false,
					iconUrl: 		'img/barchart.svg',
				},
				{
					name: 			'Pie Chart',
					enabled: 		false,
					iconUrl: 		'img/piechart.svg',
				},
				{
					name: 			'Data Table',
					enabled:		false,
					iconUrl: 		'img/table.svg',
				}
			];

			this.setVis = function(vis){
				angular.forEach(visu.visualizations,function(value,key){
					if( vis == value ){
						visu.visualizations[key].enabled = true;
					}else{
						visu.visualizations[key].enabled = false;
					}
				});
				setTimeout(function(){
					$(window).trigger('resize');
				},1)
			};
		});

		app.directive( "scatterChart", function(){
			return{
				restrict: 'E',
				scope:{
					data:"="
				},
				link: function(scope, element, attrs){

					$(element).css('padding-bottom','45px').css('display','block').css('height','100%');
					
					scope.dimensions = {
						x:"",
						y:""
					};
					scope.dimensionsSet = false;

					nv.addGraph(function() {
						var data = [];
						var svg = null;	
					  	var chart = nv.models.scatterChart()
					                .showDistX(true)
					                .showDistY(true)
					                .tooltipContent(function(key) { return '<h3>' + key + '</h3>';});
					    
					    // CHROME FIX
					    d3.rebind('clipVoronoi');
						chart.clipVoronoi(false);            

						var updateGraphic = function (){
	                        if( scope.dimensionsSet && $(element[0]).is(":visible") ) {
	                        	if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

						scope.$watch('data', function(newData, oldData){
							angular.copy(newData, data);
                    		updateGraphic();
                   		});

                   		scope.$watchCollection('dimensions', function(newData,oldData){
                   			if(newData != oldData){
                   				var bool = true;
	                   			angular.forEach(newData, function(dimension,key){
	                   				chart[key](function(d){return d[dimension]});
	                   				if(dimension == ''){
	                   					bool = false;
	                   					scope.dimensionsSet = false;
	                   					if(svg) svg.selectAll("*").remove();
	                   					chart.noData();
	                   				}
	                   			});
	                   			if(bool){
	                   				scope.dimensionsSet = true;
				                	updateGraphic();
	                   			}
                   			}
                   		});

                   		// Resize function by NV bugged so I bound it by using jquery
						$(window).resize(function(){
							if( scope.dimensionsSet && $(element[0]).is(":visible") ){
								chart.update();
							}
						});

						// Reset the chart when new data is loaded
						scope.$on( 'data-loaded', function(){
							scope.dimensionsSet = false;
							angular.forEach(scope.dimensions, function(value,index){
									scope.dimensions[index] = "";
								});
							if(svg) svg.selectAll("*").remove();
						});

					  	return chart;
					});
				},
				template:"<dimension-drop></dimension-drop>"
			}
		});
		
		app.directive( "lineChart", function(){
			return{
				restrict: 'E',
				scope:{
					data:"="
				},
				link: function(scope, element, attrs){

					$(element).css('padding-bottom','45px').css('display','block').css('height','100%');

					scope.dimensions = {
						x:"",
						y:""
					};

					scope.dimensionsSet = false;

					nv.addGraph(function() {
						var data = [];
						var svg = null; 
					  	var chart = nv.models.lineChart()
					                .useInteractiveGuideline(true);

						var updateGraphic = function (){
	                        if( scope.dimensionsSet  && $(element[0]).is(":visible") ) {
	                            if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

						scope.$watch('data', function(newData, oldData){
							angular.copy(newData, data);
                        	updateGraphic();	                        
                   		});

                   		scope.$watchCollection('dimensions', function(newData,oldData){
                   			if(newData != oldData){
                   				var bool = true;
	                   			angular.forEach(newData, function(dimension,key){
	                   				chart[key](function(d){return d[dimension]});
	                   				if(dimension == ''){
	                   					bool = false;
	                   					scope.dimensionsSet = false;
	                   					if(svg) svg.selectAll("*").remove();
	                   				}
	                   			});
	                   			if(bool){
	                   				scope.dimensionsSet = true;
				                	updateGraphic();
	                   			}
                   			}
                   		});

                   		// Resize function by NV bugged so I bound it by using jquery
						$(window).resize(function(){
							if ( scope.dimensionsSet  && $(element[0]).is(":visible") ) {
								chart.update();
							}
						});

						// Reset the chart when new data is loaded
						scope.$on( 'data-loaded', function(){
							scope.dimensionsSet = false;
							angular.forEach(scope.dimensions, function(value,index){
									scope.dimensions[index] = "";
								});
							if(svg) svg.selectAll("*").remove();
						});

					  	return chart;
					});
				},
				template:"<dimension-drop></dimension-drop>"
			}
		});
		
		app.directive( "lineWithFocusChart", function(){
			return{
				restrict: 'E',
				scope:{
					data:"="
				},
				link: function(scope, element, attrs){

					$(element).css('padding-bottom','60px').css('display','block').css('height','100%');

					scope.dimensions = {
						x:"",
						y:""
					};
					scope.dimensionsSet = false;

					nv.addGraph(function() {
						var data = [];
						var svg = null; 
					  	var chart = nv.models.lineWithFocusChart()
					  				  .tooltips(true);

						var updateGraphic = function (){
	                        if( scope.dimensionsSet  && $(element[0]).is(":visible") ) {
	                            if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

						scope.$watch('data', function(newData, oldData){
	                        angular.copy(newData, data);
	                        updateGraphic();
                   		});

                   		scope.$watchCollection('dimensions', function(newData,oldData){
                   			if(newData != oldData){
                   				var bool = true;
	                   			angular.forEach(newData, function(dimension,key){
	                   				chart[key](function(d){return d[dimension]});
	                   				if(dimension == ''){
	                   					bool = false;
	                   					scope.dimensionsSet = false;
	                   					if(svg) svg.selectAll("*").remove();
	                   				}
	                   			});
	                   			if(bool){
	                   				scope.dimensionsSet = true;
				                	updateGraphic();
	                   			}
                   			}
                   		});

                   		// Resize function by NV bugged so I bound it by using jquery
						$(window).resize(function(){
							if ( scope.dimensionsSet  && $(element[0]).is(":visible") ) {
								chart.update();
							}
						});

						// Reset the chart when new data is loaded
						scope.$on( 'data-loaded', function(){
							scope.dimensionsSet = false;
							angular.forEach(scope.dimensions, function(value,index){
									scope.dimensions[index] = "";
								});
							if(svg) svg.selectAll("*").remove();
						});

					  	return chart;
					});
				},
				template:"<dimension-drop></dimension-drop>"
			}
		});

		app.directive( "stackedAreaChart", function(){
			return{
				restrict: 'E',
				scope:{
					data:"="
				},
				link: function(scope, element, attrs){

					$(element).css('padding-bottom','45px').css('display','block').css('height','100%');

					scope.dimensions = {
						x:"",
						y:""
					};

					scope.dimensionsSet = false;

					nv.addGraph(function() {
						var data = [];
						var svg = null; 
					  	var chart = nv.models.stackedAreaChart()
					  	              .clipEdge(true)
					  	              .useInteractiveGuideline(true);

						var updateGraphic = function (){
	                        if( scope.dimensionsSet && $(element[0]).is(":visible") ) {
	                            if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

						scope.$watch('data', function(newData, oldData){
	                        angular.copy(newData, data);
	                        updateGraphic();
                   		});

                   		scope.$watchCollection('dimensions', function(newData,oldData){
                   			if(newData != oldData){
                   				var bool = true;
	                   			angular.forEach(newData, function(dimension,key){
	                   				chart[key](function(d){return d[dimension]});
	                   				if(dimension == ''){
	                   					bool = false;
	                   					scope.dimensionsSet = false;
	                   					if(svg) svg.selectAll("*").remove();
	                   				}
	                   			});
	                   			if(bool){
	                   				scope.dimensionsSet = true;
				                	updateGraphic();
	                   			}
                   			}
                   		});

                   		// Resize function by NV bugged so I bound it by using jquery
						$(window).resize(function(){
							if ( scope.dimensionsSet && $(element[0]).is(":visible") ) {
								chart.update();
							}
						});

						// Reset the chart when new data is loaded
						scope.$on( 'data-loaded', function(){
							scope.dimensionsSet = false;
							angular.forEach(scope.dimensions, function(value,index){
									scope.dimensions[index] = "";
								});
							if(svg) svg.selectAll("*").remove();
						});

					  	return chart;
					});
				},
				template:"<dimension-drop></dimension-drop>"
			}
		});

		app.directive( "multiBarChart", function(){
			return{
				restrict: 'E',
				scope:{
					data:"="
				},
				link: function(scope, element, attrs){

					$(element).css('padding-bottom','45px').css('display','block').css('height','100%');

					scope.dimensions = {
						x:"",
						y:""
					};
					scope.dimensionsSet = false;

					nv.addGraph(function() {
						var data = [];
						var svg = null; 
					  	var chart = nv.models.multiBarChart();

						var updateGraphic = function (){
	                        if( scope.dimensionsSet && $(element[0]).is(":visible") ) {
	                            if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

						scope.$watch('data', function(newData, oldData){
	                        angular.copy(newData, data);
	                        updateGraphic();
                   		});

                   		scope.$watchCollection('dimensions', function(newData,oldData){
                   			if(newData != oldData){
                   				var bool = true;
	                   			angular.forEach(newData, function(dimension,key){
	                   				chart[key](function(d){return d[dimension]});
	                   				if(dimension == ''){
	                   					bool = false;
	                   					scope.dimensionsSet = false;
	                   					if(svg) svg.selectAll("*").remove();
	                   				}
	                   			});
	                   			if(bool){
	                   				scope.dimensionsSet = true;
				                	updateGraphic();
	                   			}
                   			}
                   		});

                   		// Resize function by NV bugged so I bound it by using jquery
						$(window).resize(function(){
							if ( scope.dimensionsSet && $(element[0]).is(":visible") ) {
								chart.update();
							}
						});

						// Reset the chart when new data is loaded
						scope.$on( 'data-loaded', function(){
							scope.dimensionsSet = false;
							angular.forEach(scope.dimensions, function(value,index){
									scope.dimensions[index] = "";
								});
							if(svg) svg.selectAll("*").remove();
						});

					  	return chart;
					});
				},
				template:"<dimension-drop></dimension-drop>"
			}
		});

		app.directive( "pieChart", function(){
			return{
				restrict: 'E',
				scope:{
					data:"="
				},
				link: function(scope, element, attrs){

					$(element).css('padding-bottom','45px').css('display','block').css('height','100%');

					scope.dimensions = {
						x:"",
					};

					scope.dimensionsSet = false;

					nv.addGraph(function() {
						var data = [];
						var svg = null; 
					  	var chart = nv.models.pieChart()
					  						 .showLabels(true)
					  						 .y(function(d){return d3.sum(d.values, function(g){ return g[scope.dimensions.x]; });});
											 // This one has a somewhat different x and y setting.

						var updateGraphic = function (){
	                        if( scope.dimensionsSet && $(element[0]).is(":visible") ) {
	                            if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

						scope.$watch('data', function(newData, oldData){
	                        angular.copy(newData, data);
	                        updateGraphic();
                   		});

                   		scope.$watchCollection('dimensions', function(newData,oldData){
                   			if(newData != oldData){
                   				var bool = true;
	                   			angular.forEach(newData, function(dimension,key){
	                   				chart[key](function(d){return d.key}); // this one is different from the other nvd3 ones: .key not [dimension]
	                   				if(dimension == ''){
	                   					bool = false;
	                   					scope.dimensionsSet = false;
	                   					if(svg) svg.selectAll("*").remove();
	                   				}
	                   			});
	                   			if(bool){
	                   				scope.dimensionsSet = true;
				                	updateGraphic();
	                   			}
                   			}
                   		});

                   		// Resize function by NV bugged so I bound it by using jquery
						$(window).resize(function(){
							if ( scope.dimensionsSet && $(element[0]).is(":visible") ) {
								chart.update();
							}
						});

						// Reset the chart when new data is loaded
						scope.$on( 'data-loaded', function(){
							scope.dimensionsSet = false;
							angular.forEach(scope.dimensions, function(value,index){
									scope.dimensions[index] = "";
							});
							if(svg) svg.selectAll("*").remove();
						});

					  	return chart;
					});
				},
				template:"<dimension-drop></dimension-drop>"
			}
		});

		app.directive( "datatable", function(){
			return{
				restrict: 'E',
				templateUrl: "templates/datatable.html",
				controller: function(){

				},
				controllerAs: "tableCtrl"
			};
		});

		// The directive can be called in the HTML, in this case it would be <example-directive></example-directive>
		app.directive( "exampleDirective", function(){
			return{
				restrict: 'E',
				scope:{
					data:"=" // The data element that is bound in the HTML: <example-directive data="dataCtrl.filteredData">
				},
				link: function(scope, element, attrs){

					$(element).css('padding-bottom','45px').css('display','block').css('height','100%');

					// Declare as many dimensions as are needed for the visualization
					// These are automatically added as drop-downs
					scope.dimensions = {
						x:"",
						y:""
					};
					scope.dimensionsSet = false;

					$(function(){
						var data = [];
						// You probably want to append some type of visualization to this svg
						var svg = null; 

						// Function that should fire to re-render the visualization
						var updateGraphic = function (){
	                        if( scope.dimensionsSet && $(element[0]).is(":visible") ) {
	                            if(!svg) svg = d3.select(element[0]).append('svg');
	                        }
                    	}

                    	// This function watches the data for changes (for example when someone uses filters)
                    	scope.$watch('data', function(newData, oldData){
	                        angular.copy(newData, data);
	                        updateGraphic();
                   		});

                    	// This function watches for changes in the dimensions and
                    	// applies this to the visualization
                   		scope.$watchCollection('dimensions', function(newData,oldData){
                   			if(newData != oldData){
                   				var bool = true;
	                   			angular.forEach(newData, function(dimension,key){
	                   				// Set dimensions here
	                   				// chart[key](function(d){return d.key});
	                   				if(dimension == ''){
	                   					bool = false;
	                   					scope.dimensionsSet = true;
	                   					if(svg) svg.selectAll("*").remove();
	                   				}
	                   			});
	                   			if(bool){
	                   				scope.dimensionsSet = true;
				                	updateGraphic();
	                   			}
                   			}
                   		});

                   		// It might be a good idea to update the visualization when the window size changes
                   		$(window).resize(function(){
							updateGraphic();
						});

						// Reset the chart when new data is loaded
						scope.$on( 'data-loaded', function(){
							scope.dimensionsSet = false;
							angular.forEach(scope.dimensions, function(value,index){
									scope.dimensions[index] = "";
								});
							if(svg) svg.selectAll("*").remove();
						});

					});
				},
				// The template adds the dimension drop boxes at the top.
				template:"<dimension-drop></dimension-drop>"
			}
		});
})();