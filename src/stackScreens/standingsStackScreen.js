import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StandingsScreen from '../components/standingsScreen';

const CalendarStack = createStackNavigator();

class StandingsStackScreen extends Component {
    render() {
        return (
            <CalendarStack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                <CalendarStack.Screen name="StandingsScreen" component={StandingsScreen} />
            </CalendarStack.Navigator>
        )
    }
}
export default StandingsStackScreen;