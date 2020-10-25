import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../components/homeScreen';
import CalendarScreen from '../components/calendarScreen';

const HomeStack = createStackNavigator();

class HomeStackScreen extends Component {
    render() {
        return (
            <HomeStack.Navigator>
                <HomeStack.Screen name="Home" component={HomeScreen} />
                <HomeStack.Screen name="Calendar" component={CalendarScreen} />
            </HomeStack.Navigator>
        )
    }
}
export default HomeStackScreen;