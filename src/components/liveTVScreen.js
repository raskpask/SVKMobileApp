import React, { Component } from 'react';
import { View, Text } from 'react-native';
import axios from 'react-native-axios';

class LiveTVScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matchesToday:[],
            comingMatches:[],
            previousMatches:[]
        }
    }
    componentDidMount() {
        this.getAllLivestreams()
    }
    async getAllLivestreams() {
        await axios.get('http://svbf-web.dataproject.com/MainStreaming.aspx')
            .then(function (response) {
                console.log(this.extractAllGames(response.data))
                // this.setState({ currentMatchesM: currentMatchesM })
                // if (this.state.league == 'Men' || this.state.league == 'MenStandard') {
                //     this.setState({ currentMatches: currentMatchesM })
                // }
                // try {
                //     AsyncStorage.setItem(keyCurrentMatchesMen, JSON.stringify(currentMatchesM))
                // } catch (e) {
                //     console.log(e)
                // }

            }.bind(this));
    }
    extractAllGames(data) {
        const listOfCategories = data.split('"streaming-title">')
        return {
            gamesToday: this.extractCategory(listOfCategories[1]),
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
        const homeSet = matchString.split('StreamingReplay_ctrl1_Label1')[1] ? matchString.split('StreamingReplay_ctrl1_Label1')[1].split('>')[1].split('<')[0] : 0
        const guestSet = matchString.split('StreamingReplay_ctrl1_Label3')[1] ? matchString.split('StreamingReplay_ctrl1_Label3')[1].split('>')[1].split('<')[0] : 0
        return {
            homeLogo: matchString.split('team-logo home')[1].split('&quot;')[1].split('&quot;')[0],
            guestLogo: matchString.split('team-logo guest')[1].split('&quot;')[1].split('&quot;')[0],
            homeTeam: matchString.split('team-home')[1].split('>')[1].split('<')[0],
            guestTeam: matchString.split('team-guest')[1].split('>')[1].split('<')[0],
            time: matchString.split('DataOra')[1].split(' - ')[1].split('<')[0],
            date: matchString.split('DataOra')[1].split('>')[1].split(' - ')[0],
            streamingLink: streamingLink,
            homeSet: homeSet,
            gusetSet: guestSet,
        }
    }
    render() {

        return (
            <View>
                <Text>Live TV</Text>
            </View>
        )
    }
}

export default LiveTVScreen;