import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, ScrollView, Button, RefreshControl, Dimensions, SegmentedControlIOSComponent } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Dimensions from 'dime'

import { GetListOfTeams } from '../data/listOfTeams';
import { ExtractMatches } from '../model/webScraping/calendar';

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
        if (this.myScroll !== undefined) {
            try {
                this.myScroll.scrollTo({ x: 0, y: 89.125 * index, animated: true })
            } catch (error) {
                console.warn(error)
            }
        }
    }
    async componentDidMount() {
        await this.setContent()
        await this.getMatches()
    }

    async setContent() {
        const settings = JSON.parse(await AsyncStorage.getItem(GetKey('settings')))
        const team = settings.standardTeam.split('(M').length > 1 ? settings.standardTeam.split('(')[0].trim() : settings.standardTeam.split('(')[0]
        this.setState({ chosenTeam: team, chosenLeague: settings.league, settings: settings })
        if (settings.league === 'Men') {
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
                    this.setState({ matches: this.getMatchesFromSpecificTeam(matchesM, team) })
                } else {
                    this.setState({ matches: this.getMatchesFromSpecificTeam(matchesW, team) })
                }
                this.setState({ matchesM: matchesM, matchesW: matchesW })
            }
        } catch (e) {
            console.warn(e)
        }
        this.setState({isLoading: false})
    }
    async getMatches() {
        await axios.get(urlMenMatches)
            .then(function (response) {
                const matches = ExtractMatches(response.data)
                try {
                    AsyncStorage.setItem(keyForMatchesMen, JSON.stringify(matches))
                } catch (e) {
                    console.warn(e)
                }
                this.setState({ matchesM: matches })
            }.bind(this));
        await axios.get(urlWomenMatches)
            .then(function (response) {
                const matchesW = ExtractMatches(response.data)
                try {
                    AsyncStorage.setItem(keyForMatchesWomen, JSON.stringify(matchesW))
                } catch (e) {
                    console.warn(e)
                }
                this.setState({ matchesW: matchesW })
            }.bind(this));
        this.setState({ isLoading: false })
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
    getMatchesFromSpecificTeam(matches, chosenTeam) {
        let matchesOfTeam = []
        matches.forEach(match => {
            if (match.homeTeam == chosenTeam || match.guestTeam == chosenTeam || chosenTeam == 'All Teams')
                matchesOfTeam.push(match)
        });
        return matchesOfTeam
    }
    renderSpecificTeam(chosenTeam) {
        if (this.state.chosenLeague != 'Women') {
            const matchesOfTeam = this.getMatchesFromSpecificTeam(this.state.matchesM, chosenTeam)
            this.scrollToIndex(0)
            this.setState({ matches: matchesOfTeam })
        } else {
            const matchesOfTeam = this.getMatchesFromSpecificTeam(this.state.matchesW, chosenTeam)
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