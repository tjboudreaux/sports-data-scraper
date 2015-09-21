var xrayLib = require('x-ray');
var xray = xrayLib();

var teamListUrl = 'http://espn.go.com/college-football/teams';
var conferenceListScope = '.mod-teams-list-medium';
var teamsScope = 'ul.medium-logos';
var teamDetailScope = 'body';
var gameListScope = 'table.tablehead tr:nth-child(n+3) ';

var teamDetailSchema = [{
    teamName: '.headline .team-name a'
}];

var gameSchema = {
    games: xray(gameListScope, [{
        date: 'td:nth-of-type(1)',
        opponent: 'td:nth-of-type(2) .game-schedule .team-name',
        location: 'td:nth-of-type(2) .game-schedule .game-status'
    }])
};

var teamSchema = [{
    schoolName: 'h5 a',
    teamPage: 'h5 a@href',
    teamDetails: xray('h5 a@href', {
        logo: '.brand-logo img@src',
        name: 'li.team-name .link-text',
        scheduleLink: 'a[name="&lpos=college-football:schedule:full"]@href',
        schedule: xray(  'a[name="&lpos=college-football:schedule:full"]@href', gameSchema)
    })
}];

var conferenceSchema = [{
    conference: '.mod-header h4',
    teams: xray(teamsScope,'li', teamSchema)(function(err, results){})
}];

xray(teamListUrl, conferenceListScope, conferenceSchema)(function(err, results){

}).write('data/ncaa-football.json');

