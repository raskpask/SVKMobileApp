import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image } from 'react-native';

import HomeScreen from '../components/homeScreen';
import CalendarScreen from '../components/calendarScreen';
import StandingsScreen from '../components/standingsScreen';
import LiveTVScreen from '../components/liveTVScreen';
import LivescoreSreen from '../components/livescoreScreen';

const HomeStack = createStackNavigator();

class HomeStackScreen extends Component {
    render() {
        return (
            <HomeStack.Navigator>
                {/* <HomeStack.Screen name="Home" component={HomeScreen} options={{headerTitle: props => <Text>Component here</Text>}}/> */}
                <HomeStack.Screen name="Home" component={HomeScreen} />
                <HomeStack.Screen name="Livescore" component={LivescoreSreen} />
                <HomeStack.Screen name="Live TV" component={LiveTVScreen} />
                <HomeStack.Screen name="Calendar" component={CalendarScreen} />
                <HomeStack.Screen name="Standings" component={StandingsScreen} />
            </HomeStack.Navigator>
        )
    }
}
export default HomeStackScreen;