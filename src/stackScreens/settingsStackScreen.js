import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image } from 'react-native';

import HomeScreen from '../components/homeScreen';
import StandingsScreen from '../components/standingsScreen';
import CalendarScreen from '../components/calendarScreen';
import StatsScreen from '../components/statsScreen';
import SettingsScreen from '../components/settingsScreen';


const CalendarStack = createStackNavigator();

class SettingsStackScreen extends Component {
    render() {
        return (
            <CalendarStack.Navigator>
                <CalendarStack.Screen name="Settings" component={SettingsScreen} />
                <CalendarStack.Screen name="Standings" component={StandingsScreen} />
                <CalendarStack.Screen name="Home" component={HomeScreen} />
                <CalendarStack.Screen name="Calendar" component={CalendarScreen} />
                <CalendarStack.Screen name="Stats" component={StatsScreen} />
            </CalendarStack.Navigator>
        )
    }
}
export default SettingsStackScreen;