import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../components/homeScreen';
import LiveTVScreen from '../components/liveTVScreen';
import LivescoreSreen from '../components/livescoreScreen';
import LivestreamScreen from '../components/livestreamScreen';
import MatchStatisticsScreen from '../components/gameStats';
import News from '../components/newsScreen';

const HomeStack = createStackNavigator();

class HomeStackScreen extends Component {
    render() {
        return (
            <HomeStack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
                <HomeStack.Screen name="Livescore" component={LivescoreSreen} />
                <HomeStack.Screen name="News" component={News} />
                <HomeStack.Screen name="Live" component={LiveTVScreen} />
                <HomeStack.Screen name="Livestream" component={LivestreamScreen} />
                <HomeStack.Screen name="Match statistics" component={MatchStatisticsScreen} />
            </HomeStack.Navigator>
        )
    }
}
export default HomeStackScreen;