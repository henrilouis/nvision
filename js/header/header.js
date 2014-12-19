(function(){

	var app = angular.module( 'header', [ ] );

	app.controller( "navController",['$rootScope', function( $rootScope ){
		
		this.sheets = [
			{
				active:true
			}
		]

		this.addSheet = function(){
			var objArray = {
				active:true
			}
			angular.forEach( this.sheets, function(value,key){
				value.active = false;
			});
			this.sheets.push( objArray );
		}

		this.removeSheet = function(sheet){
			var index = this.sheets.indexOf(sheet);
			this.sheets.splice( index,1 );
			
			if(sheet.active == true){
				if(this.sheets[index-1] != null){
					this.sheets[index-1].active = true;
				}
				else if(this.sheets[index] != null){
					this.sheets[index].active = true;
				}
			}
		}

		this.selectSheet = function(sheet){
			angular.forEach( this.sheets, function(value,key){
				value.active = false;
			});
			sheet.active = true;
			$rootScope.$broadcast( 'updateVis' );
		}
	}]);

	app.directive( "stringFilter", function(){
		return{
			restrict: 'E',
			templateUrl: "js/header/stringfilter.html",
			controller: function(){
				
			},
			controllerAs: "filterCtrl"
		};
	});

	app.directive( "tabs",function(){
		return{
			restrict: 'AE',
			templateUrl: "js/header/tabs.html"
		}
	});

})();