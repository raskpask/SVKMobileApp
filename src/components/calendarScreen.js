import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Card } from 'react-native-elements'
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-community/async-storage';


class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: {},
            showAlert: false,
            matches: [[]]
        };
    }
    async componentDidMount() {
        // await axios.get('http://svbf-web.dataproject.com/CompetitionMatches.aspx?ID=174&PID=266')
        //     .then(function (response) {
        //         // this.convertMacthesToCalendarItems(this.extractMatches(response.data))
        //         this.setState({ matches: this.extractMatches(response.data) })
        //         this.loadItems()
        //     }.bind(this));
        AsyncStorage.getItem('SCHEDULE', (err, result) => {
            this.setState({ matches: JSON.parse(result) })
            this.loadItems()
        });
        axios.get('http://svbf-web.dataproject.com/CompetitionMatches.aspx?ID=174&PID=266')
            .then(function (response) {
                const matches = this.extractMatches(response.data)
                AsyncStorage.setItem(
                    'SCHEDULE',
                    JSON.stringify(matches),
                );
                this.setState({ matches: matches })
                // this.convertMacthesToCalendarItems(this.extractMatches(response.data))
                // this.setState({ matches: this.extractMatches(response.data) })
            }.bind(this));
    }
    extractMatches(data) {
        let matches = []
        let matchesStringList = data.split('$HF_WonSetHome')
        for (let i = 1; i < matchesStringList.length; i++) {
            matches.push(this.extractMatch(matchesStringList[i]))
        }
        return matches
    }
    extractMatch(matchString) {
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
    convertMacthesToCalendarItems(matches) {
        let prevMatch = matches[0]
        let tempIdenticalDateMatches = []
        tempIdenticalDateMatches.push(prevMatch)
        for (let i = 1; i < matches.length; i++) {
            if (prevMatch.date == matches[i].date) {
                tempIdenticalDateMatches.push(matches[i])
                prevMatch = matches[i]
            } else {
                this.state.items[prevMatch.date] = []
                for (let j = 0; j < tempIdenticalDateMatches.length; j++) {
                    let tempMatch = tempIdenticalDateMatches.pop()
                    // console.log(tempMatch)
                    this.state.items[prevMatch.date].push({
                        name: tempMatch.homeTeam + '-' + tempMatch.guestTeam,
                        height: Math.max(50, Math.floor(Math.random() * 150))
                    })
                }
                prevMatch = matches[i]
            }
            if (matches.length == i + 1) {
                this.state.items[prevMatch.date] = []
                for (let j = 0; j < tempIdenticalDateMatches.length; j++) {
                    let tempMatch = tempIdenticalDateMatches.pop()
                    this.state.items[prevMatch.date].push({
                        name: tempMatch.homeTeam + '-' + tempMatch.guestTeam,
                        height: Math.max(50, Math.floor(Math.random() * 150))
                    })
                }
            }
            // console.log(this.state.items)
        }
        // return items
    }

    showAlert = () => {
        this.setState({
            showAlert: true
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });
    };

    loadItems() {
        setTimeout(() => {
            const matches = this.state.matches
            for (let i = 1; i < matches.length; i++) {
                if (!(this.state.items[matches[i].date])) {

                    this.state.items[matches[i].date] = []
                }
                this.state.items[matches[i].date].push({ tempMatch: matches[i] })
            }
            const newItems = {};
            Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
            this.setState({
                items: newItems
            });
        }, 1000);

        for (let i = -150; i < 150; i++) {
            const time = new Date().getTime() + i * 24 * 60 * 60 * 1000;
            const strTime = this.timeToString(time);
            if (!this.state.items[strTime]) {
                this.state.items[strTime] = [];
            }
        }

    }
    renderItem(item) {

        return (
            <TouchableOpacity
                style={{ marginRight: 10, marginTop: 17 }}
                onPress={() => this.props.navigation.navigate('Match statistics', { tempMatch: item.tempMatch })}
            >
                <Card>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Image source={{ uri: item.tempMatch.homeLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                        <Text>{item.tempMatch.homeWonSet} - {item.tempMatch.guestWonSet}</Text>
                        <Image source={{ uri: item.tempMatch.guestLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}>
            </View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }
    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
    getTeamFromLogo(logoID) {
        switch (logoID) {
            case '1278':
                return 'Falkenberg'
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
    renderCards() {
        return (
            <ScrollView>
                {this.state.matches.map((match, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => this.props.navigation.navigate('Match statistics', { tempMatch: match })}
                        >
                            <Card>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{ maxWidth: 80, textAlign: 'center'}}>{match.date} {match.time}</Text>
                                    <Image source={{ uri: match.homeLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                                    {/* <Text>{match.homeTeam}</Text> */}
                                    <Text>{match.homeWonSet} - {match.guestWonSet}</Text>
                                    {/* <Text>{match.guestTeam}</Text> */}
                                    <Image source={{ uri: match.guestLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                                </View>
                            </Card>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* <Agenda
                    items={this.state.items}
                    ref={(agenda) => { this.agenda = agenda; }}
                    selected={'2020-09-26'}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    onRefresh={() => console.log('refreshing...')}
                    firstDay={1}
                /> */}
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
export default Calendar;