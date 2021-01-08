import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, Image, ScrollView, Button, RefreshControl, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MatchCard from './matchCard';

const keyForMatchesMen = 'matchesMen'
const keyForMatchesWomen = 'matchesWomen'

class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAlert: false,
            matches: [[]],
            matchesM: [[]],
            matchesW: [[]],
            listOfTeams: ['All Teams', 'Sollentuna VK', 'Falkenberg VBK', 'Habo WK', 'Lunds VK', 'Örkelljung VK', 'RIG Falköping', 'Södertälje VK', 'Uppsala VBS', 'Vingåkers VK', 'Hylte/Halmstad', 'Floby VK'],
            listOfTeamsM: ['All Teams', 'Sollentuna VK', 'Falkenberg VBK', 'Habo WK', 'Lunds VK', 'Örkelljung VK', 'RIG Falköping', 'Södertälje VK', 'Uppsala VBS', 'Vingåkers VK', 'Hylte/Halmstad', 'Floby VK'],
            listOfTeamsW: ['All Teams', 'Sollentuna VK ', 'Engelholm VBS', 'Örebro Volley', 'Lunds VK ', 'Värnamo VBA', 'RIG Falköping ', 'Gislaved VK', 'Linköping VC', 'IKSU Volleyboll', 'Lindesberg Volley', 'Hylte/Halmstad '],
            chosenTeam: 'All Teams',
            chosenLeague: 'League',
            refreshButtonColor: buttonColor,
            refreshing: false,
            loading: true,
        };
    }
    scrollToIndex(index) {
        try {
            this.myScroll.scrollTo({ x: 0, y: 89.125 * index, animated: true })
        } catch (error) {
            console.warn(error)
        }
    }
    async componentDidMount() {
        try {
            const matchesM = JSON.parse(await AsyncStorage.getItem(keyForMatchesMen))
            const matchesW = JSON.parse(await AsyncStorage.getItem(keyForMatchesWomen))

            if (matchesM != null && matchesW != null) {
                if (this.state.chosenLeague == 'Men' || this.state.chosenLeague == 'League') {
                    this.setState({ matches: matchesM })
                } else {
                    this.setState({ matches: matchesW })
                }
                this.setState({ matchesM: matchesM, matchesW: matchesW })
            }
        } catch (e) {
            console.warn(e)
        }
        this.getMatches()
    }
    async getMatches() {
        await axios.get('http://svbf-web.dataproject.com/CompetitionMatches.aspx?ID=174&PID=266')
            .then(function (response) {
                const matches = this.extractMatches(response.data)
                try {
                    AsyncStorage.setItem(keyForMatchesMen, JSON.stringify(matches))
                } catch (e) {
                    console.warn(e)
                }
                if (this.state.chosenLeague != 'Women')
                    this.setState({ matches: matches })
                this.setState({ matchesM: matches })
            }.bind(this));
        await axios.get('http://svbf-web.dataproject.com/CompetitionMatches.aspx?ID=175&PID=247')
            .then(function (response) {
                const matchesW = this.extractMatches(response.data)
                try {
                    AsyncStorage.setItem(keyForMatchesWomen, JSON.stringify(matchesW))
                } catch (e) {
                    console.warn(e)
                }
                if (this.state.chosenLeague == 'Women')
                    this.setState({ matches: matchesW })
                this.setState({ matchesW: matchesW })
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
        let streamLink
        if (matchString.split('onclick="f_OpenInPlayer')[1]?.length == undefined) {
            if (matchString.split('onclick="f_OpenStreaming')[1]?.length == undefined) {
                streamLink = undefined
            } else {
                streamLink = 'http://svbf-web.dataproject.com/' + matchString.split('onclick="f_OpenStreaming')[1].split('&quot;')[1].split('&quot;')[0]
            }
        } else {
            streamLink = 'http://svbf-web.dataproject.com/' + matchString.split('onclick="f_OpenInPlayer')[1].split('&quot;')[1].split('&quot;')[0]
        }

        const homeLogo = matchString.split('Home" class="Calendar_DIV_TeamLogo DIV_TeamLogo_Box" style="background-image:url(&quot;')[1].split('&quot;')[0]
        const guestLogo = matchString.split('Guest" class="Calendar_DIV_TeamLogo DIV_TeamLogo_Box" style="background-image:url(&quot;')[1].split('&quot;')[0]
        const homeTeam = this.getTeamFromLogo(homeLogo.split('_')[1].split('.')[0])
        const guestTeam = this.getTeamFromLogo(guestLogo.split('_')[1].split('.')[0])
        const matchData = {
            homeSets: matchString.split('WonSetHome" value="')[1].split('"')[0],
            guestSets: matchString.split('WonSetGuest" value="')[1].split('"')[0],
            statsLink: 'http://svbf-web.dataproject.com/' + statsLink,
            streamLink: streamLink,

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
                return 'Hylte/Halmstad '
                break;
            case '1281':
                return 'Hylte/Halmstad'
                break;
            case '1123':
                return 'Lunds VK '
                break;
            case '1282':
                return 'Lunds VK'
                break;
            case '1124':
                return 'Örebro Volley'
                break;
            case '1125':
                return 'RIG Falköping '
                break;
            case '1284':
                return 'RIG Falköping'
                break;
            case '1121':
                return 'Lindesberg Volley'
                break;
            case '1126':
                return 'Sollentuna VK '
                break;
            case '1286':
                return 'Sollentuna VK'
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
        this.setState({ chosenLeague: league, chosenTeam: 'All Teams' })
        if (league != 'Women') {
            this.setState({ matches: this.state.matchesM, listOfTeams: this.state.listOfTeamsM })
        } else {
            this.setState({ matches: this.state.matchesW, listOfTeams: this.state.listOfTeamsW })
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
                            <MatchCard key={i} navigation={this.props.navigation} match={match} isdisabled={isdisabled} isCalendar={true} />
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
                {this.state.loading ?
                    <ActivityIndicator size="large" color='lightgrey' style={{ margin: 10 }} /> :
                    this.renderCards()
                }
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