import React, { Component } from 'react';
import axios from 'react-native-axios';
import { Table, Row, Col, TableWrapper } from 'react-native-table-component';
import { StyleSheet, View, Image, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import pageStyles from '../style/basicStyle';
const colWidth = 55

const urlWomenStandings = 'https://svbf-web.dataproject.com/CompetitionStandings.aspx?ID=263&PID=350'
const urlMenStandings = 'https://svbf-web.dataproject.com/CompetitionStandings.aspx?ID=264&PID=351'

class StandingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableheader: ['Points', 'Matches', 'Set', 'Points', 'Results', 'Quotas'],
            widthHeader: [65, 180, 100, 100, 210, 120],
            tableHead: ['', 'Played', 'Won', 'Lost', 'Won', 'Lost', 'Won', 'Lost', '3-0', '3-1', '3-2', '2-3', '1-3', '0-3', 'Set', 'Point'],
            widthMain: [65, 60, 60, 60, 50, 50, 50, 50, 35, 35, 35, 35, 35, 35, 60, 60],
            tableData: [],
            tableDataM: [],
            tableDataW: [],

            logoRow: [],
            logoRowM: [],
            logoRowW: [],
            teamVisible: false,
            team: [],
            teamRanking: 0,
            popupTeamData: [],
            activeLeaguage: 'Men',
            isLoading: true
        }
    }
    async componentDidMount() {
        let teams
        let teamsW
        await axios.get(urlMenStandings)
            .then(function (response) {
                teams = this.extractStandings(response.data)
                this.createTableData(teams, 'Men')
            }.bind(this));

        await axios.get(urlWomenStandings)
            .then(function (response) {
                teamsW = this.extractStandings(response.data)
                this.createTableData(teamsW, 'Women')
            }.bind(this));
        this.setState({ isLoading: false })
    }
    createTableData(teams, league) {
        let logoRow = []
        let data = []
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
        if (league == 'Men')
            this.setState({ logoRow: logoRow, logoRowM: logoRow, tableData: data, tableDataM: data })
        else
            this.setState({ logoRowW: logoRow, tableDataW: data })
    }
    extractStandings(response) {
        let teams = []
        const teamsString = response.split('<a href="/CompetitionTeamDetails.aspx?TeamID=')
        for (let i = 1; i < teamsString.length; i++) {
            teams.push(this.extrcatTeam(teamsString[i]))
        }
        return teams
    }
    extrcatTeam(teamInfo) {
        //Logo address, name, pontis, played, wins,lost, setWin,setLost PointsWin, pointsLost, 3-0,3-1,3-2,2-3,1-3,0-1, SetQuota, PointQuota
        console.log(teamInfo)
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
    changeLeage(league) {
        if (league == 'Men') {
            this.setState({ tableData: this.state.tableDataM, logoRow: this.state.logoRowM })
        } else {
            this.setState({ tableData: this.state.tableDataW, logoRow: this.state.logoRowW })
        }
    }
    renderStandings() {
        return (
            <ScrollView horizontal={false}>
                <View>
                    <TableWrapper style={{ flexDirection: 'row' }}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#f1f8ff' }} >
                            <Row data={['Team']} widthArr={[colWidth]} textStyle={pageStyles.tableText} style={{ height: 22.5 }} />
                            <Row data={['']} widthArr={[colWidth]} textStyle={pageStyles.tableText} />
                            <Col
                                data={this.state.logoRow}
                                width={colWidth}
                                textStyle={pageStyles.tableText}
                            />
                        </Table>
                        <ScrollView style={styles.dataWrapper, { flexDirection: 'row' }} horizontal={true}>
                            <Table borderStyle={pageStyles.borderStyle}>
                                <Row data={this.state.tableheader} widthArr={this.state.widthHeader} textStyle={pageStyles.tableText} />
                                <Row data={this.state.tableHead} widthArr={this.state.widthMain} textStyle={pageStyles.tableText} />
                                {
                                    this.state.tableData.map((rowData, index) => (
                                        <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={this.state.widthMain}
                                            style={[styles.row, index % 2 && pageStyles.tableBackgroundColor]}
                                            textStyle={pageStyles.tableText}
                                        />
                                    ))
                                }
                            </Table>
                        </ScrollView>
                    </TableWrapper>
                </View>
            </ScrollView>
        )
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.isLoading ?
                    <ActivityIndicator size="large" color='lightgrey' style={{ margin: 10 }} /> :
                    this.renderStandings()
                }
                <Picker
                    selectedValue={this.state.activeLeaguage}
                    style={pickerStyle}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ activeLeaguage: itemValue })
                        this.changeLeage(itemValue)
                    }}>
                    <Picker.Item label={'Men'} value={'Men'} />
                    <Picker.Item label={'Women'} value={'Women'} />
                </Picker>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: { backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    dataWrapper: { marginTop: -1 },
    row: { height: 41 }
});
const pickerStyle = StyleSheet.create({
    bottom: 0,
    marginTop: Platform.OS === 'ios' ? -87 : 40
});
export default StandingsScreen;