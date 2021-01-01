import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row, Col, TableWrapper } from 'react-native-table-component';
import { Card } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const allStatsKey = 'allStats'
const allNamesKey = 'allNames'
const topKey = 'allTops'
const colWidth = 130
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import pageStyles from '../style/basicStyle';

const widthMainHead = [30, 100, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 55, 55, 55, 40, 55, 45, 60, 65, 45, 45, 60, 55]
const widthHeader = [130, 225, 315, 245, 320, 205]
const tableheader = ['', 'Total', 'Serve', 'Reception', 'Attack', 'Block']
const tableHead = ['Nr', 'Team', 'Mat', 'Set', 'Pts', 'BP', 'W-L', 'Tot', 'Err', '!', '-', '+', 'OVP', 'Ace', 'Tot', 'Err', 'OVP', 'Pos %', 'Perf %', 'Tot', 'Err', 'Block', 'Perf', 'Perf %', 'Eff %', 'Tot', 'Err', 'Perf %', 'Points']

class StatsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAllPlayersLoaded: false,
            showTotalRow: false,
            totalRow: [],

            rawDataPlayers: [],
            allPlayers: [],
            filteredPlayers: [],

            nameList: [],
            filteredNameList: [],

            topTotalPoints: [],
            topTotalAces: [],
            topTotalKills: [],
            topTotalBlocks: [],

            searchText: "",
            chosenTeam: "All teams",
            listOfTeams: ['All teams', 'Sollentuna', 'Vingåker', 'Lund', 'Södertelge', 'Hylte Halmstad', 'Floby', 'Habo', 'Örkelljunga', 'Uppsala', 'RIG Falköping', 'Falkenberg'],
        }
    }
    async componentDidMount() {
        let playerList = []
        let nameList = []
        let tops = {}
        try {
            tops = JSON.parse(await AsyncStorage.getItem(topKey))
            this.setState({ topTotalPoints: tops.points, topTotalKills: tops.kills, topTotalBlocks: tops.blocks, topTotalAces: tops.aces })
            playerList = JSON.parse(await AsyncStorage.getItem(allStatsKey))
            nameList = JSON.parse(await AsyncStorage.getItem(allNamesKey))
        } catch (e) {
            console.log(e)
        }
        this.setState({ filteredPlayers: playerList.slice(0, 30), filteredNameList: nameList.slice(0, 30), allPlayers: playerList, nameList: nameList })
        this.setTop()
        this.setData()
    }
    async setTop() {
        const playerListTotalPoints = await this.makeRequest('PointsTot_ForAllPlayerStats DESC', '174')
        const playerListTotalAces = await this.makeRequest('ServeWin DESC', '174')
        const playerListTotalKills = await this.makeRequest('SpikeWin DESC', '174')
        const playerListTotalBlocks = await this.makeRequest('BlockWin DESC', '174')
        try {
            AsyncStorage.setItem(topKey, JSON.stringify({ points: playerListTotalPoints, aces: playerListTotalAces, kills: playerListTotalKills, blocks: playerListTotalBlocks }))
        } catch (e) {
            console.log(e)
        }
        this.setState({ topTotalPoints: playerListTotalPoints, topTotalAces: playerListTotalAces, topTotalKills: playerListTotalKills, topTotalBlocks: playerListTotalBlocks })
    }
    async makeRequest(sortExpression, compID) {
        let playerList = []
        await axios.post('http://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData', { "startIndex": 0, "maximumRows": 10, "sortExpressions": sortExpression, "filterExpressions": [], "compID": compID, "phaseID": "266", "playerSearchByName": "" }).then(function (response) {
            for (let i = 0; i < response.data.d.length; i++) {
                playerList.push(this.extractNameAndStats(response.data.d[i]))
            }
        }.bind(this));
        return playerList
    }
    async setData() {
        let playerList = []
        let nameList = []
        await axios.post('http://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData', { "startIndex": 0, "maximumRows": 148, "sortExpressions": "PointsTot_ForAllPlayerStats DESC", "filterExpressions": [], "compID": "174", "phaseID": "266", "playerSearchByName": "" }).then(function (response) {
            this.setState({ rawDataPlayers: response.data.d })
            for (let i = 0; i < response.data.d.length; i++) {
                playerList.push(this.extractData(response.data.d[i]))
                nameList.push(this.formatName(response.data.d[i].Name, response.data.d[i].Surname))
            }
        }.bind(this));
        // await axios.post('http://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData', {"startIndex":100,"maximumRows":100,"sortExpressions":"PointsTot_ForAllPlayerStats DESC","filterExpressions":[],"compID":"174","phaseID":"266","playerSearchByName":""}).then(function (response) {
        //     playerList.push(response.data.d)
        // }.bind(this));
        try {
            AsyncStorage.setItem(allStatsKey, JSON.stringify(playerList))
            AsyncStorage.setItem(allNamesKey, JSON.stringify(nameList))
        } catch (e) {
            console.log(e)
        }
        this.setState({ allPlayers: playerList, filteredPlayers: playerList.slice(0, 30), filteredNameList: nameList.slice(0, 30), nameList: nameList })
    }
    formatName(name, surname) {
        let newName = name + ' ' + surname
        if (newName.length > 15) {
            newName = name.charAt(0) + '. ' + surname
        }
        if (newName.length > 15) {
            const listOfNames = newName.split(' ')
            if (listOfNames.length > 2) {
                newName = listOfNames[0] + ' ' + listOfNames[1].charAt(0) + '. ' + listOfNames[2]
            } else {
                newName = listOfNames[0] + ' ' + listOfNames[1].charAt(0)
            }
        }
        return newName
    }
    extractNameAndStats(data) {
        return {
            name: data.Name + ' ' + data.Surname,
            team: data.Team,
            totalPoints: data.PointsTot_ForAllPlayerStats,
            totalKills: data.SpikeWin,
            totalBlocks: data.BlockWin,
            totalAces: data.ServeWin,
        }
    }
    extractData(data) {
        const totalServ = data.ServeErr + data.ServeWin + data.ServeMinus + data.ServePlus + data.ServeHP + data.ServeEx
        const totalRec = data.RecErr + data.RecWin + data.RecMinus + data.RecPlus + data.RecHP + data.RecEx
        const totalAtt = data.SpikeErr + data.SpikeWin + data.SpikeMinus + data.SpikePlus + data.SpikeHP + data.SpikeEx
        const totalBlock = data.BlockErr + data.BlockWin + data.BlockMinus + data.BlockPlus + data.BlockHP + data.BlockEx
        return [
            data.Number,
            data.Team.split(' ')[0],
            data.PlayedMatches,
            data.PlayedSets,
            data.PointsTot_ForAllPlayerStats,
            data.Points,
            data.PointsW_P,
            totalServ,
            data.ServeErr,
            data.ServeEx,
            data.ServeMinus,
            data.ServePlus,
            data.ServeHP,
            data.ServeWin,
            totalRec,
            data.RecErr,
            data.RecHP,
            Math.round((data.RecPlus + data.RecWin) / totalRec * 100) ? Math.round((data.RecPlus + data.RecWin) / totalRec * 100) + ' %' : '-',
            Math.round((data.RecWin) / totalRec * 100) ? Math.round((data.RecWin) / totalRec * 100) + ' %' : '-',
            totalAtt,
            data.SpikeErr,
            data.SpikeHP,
            data.SpikeWin,
            Math.round((data.SpikeWin) / totalAtt * 100) ? Math.round((data.SpikeWin) / totalAtt * 100) + ' %' : '-',
            Math.round((data.SpikeWin - data.SpikeErr - data.SpikeHP) / totalAtt * 100) ? Math.round((data.SpikeWin - data.SpikeErr - data.SpikeHP) / totalAtt * 100) + ' %' : '-',
            totalBlock,
            data.BlockErr,
            Math.round((data.BlockWin) / totalBlock * 100) ? Math.round((data.BlockWin) / totalBlock * 100) + ' %' : '-',
            data.BlockWin,
        ]
    }
    newSearch(text, isTeam) {
        if (isTeam) {
            if (this.state.chosenTeam !== text) {
                this.setState({ chosenTeam: text })
            }
        } else {
            this.setState({ searchText: text })
        }
        this.filterPlayers(text, isTeam)
        if (text !== 'All teams')
            this.myScroll.scrollTo({ x: 0, y: windowHeight / 1.8, animated: true })
    }
    filterPlayers(text, isTeam) {
        if (text === '') {
            text = this.state.chosenTeam
        }
        if ((text === '' || text === 'All teams') && this.state.chosenTeam === 'All teams') {
            this.setState({ filteredNameList: this.state.nameList.slice(0, 30), filteredPlayers: this.state.allPlayers.slice(0, 30) })
            return
        }
        let nameList = []
        let playerList = []
        this.state.rawDataPlayers.map((player, i) => {
            const playerSearchString = player.Name + ' ' + player.Surname + ' ' + player.Team
            if (playerSearchString.includes(text) || text === '') {
                if (this.state.chosenTeam === 'All teams' || isTeam) {
                    playerList.push(this.state.allPlayers[i])
                    nameList.push(this.state.nameList[i])
                } else {
                    if (playerSearchString.includes(this.state.chosenTeam)) {
                        playerList.push(this.state.allPlayers[i])
                        nameList.push(this.state.nameList[i])
                    }
                }
            }
        })
        if (text !== '') {
            this.setState({ filteredNameList: nameList, filteredPlayers: playerList })
        }
        if (playerList.length < 20) {
            this.extractTotalrow(playerList)
        }
    }
    extractTotalrow(playerList) {
        console.log(playerList)
        let totPoints = 0, bp = 0, wl = 0, serTot = 0, serErr = 0, serMedium = 0, serMinus = 0, serPlus = 0, serOVP = 0, serAce = 0, recTot = 0, recErr = 0, recOVP = 0, recPos = 0, recPerf = 0, attTot = 0, attErr = 0, attBlo = 0, attPerf = 0, bloTot = 0, bloErr = 0, bloPerf = 0
        playerList.map((player, i) => {
            totPoints += player[4]
            bp += player[5]
            wl += player[6]
            serTot += player[7]
            serErr += player[8]
            serMedium += player[9]
            serMinus += player[10]
            serPlus += player[11]
            serOVP += player[12]
            serAce += player[13]
            recTot += player[14]
            recErr += player[15]
            recOVP += player[16]
            recPos += parseInt(player[17].split(' ')[0]) / 100 * player[14]
            recPerf += parseInt(player[18].split(' ')[0]) / 100 * player[14]
            attTot += player[19]
            attErr += player[20]
            attBlo += player[21]
            attPerf += player[22]
            bloTot += player[25]
            bloErr += player[26]
            bloPerf += player[27]
        })
        const totalRow = ['-', '-', '-', '-', totPoints, bp, wl, serTot, serErr, serMedium, serMinus, serPlus, serOVP, serAce,
         recTot, recErr, recOVP, Math.round(recPos / recTot * 100) + ' %', Math.round(recPerf / recTot * 100) + ' %',
        attTot,attErr,attBlo,attPerf, Math.round(attPerf/attTot * 100) + ' %', Math.round((attPerf-attBlo-attErr) / attTot * 100) + ' %']
        this.setState({ totalRow: totalRow })
    }
    loadAllPlayers() {
        this.setState({ isAllPlayersLoaded: true, filteredPlayers: this.state.allPlayers, filteredNameList: this.state.nameList })
    }
    renderTopContent(title, category, pointName, pointNameDescription) {
        return (
            <Card>
                <Card.Title>{title}</Card.Title>
                <Card.Divider />
                {
                    this.state.[category].map((player, index) => {
                        return (
                            <View key={index} style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ marginRight: 'auto' }}>{index + 1}. {player.name} ({player.team}) </Text>
                                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold' }}>{player.[pointName]}  </Text>
                                    <Text>{pointNameDescription}</Text>
                                </View>
                            </View>
                        )
                    })
                }
            </Card >
        )
    }
    renderTop() {
        return (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true}>
                <View style={{ width: windowWidth }}>
                    {this.renderTopContent('Most points', 'topTotalPoints', 'totalPoints', 'points')}
                </View>
                <View style={{ width: windowWidth }}>
                    {this.renderTopContent('Most aces', 'topTotalAces', 'totalAces', 'aces')}
                </View>
                <View style={{ width: windowWidth }}>
                    {this.renderTopContent('Most kills', 'topTotalKills', 'totalKills', 'kills')}
                </View>
                <View style={{ width: windowWidth }}>
                    {this.renderTopContent('Most blocks', 'topTotalBlocks', 'totalBlocks', 'blocks')}
                </View>
            </ScrollView>
        )
    }
    renderSearch() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <Text style={{ fontSize: 30, textAlign: 'center', paddingTop: 20, paddingBottom: 20 }}>Stats</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginLeft: 15, marginBottom: 0 }}>Filter by player: </Text>
                    <Text style={{ marginRight: windowWidth / 5, marginBottom: 0, marginLeft: 'auto' }}>Filter by team: </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        style={{ borderColor: 'lightgrey', borderWidth: 1, margin: 15, marginTop: 0, width: windowWidth / 2, height: 30 }}
                        onChangeText={(text) => this.newSearch(text, false)}
                        value={this.state.searchText}
                    />
                    <Picker
                        selectedValue={this.state.chosenTeam}
                        style={{ height: 30, width: windowWidth / 2.5, margin: 15, marginTop: 0 }}
                        onValueChange={(itemValue, itemIndex) => {
                            this.newSearch(itemValue, true)
                        }}>
                        {this.state.listOfTeams.map((team, i) => {
                            return (
                                <Picker.Item
                                    label={team}
                                    value={team}
                                    key={i}
                                />
                            )
                        })}
                    </Picker>
                </View>
            </View>
        )
    }
    render() {
        return (
            <ScrollView style={styles.container} stickyHeaderIndices={[2]} ref={(ref) => this.myScroll = ref}>
                {this.renderTop()}
                {this.renderSearch()}
                <TableWrapper style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                    <ScrollView style={styles.dataWrapper, { flexDirection: 'row' }} horizontal={true} ref={'topScroll'} showsHorizontalScrollIndicator={false}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#f1f8ff' }} >
                            <Row data={['']} widthArr={[colWidth]} textStyle={styles.header} />
                            <Row data={['Name']} widthArr={[colWidth]} textStyle={pageStyles.tableText} />
                        </Table>
                        <Table borderStyle={pageStyles.borderStyle}>
                            <Row data={tableheader} widthArr={widthHeader} textStyle={styles.header} />
                            <Row data={tableHead} widthArr={widthMainHead} textStyle={pageStyles.tableText} />
                        </Table>
                    </ScrollView>
                </TableWrapper>
                <View style={{ marginBottom: windowHeight / 2 }}>
                    <TableWrapper style={{ flexDirection: 'row' }}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#f1f8ff' }} >
                            <Col
                                data={this.state.filteredNameList}
                                width={colWidth}
                                textStyle={pageStyles.tableText}
                            />
                        </Table>
                        <ScrollView style={styles.dataWrapper, { flexDirection: 'row' }} horizontal={true} ref={'bottomScroll'}
                            onScroll={(e) => this.refs.topScroll.scrollTo({ x: e.nativeEvent.contentOffset.x, animated: false })}
                        >
                            <Table borderStyle={pageStyles.borderStyle}>
                                {
                                    this.state.filteredPlayers.map((rowData, index) => (
                                        <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={widthMainHead}
                                            style={[styles.row, index % 2 && pageStyles.tableBackgroundColor]}
                                            textStyle={pageStyles.tableText}
                                        />
                                    ))
                                }
                                <Row
                                    data={this.state.totalRow}
                                    widthArr={widthMainHead}
                                    textStyle={pageStyles.tableText}
                                />
                            </Table>
                        </ScrollView>
                    </TableWrapper>
                    {this.state.isAllPlayersLoaded ?
                        <TouchableOpacity
                            onPress={() => this.myScroll.scrollTo({ x: 0, y: windowHeight / 1.8, animated: true })}
                        >
                            <Icon name="arrow-up-circle-outline" size={30} style={{ textAlign: 'center', marginTop: 10 }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => this.loadAllPlayers()}
                        >
                            <Icon name="arrow-down-circle-outline" size={30} style={{ textAlign: 'center', marginTop: 10 }} />
                        </TouchableOpacity>
                    }

                </View>
            </ScrollView >
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
export default StatsScreen;