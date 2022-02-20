import React, { Component } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TextInput, Dimensions, TouchableOpacity, Platform } from 'react-native';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row, Col, TableWrapper } from 'react-native-table-component';
import { Card } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { FormatName } from '../model/formatName';
import { ExtractNameAndStats, ExtractData, ExtractTotalrow } from '../model/webScraping/stats';
import { GetKey } from '../model/storageKeys';
import { GetTableHead } from '../model/statsTableHead';
import BestTeam from './bestTeam';

const allStatsKeyM = 'allStatsM'
const allStatsKeyW = 'allStatsW'
const allNamesKeyM = 'allNamesM'
const allNamesKeyW = 'allNamesW'
const topKeyM = 'allTopsM'
const topKeyW = 'allTopsW'
const colWidth = 150
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import pageStyles from '../style/basicStyle';
import { GetDreamTeamSeason } from '../model/dreamTeam';

const widthMainHead = [40, 100, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 55, 45, 45, 45, 45, 45, 55, 55, 65, 55, 40, 55, 45, 60, 65, 45, 45, 60, 55]
const widthHeader = [140, 225, 370, 400, 320, 205]
const tableheader = ['', 'Total', 'Serve', 'Reception', 'Attack', 'Block']
const listOfTeamsMen = ['All teams', 'Sollentuna', 'Vingåker', 'Lund', 'Södertelge', 'Hylte Halmstad', 'Floby', 'Habo', 'Örkelljunga', 'Uppsala', 'RIG Falköping', 'Falkenberg']
const listOfTeamsWomen = ['All teams', 'Sollentuna', 'Värnamo', 'Lund', 'Gislaved', 'Hylte Halmstad', 'Linköpings VC', 'Lindesberg', 'Örebro', 'Engelholm', 'RIG Falköping', 'IKSU']

const compIdMen = '264'
const compIdWomen = '263'

class StatsScreen extends Component {
    constructor(props) {
        super(props);
        this.tableHead = GetTableHead()
        this.state = {
            isAllPlayersLoaded: false,
            isLoading: true,
            showTotalRow: false,
            totalRow: [],
            chosenLeague: 'Men',

            lastSortedByID: 0,
            sortOrderDescending: true,

            rawDataPlayers: [],
            filteredPlayers: [],
            filteredNameList: [],
            allPlayers: [],
            nameList: [],

            rawDataPlayersM: [],
            rawDataPlayersW: [],
            allPlayersM: [],
            allPlayersW: [],
            nameListM: [],
            nameListW: [],

            topTotalPoints: [],
            topTotalAces: [],
            topTotalKills: [],
            topTotalBlocks: [],

            topTotalPointsM: [],
            topTotalAcesM: [],
            topTotalKillsM: [],
            topTotalBlocksM: [],

            topTotalPointsW: [],
            topTotalAcesW: [],
            topTotalKillsW: [],
            topTotalBlocksW: [],

            searchText: "",
            chosenTeam: "All teams",
            listOfTeams: ['All teams', 'Sollentuna', 'Vingåker', 'Lund', 'Södertelge', 'Hylte Halmstad', 'Floby', 'Habo', 'Örkelljunga', 'Uppsala', 'RIG Falköping', 'Falkenberg'],
            settings: {}
        }
    }
    async componentDidMount() {
        await this.setContent()
        this.setTop()
        this.setData()
    }
    async setContent() {
        const settings = JSON.parse(await AsyncStorage.getItem(GetKey('settings')))
        this.setState({ settings: settings, chosenLeague: settings.league })
        let playerListM = []
        let playerListW = []
        let nameListM = []
        let nameListW = []
        let tops = {}
        try {
            if (settings.league !== 'Women') {
                tops = JSON.parse(await AsyncStorage.getItem(topKeyM))
                if (tops !== null)
                    this.setState({ topTotalPoints: tops.points, topTotalKills: tops.kills, topTotalBlocks: tops.blocks, topTotalAces: tops.aces })
            } else {
                tops = JSON.parse(await AsyncStorage.getItem(topKeyW))
                if (tops !== null)
                    this.setState({ topTotalPoints: tops.points, topTotalKills: tops.kills, topTotalBlocks: tops.blocks, topTotalAces: tops.aces })
            }
            playerListM = JSON.parse(await AsyncStorage.getItem(allStatsKeyM))
            nameListM = JSON.parse(await AsyncStorage.getItem(allNamesKeyM))
            playerListW = JSON.parse(await AsyncStorage.getItem(allStatsKeyW))
            nameListW = JSON.parse(await AsyncStorage.getItem(allNamesKeyW))
        } catch (e) {
            console.warn(e)
        }
        if (playerListM !== undefined && nameListM !== undefined && playerListM !== null && playerListW !== undefined && nameListW !== undefined) {
            this.setState({ allPlayersM: playerListM, nameListM: nameListM, allPlayersW: playerListW, nameListW: nameListW })
            if (this.state.chosenLeague !== 'Women') {
                this.setState({ filteredPlayers: playerListM.slice(0, 30), filteredNameList: nameListM.slice(0, 30), allPlayers: playerListM, nameList: nameListM })
            } else {
                this.setState({ filteredPlayers: playerListW.slice(0, 30), filteredNameList: nameListW.slice(0, 30), allPlayers: playerListW, nameList: nameListW })
            }
        }
        this.setState({ isLoading: false })
        GetDreamTeamSeason(playerListM)
    }
    async setTop() {
        let [playerListTotalPointsM,
            playerListTotalAcesM,
            playerListTotalKillsM,
            playerListTotalBlocksM,
            playerListTotalPointsW,
            playerListTotalAcesW,
            playerListTotalKillsW,
            playerListTotalBlocksW
        ] = await Promise.all([
            this.makeRequest('PointsTot_ForAllPlayerStats DESC', compIdMen, '0', 10),
            this.makeRequest('ServeWin DESC', compIdMen, '0', 10),
            this.makeRequest('SpikeWin DESC', compIdMen, '0', 10),
            this.makeRequest('BlockWin DESC', compIdMen, '0', 10),
            this.makeRequest('PointsTot_ForAllPlayerStats DESC', compIdWomen, '0', 10),
            this.makeRequest('ServeWin DESC', compIdWomen, '0', 10),
            this.makeRequest('SpikeWin DESC', compIdWomen, '0', 10),
            this.makeRequest('BlockWin DESC', compIdWomen, '0', 10)
        ]);
        try {
            AsyncStorage.setItem(topKeyM, JSON.stringify({ points: playerListTotalPointsM, aces: playerListTotalAcesM, kills: playerListTotalKillsM, blocks: playerListTotalBlocksM }))
            AsyncStorage.setItem(topKeyW, JSON.stringify({ points: playerListTotalPointsW, aces: playerListTotalAcesW, kills: playerListTotalKillsW, blocks: playerListTotalBlocksW }))
        } catch (e) {
            console.warn(e)
        }
        if (this.state.chosenLeague !== 'Women') {
            this.setState({ topTotalPoints: playerListTotalPointsM, topTotalAces: playerListTotalAcesM, topTotalKills: playerListTotalKillsM, topTotalBlocks: playerListTotalBlocksM })
        } else {
            this.setState({ topTotalPoints: playerListTotalPointsW, topTotalAces: playerListTotalAcesW, topTotalKills: playerListTotalKillsW, topTotalBlocks: playerListTotalBlocksW })
        }
        this.setState({
            topTotalPointsM: playerListTotalPointsM, topTotalAcesM: playerListTotalAcesM, topTotalKillsM: playerListTotalKillsM, topTotalBlocksM: playerListTotalBlocksM,
            topTotalPointsW: playerListTotalPointsW, topTotalAcesW: playerListTotalAcesW, topTotalKillsW: playerListTotalKillsW, topTotalBlocksW: playerListTotalBlocksW
        })
    }
    async makeRequest(sortExpression, compID, phaseID, noOfRows) {
        let playerList = []
        await axios.post("https://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData", { "startIndex": 0, "maximumRows": noOfRows, "sortExpressions": sortExpression, "filterExpressions": [], "compID": compID, "phaseID": phaseID, "playerSearchByName": "" }).then(function (response) {
            for (let i = 0; i < response.data.d.length; i++) {
                playerList.push(ExtractNameAndStats(response.data.d[i]))
            }
        }.bind(this));
        return playerList
    }
    async setData() {
        let playerListM = []
        let playerListW = []
        let nameListM = []
        let nameListW = []
        let rawDataPlayersM = []
        let rawDataPlayersW = []
        let numberOfPlayersM = 20
        let numberOfPlayersW = 20
        try {
            numberOfPlayersM = JSON.parse(await AsyncStorage.getItem("numberOfPlayersM"))
            numberOfPlayersW = JSON.parse(await AsyncStorage.getItem("numberOfPlayersW"))
        } catch (error) {
            console.warn(error)
        }
        await axios.post("https://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData", { "startIndex": 0, "maximumRows": numberOfPlayersM, "sortExpressions": "PointsTot_ForAllPlayerStats DESC", "filterExpressions": [], "compID": compIdMen, "phaseID": "0", "playerSearchByName": "" }).then(function (response) {
            rawDataPlayersM = response.data.d
            for (let i = 0; i < response.data.d.length; i++) {
                playerListM.push(ExtractData(response.data.d[i]))
                nameListM.push(FormatName(response.data.d[i].Name, response.data.d[i].Surname))
            }
            this.setState({ allPlayersM: playerListM, nameListM: nameListM, rawDataPlayersM: rawDataPlayersM })
        }.bind(this));
        await axios.post("https://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData", { "startIndex": 0, "maximumRows": numberOfPlayersW, "sortExpressions": "PointsTot_ForAllPlayerStats DESC", "filterExpressions": [], "compID": compIdWomen, "phaseID": "0", "playerSearchByName": "" }).then(function (response) {
            rawDataPlayersW = response.data.d
            for (let i = 0; i < response.data.d.length; i++) {
                playerListW.push(ExtractData(response.data.d[i]))
                nameListW.push(FormatName(response.data.d[i].Name, response.data.d[i].Surname))
            }
            this.setState({ allPlayersW: playerListW, nameListW: nameListW, rawDataPlayersW: rawDataPlayersW })
        }.bind(this));
        try {
            AsyncStorage.setItem(allStatsKeyM, JSON.stringify(playerListM))
            AsyncStorage.setItem(allNamesKeyM, JSON.stringify(nameListM))
            AsyncStorage.setItem(allStatsKeyW, JSON.stringify(playerListW))
            AsyncStorage.setItem(allNamesKeyW, JSON.stringify(nameListW))
        } catch (e) {
            console.warn(e)
        }
        if (this.state.chosenLeague === 'Men') {
            this.setState({ filteredPlayers: playerListM.slice(0, 30), filteredNameList: nameListM.slice(0, 30), rawDataPlayers: rawDataPlayersM })
        } else {
            this.setState({ filteredPlayers: playerListW.slice(0, 30), filteredNameList: nameListW.slice(0, 30), rawDataPlayers: rawDataPlayersW })
        }
    }

    newSearch(text, isTeam) {
        if (isTeam) {
            this.setState({ chosenTeam: text })
        } else {
            this.setState({ searchText: text })
        }
        if (isTeam)
            this.filterPlayersByTeam(text)
        else
            this.filterPlayers(text)
        if (text !== 'All teams')
            this.myScroll.scrollTo({ x: 0, y: windowHeight / 1.8, animated: true })
    }
    filterPlayersByTeam(text) {
        if (text === 'All teams') {
            this.setState({ filteredNameList: this.state.nameList.slice(0, 30), filteredPlayers: this.state.allPlayers.slice(0, 30), isAllPlayersLoaded: false })
            return
        }
        let nameList = []
        let playerList = []
        this.state.allPlayers.map((player, i) => {
            if (text.trim().includes(player.data[1].trim())) {
                playerList.push(player)
                nameList.push(player.name)
            }
        })
        this.setState({ filteredNameList: nameList, filteredPlayers: playerList })
        this.extractTotalrow(playerList, nameList)
    }
    filterPlayers(text) {
        if (text !== '') {
            let nameList = []
            let playerList = []
            this.state.allPlayers.map((player, i) => {
                const playerSearchString = player.name.toLowerCase()
                if (playerSearchString.includes(text.toLowerCase())) {
                    playerList.push(this.state.allPlayers[i])
                    nameList.push(this.state.nameList[i])
                }
            })
            this.setState({ filteredNameList: nameList, filteredPlayers: playerList })
            this.extractTotalrow(playerList, nameList)
        } else {
            this.filterPlayersByTeam(this.state.chosenTeam)
        }

    }
    extractTotalrow(playerList, nameList) {
        nameList[nameList.length] = 'Total'
        this.setState({ totalRow: ExtractTotalrow(playerList), filteredNameList: nameList })
    }
    loadAllPlayers() {
        this.setState({ isAllPlayersLoaded: true, filteredPlayers: this.state.allPlayers, filteredNameList: this.state.nameList })
    }
    sortList(index) {
        const procentList = [14, 20, 21, 22, 27, 28, 31]
        let newList = []
        if (index === this.state.lastSortedByID) {
            if (this.state.sortOrderDescending) {
                if (procentList.includes(index)) {
                    newList = this.state.allPlayers.sort((a, b) => (parseInt(a.data[index].split(' ').length > 1 ? a.data[index].split(' ')[0] : -1000) < parseInt(b.data[index].split(' ').length > 1 ? b.data[index].split(' ')[0] : -1000)) ? 1 :
                        ((parseInt(b.data[index].split(' ').length > 1 ? b.data[index].split(' ')[0] : -1000) < parseInt(a.data[index].split(' ').length > 1 ? a.data[index].split(' ')[0] : -1000)) ? -1 : 0)); // Descending sort

                } else {
                    newList = this.state.allPlayers.sort((a, b) => (a.data[index] > b.data[index]) ? 1 : ((b.data[index] > a.data[index]) ? -1 : 0)); // Descending sort
                }
                this.setState({ sortOrderDescending: false })
            } else {
                if (procentList.includes(index)) {
                    newList = this.state.allPlayers.sort((a, b) => (parseInt(a.data[index].split(' ')[0]) < parseInt(b.data[index].split(' ')[0])) ? 1 : ((parseInt(b.data[index].split(' ')[0]) < parseInt(a.data[index].split(' ')[0])) ? -1 : 0)); // ASC sort
                } else {
                    newList = this.state.allPlayers.sort((a, b) => (a.data[index] < b.data[index]) ? 1 : ((b.data[index] < a.data[index]) ? -1 : 0)); // ASC sort
                }
                this.setState({ sortOrderDescending: true })
            }
        } else {
            if (procentList.includes(index)) {
                newList = this.state.allPlayers.sort((a, b) => (parseInt(a.data[index].split(' ').length > 1 ? a.data[index].split(' ')[0] : -1000) < parseInt(b.data[index].split(' ').length > 1 ? b.data[index].split(' ')[0] : -1000)) ? 1 :
                    ((parseInt(b.data[index].split(' ').length > 1 ? b.data[index].split(' ')[0] : -1000) < parseInt(a.data[index].split(' ').length > 1 ? a.data[index].split(' ')[0] : -1000)) ? -1 : 0)); // Descending sort
            } else {
                newList = this.state.allPlayers.sort((a, b) => (a.data[index] < b.data[index]) ? 1 : ((b.data[index] < a.data[index]) ? -1 : 0)); // Descending sort
            }
            this.setState({ sortOrderDescending: true, lastSortedByID: index })
        }
        if (this.state.isAllPlayersLoaded)
            return newList
        else
            return newList.splice(0, 30)
    }
    changeLeague(league) {
        if (!this.state.isLoading) {
            this.setState({ chosenLeague: league, isLoading: true, searchText: '', chosenTeam: 'All teams' })
            if (league !== 'Women') {
                this.setState({
                    filteredPlayers: this.state.allPlayersM.slice(0, 30), filteredNameList: this.state.nameListM.slice(0, 30), rawDataPlayers: this.state.rawDataPlayersM,
                    isLoading: false, allPlayers: this.state.allPlayersM, nameList: this.state.nameListM, listOfTeams: listOfTeamsMen, topTotalPoints: this.state.topTotalPointsM,
                    topTotalAces: this.state.topTotalAcesM, topTotalKills: this.state.topTotalKillsM, topTotalBlocks: this.state.topTotalBlocksM
                })
            } else {
                this.setState({
                    filteredPlayers: this.state.allPlayersW.slice(0, 30), filteredNameList: this.state.nameListW.slice(0, 30), rawDataPlayers: this.state.rawDataPlayersW,
                    isLoading: false, allPlayers: this.state.allPlayersW, nameList: this.state.nameListW, listOfTeams: listOfTeamsWomen, topTotalPoints: this.state.topTotalPointsW,
                    topTotalAces: this.state.topTotalAcesW, topTotalKills: this.state.topTotalKillsW, topTotalBlocks: this.state.topTotalBlocksW
                })
            }
        }
    }
    renderTopContent(title, category, pointName, pointNameDescription) {
        return (
            <Card>
                <Card.Title>{title}</Card.Title>
                <Card.Divider />
                {
                    this.state[category].map((player, index) => {
                        return (
                            <View key={index} style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ marginRight: 'auto' }}>{index + 1}. {player.name} ({player.team}) </Text>
                                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold' }}>{player[pointName]}  </Text>
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
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true} style={{ marginTop: Platform.OS === 'ios' ? 87 : 0 }}>
                <View style={{ width: windowWidth }}>
                    <BestTeam name='In form team' />
                </View>
                <View style={{ width: windowWidth }}>
                    <BestTeam name='Team of the season' />
                </View>
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
                        clearButtonMode="while-editing"
                        style={{ borderColor: 'lightgrey', borderWidth: 1, margin: 15, marginTop: 0, width: windowWidth / 2, height: 30 }}
                        onChangeText={(text) => this.newSearch(text, false)}
                        value={this.state.searchText}
                        editable={!this.state.isLoading}
                    />
                    <Picker
                        enabled={!this.state.isLoading}
                        selectedValue={this.state.chosenTeam}
                        style={{ height: 30, width: windowWidth / 2.5, margin: Platform.OS === 'ios' ? 0 : 15, marginTop: Platform.OS === 'ios' ? -87 : 0 }}
                        onValueChange={(itemValue, itemIndex) => {
                            if (this.state.chosenTeam !== itemValue)
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
    renderPickLeague() {
        return (
            <Picker
                enabled={!this.state.isLoading}
                selectedValue={this.state.chosenLeague}
                style={{ height: 50, marginTop: Platform.OS === 'ios' ? -87 : 0 }}
                onValueChange={(itemValue) => {
                    this.changeLeague(itemValue)
                }}>

                <Picker.Item label={'Men'} value={'Men'} />
                <Picker.Item label={'Women'} value={'Women'} />
            </Picker>
        )
    }
    render() {
        let nameList = []
        this.state.filteredPlayers.map((rowData) => (
            nameList.push(FormatName(rowData.name.split(' ')[0], rowData.name.split(' ')[1]))
        ))
        return (
            <ScrollView style={styles.container} stickyHeaderIndices={[3]} ref={(ref) => this.myScroll = ref}>
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
                            <Row data={this.tableHead} widthArr={widthMainHead} textStyle={pageStyles.tableText} />
                        </Table>
                    </ScrollView>
                </TableWrapper>
                <View style={{ marginBottom: windowHeight / 2 }}>
                    <TableWrapper style={{ flexDirection: 'row' }}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#f1f8ff' }} >
                            <Col
                                data={nameList}
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
                                            data={rowData.data}
                                            widthArr={widthMainHead}
                                            style={[styles.row, index % 2 && pageStyles.tableBackgroundColor]}
                                            textStyle={pageStyles.tableText}
                                        />
                                    ))
                                }
                                {
                                    this.state.chosenTeam === 'All teams' ?
                                        <Text></Text>
                                        :
                                        <Row
                                            data={this.state.totalRow}
                                            widthArr={widthMainHead}
                                            textStyle={{ fontWeight: 'bold', margin: 6, textAlign: 'center' }}
                                        />
                                }
                            </Table>
                        </ScrollView>
                    </TableWrapper>
                    {this.state.isLoading ?
                        <ActivityIndicator size="large" color='lightgrey' style={{ margin: 10 }} /> :
                        this.state.isAllPlayersLoaded ?
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
                {this.renderPickLeague()}
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