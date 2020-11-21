import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'react-native-axios';
import { Table, Row, Col, Rows, TableWrapper } from 'react-native-table-component';

import pageStyles from '../style/basicStyle';

const colWidth = 130

class GameStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableheader: ['', 'SET', 'Points', 'Serve', 'Reception', 'Attack', 'Block'],
            tableHead: ['Nr', '1', '2', '3', '4', '5', 'Tot', 'BP', 'V-L', 'Tot', 'Miss', 'Ace', 'Tot', 'Miss', 'Pos %', 'Perf %', 'Tot', 'Miss', 'Block', 'Perf', 'Perf %', 'Eff %', 'Points'],
            widthMainHead: [30, 25, 25, 25, 25, 25, 35, 35, 35, 45, 45, 40, 45, 45, 55, 55, 45, 45, 55, 40, 55, 60, 55],
            widthMain: [30, 25, 25, 25, 25, 25, 35, 35, 35, 45, 45, 40, 45, 45, 55, 55, 45, 45, 55, 40, 55, 60, 55],
            widthHeader: [30, 125, 105, 130, 200, 295, 55],

            totalRow: [],
            totalHome: [],
            totalGuest: [],
            playersHome: [[]],
            playersGuest: [[]],
            tableData: [[]],
            activeTeam: this.props.route.params.tempMatch.homeTeam,

            numberActiveTeam: ['Loading...'],
            nameHomeTeam: [[]],
            nameGuestTeam: [[]],
        }
    }
    async componentDidMount() {
        await axios.get(this.props.route.params.tempMatch.statsLink)
            .then(function (response) {
                this.extractGameStats(response.data)
            }.bind(this));
    }
    extractGameStats(data) {
        let nameHomeTeam = []
        let nameGuestTeam = []
        let playersHome = []
        let playersGuest = []
        let totalHome = []
        let totalGuest = []
        let playerHomeStringList = data.split('</colgroup>')[1].split('MatchDetails_PlayerNumber')
        let playerGuestStringList = data.split('</colgroup>')[2].split('MatchDetails_PlayerNumber')

        for (let i = 1; i < playerHomeStringList.length; i++) {
            if (i != playerHomeStringList.length - 1) {
                playersHome.push(this.extractPlayer(playerHomeStringList[i]))
                nameHomeTeam.push(this.extractNameAndNumber(playerHomeStringList[i]))
            } else {
                totalHome = this.extractPlayer(playerHomeStringList[i])
            }

        }
        for (let i = 1; i < playerGuestStringList.length; i++) {
            if (i != playerGuestStringList.length - 1) {
                playersGuest.push(this.extractPlayer(playerGuestStringList[i]))
                nameGuestTeam.push(this.extractNameAndNumber(playerGuestStringList[i]))
            } else {
                totalGuest = this.extractPlayer(playerGuestStringList[i])
            }
        }
        nameHomeTeam.push(['Total'])
        nameGuestTeam.push(['Total'])
        // console.log(playersHome)
        if (this.state.activeTeam == this.props.route.params.tempMatch.homeTeam)
            this.setState({ tableData: playersHome, totalRow: totalHome, numberActiveTeam: nameHomeTeam })
        else
            this.setState({ tableData: playersGuest, totalRow: totalGuest, numberActiveTeam: nameGuestTeam })

        this.setState({ playersHome: playersHome, playersGuest: playersGuest, totalGuest: totalGuest, totalHome: totalHome, nameHomeTeam: nameHomeTeam, nameGuestTeam: nameGuestTeam })

    }
    extractPlayer(playerString) {
        const spikeKills = playerString.split('SpikeWin')[1].split('>')[1].split('<')[0]
        const spikesInBlock = playerString.split('SpikeHP')[1].split('>')[1].split('<')[0]
        const spikeErrors = playerString.split('SpikeErr')[1].split('>')[1].split('<')[0]
        const totalSpikes = playerString.split('SpikeTot')[1].split('>')[1].split('<')[0]
        const efficiency = totalSpikes == '-' ? '.' : Math.round((parseInt(spikeKills == '-' ? 0 : spikeKills) - (parseInt(spikeErrors == '-' ? 0 : spikeErrors) + parseInt(spikesInBlock == '-' ? 0 : spikesInBlock))) / parseInt(totalSpikes == '-' ? 0 : totalSpikes) * 100)

        const playerNumber = playerString.split('PlayerNumber')[1] ? playerString.split('PlayerNumber')[1].split('>')[1].split('<')[0] : ''

        const playerData = [
            playerNumber,
            // playerString.split('"PlayerName"')[1].split('b>')[1].split('<')[0],
            playerString.split('Set1')[1].split('>')[1].split('<')[0],
            playerString.split('Set2')[1].split('>')[1].split('<')[0],
            playerString.split('Set3')[1].split('>')[1].split('<')[0],
            playerString.split('Set4')[1].split('>')[1].split('<')[0],
            playerString.split('Set5')[1].split('>')[1].split('<')[0],

            playerString.split('"PointsTot"')[1].split('>')[1].split('<')[0],
            playerString.split('"Points"')[1].split('>')[1].split('<')[0],
            playerString.split('L_VP')[1].split('>')[1].split('<')[0],

            playerString.split('ServeTot')[1].split('>')[1].split('<')[0],
            playerString.split('ServeErr')[1].split('>')[1].split('<')[0],
            playerString.split('ServeAce')[1].split('>')[1].split('<')[0],

            playerString.split('RecTot')[1].split('>')[1].split('<')[0],
            playerString.split('RecErr')[1].split('>')[1].split('<')[0],
            playerString.split('RecPos')[1].split('>')[1].split('<')[0],
            playerString.split('RecPerf')[1].split('>')[1].split('<')[0],

            totalSpikes,
            spikeErrors,
            spikesInBlock,
            spikeKills,
            playerString.split('SpikePos')[1].split('>')[1].split('<')[0],
            efficiency + ' %',

            playerString.split('BlockWin')[1].split('>')[1].split('<')[0]
        ]

        return playerData
    }
    extractNameAndNumber(playerString) {
        let playerName = playerString.split('"PlayerName"')[1].split('b>')[1].split('<')[0]
        if (playerName.length > 15) {
            const listOfNames = playerName.split(' ')
            if (listOfNames.length > 2) {
                if (listOfNames[2] == '(L)') {
                    playerName = listOfNames[1].charAt(0) + '. ' + listOfNames[0] + ' ' + listOfNames[2]
                } else {
                    playerName = listOfNames[2].charAt(0) + '. ' + listOfNames[0]
                }
            } else {
                playerName = listOfNames[1].charAt(0) + '. ' + listOfNames[0]
            }
        }
        return ([
            playerName
        ])

    }
    pickTeam(team) {
        if (team == 'home') {
            this.setState({ tableData: this.state.playersHome, totalRow: this.state.totalHome, activeTeam: this.props.route.params.tempMatch.homeTeam, numberActiveTeam: this.state.nameHomeTeam })
        } else {
            this.setState({ tableData: this.state.playersGuest, totalRow: this.state.totalGuest, activeTeam: this.props.route.params.tempMatch.guestTeam, numberActiveTeam: this.state.nameGuestTeam })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView horizontal={false}>
                    <View>
                        {/* <Table borderStyle={pageStyles.tableHeaderBorder}>
                        </Table>

                        <Table borderStyle={pageStyles.tableHeadBorder}>
                        </Table> */}
                        <TableWrapper style={{ flexDirection: 'row' }}>
                            <Table borderStyle={{ borderWidth: 1, borderColor: '#f1f8ff' }} >
                                <Row data={['']} widthArr={[colWidth]} textStyle={styles.header} />
                                <Row data={['Name']} widthArr={[colWidth]} textStyle={pageStyles.tableText} />
                                <Col
                                    data={this.state.numberActiveTeam}
                                    width={colWidth}
                                    textStyle={pageStyles.tableText}
                                />
                            </Table>
                            <ScrollView style={styles.dataWrapper, { flexDirection: 'row' }} horizontal={true}>
                                <Table borderStyle={pageStyles.borderStyle}>
                                    <Row data={this.state.tableheader} widthArr={this.state.widthHeader} textStyle={styles.header} />
                                    <Row data={this.state.tableHead} widthArr={this.state.widthMainHead} textStyle={pageStyles.tableText} />
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
                                    <Row data={this.state.totalRow} widthArr={this.state.widthMain} textStyle={pageStyles.totalRow} />
                                </Table>
                                {/* <Table borderStyle={pageStyles.tableHeadBorder}> */}
                                {/* </Table> */}
                            </ScrollView>
                        </TableWrapper>
                    </View>
                </ScrollView>
                {/* <View style={{ padding: 10 }}> */}
                {/* <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}> */}
                {/* <CheckBox
                            value={this.state.filterName}
                            onValueChange={(newValue) => this.setState({ filterName: newValue })}
                        />
                        <Text style={{ margin: 0, padding: 0 }}>Name</Text>
                        <CheckBox
                            value={this.state.filterSets}
                            onValueChange={(newValue) => this.setState({ filterSets: newValue })}
                        />
                        <Text style={{ margin: 0, padding: 0 }}>Set</Text>
                        <CheckBox
                            value={this.state.filterPoints}
                            onValueChange={(newValue) => this.setState({ filterPoints: newValue })}
                        />
                        <Text style={{ margin: 0, padding: 0 }}>Pts</Text>
                        <CheckBox
                            value={this.state.filterServe}
                            onValueChange={(newValue) => this.setState({ filterServe: newValue })}
                        />
                        <Text style={{ margin: 0, padding: 0 }}>Ser</Text>
                        <CheckBox
                            value={this.state.filterReception}
                            onValueChange={(newValue) => this.setState({ filterReception: newValue })}
                        />
                        <Text style={{ margin: 0, padding: 0 }}>Rec</Text>
                        <CheckBox
                            value={this.state.filterAttack}
                            onValueChange={(newValue) => this.setState({filterAttack:newValue})}
                        />
                        <Text style={{ margin: 0, padding: 0 }}>Att</Text>
                        <CheckBox
                            value={this.state.filterBlock}
                            onValueChange={(newValue) => this.setState({filterBlock:newValue})}
                        />
                        <Text style={{ margin: 0, padding: 0 }}>Blo</Text> */}
                {/* </View>
                </View> */}
                <View style={{ padding: 10 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => this.pickTeam('home')}
                        >
                            <Image source={{ uri: this.props.route.params.tempMatch.homeLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 30 }}>{this.state.activeTeam}</Text>
                        <TouchableOpacity
                            onPress={() => this.pickTeam('away')}
                        >
                            <Image source={{ uri: this.props.route.params.tempMatch.guestLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 0, paddingTop: 0, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    dataWrapper: { marginTop: -1 },
    header: { fontSize: 20, textAlign: 'center' },
    wrapper: { flexDirection: 'row' },
});
export default GameStats;