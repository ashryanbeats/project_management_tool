'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('repo', {
        url: '/repo/:owner/:name',
        templateUrl: 'js/repo/repo.html',
        controller: 'RepoShowController'
    });
});

app.factory('RepoInfoFactory', function($http){
				

	return {
		getRepoInfo: function (repoName){
			return $http.get('api/repo/repo/' + repoName).then(function(repoInfo){
				return repoInfo;
			});
		},
		getRepoCollaborators: function (repoName){
			return $http.get('api/repo/repo/' + repoName +"/collaborators").then(function(repoCollaborators){
				return repoCollaborators;
			});
		},
		getRepoCommits: function (repoName){
			return $http.get('api/repo/repo/' + repoName +"/commits").then(function(repoCommits){
				return repoCommits;
			});
		},
		getStatsCodeFrequency: function (repoName){
			return $http.get('api/repo/repo/' + repoName +"/statsCodeFrequency").then(function(statsCodeFrequency){
				return statsCodeFrequency;
			});
		},
		getStatsCommitActivity: function (repoName){
			return $http.get('api/repo/repo/' + repoName +"/statsCommitActivity").then(function(statsCommitActivity){
				return statsCommitActivity;
			});
		},
		getStatsContributors: function (repoName){
			return $http.get('api/repo/repo/' + repoName +"/statsContributors").then(function(statsContributors){
				return statsContributors;
			});
		},
		getStatsParticipation: function (repoName){
			return $http.get('api/repo/repo/' + repoName +"/statsParticipation").then(function(statsParticipation){
				return statsParticipation;
			});
		},
		getRepoLabels: function (repoInfo) {
			return $http.get('api/repo/' + repoInfo.owner + "/" + repoInfo.name + "/repo-labels").then(function(repoLabels){
				return repoLabels;
			});
		}
	};
})



app.factory('RepoIssuesFactory', function($http){
				
	return {
		getRepoIssues: function (repoInfo){
			console.log("ETAFAESG");
			return $http.get('api/repo/' +repoInfo.owner + "/" + repoInfo.name +"/repo-issues").then(function(repoIssues){
				return repoIssues;
			});
		},
		createRepoIssue: function (repoInfo, issue) {
			return $http.post('api/repo/' + repoInfo.owner + "/" + repoInfo.name +"/create-repo-issue", issue).then(function(createdRepoIssue){
				console.log("Inside angular post", createdRepoIssue);
				return createdRepoIssue;
			});
		}
	};
});






app.controller('RepoShowController', function($scope, $stateParams, $state, RepoInfoFactory, RepoIssuesFactory){
	console.log("I am state params",$stateParams);
	$scope.hello = "Welcomes";
	$scope.issue = {};
	$scope.issue.labels = [];

	// issue = { body: "mytext"}

// $scope.createLabels = function(labels) {
// 	$scope.issues.labels.push(labels);
// }

  $scope.createIssue = function(issue) {
  	//issue.labels.push(issue.label); 
  	issue.assignee = "carlos-r-mendoza";

      console.log("This is the issue", issue);
       console.log("STATEPARAMAS", $stateParams.name);
      // console.log("NEWISSUE", newIssue);
		RepoIssuesFactory.createRepoIssue($stateParams, issue).then(createdRepoIssueFulfilled, rejected);
    }


		function repoInfoFulfilled(repoInfo) {
		
		$scope.repoInfo = repoInfo;

		// profileRepos.data.forEach(function(repo){
		// 	var repoObj = {};
		// 	repoObj.name = repo.name;
		// 	repoObj.language = repo.language;
		// 	repoObj.description = repo.description;
		// 	repoObj.url = repo.html_url;
		// 	repoObj.created = repo.created_at;
		// 	repoObj.lastUpdated = repo.updated_at;
		// 	repoObj.watchers = repo.watchers_count;
		// 	repoObj.forks = repo.forks_count;

		// 	$scope.profileRepos.push(repoObj);
		}




		function repoCollaboratorsFulfilled(repoCollaborators) {
		 $scope.collaborators = repoCollaborators;
		}

		function repoCommitsFulfilled(repoCommits) {
		 $scope.commits = repoCommits;
		}

		function statsCodeFrequencyFulfilled(statsCodeFrequency) {
			$scope.stats = statsCodeFrequency;
		}

		function statsCommitActivityFulfilled(statsCommitActivity) {
			$scope.statsCommit = statsCommitActivity.data[statsCommitActivity.data.length-1];
		}

		function statsContributorsFulfilled(statsContributors) {
			$scope.statsContributors = statsContributors;
		}

		function statsParticipationFulfilled(statsParticipation) {
			$scope.statsParticipation = statsParticipation;
		}


		function repoIssuesFulfilled(repoIssues) {
			 $scope.repoIssues = repoIssues;

		}

		function createdRepoIssueFulfilled(createdRepoIssue) {
			RepoIssuesFactory.getRepoIssues($stateParams).then(repoIssuesFulfilled, rejected);
		}

		function repoLabelsFulfilled(repoLabels){
			$scope.repoLabels = repoLabels.data;
		}



		function rejected(error){
			console.log(error);
		}
		
		RepoInfoFactory.getRepoInfo($stateParams.name).then(repoInfoFulfilled, rejected);
		RepoInfoFactory.getRepoCollaborators($stateParams.name).then(repoCollaboratorsFulfilled, rejected);
		RepoInfoFactory.getRepoCommits($stateParams.name).then(repoCommitsFulfilled, rejected);
		RepoInfoFactory.getStatsCodeFrequency($stateParams.name).then(statsCodeFrequencyFulfilled, rejected);
		RepoInfoFactory.getStatsCommitActivity($stateParams.name).then(statsCommitActivityFulfilled, rejected);
		RepoInfoFactory.getStatsContributors($stateParams.name).then(statsContributorsFulfilled, rejected);
		RepoInfoFactory.getStatsParticipation($stateParams.name).then(statsParticipationFulfilled, rejected);
		RepoIssuesFactory.getRepoIssues($stateParams).then(repoIssuesFulfilled, rejected);
		RepoInfoFactory.getRepoLabels($stateParams).then(repoLabelsFulfilled, rejected);


});