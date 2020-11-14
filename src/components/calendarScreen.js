import React, { Component } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Card } from 'react-native-elements'
import { Agenda } from 'react-native-calendars';
import axios from 'react-native-axios';

class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: {},
            showAlert: false,
            matches: []
        };
    }
    async componentDidMount() {
        await axios.get('http://svbf-web.dataproject.com/CompetitionMatches.aspx?ID=174&PID=266')
            .then(function (response) {
                // this.convertMacthesToCalendarItems(this.extractMatches(response.data))
                this.setState({ matches: this.extractMatches(response.data) })
                this.loadItems()
            }.bind(this));
        // console.log(this.state.matches)
    }
    extractMatches(data) {
        let matches = []
        let matchesStringList = data.split('$HF_WonSetHome')
        // console.log(matchesStringList[1])
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
        }
        const streamingLink = matchString.split('<a href="')[1]?.split('" target="_blank"')[0] ? matchString.split('<a href="')[1].split('" target="_blank"')[0] : ""
        const matchData = {
            homeWonSet: matchString.split('WonSetHome" value="')[1].split('"')[0],
            guestWonSet: matchString.split('WonSetGuest" value="')[1].split('"')[0],
            streamingLink: streamingLink,
            statsLink: 'http://svbf-web.dataproject.com/' + statsLink,

            date: matchString.split('DataOra"')[1].split('>')[1].split(' -')[0],
            time: matchString.split('DataOra"')[1].split('>')[1].split(' - ')[1].split('<')[0],
            arena: matchString.split('Palasport">')[1].split('</span>')[0],

            homeTeam: matchString.split('<div class="t-col t-col-5" style="text-align: left;">')[1].split('<span')[1].split('>')[1].split('<')[0],
            homeLogo: matchString.split('Home" class="Calendar_DIV_TeamLogo DIV_TeamLogo_Box" style="background-image:url(&quot;')[1].split('&quot;')[0],
            guestTeam: matchString.split('<div class="t-col t-col-5" style="text-align: right;">')[1].split('<span')[1].split('>')[1].split('<')[0],
            guestLogo: matchString.split('Guest" class="Calendar_DIV_TeamLogo DIV_TeamLogo_Box" style="background-image:url(&quot;')[1].split('&quot;')[0],

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
                onPress={() => this.props.navigation.navigate('Match statistics',{gameLink: item.tempMatch.statsLink})}
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
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Agenda
                    items={this.state.items}
                    ref={(agenda) => { this.agenda = agenda; }}
                    selected = {'2020-09-26'}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    onRefresh={() => console.log('refreshing...')}
                    firstDay={1}
                // pastScrollRange={50}
                // futureScrollRange={100}
                // renderItem={this.renderItem}
                />
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