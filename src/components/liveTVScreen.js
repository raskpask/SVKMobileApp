import React, { Component } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import axios from 'react-native-axios';

import MatchCard from './matchCard';

class LiveTVScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matchesToday: [],
            comingMatches: [],
            previousMatches: []
        }
    }
    componentDidMount() {
        this.getAllLivestreams()
    }
    async getAllLivestreams() {
        await axios.get('http://svbf-web.dataproject.com/MainStreaming.aspx')
            .then(function (response) {
                const matches = this.extractAllGames(response.data)
                if (matches.matchesToday == undefined) {
                    this.setState({ matchesToday: [[]], previousMatches: matches.playedGames, comingMatches: matches.commingMatches })
                } else {
                    this.setState({ matchesToday: matches.matchesToday, previousMatches: matches.playedGames, comingMatches: matches.commingMatches })
                }
            }.bind(this));
    }
    extractAllGames(data) {
        const listOfCategories = data.split('"streaming-title">')
        return {
            matchesToday: this.extractCategory(listOfCategories[1]),
            commingMatches: this.extractCategory(listOfCategories[2]),
            playedGames: this.extractCategory(listOfCategories[3])
        }
    }
    extractCategory(dataString) {
        const listOfMatches = dataString.split('DIV_MatchStreaming"')
        let matches = []
        for (let i = 1; i < listOfMatches.length; i++) {
            matches.push(this.extractMatch(listOfMatches[i]))
        }
        return matches
    }
    extractMatch(matchString) {
        const streamingLink = matchString.split('f_OpenInPlayer')[1] ? matchString.split('f_OpenInPlayer')[1].split('&quot;')[1].split('&quot;')[0] : ''
        const homeSet = matchString.split('_Label1"')[1] ? matchString.split('_Label1"')[1].split('>')[1].split('<')[0] : 0
        const guestSet = matchString.split('_Label3"')[1] ? matchString.split('_Label3"')[1].split('>')[1].split('<')[0] : 0
        return {
            homeLogo: matchString.split('team-logo home')[1].split('&quot;')[1].split('&quot;')[0],
            guestLogo: matchString.split('team-logo guest')[1].split('&quot;')[1].split('&quot;')[0],
            homeTeam: matchString.split('team-home')[1].split('>')[1].split('<')[0],
            guestTeam: matchString.split('team-guest')[1].split('>')[1].split('<')[0],
            time: matchString.split('DataOra')[1].split(' - ')[1].split('<')[0],
            date: matchString.split('DataOra')[1].split('>')[1].split(' - ')[0],
            streamLink: 'http://svbf-web.dataproject.com/' + streamingLink,
            homeSets: homeSet,
            guestSets: guestSet,
        }
    }
    renderMatches() {
        return (
            <ScrollView>
                <Text style={styles.h1}>Matches today</Text>
                {this.state.matchesToday.map((match, i) => {
                    if (match.length < 1) {
                        return (
                            <Text key={i} style={styles.text}>No livestreamed games today</Text>
                        )
                    } else {
                        return (
                            <MatchCard key={i} navigation={this.props.navigation} match={match} isdisabled={true} />
                        )
                    }
                })}
                <Text style={styles.h1PaddingTop}>Upcoming matches</Text>
                {this.state.comingMatches.map((match, i) => {
                    return (
                        <MatchCard key={i} navigation={this.props.navigation} match={match} isdisabled={true} />
                    )
                })}
                <Text style={styles.h1PaddingTop}>Previous matches</Text>
                {this.state.previousMatches.map((match, i) => {
                    return (
                        <MatchCard key={i} navigation={this.props.navigation} match={match} isdisabled={true} />
                    )
                })}
            </ScrollView>
        )
    }
    render() {
        return (
            <View>
                {this.renderMatches()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    h1: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        marginLeft: 20,
        marginRight: 20,
    },
    h1PaddingTop: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        paddingTop: 40,
        borderBottomWidth: 1,
        marginLeft: 20,
        marginRight: 20,
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
    }

});
export default LiveTVScreen;