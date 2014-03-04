var app = angular.module('croApp', []);

app.controller('croController', function croController($scope, $location, $http, $q) {
	var canceler;
	var fetchRepositoryDelay;

	$scope.fetchRepository = function() {
		if (fetchRepositoryDelay) {
			window.clearTimeout(fetchRepositoryDelay);
		}

		if (canceler) {
			canceler.resolve();
		}

		canceler = $q.defer();

		fetchRepositoryDelay = window.setTimeout(function() {
			var request = $http({
				method: 'GET',
				url: 'https://api.github.com/repos/' + $scope.user + '/' + $scope.repo,
				dataType: 'json',
				headers: {
			        Accept: 'application/vnd.github.v3'
			    },
			    timeout: canceler.promise
			});

			request.success(function (data, status, headers, config) {
				$scope.url = data.html_url;
				$scope.homepage = data.homepage;
				$scope.name = data.name;
				$scope.owner = data.owner.login;
				$scope.repository = $scope.owner + '/' + $scope.name
				$scope.summary = data.description;
				$scope.keywords = [];
				//$scope.license = 'Unknown'; // TODO: describe license information
				$scope.archive = data.html_url + '/archive/master.zip';
				$scope.contributors = [];
				$scope.version = null;

				fetchOwner(data.owner);

				// TODO: fetch releases and choose the latest version, set $scope.version
			});

			request.error(function(data, status, headers, config) {
				console.log(data);
			});
		}, 1000);
	};

	var fetchOwner = function(user) {
		request = $http({
			method: 'GET',
			url: user.url,
			dataType: 'json',
			headers: {
		        Accept: 'application/vnd.github.v3'
		    },
		});

		request.success(function (data, status, headers, config) {
			$scope.author = [data.name];
		});

		request.error(function(data, status, headers, config) {
			console.log(data);
		});
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