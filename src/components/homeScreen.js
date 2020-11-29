import React, { Component } from 'react';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, TouchableOpacity, Image, RefreshControl, TouchableOpacityBase } from 'react-native';
import { Card } from 'react-native-elements'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';

const keyCurrentMatchesMen = 'currentMatchesMen'
const keyCurrentMatchesWomen = 'currentMatchesWomen'
const keyLeague = 'league'

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMatches: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            currentMatchesM: [[]],
            currentMatchesW: [[]],
            league: '',
            refreshing: false,
            loading: true,

        };
    }
    async componentDidMount() {
        try {
            const matchesM = JSON.parse(await AsyncStorage.getItem(keyCurrentMatchesMen))
            const matchesW = JSON.parse(await AsyncStorage.getItem(keyCurrentMatchesWomen))
            const league = JSON.parse(await AsyncStorage.getItem(keyLeague))
            if (league == 'WomenStandard')
                this.setState({ league: 'Women' })
            else
                this.setState({ league: 'Men' })

            if ((this.state.league == 'Men' && !this.state.loading) || league == 'MenStandard') {
                this.setState({ currentMatches: matchesM })
            } else {
                this.setState({ currentMatches: matchesW })
            }
            this.scrollToIndex(this.getTodayScrollIndex())
        } catch (error) {
            console.log(error)
        }
        this.getCurrentMatches()
    }
    async getCurrentMatches() {
        let currentMatchesM = []
        await axios.get('http://svbf-web.dataproject.com/CompetitionHome.aspx?ID=174')
            .then(function (response) {
                currentMatchesM = this.extractCurrentMatches(response.data)
                this.setState({ currentMatchesM: currentMatchesM })
                if (this.state.league == 'Men' || this.state.league == 'MenStandard') {
                    this.setState({ currentMatches: currentMatchesM })
                }
                try {
                    AsyncStorage.setItem(keyCurrentMatchesMen, JSON.stringify(currentMatchesM))
                } catch (e) {
                    console.log(e)
                }

            }.bind(this));
        await axios.get('http://svbf-web.dataproject.com/CompetitionHome.aspx?ID=175')
            .then(function (response) {
                currentMatchesW = this.extractCurrentMatches(response.data)
                this.setState({ currentMatchesW: currentMatchesW })
                if ((this.state.league == 'Women' && !this.state.loading) || this.state.league == 'WomenStandard') {
                    this.setState({ currentMatches: currentMatchesW })
                }
                try {
                    AsyncStorage.setItem(keyCurrentMatchesWomen, JSON.stringify(currentMatchesW))
                } catch (e) {
                    console.log(e)
                }

            }.bind(this));
        this.setState({ loading: false })

    }
    extractCurrentMatches(data) {
        const listOfGames = data.split('"DIV_Match_Main"')
        let matches = []
        for (let i = 1; i < listOfGames.length; i++) {
            matches.push(this.extractOneMatch(listOfGames[i]))
        }
        return matches
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
        let statsLink = ''
        const statsLinkList = matchString.split('window.location=&#39;')[1].split('&#39;;')[0].split('amp;')
        if (statsLink != undefined && statsLink != null) {
            statsLink = 'http://svbf-web.dataproject.com/'
            statsLinkList.forEach(element => {
                statsLink += element;
            });
        }
        const matchData = {
            date: date,
            time: time,
            streamLink: streamLink,
            statsLink: statsLink,
            homeLogo: matchString.split('"IMG_Home"')[1].split('src="')[1].split('"')[0],
            guestLogo: matchString.split('"IMG_Guest"')[1].split('src="')[1].split('"')[0],
            homeTeam: matchString.split('"Label1"')[1].split('>')[1].split('<')[0],
            guestTeam: matchString.split('"Label2"')[1].split('>')[1].split('<')[0],
            homeSets: matchString.split('"Label3"')[1]?.split('>')[1].split('<')[0] ?? 0,
            guestSets: matchString.split('"Label4"')[1]?.split('>')[1].split('<')[0] ?? 0,
            set1: matchString.split('"Label5"')[1]?.split('>')[1].split('<')[0],
            set2: matchString.split('"Label7"')[1]?.split('>')[1].split('<')[0],
            set3: matchString.split('"Label9"')[1]?.split('>')[1].split('<')[0],
            set4: matchString.split('"Label11"')[1]?.split('>')[1].split('<')[0],
            set5: matchString.split('"Label13"')[1]?.split('>')[1].split('<')[0],
        }
        return (matchData)
    }
    changeLeague(league) {

        if (league != this.state.league && (league == 'Men' || league == 'Women')) {
            this.setState({ league: league })
            try {
                AsyncStorage.setItem(keyLeague, JSON.stringify(league + 'Standard'))
            } catch (error) {
                console.log(error)
            }
        }
        if (league == 'Men')
            this.setState({ currentMatches: this.state.currentMatchesM })
        else if (league == 'Women')
            this.setState({ currentMatches: this.state.currentMatchesW })
    }
    async refreshPage() {
        this.setState({ refreshing: true })
        await this.getMatches()
        this.renderSpecificTeam()
        this.setState({ refreshing: false })
    }
    scrollToIndex(index) {
        if (this.myScroll) {
            index = index ?? 0
            this.myScroll.scrollTo({ x: 0, y: 95 * (index - 1), animated: true })
        }
    }
    getTodayScrollIndex() {
        let index = 0
        for (const [i, match] of this.state.currentMatches.entries()) {
            if (Date.parse(new Date().toJSON().slice(0, 10)) <= Date.parse(match.date)) {
                index = i
                break;
            }
        }
        return index
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
            <ScrollView
                style={{ height: 400, borderWidth: 0 }}
                refreshControl={
                    <RefreshControl
                        onRefresh={() => this.refreshPage()}
                        refreshing={this.state.refreshing}
                    />
                }
                ref={(ref) => this.myScroll = ref}
            >
                {
                    this.state.currentMatches.map((match, i) => {
                        let isdisabled = false
                        if (match.homeSets == '0' && match.guestSets == '0')
                            isdisabled = true

                        return (
                            <Card key={i}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                    {
                                        match.streamLink != undefined ?
                                            <Icon name="youtube-tv" size={30}
                                                onPress={() => this.props.navigation.navigate('Livestream', { link: match.streamLink })}
                                            /> : <Text></Text>
                                    }
                                    <Text style={{ maxWidth: 80, textAlign: 'center' }}>{match.date}</Text>
                                    <Text style={{ maxWidth: 80, textAlign: 'center' }}>{match.time}</Text>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: 200
                                        }}
                                        disabled={isdisabled}
                                        onPress={() => this.props.navigation.navigate('Match statistics', { tempMatch: match })}
                                    >
                                        <Image source={{ uri: match.homeLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                                        <View
                                            style={{
                                                flexDirection: 'column',

                                            }}>
                                            <Text style={{ textAlign: 'center', fontWeight: "bold" }}>{match.homeSets} - {match.guestSets} </Text>
                                            <Text style={{ maxWidth: 80, textAlign: 'center', fontSize: 10 }}>{match.set1 ? '(' + match.set1 + ', ' + match.set2 + ', ' + match.set3 + (match.set4 ? ', ' + match.set4 : '') + (match.set5 ? ',' + match.set5 + ')' : ')') : ''}</Text>
                                        </View>
                                        <Image source={{ uri: match.guestLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        )
                    })
                }
            </ ScrollView>
        )
    }
    render() {
        return (
            <View>
                {this.renderTopComponent()}
                {this.renderCurrentGames()}
                <View >
                    <Picker
                        selectedValue={this.state.league}
                        onValueChange={(itemValue, itemIndex) => {
                            if (!this.state.loading)
                                this.changeLeague(itemValue)
                        }}>
                        <Picker.Item label={'Men'} value={'Men'} />
                        <Picker.Item label={'Women'} value={'Women'} />
                    </Picker>
                </View>
            </View>
        )
    }
}
export default Home;