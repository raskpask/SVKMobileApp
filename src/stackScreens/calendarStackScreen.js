import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image } from 'react-native';

import HomeScreen from '../components/homeScreen';
import CalendarScreen from '../components/calendarScreen';
import StandingsScreen from '../components/standingsScreen';
import GameStatsScreen from '../components/gameStats';

const CalendarStack = createStackNavigator();

class CalendarStackScreen extends Component {
    render() {
        return (
            <CalendarStack.Navigator>
                <CalendarStack.Screen name="Calendar" component={CalendarScreen} />
                <CalendarStack.Screen name="Match statistics" component={GameStatsScreen} />
                <CalendarStack.Screen name="Home" component={HomeScreen} />
                <CalendarStack.Screen name="Standings" component={StandingsScreen} />
            </CalendarStack.Navigator>
        )
    }
}
export default CalendarStackScreen;