import React, { Component } from 'react';
import WebPage from './webPage';
import axios from 'react-native-axios';

class StandingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            standings: "<div>Loading...</div>"
        }
    }
    async componentDidMount() {
        let teams
        await axios.get('http://svbf-web.dataproject.com/CompetitionStandings.aspx?ID=174&PID=266')
            .then(function (response) {
                teams = this.extractStandings(response.data)
            }.bind(this));

        this.setState({ standings: teams })
        console.log(this.state.standings[0].lost03)

    }
    extractStandings(response) {
        let teams = []
        // console.log(response.split('<a href="/CompetitionTeamDetails.aspx?TeamID=')[10])
        const teamsString = response.split('<a href="/CompetitionTeamDetails.aspx?TeamID=')
        for (let i = 1; i < teamsString.length; i++) {
            // console.log(this.extrcatTeam(teamsString[i]))
            teams.push(this.extrcatTeam(teamsString[i]))
        }
        return teams
        // let teamsString = response.split('<a href="/CompetitionTeamDetails.aspx?TeamID=1279&ID=174" id="TeamDetails_Link">')[1].split('<div id="RG_Standing_Main"')[0]
        // teams.push(this.extrcatTeam(teamsString.split('<a href="/CompetitionTeamDetails.aspx?TeamID=1279&ID=174" id="TeamDetails_Link">')[0].split('</td><td class="RadGrid_AdditionalColumn_hide_md" align="center">')[0]))
    }
    extrcatTeam(teamInfo) {
        //Logo address, name, pontis, played, wins,lost, setWin,setLost PointsWin, pointsLost, 3-0,3-1,3-2,2-3,1-3,0-1, SetQuota, PointQuota
        const team = {
            logoUrl: teamInfo.split('&quot;')[1].split('&quot;')[0],
            name: teamInfo.split('<span id="TeamName"')[1].split('>')[1].split('<')[0],
            points: teamInfo.split('<span id="Points">')[1].split('<')[0],
            matchesPlayed: teamInfo.split('<span id="MatchesPlayed">')[1].split('</span>')[0],
            wonMatches: teamInfo.split('<span id="WonMatches">')[1].split('</span>')[0],
            lostMatches: teamInfo.split('<span id="LostMatches">')[1].split('</span>')[0],
            setsWon: teamInfo.split('<span id="SetsWon">')[1].split('</span>')[0],
            setsLost: teamInfo.split('<span id="SetsLost">')[1].split('</span>')[0],
            pointsWon: teamInfo.split('<span id="PuntiFatti">')[1].split('</span>')[0],
            pointsLost: teamInfo.split('<span id="PuntiSubiti">')[1].split('</span>')[0],
            wins30: teamInfo.split('<span id="Final30">')[1].split('</span>')[0],
            wins31: teamInfo.split('<span id="Final31">')[1].split('</span>')[0],
            wins32: teamInfo.split('<span id="Final32">')[1].split('</span>')[0],
            lost23: teamInfo.split('<span id="Final23">')[1].split('</span>')[0],
            lost13: teamInfo.split('<span id="Final13">')[1].split('</span>')[0],
            lost03: teamInfo.split('<span id="Final03">')[1].split('</span>')[0],
            setQuota: teamInfo.split('<span id="QuotSet" style="text-align:center;">')[1].split('</span>')[0],
            pointQuota: teamInfo.split('<span id="QuotPoints">')[1].split('</span>')[0],
        }
        // console.log(team)
        return team
    }
    render() {
        return (
            <WebPage html={this.state.standings[0].lost03} />
        )
    }
}
export default StandingsScreen;