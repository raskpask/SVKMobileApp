import React, { Component } from 'react';
import axios from 'react-native-axios';
import { Text, View, TouchableOpacity, ImageBackground, RefreshControl, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from 'react-redux'

import { getAndSetCurrentMatches } from '../model/webScraping/homeMatches';
import MatchCard from './matchCard';
const now = new Date()
const dateNow = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0')
const timeNow = now.getHours() + ":" + now.getMinutes()


const HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            league: '',
            news: [],
            refreshing: false,
            isLoading: true,
        };
    }
    async componentDidMount() {
        try {
            this.getNews()
        } catch (error) {
            console.warn(error)
        }
        this.setState({ isLoading: false })
    }
    async componentDidUpdate() {
        if (!this.state.isLoading && this.props.settingsChanged) {
            await getAndSetCurrentMatches()
            this.props.setSettingsChangedHome(false)
        }
    }
    componentWillUnmount() {
        clearInterval(this.interval);
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
    async refreshPage() {
        this.setState({ refreshing: true })
        await getAndSetCurrentMatches()
        this.setState({ refreshing: false })
    }
    renderLiveStreamComponent(isTop) {
        const isMatchToday = useSelector((state) => state.isMatchTodayHome.value)
        if (isMatchToday) {
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
        const liveBackgroundColor = useSelector((state) => state.liveBackgroundColorHome.value)
        return (
            <View>
                <TouchableOpacity style={{ width: '100%' }} onPress={() => this.props.navigation.navigate('Live')}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: liveBackgroundColor, padding: 10, margin: 10, marginBottom: 0, borderWidth: 1, borderColor: 'lightgrey' }}>
                        <Text style={{ fontSize: 30 }}>{text}</Text>
                        <Icon name="youtube-tv" size={40} style={{ marginLeft: 10, padding: 0 }} />
                    </View >
                </TouchableOpacity>
            </View >
        )
    }
    renderCurrentGames() {
        const currentMatches = useSelector((state) => state.currentMatches.value)
        return (
            <ScrollView
                ref={(ref) => this.myScroll = ref}
                style={{ height: 375, borderWidth: 0 }}
            >
                {
                    currentMatches.map((match, i) => {
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
                {news.map(((news, i) => {
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
export default HomeScreen;