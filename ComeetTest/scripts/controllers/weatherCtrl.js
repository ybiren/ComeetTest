/**************************************************/
/* weatherCtrl.js
	 Retrieves weather data and sorts it according to 
	 best temeperature and humidity.
*/
/*************************************************/

weatherApp.controller("weatherCtrl", ['$scope', 'httpSvc', function ($scope, httpSvc) {

											//min latitude = -180 , min longitude = -85 ,man latitude = 180 , man longitude = 85 
	const WeatherUrl = "http://api.openweathermap.org/data/2.5/box/city?bbox=-180,-85,180,85&cluster=yes&appid=e20aaefa55c63f0723b262986f308acf";
	const BestWeather = 21;
	const BestHumidity = 50;
	const Men = "men";  
	const Women = "women";

	$scope.StateEnum = {
		"Init": 0,
		"Retrive": 1,
		"Process": 2,
	  "Display":3,
		"Error":4
	};
	
	$scope.criteria = { "selectedOption": Men };
	$scope.numResForDisp = 5; 

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//sorts weather data (using underscore.js library) according to distance between city temperature and best temerature , city humidity and best humidity 
	var weatherSorter = function (value) {
		let criteria = 0;
		if ($scope.criteria.selectedOption === Women) {
			criteria = 1;
		}
		return Math.abs(value.main.temp - (BestWeather + criteria)) + Math.abs(value.main.humidity - BestHumidity);
	};
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.doWeatherReq = function () {
		$scope.currtState = $scope.StateEnum.Retrieve;
		httpSvc.get(WeatherUrl)
			.then(function(weatherDat) {
					$scope.currtState = $scope.StateEnum.Process;
				  //sort data using underscore.js library
					$scope.sortedArr = _.sortBy(weatherDat.data.list, weatherSorter);
					$scope.currtState = $scope.StateEnum.Display;
			  },
				function(err) {
					$scope.currtState = $scope.StateEnum.Error;
					$scope.errMsg = `Oops... ${JSON.stringify(err)}`;
				});
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.navToHomePage = function () {
		$scope.currtState = $scope.StateEnum.Init;
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.getStateMsg = function () {

		let text = "";
		switch ($scope.currtState) {
			case $scope.StateEnum.Retrieve:
				text = "Retriving data...";
				break;
			case $scope.StateEnum.Process:
				text = "Processing data...";
				break;
			case $scope.StateEnum.Error:
				text = $scope.errMsg;
			break;
			default:
		}
		return text;

	}

	//start from here
	$scope.currtState = $scope.StateEnum.Init;
	
}]);