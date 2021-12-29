import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, ScrollView, Button, RefreshControl, Dimensions, SegmentedControlIOSComponent } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Dimensions from 'dime'
import { GetTeamFromLogo } from '../model/teamHelper';
import { GetListOfTeams } from '../data/listOfTeams';

import MatchCard from './matchCard';
import { GetKey } from '../model/storageKeys';

const keyForMatchesMen = 'matchesMen'
const keyForMatchesWomen = 'matchesWomen'

const windowWidth = Dimensions.get('window').width;

const urlWomenMatches = 'https://svbf-web.dataproject.com/CompetitionMatches.aspx?ID=263&PID=350'
const urlMenMatches = 'https://svbf-web.dataproject.com/CompetitionMatches.aspx?ID=264&PID=351'


class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAlert: false,
            matches: [[]],
            matchesM: [[]],
            matchesW: [[]],
            listOfTeams: ['All Teams'],
            listOfTeamsM: [],
            listOfTeamsW: [],
            chosenTeam: 'All Teams',
            chosenLeague: 'League',
            refreshButtonColor: buttonColor,
            refreshing: false,
            isLoading: true,
            settings: {}
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
        const settings = JSON.parse(await AsyncStorage.getItem(GetKey('settings')))
        const team = settings.standardTeam.split('(M').length > 1 ? settings.standardTeam.split('(')[0].trim() : settings.standardTeam.split('(')[0]
        this.setState({ chosenTeam: team })
        this.setState({ chosenLeague: settings.league })
        this.setState({ settings: settings })
        if (this.state.settings.league === 'Men') {
            this.setState({ listOfTeams: GetListOfTeams('Men', true) })
        } else {
            this.setState({ listOfTeams: GetListOfTeams('Women', true) })
        }
        this.setState({
            listOfTeamsM: GetListOfTeams('Men', true),
            listOfTeamsW: GetListOfTeams('Women', true)
        })
        try {
            const matchesM = JSON.parse(await AsyncStorage.getItem(keyForMatchesMen))
            const matchesW = JSON.parse(await AsyncStorage.getItem(keyForMatchesWomen))

            if (matchesM != null || matchesW != null) {
                if (settings.league === 'Men') {
                    this.setState({ matches: matchesM })
                } else {
                    this.setState({ matches: matchesW })
                }
                this.setState({ matchesM: matchesM, matchesW: matchesW })
            }
        } catch (e) {
            console.warn(e)
        }
        await this.getMatches()
        if (team != null) {
            this.renderSpecificTeam(team)
            this.setState({ chosenTeam: team })
        }
    }
    async getMatches() {
        await axios.get(urlMenMatches)
            .then(function (response) {
                const matches = this.extractMatches(response.data)
                try {
                    AsyncStorage.setItem(keyForMatchesMen, JSON.stringify(matches))
                } catch (e) {
                    console.warn(e)
                }
                if (this.state.chosenLeague != 'Women' || this.state.settings.league == 'Men')
                    this.setState({ matches: matches })
                this.setState({ matchesM: matches })
            }.bind(this));
        await axios.get(urlWomenMatches)
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


        this.setState({ isLoading: false })
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
        const homeTeam = GetTeamFromLogo(homeLogo.split('_')[1].split('.')[0])
        const guestTeam = GetTeamFromLogo(guestLogo.split('_')[1].split('.')[0])
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
    renderSpecificTeam(chosenTeam) {
        if (this.state.chosenLeague != 'Women') {
            let matchesOfTeam = []
            this.state.matchesM.forEach(match => {
                if (match.homeTeam == chosenTeam || match.guestTeam == chosenTeam || chosenTeam == 'All Teams')
                    matchesOfTeam.push(match)
            });
            this.scrollToIndex(0)
            this.setState({ matches: matchesOfTeam })

        } else {
            let matchesOfTeam = []
            this.state.matchesW.forEach(match => {
                if (match.homeTeam == chosenTeam || match.guestTeam == chosenTeam || chosenTeam == 'All Teams')
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
        this.renderSpecificTeam(this.state.chosenTeam)
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
                        enabled={!this.state.isLoading}
                        selectedValue={this.state.chosenTeam}
                        style={{ marginTop: Platform.OS === 'ios' ? -100 : 0, height: 50, width: windowWidth / 3.2 }}
                        onValueChange={(itemValue) => {
                            this.setState({ chosenTeam: itemValue })
                            this.renderSpecificTeam(itemValue)
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
                        enabled={!this.state.isLoading}
                        selectedValue={this.state.chosenLeague}
                        style={{ marginTop: Platform.OS === 'ios' ? -100 : 0, height: 50, width: windowWidth / 3.2 }}
                        onValueChange={(itemValue, itemIndex) => {
                            if (this.state.chosenTeam != 'Men')
                                this.changeLeague(itemValue)
                        }}>
                        <Picker.Item label={'Men'} value={'Men'} />
                        <Picker.Item label={'Women'} value={'Women'} />

                    </Picker>
                </View>
                <View style={{ marginRight: 15, width: windowWidth / 5 }}>
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
                {this.state.isLoading ?
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