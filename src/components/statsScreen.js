import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row, Col, TableWrapper } from 'react-native-table-component';
import { Card, ListItem } from 'react-native-elements'

const allStatsKey = 'allStats'
const allNamesKey = 'allNames'
const topKey = 'allTops'
const colWidth = 130
const windowWidth = Dimensions.get('window').width;
import pageStyles from '../style/basicStyle';

class StatsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allPlayers: [],
            filteredPlayers: [],

            nameList: [],
            filteredNameList: [],

            topTotalPoints: [],
            topTotalAces: [],
            topTotalKills: [],
            topTotalBlocks: [],

            tableheader: ['', 'Total', 'Serve', 'Reception', 'Attack', 'Block'],
            tableHead: ['Nr', 'Team', 'Mat', 'Set', 'Pts', 'BP', 'W-L', 'Tot', 'Err', '!', '-', '+', 'OVP', 'Ace', 'Tot', 'Err', 'OVP', 'Pos %', 'Perf %', 'Tot', 'Err', 'Block', 'Perf', 'Perf %', 'Eff %', 'Tot', 'Err', 'Perf %', 'Points'],
            widthMainHead: [30, 100, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 55, 55, 55, 40, 55, 45, 60, 65, 45, 45, 60, 55],
            widthMain: [30, 25, 25, 25, 25, 25, 35, 35, 35, 45, 45, 40, 45, 45, 55, 55, 45, 45, 55, 40, 55, 60, 55],
            widthHeader: [130, 225, 315, 245, 320, 205],
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
        this.setState({ filteredPlayers: playerList.slice(0, 30), filteredNameList: nameList.slice(0, 30) })

        // this.setState({ filteredPlayers: playerList, filteredNameList: nameList })
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
    render() {
        return (
            <ScrollView style={styles.container} stickyHeaderIndices={[1]}>
                {this.renderTop()}
                <TableWrapper style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                    <ScrollView style={styles.dataWrapper, { flexDirection: 'row' }} horizontal={true} ref={'topScroll'} showsHorizontalScrollIndicator={false}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#f1f8ff' }} >
                            <Row data={['']} widthArr={[colWidth]} textStyle={styles.header} />
                            <Row data={['Name']} widthArr={[colWidth]} textStyle={pageStyles.tableText} />
                        </Table>
                        <Table borderStyle={pageStyles.borderStyle}>
                            <Row data={this.state.tableheader} widthArr={this.state.widthHeader} textStyle={styles.header} />
                            <Row data={this.state.tableHead} widthArr={this.state.widthMainHead} textStyle={pageStyles.tableText} />
                        </Table>
                    </ScrollView>
                </TableWrapper>
                <View>
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
                                {/* <Row data={this.state.tableheader} widthArr={this.state.widthHeader} textStyle={styles.header} />
                                    <Row data={this.state.tableHead} widthArr={this.state.widthMainHead} textStyle={pageStyles.tableText} /> */}
                                {
                                    this.state.filteredPlayers.map((rowData, index) => (
                                        <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={this.state.widthMainHead}
                                            style={[styles.row, index % 2 && pageStyles.tableBackgroundColor]}
                                            textStyle={pageStyles.tableText}
                                        />
                                    ))
                                }
                            </Table>
                        </ScrollView>
                    </TableWrapper>
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