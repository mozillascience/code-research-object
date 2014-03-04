var app = angular.module('croApp', []);

app.controller('croController', function croController($scope, $location, $http, $q) {
	var canceler;

	$scope.fetchRepository = function() {
		if (canceler) {
			canceler.resolve();
		}

		canceler = $q.defer();

		request = $http({
			method: 'GET',
			url: 'https://api.github.com/repos/' + $scope.user + '/' + $scope.repo,
			dataType: 'json',
			headers: {
		        Accept: 'application/vnd.github.v3'
		    },
		    timeout: canceler.promise
		});

		request.success(function (data, status, headers, config) {
			$scope.homepage = data.html_url;
			$scope.name = data.name;
			$scope.owner = data.owner.login;
			$scope.repository = $scope.owner + '/' + $scope.name
			$scope.description = data.description;
			//$scope.license = 'Unknown'; // TODO: describe license information
			$scope.archive = data.html_url + '/archive/master.zip';
			$scope.contributors = [];

			fetchContributor(data.owner);
		});

		request.error(function(data, status, headers, config) {
			console.log(data);
		});
	};

	var fetchContributor = function(user) {
		request = $http({
			method: 'GET',
			url: user.url,
			dataType: 'json',
			headers: {
		        Accept: 'application/vnd.github.v3'
		    },
		});

		request.success(function (data, status, headers, config) {
			$scope.contributors = [data.name];
		});

		request.error(function(data, status, headers, config) {
			console.log(data);
		});
	};

	$scope.archiveRepository = function() {
		alert('TODO!');
	};

	$scope.parseURL = function() {
		if (!$scope.url) {
			return false;
		}

		var matches = $scope.url.match(/^https?:\/\/github\.com\/(.+?)\/([^\/]+)/);

		if (!matches) {
			return false;
		}

		$scope.user = matches[1];
		$scope.repo = matches[2];

		$scope.fetchRepository();

		return true;
	};

	$scope.query = $location.$$search;
	$scope.url = $scope.query.url;

	if ($scope.query.url) {
		if (!$scope.parseURL()) {
			$scope.query.url = null;
		}
	}
});