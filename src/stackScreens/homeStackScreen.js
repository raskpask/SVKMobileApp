import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image } from 'react-native';

import HomeScreen from '../components/homeScreen';
import CalendarScreen from '../components/calendarScreen';
import StandingsScreen from '../components/standingsScreen';

const HomeStack = createStackNavigator();

class HomeStackScreen extends Component {
    render() {
        return (
            <HomeScreen/>
            // <HomeStack.Navigator>
            //     <HomeStack.Screen name="Home" component={HomeScreen} />
            //     <HomeStack.Screen name="Calendar" component={CalendarScreen} />
            //     <HomeStack.Screen name="Standings" component={StandingsScreen} />
            // </HomeStack.Navigator>
        )
    }
}
export default HomeStackScreen;