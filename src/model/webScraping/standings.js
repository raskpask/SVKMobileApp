import React from 'react';
import { Image } from 'react-native';
export function CreateTableDataStandings(teams) {
    let data = []
    let logoRow = []
    for (let i = 0; i < teams.length; i++) {
        logoRow.push(<Image source={{ uri: teams[i].logoUrl }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />)
        data.push([
            teams[i].points,
            teams[i].matchesPlayed,
            teams[i].wonMatches,
            teams[i].lostMatches,
            teams[i].setsWon,
            teams[i].setsLost,
            teams[i].pointsWon,
            teams[i].pointsLost,
            teams[i].wins30,
            teams[i].wins31,
            teams[i].wins32,
            teams[i].lost23,
            teams[i].lost13,
            teams[i].lost03,
            teams[i].setQuota,
            teams[i].pointQuota
        ])
    }
    return [logoRow, data]
}
export function ExtractStandings(response) {
    let teams = []
    const teamsString = response.split('<a href="/CompetitionTeamDetails.aspx?TeamID=')
    for (let i = 1; i < teamsString.length; i++) {
        teams.push(extractTeam(teamsString[i]))
    }
    return teams
}
function extractTeam(teamInfo) {
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
        setQuota: teamInfo.split('<span id="QuotSet"')[1].split('>')[1].split('<')[0],
        pointQuota: teamInfo.split('<span id="QuotPoints">')[1].split('<')[0],
    }
    return team
}