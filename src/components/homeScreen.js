import React, { Component } from 'react';
import axios from 'react-native-axios';
import { Text, View, TouchableOpacity, ImageBackground, RefreshControl, ActivityIndicator } from 'react-native';
import { Card, ThemeConsumer } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

import MatchCard from './matchCard';
import { GetKey } from '../model/storageKeys';
const now = new Date()
const dateNow = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0')
const timeNow = now.getHours() + ":" + now.getMinutes()

const urlWomen = 'https://svbf-web.dataproject.com/CompetitionHome.aspx?ID=263'
const urlMen = 'https://svbf-web.dataproject.com/CompetitionHome.aspx?ID=264'

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMatches: [],
            currentMatchesM: [[]],
            currentMatchesW: [[]],
            league: '',
            news: [],
            refreshing: false,
            isLoading: true,
            isMatchToday: false,
            liveBackgroundColor: 'white',
            settings: {}
        };
    }
    async componentDidMount() {
        this.props.onRef(this)
        try {
            this.setState({ settings: JSON.parse(await AsyncStorage.getItem(GetKey('settings'))) })
            this.setSavedMatches()
            this.getNews()
        }
        catch (error) {
            console.warn(error)
        }
        this.getCurrentMatches()
    }
    async componentDidUpdate() {
        await this.getCurrentMatches()
    }
    componentWillUnmount() {
        clearInterval(this.interval);
        this.props.onRef(undefined)
    }
    async updateSettings(){
        this.setState({ settings: JSON.parse(await AsyncStorage.getItem(GetKey('settings'))) })
        this.setSavedMatches()
    }
    async setSavedMatches(){
        const matchesM = JSON.parse(await AsyncStorage.getItem(GetKey('currentMatchesHomeM')))
        const matchesW = JSON.parse(await AsyncStorage.getItem(GetKey('currentMatchesHomeW')))
        if (matchesM !== null || matchesW !== null) {
            this.setMatches(matchesM, matchesW)
        }  
    }
    getNews() {
        axios.get('http://svbf-web.dataproject.com/MainHome.aspx')
            .then(function (response) {
                const news = this.extractNews(response.data)
                this.setState({ news: news })
            }.bind(this));
    }
    extractNews(data) {
        let listOfNews = []
        const listOfNewsString = data.split('"Content_Main_RP_Competitions_sm_HyperLink')
        for (let i = 1; i < listOfNewsString.length - 1; i++) {
            listOfNews.push(this.extractSingleNews(listOfNewsString[i]))
        }
        return listOfNews
    }
    extractSingleNews(newsString) {
        return {
            title: newsString.split('TileTitle')[1].split('>')[1].split('<')[0].split('  ').join('').split('\n').join(''),
            newsLink: 'http://svbf-web.dataproject.com/' + newsString.split('href=')[1].split('"')[1].split('&amp;')[0],
            image: newsString.split('background-image:url')[1].split('&quot;')[1].split('&quot;')[0].split(' ').join('%20'),
        }
    }
    setMatches(matchesM, matchesW){
        if (this.state.settings !== null && this.state.settings.showWomen && !this.state.settings.showMen) {
            this.setState({ currentMatches: matchesW })
        } else if (this.state.settings !== null && !this.state.settings.showWomen && this.state.settings.showMen) {
            this.setState({ currentMatches: matchesM })
        } else {
            const matches = this.concatMatches(matchesW, matchesM)
            this.setState({ currentMatches: matches })
        }
    }
    async getCurrentMatches() {
        let currentMatchesM = []
        let currentMatchesW = []
        await axios.get(urlMen)
            .then(function (response) {
                currentMatchesM = this.extractCurrentMatches(response.data, 'men')
            }.bind(this));
        await axios.get(urlWomen)
            .then(function (response) {
                currentMatchesW = this.extractCurrentMatches(response.data, 'women')
                this.setState({ currentMatchesW: currentMatchesW })
            }.bind(this));

        if (this.state.isMatchToday) {
            this.interval = setInterval(() => this.setState({ liveBackgroundColor: this.state.liveBackgroundColor === 'white' ? 'yellow' : 'white' }), 1000);
        }
        AsyncStorage.setItem(GetKey('currentMatchesHomeM'), JSON.stringify(currentMatchesM))
        AsyncStorage.setItem(GetKey('currentMatchesHomeW'), JSON.stringify(currentMatchesW))
        if (currentMatchesM !== null || currentMatchesW !== null) {
            this.setMatches(currentMatchesM, currentMatchesW)
        }
        this.setState({ isLoading: false })
    }
    concatMatches(currentMatchesW, currentMatchesM) {
        let currentMatches = []
        let matchesToday = []
        let matcherOtherDAys = []
        if (this.state.settings !== null && this.state.settings.showMen && this.state.settings.showWomen) {
            currentMatches = currentMatchesW.concat(currentMatchesM).sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0)).sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
        } else if (this.state.settings !== null && this.state.settings.showWomen) {
            currentMatches = currentMatchesW.sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0)).sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
        } else if (this.state.settings !== null && this.state.settings.showMen) {
            currentMatches = currentMatchesM.sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0)).sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
        }
        currentMatches.forEach(match => {
            if (match.date === dateNow)
                matchesToday.push(match)
            else
                matcherOtherDAys.push(match)
        })
        return matchesToday.concat(matcherOtherDAys)
    }
    extractCurrentMatches(data, gender) {
        const listOfGames = data.split('"DIV_Match_Main"')
        let matches = []
        for (let i = 1; i < listOfGames.length; i++) {
            matches.push(this.extractOneMatch(listOfGames[i], gender))
        }
        return matches
    }
    extractOneMatch(matchString, gender) {
        let date
        let time
        if (matchString.split('"LB_DataOra"').length < 2) {
            time = matchString.split('"LB_Ora_Today"')[1].split('>')[1].split('<')[0]
            date = new Date().toISOString().slice(0, 10)
            const currentTime = new Date()
            const minutes = currentTime.getMinutes()
            if (time < currentTime.getHours() + ':' + (minutes > 5 ? minutes - 5 : minutes) && time > currentTime.getHours() - 3 + ':' + minutes) {
                this.setState({ isMatchToday: true })
            }
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
        let livescoreLink = matchString.split('onclick="window.open(')[1]?.split('&#39;')[1].split('&#39;')[0]
        if (livescoreLink !== undefined) {
            livescoreLink = 'http://svbf-web.dataproject.com' + livescoreLink;
        }
        const matchData = {
            gender: gender,
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
            livescoreLink: livescoreLink,
        }
        return (matchData)
    }
    async refreshPage() {
        this.setState({ refreshing: true })
        await this.getCurrentMatches()
        this.setState({ refreshing: false })
    }
    renderLiveStreamComponent(isTop) {
        if (this.state.isMatchToday) {
            return (
                this.renderTextForLiveComponent('LIVE')
            )
        } else if (!isTop) {
            return (
                this.renderTextForLiveComponent('Watch matches')
            )
        }
    }
    renderTextForLiveComponent(text) {
        return (
            <View>
                <TouchableOpacity style={{ width: '100%' }} onPress={() => this.props.navigation.navigate('Live')}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: this.state.liveBackgroundColor, padding: 10, margin: 10, marginBottom: 0, borderWidth: 1, borderColor: 'lightgrey' }}>
                        <Text style={{ fontSize: 30 }}>{text}</Text>
                        <Icon name="youtube-tv" size={40} style={{ marginLeft: 10, padding: 0 }} />
                    </View >
                </TouchableOpacity>
            </View >
        )
    }
    renderCurrentGames() {
        return (
            <ScrollView
                ref={(ref) => this.myScroll = ref}
                style={{ height: 375, borderWidth: 0 }}
            >
                {
                    this.state.currentMatches.map((match, i) => {
                        let isdisabled = false
                        if (match.date > dateNow || match.date === dateNow && match.time >= timeNow)
                            isdisabled = true
                        return (
                            <MatchCard key={i} navigation={this.props.navigation} match={match} isdisabled={isdisabled} />
                        )
                    })
                }
            </ ScrollView>
        )
    }
    renderNews() {
        return (
            <ScrollView>
                {this.state.news.map(((news, i) => {
                    return (
                        <Card key={i} containerStyle={{ padding: 0 }}>
                            <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('News', { newsLink: news.newsLink })}>
                                <ImageBackground
                                    style={{
                                        resizeMode: 'contain',
                                        flex: 1,
                                        aspectRatio: 1,
                                        justifyContent: 'flex-end'
                                    }}
                                    source={{ uri: news.image }} >
                                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: 'center', backgroundColor: "#000000a0" }}>{news.title}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </Card>
                    )
                }))}
            </ScrollView>
        )
    }
    render() {
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
                {this.renderLiveStreamComponent(true)}
                <Text style={{ fontSize: 30, textAlign: 'center', marginTop: 20, marginBottom: 10 }}>Matches</Text>
                {this.state.isLoading ?
                    <ActivityIndicator size="large" color='lightgrey' style={{ margin: 10 }} /> :
                    this.renderCurrentGames()
                }
                <Text style={{ fontSize: 30, textAlign: 'center', marginTop: 20, marginBottom: 10 }}>News</Text>
                {this.renderNews()}
                {this.renderLiveStreamComponent(false)}
            </ScrollView>
        )
    }
}

export default Home;