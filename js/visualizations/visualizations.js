(function(){

	/*-----------------------------------------------------*\
		In this module all the visualization directives
		are declared and they are added to the list
		with names and icons. The directive property is
		the way to call it in html. Next to this the 
		dimension possibilities are specified.
	\*-----------------------------------------------------*/

	var app = angular.module( 'visualizations', [ ] );

		app.factory( 'visualizationList', function(){
			var visualizations = [
				{
					name: 			'Scatter Chart',
					iconUrl: 		'img/scatterchart.svg',
					dimensions: 	{x:{numeric:true, string:false},y:{numeric:true, string:false}},
					directive: 		'<scatter-chart ng-if="sheetCtrl.visualization.name == \'Scatter Chart\'" data="sheetCtrl.getData()" dimensions="dimensions"></scatter-chart>'
				},
				{
					name: 			'Line Chart',
					iconUrl: 		'img/linechart.svg',
					dimensions: 	{x:{numeric:true, string:false},y:{numeric:true, string:false}},
					directive: 		'<line-chart ng-if="sheetCtrl.visualization.name == \'Line Chart\'" data="sheetCtrl.getData()" dimensions="dimensions"></line-chart>'
				},
				{
					name: 			'Stacked Area Chart',
					iconUrl: 		'img/areachart.svg',
					dimensions: 	{x:{numeric:true, string:false},y:{numeric:true, string:false}},
					directive: 		'<stacked-area-chart ng-if="sheetCtrl.visualization.name == \'Stacked Area Chart\'" data="sheetCtrl.getData()" dimensions="dimensions"></stacked-area-chart>'
				},
				{
					name: 			'Bar Chart',
					iconUrl: 		'img/barchart.svg',
					dimensions: 	{x:{numeric:true, string:true},y:{numeric:true, string:false}},
					directive: 		'<multi-bar-chart ng-if="sheetCtrl.visualization.name == \'Bar Chart\'" data="sheetCtrl.getData()" dimensions="dimensions"></multi-bar-chart>'
				},
				{
					name: 			'Pie Chart',
					iconUrl: 		'img/piechart.svg',
					dimensions: 	{x:{numeric:true, string:false}},
					directive: 		'<pie-chart ng-if="sheetCtrl.visualization.name == \'Pie Chart\'" data="sheetCtrl.getData()" dimensions="dimensions"></pie-chart>'
				},
				{
					name: 			'Data Table',
					iconUrl: 		'img/table.svg',
					dimensions: 	{},
					directive: 		'<div ng-if="sheetCtrl.visualization.name == \'Data Table\'" id="tablesContainer"><datatable ng-repeat="table in sheetCtrl.getData()"></datatable></div>'
				}
			]
			return visualizations;
		});

		app.directive( "scatterChart" ,function(){
			return{
				restrict: 'E',
				scope:{
					data:"=",
					dimensions:"=",
				},
				link: function(scope, element, attrs){

					$(element).css('display','block').css('height','100%');
					nv.addGraph(function() {
						var data = [];
						var svg = null;	
					  	var chart = nv.models.scatterChart()
					                .showDistX(true)
					                .showDistY(true)
					                .tooltipContent(function( key, x, y, e ) { return '<h3>' +  key + '</h3>';});
					                //.tooltipContent(function( key, x, y, e ) { return '<h3>' +  e.point.name + '</h3>';});				    
					    // CHROME FIX
					    d3.rebind('clipVoronoi');
						chart.clipVoronoi(false);

						/*-----------------------------------*\
						
								Functions for updating
								and setting dimensions

						\*-----------------------------------*/

						var updateGraphic = function (){
	                        if( scope.$parent.dimensionsSet && $(element[0]).is(":visible") ) {
	                        	if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

                    	var setDimensions = function(){
                    		angular.forEach( scope.dimensions, function(dimension,key){
                    			if( key != "filter" ) // Else the local filter for sheets will trigger, bit dirty
								chart[key](function(d){return d[dimension.name]});
							});
                    	}

                    	/*-----------------------------------*\
						
								Watches for changes in
								the data / sheet /
								window size

						\*-----------------------------------*/

						scope.$watch('data', function(newData, oldData){
							angular.copy(newData, data); 
                			updateGraphic();
                   		});

						$(window).resize(function(){
							if( $(element[0]).is(":visible") && scope.$parent.dimensionsSet ){
								chart.update();
							}
						});

						scope.$on( 'updateVis', function(){
							setTimeout(function(){
								updateGraphic();
							},1);
						});

						scope.$on( 'dimensionsSet', function(){
							setDimensions();
							updateGraphic();
						});

						scope.$on( 'dimensionsUnset', function(){
							if(svg) svg.selectAll("*").remove();
							chart.noData();
						});

						/*-----------------------------------*\

							To be called on initialization

						\*-----------------------------------*/

						angular.copy(scope.data, data); 
						if( scope.$parent.dimensionsSet ){
                    		setDimensions();
                    	}
                    	updateGraphic();
					});
				}
			}
		});
		
		app.directive( "lineChart", function(){
			return{
				restrict: 'E',
				scope:{
					data:"=",
					dimensions:"="
				},
				link: function(scope, element, attrs){

					$(element).css('display','block').css('height','100%');
					nv.addGraph(function() {
						var data = [];
						var svg = null; 
					  	var chart = nv.models.lineChart()
					                .useInteractiveGuideline(true);
						
						/*-----------------------------------*\
						
								Functions for updating
								and setting dimensions

						\*-----------------------------------*/

						var updateGraphic = function (){
	                        if( scope.$parent.dimensionsSet && $(element[0]).is(":visible") ) {
	                        	if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

                    	var setDimensions = function(){
                    		angular.forEach( scope.dimensions, function(dimension,key){
                    			if( key != "filter" ) // Else the local filter for sheets will trigger, bit dirty
								chart[key](function(d){return d[dimension.name]});
							});
                    	}

                    	/*-----------------------------------*\
						
								Watches for changes in
								the data / sheet /
								window size

						\*-----------------------------------*/

						scope.$watch('data', function(newData, oldData){
							angular.copy(newData, data); 
                			updateGraphic();
                   		});

						$(window).resize(function(){
							if( $(element[0]).is(":visible") && scope.$parent.dimensionsSet ){
								chart.update();
							}
						});

						scope.$on( 'updateVis', function(){
							setTimeout(function(){
								updateGraphic();
							},1);
						});

						scope.$on( 'dimensionsSet', function(){
							setDimensions();
							updateGraphic();
						});

						scope.$on( 'dimensionsUnset', function(){
							if(svg) svg.selectAll("*").remove();
							chart.noData();
						});

						/*-----------------------------------*\

							To be called on initialization

						\*-----------------------------------*/

						angular.copy(scope.data, data); 
						if( scope.$parent.dimensionsSet ){
                    		setDimensions();
                    	}
                    	updateGraphic();
					});
				}
			}
		});
		
		app.directive( "lineWithFocusChart", function(){
			return{
				restrict: 'E',
				scope:{
					data:"=",
					dimensions:"="
				},
				link: function(scope, element, attrs){

					$(element).css('display','block').css('height','100%');
					
					nv.addGraph(function() {
						var data = [];
						var svg = null; 
					  	var chart = nv.models.lineWithFocusChart()
					  				  .tooltips(true);

						/*-----------------------------------*\
						
								Functions for updating
								and setting dimensions

						\*-----------------------------------*/

						var updateGraphic = function (){
	                        if( scope.$parent.dimensionsSet && $(element[0]).is(":visible") ) {
	                        	if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

                    	var setDimensions = function(){
                    		angular.forEach( scope.dimensions, function(dimension,key){
                    			if( key != "filter" ) // Else the local filter for sheets will trigger, bit dirty
								chart[key](function(d){return d[dimension.name]});
							});
                    	}

                    	/*-----------------------------------*\
						
								Watches for changes in
								the data / sheet /
								window size

						\*-----------------------------------*/

						scope.$watch('data', function(newData, oldData){
							angular.copy(newData, data); 
                			updateGraphic();
                   		});

						$(window).resize(function(){
							if( $(element[0]).is(":visible") && scope.$parent.dimensionsSet ){
								chart.update();
							}
						});

						scope.$on( 'updateVis', function(){
							setTimeout(function(){
								updateGraphic();
							},1);
						});

						scope.$on( 'dimensionsSet', function(){
							setDimensions();
							updateGraphic();
						});

						scope.$on( 'dimensionsUnset', function(){
							if(svg) svg.selectAll("*").remove();
							chart.noData();
						});

						/*-----------------------------------*\

							To be called on initialization

						\*-----------------------------------*/

						angular.copy(scope.data, data); 
						if( scope.$parent.dimensionsSet ){
                    		setDimensions();
                    	}
                    	updateGraphic();
					});
				}
			}
		});

		app.directive( "stackedAreaChart", function(){
			return{
				restrict: 'E',
				scope:{
					data:"=",
					dimensions:"="
				},
				link: function(scope, element, attrs){

					$(element).css('display','block').css('height','100%');
					
					nv.addGraph(function() {
						var data = [];
						var svg = null; 
					  	var chart = nv.models.stackedAreaChart()
					  	              .clipEdge(true)
					  	              .useInteractiveGuideline(true);

						/*-----------------------------------*\
						
								Functions for updating
								and setting dimensions

						\*-----------------------------------*/

						var updateGraphic = function (){
	                        if( scope.$parent.dimensionsSet && $(element[0]).is(":visible") ) {
	                        	if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

                    	var setDimensions = function(){
                    		angular.forEach( scope.dimensions, function(dimension,key){
                    			if( key != "filter" ) // Else the local filter for sheets will trigger, bit dirty
								chart[key](function(d){return d[dimension.name]});
							});
                    	}

                    	/*-----------------------------------*\
						
								Watches for changes in
								the data / sheet /
								window size

						\*-----------------------------------*/

						scope.$watch( 'data', function(newData, oldData){
							angular.copy(newData, data); 
                			updateGraphic();
                   		});

						$(window).resize(function(){
							if( $(element[0]).is(":visible") && scope.$parent.dimensionsSet ){
								chart.update();
							}
						});

						scope.$on( 'updateVis', function(){
							setTimeout(function(){
								updateGraphic();
							},1);
						});

						scope.$on( 'dimensionsSet', function(){
							setDimensions();
							updateGraphic();
						});

						scope.$on( 'dimensionsUnset', function(){
							if(svg) svg.selectAll("*").remove();
							chart.noData();
						});

						/*-----------------------------------*\

							To be called on initialization

						\*-----------------------------------*/

						angular.copy(scope.data, data); 
						if( scope.$parent.dimensionsSet ){
                    		setDimensions();
                    	}
                    	updateGraphic();
					});
				}
			}
		});

		app.directive( "multiBarChart", function(){
			return{
				restrict: 'E',
				scope:{
					data:"=",
					dimensions:"="
				},
				link: function(scope, element, attrs){

					$(element).css('display','block').css('height','100%');
					
					nv.addGraph(function() {
						var data = [];
						var svg = null; 
					  	var chart = nv.models.multiBarChart(); 

						/*-----------------------------------*\
						
								Functions for updating
								and setting dimensions

						\*-----------------------------------*/

						var updateGraphic = function (){
	                        if( scope.$parent.dimensionsSet && $(element[0]).is(":visible") ) {
	                        	if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

                    	var setDimensions = function(){
                    		angular.forEach( scope.dimensions, function(dimension,key){
                    			if( key != "filter" ) // Else the local filter for sheets will trigger, bit dirty
								chart[key](function(d){return d[dimension.name]});
							});
                    	}

                    	/*-----------------------------------*\
						
								Watches for changes in
								the data / sheet /
								window size

						\*-----------------------------------*/

						scope.$watch('data', function(newData, oldData){
							angular.copy(newData, data); 
                			updateGraphic();
                   		});

						$(window).resize(function(){
							if( $(element[0]).is(":visible") && scope.$parent.dimensionsSet ){
								chart.update();
							}
						});

						scope.$on( 'updateVis', function(){
							setTimeout(function(){
								updateGraphic();
							},1);
						});

						scope.$on( 'dimensionsSet', function(){
							setDimensions();
							updateGraphic();
						});

						scope.$on( 'dimensionsUnset', function(){
							if(svg) svg.selectAll("*").remove();
							chart.noData();
						});

						/*-----------------------------------*\

							To be called on initialization

						\*-----------------------------------*/

						angular.copy(scope.data, data); 
						if( scope.$parent.dimensionsSet ){
                    		setDimensions();
                    	}
                    	updateGraphic();
					});
				}
			}
		});

		app.directive( "pieChart", function(){
			return{
				restrict: 'E',
				scope:{
					data:"=",
					dimensions:"="
				},
				link: function(scope, element, attrs){

					$(element).css('display','block').css('height','100%');
					
					nv.addGraph(function() {
						var data = [];
						var svg = null; 
					  	var chart = nv.models.pieChart()
					  						 .showLabels(true)
					  						 .y(function(d){return d3.sum(d.values, function(g){ return g[scope.dimensions.x.name]; });});
											 // This one has a somewhat different x and y setting.

                   		/*-----------------------------------*\
						
								Functions for updating
								and setting dimensions

						\*-----------------------------------*/

						var updateGraphic = function (){
	                        if( scope.$parent.dimensionsSet && $(element[0]).is(":visible") ) {
	                        	if(!svg) svg = d3.select(element[0]).append('svg');
	                            svg.datum(data)
                                   .transition().duration(500)
                                   .call(chart);
	                        }
                    	}

                    	var setDimensions = function(){
                    		angular.forEach( scope.dimensions, function(dimension,key){
								if(key == "x"){
									if( key != "filter" ) // Else the local filter for sheets will trigger, bit dirty
                   					chart[key](function(d){return d.key}); // this one is different from the other nvd3 ones: .key not [dimension]
                   				}
							});
                    	}

                    	/*-----------------------------------*\
						
								Watches for changes in
								the data / sheet /
								window size

						\*-----------------------------------*/

						scope.$watch('data', function(newData, oldData){
							angular.copy(newData, data); 
                			updateGraphic();
                   		});

						$(window).resize(function(){
							if( $(element[0]).is(":visible") && scope.$parent.dimensionsSet ){
								chart.update();
							}
						});

						scope.$on( 'updateVis', function(){
							setTimeout(function(){
								updateGraphic();
							},1);
						});

						scope.$on( 'dimensionsSet', function(){
							setDimensions();
							updateGraphic();
						});

						scope.$on( 'dimensionsUnset', function(){
							if(svg) svg.selectAll("*").remove();
							chart.noData();
						});

						/*-----------------------------------*\

							To be called on initialization

						\*-----------------------------------*/

						angular.copy(scope.data, data); 
						if( scope.$parent.dimensionsSet ){
                    		setDimensions();
                    	}
                    	updateGraphic();
					});
				}
			}
		});

		app.directive( "datatable", function(){
			return{
				restrict: 'E',
				templateUrl: "js/visualizations/data-table.html",
			};
		});

		// The directive can be called in the HTML, in this case it would be <example-directive></example-directive>
		app.directive( "exampleDirective", function(){
			return{
				restrict: 'E',
				scope:{
					data:"=",
					dimensions:"="
					// The data and dimensions element that is bound in the HTML: <example-directive data="dataCtrl.filteredData">
				},
				link: function(scope, element, attrs){

					$(element).css('display','block').css('height','100%');
					
					$(function(){
						var data = [];
						// You probably want to append some type of visualization to this svg
						var svg = null; 
						// Function that should fire to re-render the visualization
						
						/*-----------------------------------*\
						
								Functions for updating
								and setting dimensions

						\*-----------------------------------*/

						var updateGraphic = function (){
	                        if( dimensionsSet && $(element[0]).is(":visible") ) {
	                        	if(!svg) svg = d3.select(element[0]).append('svg');
	                        }
                    	}

                    	var setDimensions = function(){
                    		angular.forEach( scope.dimensions, function(dimension,key){
								if( key != "filter" ){ // Else the local filter for sheets will trigger, bit dirty
									
								}
							});
                    	}

                    	/*-----------------------------------*\
						
								Watches for changes in
								the data / sheet /
								window size

						\*-----------------------------------*/

						// This function watches the data for changes (for example when someone uses filters)
						scope.$watch('data', function(newData, oldData){
							angular.copy(newData, data); 
                			updateGraphic();
                   		});

						// It might be a good idea to update the visualization when the window size changes
						$(window).resize(function(){
							if( $(element[0]).is(":visible") && scope.$parent.dimensionsSet ){
								
							}
						});

						scope.$on( 'updateVis', function(){
							setTimeout(function(){
								updateGraphic();
							},1);
						});

						// This function watches for changes in the dimensions and
                    	// applies this to the visualization
						scope.$on( 'dimensionsSet', function(){
							setDimensions();
							updateGraphic();
						});

						// Reset the chart when new data is loaded
						scope.$on( 'dimensionsUnset', function(){
							if(svg) svg.selectAll("*").remove();
							chart.noData();
						});

						/*-----------------------------------*\

							To be called on initialization

						\*-----------------------------------*/

						angular.copy(scope.data, data); 
						if( scope.$parent.dimensionsSet ){
                    		setDimensions();
                    	}
                    	updateGraphic();

					});
				}
			}
		});
})();