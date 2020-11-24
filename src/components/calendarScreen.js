import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Button, RefreshControl } from 'react-native';
import { Card } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker';
import axios from 'react-native-axios';


class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAlert: false,
            matches: [[]],
            matchesM: [[]],
            matchesW: [[]],
            listOfTeams: ['All Teams', 'Sollentuna VK (M)', 'Falkenberg VBK', 'Habo WK', 'Lunds VK (M)', 'Örkelljung VK', 'RIG Falköping (M)', 'Södertälje VK', 'Uppsala VBS', 'Vingåkers VK', 'Hylte/Halmstad (M)', 'Floby VK'],
            listOfTeamsM: ['All Teams', 'Sollentuna VK (M)', 'Falkenberg VBK', 'Habo WK', 'Lunds VK (M)', 'Örkelljung VK', 'RIG Falköping (M)', 'Södertälje VK', 'Uppsala VBS', 'Vingåkers VK', 'Hylte/Halmstad (M)', 'Floby VK'],
            listOfTeamsW: ['All Teams', 'Sollentuna VK (W)', 'Engelholm VBS', 'Örebro Volley', 'Lunds VK (W)', 'Värnamo VBA', 'RIG Falköping (W)', 'Gislaved VK', 'Linköping VC', 'IKSU Volleyboll', 'Lindesberg Volley', 'Hylte/Halmstad (W)'],
            chosenTeam: 'All Teams',
            chosenLeague: 'League',
            refreshButtonColor: buttonColor,
            refreshing: false,
            loading: true,
        };
    }
    scrollToIndex(index) {
        this.myScroll.scrollTo({ x: 0, y: 89.125 * index, animated: true })
    }
    componentDidMount() {
        this.getMatches()
    }
    async getMatches() {
        axios.get('http://svbf-web.dataproject.com/CompetitionMatches.aspx?ID=174&PID=266')
            .then(function (response) {
                const matches = this.extractMatches(response.data)
                this.setState({ matches: matches, matchesM: matches })
            }.bind(this));
        axios.get('http://svbf-web.dataproject.com/CompetitionMatches.aspx?ID=175&PID=247')
            .then(function (response) {
                this.setState({ matchesW: this.extractMatches(response.data) })
            }.bind(this));
        this.setState({ loading: false })



    }
    extractMatches(data) {
        let matches = []
        let matchesStringList = data.split('$HF_WonSetHome')
        for (let i = 1; i < matchesStringList.length; i++) {
            matches.push(this.extractMatch(matchesStringList[i], i))
        }
        return matches
    }
    extractMatch(matchString, index) {
        const statsLinkStringList = matchString.split('onclick="javascript:window.location=')[1].split('>')[0].split('&')
        let statsLink = ''
        for (let i = 1; i < statsLinkStringList.length - 1; i++) {
            statsLink += statsLinkStringList[i].split(';')[1]
            if (i != statsLinkStringList.length - 1) {
                statsLink += '&';
            }
        }
        const streamingLink = matchString.split('<a href="')[1]?.split('" target="_blank"')[0] ? matchString.split('<a href="')[1].split('" target="_blank"')[0] : ""
        const homeLogo = matchString.split('Home" class="Calendar_DIV_TeamLogo DIV_TeamLogo_Box" style="background-image:url(&quot;')[1].split('&quot;')[0]
        const guestLogo = matchString.split('Guest" class="Calendar_DIV_TeamLogo DIV_TeamLogo_Box" style="background-image:url(&quot;')[1].split('&quot;')[0]
        const homeTeam = this.getTeamFromLogo(homeLogo.split('_')[1].split('.')[0])
        const guestTeam = this.getTeamFromLogo(guestLogo.split('_')[1].split('.')[0])
        const matchData = {
            homeWonSet: matchString.split('WonSetHome" value="')[1].split('"')[0],
            guestWonSet: matchString.split('WonSetGuest" value="')[1].split('"')[0],
            streamingLink: streamingLink,
            statsLink: 'http://svbf-web.dataproject.com/' + statsLink,

            date: matchString.split('DataOra"')[1].split('>')[1].split(' -')[0],
            time: matchString.split('DataOra"')[1].split('>')[1].split(' - ')[1].split('<')[0],
            arena: matchString.split('Palasport">')[1].split('</span>')[0],

            homeTeam: homeTeam,
            homeLogo: homeLogo,
            guestTeam: guestTeam,
            guestLogo: guestLogo,

            ref1: matchString.split('Arbitro1">')[1].split('</span>')[0],
            ref2: matchString.split('Arbitro2">')[1].split('</span>')[0],
        }
        return matchData
    }

    getTeamFromLogo(logoID) {
        switch (logoID) {
            case '1117':
                return 'Engelholm VBS'
                break;
            case '1120':
                return 'IKSU Volleyboll'
                break;
            case '1127':
                return 'Värnamo VBA'
                break;
            case '1119':
                return 'Hylte/Halmstad (W)'
                break;
            case '1281':
                return 'Hylte/Halmstad (M)'
                break;
            case '1123':
                return 'Lunds VK (W)'
                break;
            case '1282':
                return 'Lunds VK (M)'
                break;
            case '1124':
                return 'Örebro Volley'
                break;
            case '1125':
                return 'RIG Falköping (W)'
                break;
            case '1284':
                return 'RIG Falköping (M)'
                break;
            case '1121':
                return 'Lindesberg Volley'
                break;
            case '1126':
                return 'Sollentuna VK (W)'
                break;
            case '1286':
                return 'Sollentuna VK (M)'
                break;
            case '1122':
                return 'Linköping VC'
                break;
            case '1118':
                return 'Gislaved VK'
                break;
            case '1278':
                return 'Falkenberg VBK'
                break;
            case '1279':
                return 'Floby VK'
                break;
            case '1280':
                return 'Habo WK'
                break;
            case '1283':
                return 'Örkelljung VK'
                break;
            case '1285':
                return 'Södertälje VK'
                break;
            case '1287':
                return 'Uppsala VBS'
                break;
            case '1288':
                return 'Vingåkers VK'
                break;
            default:
                return ''
        }
    }
    getTodayScrollIndex() {
        let index = 0
        for (const [i, match] of this.state.matches.entries()) {
            if (Date.parse(new Date().toJSON().slice(0, 10)) <= Date.parse(match.date)) {
                index = i
                break;
            }
        }
        return index
    }
    renderSpecificTeam() {
        if (this.state.chosenLeague != 'Women') {

            let matchesOfTeam = []
            this.state.matchesM.forEach(match => {
                if (match.homeTeam == this.state.chosenTeam || match.guestTeam == this.state.chosenTeam)
                    matchesOfTeam.push(match)
            });
            this.scrollToIndex(0)
            this.setState({ matches: matchesOfTeam })

        } else {
            let matchesOfTeam = []
            this.state.matchesW.forEach(match => {
                if (match.homeTeam == this.state.chosenTeam || match.guestTeam == this.state.chosenTeam)
                    matchesOfTeam.push(match)
            });
            this.scrollToIndex(0)
            this.setState({ matches: matchesOfTeam })
        }
    }
    changeLeague(league) {
        if (!this.state.loading) {
            this.setState({ chosenLeague: league, chosenTeam: 'All Teams' })
            if (league != 'Women') {
                this.setState({ matches: this.state.matchesM, listOfTeams: this.state.listOfTeamsM })
            } else {
                this.setState({ matches: this.state.matchesW, listOfTeams: this.state.listOfTeamsW })
            }
        }
    }
    async refreshPage() {
        this.setState({ refreshing: true })
        await this.getMatches()
        this.renderSpecificTeam()
        this.setState({ refreshing: false })

    }
    renderCards() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        onRefresh={() => this.refreshPage()}
                        refreshing={this.state.refreshing}
                    />
                }
                ref={(ref) => this.myScroll = ref}
            >
                {
                    this.state.matches.map((match, i) => {
                        let isdisabled = false
                        if (match.homeWonSet == '0' && match.guestWonSet == '0')
                            isdisabled = true
                        return (
                            <TouchableOpacity
                                disabled={isdisabled}
                                key={i}
                                onPress={() => this.props.navigation.navigate('Match statistics', { tempMatch: match })}
                            >
                                <Card>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                        <Text style={{ maxWidth: 80, textAlign: 'center' }}>{match.date} {match.time}</Text>
                                        <Image source={{ uri: match.homeLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                                        <View
                                            style={{
                                                flexDirection: 'column',

                                            }}>
                                            <Text style={{ textAlign: 'center', fontWeight: "bold" }}>{match.homeWonSet} - {match.guestWonSet} </Text>
                                            <Text style={{ maxWidth: 60, textAlign: 'center', fontSize: 10 }}>{match.arena}</Text>
                                        </View>
                                        <Image source={{ uri: match.guestLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        )
                    })
                }
            </ ScrollView >
        )
    }
    renderTop() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <View style={{ marginLeft: 15 }}>
                    <Picker
                        selectedValue={this.state.chosenTeam}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ chosenTeam: itemValue })
                            if (this.state.chosenTeam != 'All Teams')
                                this.renderSpecificTeam()
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
                <View >
                    <Picker
                        enabled={!this.state.loading}
                        selectedValue={this.state.chosenLeague}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => {
                            if (this.state.chosenTeam != 'Men')
                                this.changeLeague(itemValue)
                        }}>
                        <Picker.Item label={'Men'} value={'Men'} />
                        <Picker.Item label={'Women'} value={'Women'} />

                    </Picker>
                </View>
                <View style={{ marginRight: 15, width: 70 }}>
                    <Button
                        onPress={() => this.scrollToIndex(this.getTodayScrollIndex())}
                        title="Today"
                        color={buttonColor}
                    />
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderTop()}
                {this.renderCards()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
});


// Standard color of page
const buttonColor = '#0095ff'

export default Calendar;