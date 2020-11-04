import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image } from 'react-native';

import HomeScreen from '../components/homeScreen';
import StandingsScreen from '../components/standingsScreen';
import CalendarScreen from '../components/calendarScreen';
// import ScheduleScreen from '../components/scheduleScreen';

const CalendarStack = createStackNavigator();

class StandingsStackScreen extends Component {
    render() {
        return (
            <CalendarStack.Navigator>
                <CalendarStack.Screen name="Standings" component={StandingsScreen} />
                <CalendarStack.Screen name="Home" component={HomeScreen} />
                <CalendarStack.Screen name="Calendar" component={CalendarScreen} />
            </CalendarStack.Navigator>
        )
    }
}
export default StandingsStackScreen;