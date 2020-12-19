import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image } from 'react-native';

import HomeScreen from '../components/homeScreen';
import CalendarScreen from '../components/calendarScreen';
import StandingsScreen from '../components/standingsScreen';
import LiveTVScreen from '../components/liveTVScreen';
import LivescoreSreen from '../components/livescoreScreen';
import LivestreamScreen from '../components/livestreamScreen';
import MatchStatisticsScreen from '../components/gameStats';
import News from '../components/newsScreen';

const HomeStack = createStackNavigator();

class HomeStackScreen extends Component {
    render() {
        return (
            <HomeStack.Navigator>
                {/* <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerTitle: props =>  <Header screen='Home'/>  }} /> */}
                <HomeStack.Screen name="Home" component={HomeScreen} />
                <HomeStack.Screen name="Livescore" component={LivescoreSreen} />
                <HomeStack.Screen name="News" component={News} />
                <HomeStack.Screen name="Live" component={LiveTVScreen} />
                <HomeStack.Screen name="Calendar" component={CalendarScreen} />
                <HomeStack.Screen name="Standings" component={StandingsScreen} />
                <HomeStack.Screen name="Livestream" component={LivestreamScreen} />
                <HomeStack.Screen name="Match statistics" component={MatchStatisticsScreen} />
            </HomeStack.Navigator>
        )
    }
}
export default HomeStackScreen;