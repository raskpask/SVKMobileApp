import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, TouchableOpacity, TouchableOpacityBase } from 'react-native';
import { Card } from 'react-native-elements'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }
    componentDidMount() {
        this.getCurrentMatches()
    }
    getCurrentMatches() {
        axios.get('http://svbf-web.dataproject.com/CompetitionHome.aspx?ID=174')
            .then(function (response) {
                this.extractCurrentMatches(response.data)
            }.bind(this));

    }
    extractCurrentMatches(data) {
        const listOfGames = data.split('"DIV_Match_Main"')
        let matches = []
        for (let i = 1; i < listOfGames.length; i++) {
            matches.push(this.extractOneMatch(listOfGames[i]))
        }
        console.log(matches)
    }
    extractOneMatch(matchString) {
        let date
        let time
        if (matchString.split('"LB_DataOra"').length < 2) {
            time = matchString.split('"LB_Ora_Today"')[1].split('>')[1].split('<')[0]
            date = new Date().toISOString().slice(0, 10)
        } else {
            const dateAndTime = matchString.split('"LB_DataOra"')[1].split('>')[1].split('<')[0]
            date = dateAndTime.split(' - ')[0]
            time = dateAndTime.split(' - ')[1]
        }
        let streamLink
        if (matchString.split('"DIV_Stream"')[1]?.length == undefined) {
            streamLink = undefined
        } else {
            streamLink = 'http://svbf-web.dataproject.com/' + matchString.split('"DIV_Stream"')[1].split('&quot;')[1].split('&quot;')
        }

        return {
            date: date,
            time: time,
            streamLink: streamLink,
            homeLogo: matchString.split('"IMG_Home"')[1].split('src="')[1].split('"')[0],
            guestLogo: matchString.split('"IMG_Guest"')[1].split('src="')[1].split('"')[0],
            homeTeam: matchString.split('"Label1"')[1].split('>')[1].split('<')[0],
            guestTeam: matchString.split('"Label2"')[1].split('>')[1].split('<')[0],
            homeSets: matchString.split('"Label3"')[1]?.split('>')[1].split('<')[0],
            guestSets: matchString.split('"Label4"')[1]?.split('>')[1].split('<')[0],
            set1: matchString.split('"Label5"')[1]?.split('>')[1].split('<')[0],
            set2: matchString.split('"Label7"')[1]?.split('>')[1].split('<')[0],
            set3: matchString.split('"Label9"')[1]?.split('>')[1].split('<')[0],
            set4: matchString.split('"Label11"')[1]?.split('>')[1].split('<')[0],
            set5: matchString.split('"Label13"')[1]?.split('>')[1].split('<')[0],
        }
    }
    renderTopComponent() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ width: '50%' }} onPress={() => this.props.navigation.navigate('Live TV')}>
                    <Card>
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>Live TV</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '50%' }} onPress={() => this.props.navigation.navigate('Livescore')}>
                    <Card >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>Livescore</Text>
                    </Card>
                </TouchableOpacity>
            </View >
        )
    }
    renderCurrentGames() {
        return (
            <View>

            </View>
        )
    }
    render() {
        return (
            <View>
                {this.renderTopComponent()}
                {this.renderCurrentGames()}
            </View>
        )
    }
}
export default Home;