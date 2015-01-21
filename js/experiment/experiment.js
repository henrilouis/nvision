(function(){

	var app = angular.module( 'experiment', [ ] );

	app.controller('experimentController',[ 'dataService', "$http" ,function(dataService, $http){
		this.condition = Math.random() < .5;
		dataService.setArrowsEnabled(this.condition);
		this.overlay = true;
		this.phase = 0;

		var exp = this;

		// Should get and write id from database immediately from start
		var userinfo =
		{
			"id":'',
			"email":'',
			"timestamp":Date.now(),
			"age":'',
			"gender":'',
			"useragent":navigator.userAgent,
			"resolution":{width:$(window).width(),height:$(window).height(), swidth:screen.width, sheight:screen.height},
			"condition":this.condition ? 1 : 0
		}

		$.post('ajax/insertuser.php', userinfo).done(function(data){
			
		});

		this.userinfo = userinfo;

		this.expertiseQuest = [

			"Information visualization applications ( Tableau, Spotfire, Qlikview etc. ).",
			"Business intelligence applications.",
			"The field of statistics.",
			"The field of information visualization.",
			"Programming.",
			"Microsoft Excel.",
			"Microsoft Word.",
			"Using the internet.",
			"Using computers."

		]

		this.systemQuest = [
			
			"Using the system is frustrating.",
			"The system is flexible.",
			"I would recommend the system to others.",
			"The system is dull.",
			"The system is useless.",
			"I feel comfortable using the system.",
			"The system is wonderful.",
			"The system is difficult to use.",
			"The system showed useful visualizations.",
			"The system made me understand the information.",
			"Overall, I am satisfied with this system.",
			"Learning to operate the system is hard.",
			"Performing tasks is straightforward."
			
		]

		var log = [
			{
				"name": "assignment1",
				"attempts":[]
			},
			{
				"name": "assignment2",
				"attempts":[]
			},
			{
				"name": "assignment3",
				"attempts":[]
			},
			{
				"name": "assignment4",
				"attempts":[]
			},
			{
				"name": "assignment5",
				"attempts":[]
			}			
		];

		// The correct answers to the questions
		var correct = [
			"165",
			"datsun",
			"175",
			"audi",
			"buick"
		]

		// Variable to keep track of the hints
		var hint = [
			false,
			false,
			false,
			false,
			false
		]

		this.hint = hint;

		// Function to get al the information from the application
		function getSheets(){
			var sheets = [];
			angular.forEach( angular.element('sheet'), function(value,key){ 
				var sheet = {
					'sheetnumber':angular.copy(key),
					'visualization':angular.copy( angular.element(value).scope().sheetCtrl.visualization.name ),
					'dimensions':angular.copy( angular.element(value).scope().dimensions ),
					'filters':angular.copy( angular.element(value).scope().filters ),
				};
				sheets.push(sheet);
			});
			return sheets;
		}

		this.testAssignment = function(number){
			var success = false;
			if( angular.isDefined(exp.answer) ){
				if( angular.isDefined(exp.answer[number]) ){
					if( exp.answer[number].toLowerCase().indexOf( correct[number] ) > -1 ) {
						success = true;
					}
				}
			}
			return success;
		}

		this.verifyAssignment = function(number){

			var success = false;
			var globalfilters = angular.copy( angular.element('global-filters').scope().sidebarCtrl.filters );
			var sheets = getSheets();

			if(globalfilters.length < 1){
				// for the database
				globalfilters= '';
			}

			if( angular.isDefined(exp.answer) ){
				if( angular.isDefined(exp.answer[number]) ){
					if( exp.answer[number].toLowerCase().indexOf( correct[number] ) > -1 ) {
						success = true;
					}
				}
			}

			var attempt = {
				"userid": userinfo.id,
				"assignment": number,
				"timestamp":Date.now(),
				"success":success? 1 : 0,
				"globalfilters": globalfilters,
				"sheets": sheets,
				"answer":""
			}

			if( angular.isDefined(exp.answer) ){
				if( angular.isDefined(exp.answer[number]) ){
					attempt["answer"] = exp.answer[number];
				}
			}

			log[number].attempts.push(attempt);

			if(success){
				exp.phase++;
			}
			else{
				hint[number] = true;
			}

			$.post('ajax/insertattempt.php', attempt).done(function(data){
				
			});
		}

		this.submitQuest = function(){
			angular.forEach(exp.qanswer, function( value,key ){
				var array = {
					"userid": userinfo.id,
					"questionid": key,
					"answer": value
				}
				$.post('ajax/insertanswer.php', array).done(function(data){
					
				});
			});

			// Also submitting age and gender
			$.post('ajax/updateuser.php', userinfo).done(function(data){
				
			});
			
			exp.phase++;
		};

		this.submitEmail = function(){
			$.post('ajax/updateuser.php', userinfo).done(function(data){
				
			});
			exp.phase++;
			dataService.loadData("data_overheid.json");
		}
	}]);

	app.directive('experimentOverlay',function(){
		return{
			restrict: 'E',
			templateUrl: "js/experiment/experiment.html"
		}
	});

	app.directive('experimentBtn',function(){
		return{
			restrict: 'E',
			templateUrl: "js/experiment/experiment-btn.html"
		}
	});

})();