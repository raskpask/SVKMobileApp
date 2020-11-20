import React, { Component } from 'react';
import axios from 'react-native-axios';
import { Table, Row, Rows, TableWrapper } from 'react-native-table-component';
import { StyleSheet, View, Image, TouchableOpacity, Button, ScrollView } from 'react-native';
import { Dialog } from 'react-native-simple-dialogs';

import pageStyles from '../style/basicStyle';

class StandingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Team', 'Points', 'Total games', 'Wins', 'Lost', 'Sets won', 'Sets lost'],
            tableData: [],
            teamVisible: false,
            team: [],
            teamRanking: 0,
            popupTeamData: []
        }
    }
    async componentDidMount() {
        let teams
        await axios.get('http://svbf-web.dataproject.com/CompetitionStandings.aspx?ID=174&PID=266')
            .then(function (response) {
                teams = this.extractStandings(response.data)
            }.bind(this));
        let data = []
        for (let i = 0; i < teams.length; i++) {
            data.push([
                <TouchableOpacity onPress={() => this.setTeamPopup(teams[i], i + 1)}>
                    <Image source={{ uri: teams[i].logoUrl }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                </TouchableOpacity >,
                teams[i].points,
                teams[i].matchesPlayed,
                teams[i].wonMatches,
                teams[i].lostMatches,
                teams[i].setsWon,
                teams[i].setsLost]
            )
        }
        this.setState({ tableData: data })

    }
    setTeamPopup(team, ranking) {
        let popupTeamData = [
            ['Points', team.points + 'p'],
            ['Matches played', team.matchesPlayed],
            ['Matches won', team.wonMatches],
            ['Matches lost', team.lostMatches],
            // ['Sets played', parseInt(team.setsWon) + parseInt(team.setsLost)],
            ['Sets Won', team.setsWon],
            ['Sets lost', team.setsLost],
            ['Set quota', team.setQuota],
            // ['Rallies played', parseInt(team.pointsLost) + parseInt(team.pointsWon)],
            ['Rallies won', team.pointsWon],
            ['Rallies lost', team.pointsLost],
            ['Point quota', team.pointQuota],
            ['3-0 wins', team.wins30],
            ['3-1 wins', team.wins31],
            ['3-2 wins', team.wins32],
            ['2-3 losses', team.lost23],
            ['1-3 losses', team.lost13],
            ['0-3 losses', team.lost03],
        ]

        this.setState({ team: team, teamRanking: ranking, teamVisible: true, popupTeamData: popupTeamData })
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
            <View style={styles.container}>
                <Table borderStyle={pageStyles.borderStyle}>
                    <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text} />
                    <Rows data={this.state.tableData} textStyle={styles.text} />
                </Table>
                <Dialog
                    visible={this.state.teamVisible}
                    title={this.state.team.name}
                    onTouchOutside={() => this.setState({ teamVisible: false })} >
                    <View >
                        <ScrollView style={styles.dataWrapper}>
                            <Table
                                borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff', margin: 0 }}
                            >
                                <TableWrapper>
                                    <Rows data={this.state.popupTeamData} textStyle={styles.text} />
                                </TableWrapper>
                            </Table>
                            <View style={{ marginTop: 20 }}>
                                <Button
                                    style={{ marginTop: 20 }}
                                    onPress={() => this.setState({ teamVisible: false })}
                                    title="close"
                                    color="#5450ff"
                                    accessibilityLabel="Learn more about this purple button"
                                />
                            </View>
                        </ScrollView>
                    </View>
                </Dialog>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 0, paddingTop: 0, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    dataWrapper: { marginTop: -1 },
});
export default StandingsScreen;