'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('github-profile', {
        url: '/github-profile',
        templateUrl: 'js/github-profile/github-profile.html',
        controller: 'GitHubProfileController'
    });
});

app.factory('GitHubProfileFactory', function($http){
	return {
		getUserInfo: function (){
			return $http.get('api/github-profile/username').then(function(profileData){
				return profileData;
			});
		},
		getUserEvents: function (){
			return $http.get('api/github-profile/collaborators').then(function(profileEvents){
				return profileEvents;
			});
		},
		getUserRepos: function (){
			return $http.get('api/github-profile/repos').then(function(profileRepos){
				return profileRepos;
			});
		},
		getRepoIssues: function(url){
			return $http.get('api/repo'+url+"/repo-issues").then(function(repoIssues){
				return repoIssues;
			});
		},
		closeIssue: function(url, number, issue){
			return $http.post('api/repo'+url+'/edit-repo-issue/'+number, issue).then(function(iss){
				return iss;
			});
		}
	};

});

app.controller('GitHubProfileController', function($scope, GitHubProfileFactory, RepoFactory, $stateParams) {

	$scope.profile = {};
	$scope.profileEvents = [];
	$scope.profileRepos = [];
	$scope.collaborators = "";
	$scope.repoName = "";

	function profileFulfilled(profileData) {
		$scope.info = profileData;
		$scope.profile.name = profileData.data.name;
		$scope.profile.name = profileData.data.name;
		$scope.profile.username = profileData.data.login;
		$scope.profile.avatar = profileData.data.avatar_url;
		$scope.profile.email = profileData.data.email;
		$scope.profile.company = profileData.data.company;
		$scope.profile.location = profileData.data.location;
		$scope.profile.gitHubProfileLink = profileData.data.html_url;
		$scope.profile.publicRepos = profileData.data.public_repos;

	}
	function rejected(error){
		console.log(error);
	}

	function profileEventsFulfilled(profileEvents) {

		profileEvents.data.forEach(function(event){
			var eventObj = {};

			eventObj.type = event.type;
			eventObj.repo = event.repo.name;
			eventObj.date = event.created_at;
			if(eventObj.type === "PushEvent") {
				eventObj.message = event.payload.commits[0].message;
			} else { eventObj.message = ""; }
		
		$scope.profileEvents.push(eventObj);
		
		});
	}

	function profileReposFulfilled(profileRepos) {
		profileRepos.data.forEach(function(repo){
			var repoObj = {};
			repoObj.name = repo.name;
			repoObj.full_name = repo.full_name;
			repoObj.language = repo.language;
			repoObj.description = repo.description;
			repoObj.url = repo.html_url;
			repoObj.created = repo.created_at;
			repoObj.lastUpdated = repo.updated_at;
			repoObj.watchers = repo.watchers_count;
			repoObj.forks = repo.forks_count;
			repoObj.owner = repo.owner.login;
			$scope.profileRepos.push(repoObj);
			});	
		}

		function profileReposCollaboratorsFulfilled(profileRepos) {
			$scope.collaborators = profileRepos;
		}

	

	function getIssueAssignments(info){
		var issue = info.data;
		issue.forEach(function(iss){
			if(iss.assignee){
				$scope.assign = true;
				if(iss.assignee.login === $scope.username && iss.state==='open'){
					$scope.assignments.push(iss);
				}
			}
		});
		if($scope.assignments.length===0){
			$scope.assignments.push({title: 'No Assignments for this Repo'});
			$scope.assign = false;
		}
		return $scope.assignments;
	}

	$scope.getAssignments = function(profileRepo, user){
		$scope.repoName = profileRepo.name;
		$scope.repoOwner = profileRepo.owner;
		console.log('REPONAME', $scope.repoName);
		var profileRepoURL = profileRepo.url;
		$scope.assignments = [];
		$scope.url = profileRepoURL.split("https://github.com")[1];
		$scope.username = user;
		console.log('USER', $scope.username);
		GitHubProfileFactory.getRepoIssues($scope.url).then(getIssueAssignments, rejected);
	};
	
	

	$scope.closeIssue = function(assignment){
		var number = assignment.number;
		var issue = {};

		if(assignment.state === 'open'){
			issue = {
			title: assignment.title,
			body: assignment.body,
			assignee: assignment.assignee.login,
			state: 'closed'
			};
			assignment.state = 'closed';
			
		}
		else if(assignment.state === 'closed'){
			issue = {
			title: assignment.title,
			body: assignment.body,
			assignee: assignment.assignee.login,
			state: 'open'
			};
			assignment.state = 'open';
		}
		
		GitHubProfileFactory.closeIssue($scope.url, number, issue);
	};

	$scope.updateStatus = function(state){
		if(state==='open'){
			state='closed';
		}
		else{
			state='open';
		}
	};

		GitHubProfileFactory.getUserInfo().then(profileFulfilled, rejected);
		GitHubProfileFactory.getUserEvents().then(profileEventsFulfilled, rejected);
		GitHubProfileFactory.getUserRepos().then(profileReposFulfilled, rejected);

});