import React, { Component } from 'react';
import axios from 'react-native-axios';
import { Text, View, TouchableOpacity, ImageBackground, RefreshControl, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

import MatchCard from './matchCard';
import { GetKey } from '../model/storageKeys';
import { ExtractCurrentMatches, ExtractNews, ConcatMatches } from '../model/webScraping/home';

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
        try {
            const settings = JSON.parse(await AsyncStorage.getItem(GetKey('settings')))
            this.setState({ settings: settings })
            this.setSavedMatches()
            this.getNews()
        }
        catch (error) {
            console.warn(error)
        }
        this.getCurrentMatches(settings)
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    async setSavedMatches() {
        const matchesM = JSON.parse(await AsyncStorage.getItem(GetKey('currentMatchesHomeM')))
        const matchesW = JSON.parse(await AsyncStorage.getItem(GetKey('currentMatchesHomeW')))
        if (matchesM !== null || matchesW !== null) {
            this.setMatches(matchesM, matchesW)
        }
    }
    getNews() {
        axios.get('http://svbf-web.dataproject.com/MainHome.aspx')
            .then(function (response) {
                const news = ExtractNews(response.data)
                this.setState({ news: news })
            }.bind(this));
    }

    setMatches(matchesM, matchesW) {
        if (this.state.settings !== null && this.state.settings.showWomen && !this.state.settings.showMen) {
            this.setState({ currentMatches: matchesW })
        } else if (this.state.settings !== null && !this.state.settings.showWomen && this.state.settings.showMen) {
            this.setState({ currentMatches: matchesM })
        } else {
            const matches = ConcatMatches(matchesW, matchesM, this.state.settings)
            this.setState({ currentMatches: matches })
        }
    }
    async getCurrentMatches(settings) {
        let currentMatchesM = []
        let currentMatchesW = []
        await axios.get(urlMen)
            .then(function (response) {
                currentMatchesM = ExtractCurrentMatches(response.data, 'men')
            }.bind(this));
        await axios.get(urlWomen)
            .then(function (response) {
                currentMatchesW = ExtractCurrentMatches(response.data, 'women')
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

    async refreshPage() {
        this.setState({ refreshing: true })
        await this.getCurrentMatches(this.state.settings)
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