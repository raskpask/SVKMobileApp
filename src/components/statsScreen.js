import React, { Component } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row, Col, TableWrapper } from 'react-native-table-component';
import { Card } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { formatName } from '../model/formatName';

const allStatsKeyM = 'allStatsM'
const allStatsKeyW = 'allStatsW'
const allNamesKeyM = 'allNamesM'
const allNamesKeyW = 'allNamesW'
const topKeyM = 'allTopsM'
const topKeyW = 'allTopsW'
const colWidth = 130
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import pageStyles from '../style/basicStyle';

const widthMainHead = [40, 100, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 55, 45, 45, 45, 45, 45, 55, 55, 65, 55, 40, 55, 45, 60, 65, 45, 45, 60, 55]
const widthHeader = [140, 225, 370, 400, 320, 205]
const tableheader = ['', 'Total', 'Serve', 'Reception', 'Attack', 'Block']
const listOfTeamsMen = ['All teams', 'Sollentuna', 'Vingåker', 'Lund', 'Södertelge', 'Hylte Halmstad', 'Floby', 'Habo', 'Örkelljunga', 'Uppsala', 'RIG Falköping', 'Falkenberg']
const listOfTeamsWomen = ['All teams', 'Sollentuna', 'Värnamo', 'Lund', 'Gislaved', 'Hylte Halmstad', 'Linköping', 'Lindesberg', 'Örebro', 'Engelholm', 'RIG Falköping', 'IKSU']

class StatsScreen extends Component {
    constructor(props) {
        super(props);
        this.tableHead = [
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(0) }) }}><Text style={{ textAlign: 'center' }}>Nr</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(1) }) }}><Text style={{ textAlign: 'center' }}>Team</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(2) }) }}><Text style={{ textAlign: 'center' }}>Mts</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(3) }) }}><Text style={{ textAlign: 'center' }}>Set</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(4) }) }}><Text style={{ textAlign: 'center' }}>Pts</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(5) }) }}><Text style={{ textAlign: 'center' }}>BP</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(6) }) }}><Text style={{ textAlign: 'center' }}>W-L</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(7) }) }}><Text style={{ textAlign: 'center' }}>Tot</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(8) }) }}><Text style={{ textAlign: 'center' }}>Err</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(9) }) }}><Text style={{ textAlign: 'center' }}>!</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(10) }) }}><Text style={{ textAlign: 'center' }}>-</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(11) }) }}><Text style={{ textAlign: 'center' }}>+</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(12) }) }}><Text style={{ textAlign: 'center' }}>OVP</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(13) }) }}><Text style={{ textAlign: 'center' }}>Ace</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(14) }) }}><Text style={{ textAlign: 'center' }}>Eff %</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(15) }) }}><Text style={{ textAlign: 'center' }}>Tot</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(16) }) }}><Text style={{ textAlign: 'center' }}>Err</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(17) }) }}><Text style={{ textAlign: 'center' }}>OVP</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(18) }) }}><Text style={{ textAlign: 'center' }}>-</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(19) }) }}><Text style={{ textAlign: 'center' }}>!</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(20) }) }}><Text style={{ textAlign: 'center' }}>Pos %</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(21) }) }}><Text style={{ textAlign: 'center' }}>Perf %</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(22) }) }}><Text style={{ textAlign: 'center' }}>Eff %</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(23) }) }}><Text style={{ textAlign: 'center' }}>Tot</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(24) }) }}><Text style={{ textAlign: 'center' }}>Err</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(25) }) }}><Text style={{ textAlign: 'center' }}>Block</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(26) }) }}><Text style={{ textAlign: 'center' }}>Perf</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(27) }) }}><Text style={{ textAlign: 'center' }}>Perf %</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(28) }) }}><Text style={{ textAlign: 'center' }}>Eff %</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(29) }) }}><Text style={{ textAlign: 'center' }}>Tot</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(30) }) }}><Text style={{ textAlign: 'center' }}>Err</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(31) }) }}><Text style={{ textAlign: 'center' }}>Perf %</Text></TouchableOpacity>,
            <TouchableOpacity onPress={() => { this.setState({ filteredPlayers: this.sortList(32) }) }}><Text style={{ textAlign: 'center' }}>Points</Text></TouchableOpacity>
        ]
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
        }
    }
    async componentDidMount() {
        let playerListM = []
        let playerListW = []
        let nameListM = []
        let nameListW = []
        let tops = {}
        try {
            if (this.state.chosenLeague !== 'Women') {
                tops = JSON.parse(await AsyncStorage.getItem(topKeyM))
                this.setState({ topTotalPoints: tops.points, topTotalKills: tops.kills, topTotalBlocks: tops.blocks, topTotalAces: tops.aces })
            } else {
                tops = JSON.parse(await AsyncStorage.getItem(topKeyW))
                this.setState({ topTotalPoints: tops.points, topTotalKills: tops.kills, topTotalBlocks: tops.blocks, topTotalAces: tops.aces })
            }
            playerListM = JSON.parse(await AsyncStorage.getItem(allStatsKeyM))
            nameListM = JSON.parse(await AsyncStorage.getItem(allNamesKeyM))
            playerListW = JSON.parse(await AsyncStorage.getItem(allStatsKeyW))
            nameListW = JSON.parse(await AsyncStorage.getItem(allNamesKeyW))
        } catch (e) {
            console.warn(e)
        }
        if (playerListM !== undefined || nameListM !== undefined || playerListW !== undefined || nameListW !== undefined) {
            this.setState({ allPlayersM: playerListM, nameListM: nameListM, allPlayersW: playerListW, nameListW: nameListW })
            if (this.state.chosenLeague !== 'Women') {
                this.setState({ filteredPlayers: playerListM.slice(0, 30), filteredNameList: nameListM.slice(0, 30), allPlayers: playerListM, nameList: nameListM })
            } else {
                this.setState({ filteredPlayers: playerListW.slice(0, 30), filteredNameList: nameListW.slice(0, 30), allPlayers: playerListW, nameList: nameListW })
            }
        }
        this.setState({ isLoading: false })
        this.setTop()
        this.setData()
    }
    async setTop() {
        const playerListTotalPointsM = await this.makeRequest('PointsTot_ForAllPlayerStats DESC', '174', '266', 10)
        const playerListTotalAcesM = await this.makeRequest('ServeWin DESC', '174', '266', 10)
        const playerListTotalKillsM = await this.makeRequest('SpikeWin DESC', '174', '266', 10)
        const playerListTotalBlocksM = await this.makeRequest('BlockWin DESC', '174', '266', 10)

        const playerListTotalPointsW = await this.makeRequest('PointsTot_ForAllPlayerStats DESC', '175', '247', 10)
        const playerListTotalAcesW = await this.makeRequest('ServeWin DESC', '175', '247', 10)
        const playerListTotalKillsW = await this.makeRequest('SpikeWin DESC', '175', '247', 10)
        const playerListTotalBlocksW = await this.makeRequest('BlockWin DESC', '175', '247', 10)
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
        await axios.post('http://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData', { "startIndex": 0, "maximumRows": noOfRows, "sortExpressions": sortExpression, "filterExpressions": [], "compID": compID, "phaseID": phaseID, "playerSearchByName": "" }).then(function (response) {
            for (let i = 0; i < response.data.d.length; i++) {
                playerList.push(this.extractNameAndStats(response.data.d[i]))
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
        await axios.post('http://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData', { "startIndex": 0, "maximumRows": 148, "sortExpressions": "PointsTot_ForAllPlayerStats DESC", "filterExpressions": [], "compID": "174", "phaseID": "266", "playerSearchByName": "" }).then(function (response) {
            rawDataPlayersM = response.data.d
            for (let i = 0; i < response.data.d.length; i++) {
                playerListM.push(this.extractData(response.data.d[i]))
                nameListM.push(formatName(response.data.d[i].Name, response.data.d[i].Surname))
            }
            this.setState({ allPlayersM: playerListM, nameListM: nameListM, rawDataPlayersM: rawDataPlayersM })
        }.bind(this));
        await axios.post('http://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData', { "startIndex": 0, "maximumRows": 149, "sortExpressions": "PointsTot_ForAllPlayerStats DESC", "filterExpressions": [], "compID": "175", "phaseID": "247", "playerSearchByName": "" }).then(function (response) {
            rawDataPlayersW = response.data.d
            for (let i = 0; i < response.data.d.length; i++) {
                playerListW.push(this.extractData(response.data.d[i]))
                nameListW.push(formatName(response.data.d[i].Name, response.data.d[i].Surname))
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
        return {
            name: data.Name + ' ' + data.Surname,
            data: [
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
                totalServ > 20 ? Math.round((data.ServeWin * 2 + data.ServePlus + data.ServeHP * 2 - data.ServeMinus - data.ServeErr * 2) / totalServ * 100) + ' %' : '-',
                totalRec,
                data.RecErr,
                data.RecHP,
                data.RecMinus,
                data.RecEx,
                (data.RecPlus + data.RecWin) / totalRec * 100 ? Math.round((data.RecPlus + data.RecWin) / totalRec * 100) + ' %' : '-',
                (data.RecWin) / totalRec * 100 ? Math.round((data.RecWin) / totalRec * 100) + ' %' : '-',
                totalRec > 20 ? Math.round((data.RecWin * 2 + data.RecPlus - data.RecMinus - data.RecErr * 2 - data.RecHP * 2) / totalRec * 100) + ' %' : '-',
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
        if ((text === '' || text === 'All teams') && this.state.chosenTeam === 'All teams' && this.state.nameList !== undefined) {
            this.setState({ filteredNameList: this.state.nameList.slice(0, 30), filteredPlayers: this.state.allPlayers.slice(0, 30), isAllPlayersLoaded: false })
            return
        }
        let nameList = []
        let playerList = []
        this.state.rawDataPlayers.map((player, i) => {
            let playerSearchString = player.Team
            if (!isTeam && text === 'All teams') {
                playerSearchString += ' ' + player.Name + ' ' + player.Surname
            }
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
        this.extractTotalrow(playerList, nameList)
    }
    extractTotalrow(playerList, nameList) {
        let totPoints = 0, bp = 0, wl = 0, serTot = 0, serErr = 0, serMedium = 0, serMinus = 0, serPlus = 0, serOVP = 0, serAce = 0, recTot = 0, recErr = 0, recOVP = 0, recMed = 0, recMin = 0, recPos = 0, recPerf = 0, attTot = 0, attErr = 0, attBlo = 0, attPerf = 0, bloTot = 0, bloErr = 0, bloPerf = 0
        playerList.map((player, i) => {
            totPoints += player.data[4]
            bp += player.data[5]
            wl += player.data[6]
            serTot += player.data[7]
            serErr += player.data[8]
            serMedium += player.data[9]
            serMinus += player.data[10]
            serPlus += player.data[11]
            serOVP += player.data[12]
            serAce += player.data[13]
            recTot += player.data[15]
            recErr += player.data[16]
            recOVP += player.data[17]
            recMin += player.data[18]
            recMed += player.data[19]
            recPos += player.data[20] === '-' ? 0 : Math.round(parseInt(player.data[20].split(' ')[0]) / 100 * player.data[15])
            recPerf += player.data[21] === '-' ? 0 : Math.round(parseInt(player.data[21].split(' ')[0]) / 100 * player.data[15])
            attTot += player.data[23]
            attErr += player.data[24]
            attBlo += player.data[25]
            attPerf += player.data[26]
            bloTot += player.data[29]
            bloErr += player.data[30]
            bloPerf += player.data[32]
        })
        const totalRow = ['-', '-', '-', '-', totPoints, bp, wl, serTot, serErr, serMedium, serMinus, serPlus, serOVP, serAce, (serTot > 20) ? Math.round((serAce * 2 + serOVP * 2 + serPlus - serMinus - serErr * 2) / serTot * 100) + ' %' : '-',
            recTot, recErr, recOVP, recMin, recMed, Math.round(recPos / recTot * 100) + ' %', Math.round(recPerf / recTot * 100) + ' %', (recTot > 20) ? Math.round((recPerf + recPos - recMin - recOVP * 2 - recErr * 2) / recTot * 100) + ' %' : '-',
            attTot, attErr, attBlo, attPerf, Math.round(attPerf / attTot * 100) + ' %', Math.round((attPerf - attBlo - attErr) / attTot * 100) + ' %',
            bloTot, bloErr, Math.round(bloPerf / bloTot * 100) + ' %', bloPerf
        ]
        nameList[nameList.length] = 'Total'
        this.setState({ totalRow: totalRow, filteredNameList: nameList })
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
                    newList = this.state.filteredPlayers.sort((a, b) => (parseInt(a.data[index].split(' ').length > 1 ? a.data[index].split(' ')[0] : -1000) < parseInt(b.data[index].split(' ').length > 1 ? b.data[index].split(' ')[0] : -1000)) ? 1 :
                        ((parseInt(b.data[index].split(' ').length > 1 ? b.data[index].split(' ')[0] : -1000) < parseInt(a.data[index].split(' ').length > 1 ? a.data[index].split(' ')[0] : -1000)) ? -1 : 0)); // Descending sort

                } else {
                    newList = this.state.filteredPlayers.sort((a, b) => (a.data[index] > b.data[index]) ? 1 : ((b.data[index] > a.data[index]) ? -1 : 0)); // Descending sort
                }
                this.setState({ sortOrderDescending: false })
            } else {
                if (procentList.includes(index)) {
                    newList = this.state.filteredPlayers.sort((a, b) => (parseInt(a.data[index].split(' ')[0]) < parseInt(b.data[index].split(' ')[0])) ? 1 : ((parseInt(b.data[index].split(' ')[0]) < parseInt(a.data[index].split(' ')[0])) ? -1 : 0)); // ASC sort
                } else {
                    newList = this.state.filteredPlayers.sort((a, b) => (a.data[index] < b.data[index]) ? 1 : ((b.data[index] < a.data[index]) ? -1 : 0)); // ASC sort
                }
                this.setState({ sortOrderDescending: true })
            }
        } else {
            if (procentList.includes(index)) {
                newList = this.state.filteredPlayers.sort((a, b) => (parseInt(a.data[index].split(' ').length > 1 ? a.data[index].split(' ')[0] : -1000) < parseInt(b.data[index].split(' ').length > 1 ? b.data[index].split(' ')[0] : -1000)) ? 1 :
                    ((parseInt(b.data[index].split(' ').length > 1 ? b.data[index].split(' ')[0] : -1000) < parseInt(a.data[index].split(' ').length > 1 ? a.data[index].split(' ')[0] : -1000)) ? -1 : 0)); // Descending sort
            } else {
                newList = this.state.filteredPlayers.sort((a, b) => (a.data[index] < b.data[index]) ? 1 : ((b.data[index] < a.data[index]) ? -1 : 0)); // Descending sort
            }
            this.setState({ sortOrderDescending: true, lastSortedByID: index })
        }
        return newList
    }
    changeLeague(league) {
        if (!this.state.isLoading) {
            this.setState({ chosenLeague: league, isLoading: true, searchText: '', chosenTeam: 'All teams' })
            if (league != 'Women') {
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
                        clearButtonMode="while-editing"
                        style={{ borderColor: 'lightgrey', borderWidth: 1, margin: 15, marginTop: 0, width: windowWidth / 2, height: 30 }}
                        onChangeText={(text) => this.newSearch(text, false)}
                        value={this.state.searchText}
                        editable={!this.state.isLoading}
                    />
                    <Picker
                        enabled={!this.state.isLoading}
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
    renderPickLeague() {
        return (
            <Picker
                enabled={!this.state.isLoading}
                selectedValue={this.state.chosenLeague}
                style={{ height: 50 }}
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
            nameList.push(formatName(rowData.name.split(' ')[0], rowData.name.split(' ')[1]))
        ))
        return (
            <ScrollView style={styles.container} stickyHeaderIndices={[3]} ref={(ref) => this.myScroll = ref}>
                {this.renderPickLeague()}
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