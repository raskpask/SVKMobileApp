import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'react-native-axios';
import { Table, Row, Col, TableWrapper } from 'react-native-table-component';
import { ExtractSets, ExtractPointsInSets, ExtractHomeTeam, ExtractGuestTeam } from '../model/webScraping/gamestats'
import AsyncStorage from '@react-native-async-storage/async-storage';

import pageStyles from '../style/basicStyle';

const colWidth = 130

class GameStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableheader: ['', 'SET', 'Points', 'Serve', 'Reception', 'Attack', 'Block'],
            tableHead: ['Nr', '1', '2', '3', '4', '5', 'Tot', 'BP', 'V-L', 'V/L', 'Tot', 'Miss', 'Ace', 'Tot', 'Miss', 'Pos %', 'Perf %', 'Tot', 'Miss', 'Block', 'Perf', 'Perf %', 'Eff %', 'Points'],
            widthMain: [40, 25, 25, 25, 25, 25, 45, 45, 45, 45, 45, 55, 40, 45, 55, 55, 65, 45, 60, 55, 50, 65, 60, 65],
            widthHeader: [40, 125, 180, 140, 220, 335, 65],

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

            gameResultSets: '0-0',
            gameResultPoints: '(0-0, 0-0, 0-0)'
        }
    }
    async componentDidMount() {
        const response = await axios.get(this.props.route.params.tempMatch.statsLink)
        this.extractGameStats(response.data)
    }
    extractGameStats(data) {
        const homeTeam = ExtractHomeTeam(data)
        const guestTeam = ExtractGuestTeam(data)
        if (this.state.activeTeam == this.props.route.params.tempMatch.homeTeam) {
            this.setState({ tableData: homeTeam.playersHome, totalRow: homeTeam.totalHome, numberActiveTeam: homeTeam.nameHomeTeam })
        } else {
            this.setState({ tableData: guestTeam.playersGuest, totalRow: guestTeam.totalGuest, numberActiveTeam: guestTeam.nameGuestTeam })
        }
        this.setState({ gameResultSets: ExtractSets(data), gameResultPoints: ExtractPointsInSets(data) })
        this.setState({ playersHome: homeTeam.playersHome, playersGuest: guestTeam.playersGuest, totalGuest: guestTeam.totalGuest, totalHome: homeTeam.totalHome, nameHomeTeam: homeTeam.nameHomeTeam, nameGuestTeam: guestTeam.nameGuestTeam })

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
                                    <Row data={this.state.totalRow} widthArr={this.state.widthMain} textStyle={pageStyles.totalRow} />
                                </Table>
                            </ScrollView>
                        </TableWrapper>
                    </View>
                    <View >
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            {this.state.gameResultSets}
                        </Text>
                        <Text style={{ textAlign: 'center' }}>
                            {this.state.gameResultPoints}
                        </Text>
                    </View>
                </ScrollView>
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