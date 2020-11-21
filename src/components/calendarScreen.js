import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Button, RefreshControl } from 'react-native';
import { Card } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-community/async-storage';


class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: {},
            showAlert: false,
            matches: [[]],
            listOfTeams: ['All Teams', 'Sollentuna VK', 'Falkenberg', 'Habo WK', 'Lunds VK', 'Örkelljung VK', 'RIG Falköping', 'Södertälje VK', 'Uppsala VBS', 'Vingåkers VK'],
            chosenTeam: 'All Teams',
            refreshButtonColor: buttonColor,
            refreshing: false
        };
    }
    scrollToIndex(index) {
        this.myScroll.scrollTo({ x: 0, y: 89.125 * index, animated: true })
    }
    componentDidMount() {
        AsyncStorage.getItem('SCHEDULE', (err, result) => {
            this.setState({ matches: JSON.parse(result) })
        });
        this.getMatches()

    }
    async getMatches() {
        axios.get('http://svbf-web.dataproject.com/CompetitionMatches.aspx?ID=174&PID=266')
            .then(function (response) {
                const matches = this.extractMatches(response.data)
                AsyncStorage.setItem(
                    'SCHEDULE',
                    JSON.stringify(matches),
                );
                this.setState({ matches: matches })
            }.bind(this));
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
            case '1278':
                return 'Falkenberg VBK'
                break;
            case '1279':
                return 'Floby VK'
                break;
            case '1280':
                return 'Habo WK'
                break;
            case '1281':
                return 'Hylte/Halmstad'
                break;
            case '1282':
                return 'Lunds VK'
                break;
            case '1283':
                return 'Örkelljung VK'
                break;
            case '1284':
                return 'RIG Falköping'
                break;
            case '1285':
                return 'Södertälje VK'
                break;
            case '1286':
                return 'Sollentuna VK'
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
        AsyncStorage.getItem('SCHEDULE', (err, result) => {
            if (this.state.chosenTeam == 'All Teams')
                this.setState({ matches: JSON.parse(result) })
            else {
                const allMatches = JSON.parse(result)
                let matchesOfTeam = []
                allMatches.forEach(match => {
                    if (match.homeTeam == this.state.chosenTeam || match.guestTeam == this.state.chosenTeam)
                        matchesOfTeam.push(match)
                });
                this.scrollToIndex(0)
                this.setState({ matches: matchesOfTeam })
            }
        });
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
                                        {/* <Text>{match.homeTeam}</Text> */}
                                        <View
                                            style={{
                                                flexDirection: 'column',

                                            }}>
                                            <Text style={{ textAlign: 'center', fontWeight: "bold" }}>{match.homeWonSet} - {match.guestWonSet} </Text>
                                            <Text style={{ maxWidth: 60, textAlign: 'center', fontSize: 10 }}>{match.arena}</Text>
                                        </View>

                                        {/* <Text>{match.guestTeam}</Text> */}
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
                        style={{ height: 50, width: 200 }}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ chosenTeam: itemValue })
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
                <View style={{ marginRight: 15, width: 150 }}>
                    <Button
                        onPress={() => this.scrollToIndex(this.getTodayScrollIndex())}
                        title="Go to today"
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