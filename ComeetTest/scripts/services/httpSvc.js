/**************************************************/
/* httpSvc.js
   Makes ajax request and returns response data
*/
/*************************************************/

weatherApp.factory('httpSvc',
[
	'$http', '$q', function ($http, $q) {
		var val = "";
		return {
			get: function (url) {
				var defer = $q.defer();
				$http({
					method: 'GET',
					url: url
				}).then(function (data) {
					  defer.resolve(data);
				  }, function errorCallback(response) {
					    defer.reject(response);
					}
				);
				return defer.promise;
			}

		}
	}
]);