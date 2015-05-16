'use strict';
var router = require('express').Router();
var github = require('./gitHubAPI');

module.exports = router;

var errGitHub = function(err) {
	console.log("Error with GitHub API: ", err);
}

router.get('/:repoOwner/:repoName', function (req, res) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.repos.get({
		user: req.params.repoOwner,
		repo: req.params.repoName,
	}, function(err, repoInfo){
		if(err) { errGitHub(err); }
		res.json(repoInfo);
	})
	
});

router.get('/:repoOwner/:repoName/collaborators', function (req, res) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.repos.getCollaborators({
		user: req.params.repoOwner,
		repo: req.params.repoName
	}, function(err, repoCollaborators) {
		if(err) { errGitHub(err); }
		res.json(repoCollaborators);
	});

});

router.get('/:repoOwner/:repoName/commits', function (req, res) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.repos.getCommits({
		user: req.params.repoOwner,
		repo: req.params.repoName
	}, function(err, repoCommits) {
		if(err) { errGitHub(err); }
		res.json(repoCommits);
	});

});

router.get('/:repoOwner/:repoName/statsCodeFrequency', function (req, res) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.repos.getStatsCodeFrequency({
		user: req.params.repoOwner,
		repo: req.params.repoName
	}, function(err, statsCodeFrequency) {
		if(err) { errGitHub(err); }
		res.json(statsCodeFrequency);
	});

});

router.get('/:repoOwner/:repoName/statsCommitActivity', function (req, res) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.repos.getStatsCommitActivity({
		user: req.params.repoOwner,
		repo: req.params.repoName
	}, function(err, statsCommitActivity) {
		if(err) { errGitHub(err); }		
		res.json(statsCommitActivity);
	});

});

router.get('/:repoOwner/:repoName/statsContributors', function (req, res) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.repos.getStatsContributors({
		user: req.params.repoOwner,
		repo: req.params.repoName
	}, function(err, statsContributors) {
		if(err) { errGitHub(err); }		
		res.json(statsContributors);
	});

});

router.get('/:repoOwner/:repoName/statsParticipation', function (req, res) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.repos.getStatsParticipation({
		user: req.params.repoOwner,
		repo: req.params.repoName
	}, function(err, statsParticipation) {
		if(err) { errGitHub(err); }
		res.json(statsParticipation);
	});

});


/***GETS ISSUES FOR A PARTICULAR REPO***/
router.get('/:repoOwner/:repoName/repo-issues', function (req, res) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.issues.repoIssues({
		user: req.params.repoOwner,
		repo: req.params.repoName,
		state: "all",
		per_page: 100
	}, function(err, repoIssues) {
		if(err) { errGitHub(err); }
		res.json(repoIssues);
	});
});

/***GETS LABELS FOR A PARTICULAR REPO***/
router.get('/:repoOwner/:repoName/repo-labels', function (req, res) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.issues.getLabels({
		user: req.params.repoOwner,
		repo: req.params.repoName,
		per_page: 100
	}, function(err, repoLabels) {
		if(err) { errGitHub(err); }
		res.json(repoLabels);
	});
});

/***GETS MILESTONES FOR A PARTICULAR REPO***/
router.get('/:repoOwner/:repoName/repo-milestones', function (req, res) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.issues.getAllMilestones({
		user: req.params.repoOwner,
		repo: req.params.repoName
	}, function(err, repoMilestones) {
		if(err) { errGitHub(err); }
		res.json(repoMilestones);
	});
});

/***CREATES/POSTS AN ISSUE***/
router.post('/:repoOwner/:repoName/create-repo-issue', function (req, res) {

	github.authenticate({
	    type: "oauth",
	    token: req.user.github.token
	});

	var createdIssue = {};

	if(req.body.title) { createdIssue.title = req.body.title } else { createdIssue.title = ""; }	
	if(req.body.body) { createdIssue.body = req.body.body; } else { createdIssue.body = ""; }
	if(req.body.assignee) { createdIssue.assignee = req.body.assignee } else { createdIssue.assignee = ""; }
	if(req.body.labels) { createdIssue.labels = req.body.labels } else { createdIssue.labels = "[]"; }

	console.log("CREATED ISSUE: ", createdIssue);

	github.issues.create({
		user: req.params.repoOwner,
		repo: req.params.repoName,
		title: createdIssue.title,
		body: createdIssue.body,
		assignee: createdIssue.assignee,
		// milestone: req.body.milestone,
		labels: createdIssue.labels
	}, function(err, createdRepoIssue) {
		if(err) { errGitHub(err); }		
		res.json(createdRepoIssue);
	});
});

/***CREATES/POSTS AN ISSUE***/
router.post('/:repoOwner/:repoName/edit-repo-issue/:issueNumber', function (req, res) {

	github.authenticate({
	    type: "oauth",
	    token: req.user.github.token
	});

	var editedIssue = {};

	if(req.params.issueNumber) { editedIssue.number = req.params.issueNumber; } else { editedIssue.number = ""; }
	if(req.body.title) { editedIssue.title = req.body.title; } else { editedIssue.title = ""; }
	if(req.body.body) { editedIssue.body = req.body.body; } else { editedIsse.body = ""; }
	if(req.body.assignee) { editedIssue.assignee = req.body.assignee; } else { editedIssue.assignee = ""; }
	if(req.body.state) { editedIssue.state = req.body.state } else { editedIssue.state = ""; }
	if(req.body.labels) { editedIssue.labels = req.body.labels } else { editedIssue.labels = "[]"; } 

	console.log("EDITED ISSUE: ", editedIssue);

	github.issues.edit({
		user: req.params.repoOwner,
		repo: req.params.repoName,
		number: editedIssue.number,
		title: editedIssue.title,
		body: editedIssue.body,
		assignee: editedIssue.assignee,
		// milestone: issueMilestone,	
		state: editedIssue.state,
		labels: editedIssue.labels
	}, function(err, editedRepoIssue) {
		if(err) { errGitHub(err); }
		res.json(editedRepoIssue);
	});
});



/***CREATES/POSTS A REPO LABEL***/
router.post('/:repoOwner/:repoName/create-repo-label/:labelName', function (req, res) {

	var userToken = req.user.github.token;
	var labelName = req.body.name;
	var labelColor = req.body.color;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.issues.createLabel({
		user: req.params.repoOwner,
		repo: req.params.repoName,
		name: labelName,
		color: labelColor
	}, function(err, createdRepoLabel) {
		if(err) { errGitHub(err); }		
		res.json(createdRepoLabel);
	});
});

/***EDIT REPO LABEL***/
router.post('/:repoOwner/:repoName/labels', function (req, res,next) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});
	console.log('body', req.body);
	github.issues.updateLabel({
		user: req.params.repoOwner,
		repo: req.params.repoName,
		name: req.body.old,
		color: req.body.color
	}, function(err, name) {
		if(err) { errGitHub(err); }		
		res.json(name);
	});
});

/***CREATES/POSTS AN ISSUE***/
router.post('/:repoOwner/:repoName/create-repo-milestone/:milestoneTitle', function (req, res) {

	var userToken = req.user.github.token;
	var milestoneTitle = req.body.title;
	var milestoneState = req.body.state;
	var milestoneDescription = req.body.description;
	var milestoneDueDate = req.body.due_on;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.issues.createMilestone({
		user: req.params.repoOwner,
		repo: req.params.repoName,
		title: milestoneTitle,
		state: milestoneState,
		description: milestoneDescription,
		due_on: milestoneDueDate
	}, function(err, createdRepoMilestone) {
		if(err) { errGitHub(err); }		
		res.json(createdRepoMilestone);
	});
});

/***GET COMMENTS ON AN ISSUE***/
router.get('/:repoOwner/:repoName/repo-issue-comments/:issueNumber', function (req, res) {

	var userToken = req.user.github.token;

	github.authenticate({
	    type: "oauth",
	    token: userToken
	});

	github.issues.getComments({
		user: req.params.repoOwner,
		repo: req.params.repoName,
		number: req.params.issueNumber
	}, function(err, issueComments) {
		if(err) { errGitHub(err); }		
		res.json(issueComments);
	});
});

