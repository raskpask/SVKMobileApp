import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CalendarScreen from '../components/calendarScreen';
import GameStatsScreen from '../components/gameStats';

const CalendarStack = createStackNavigator();

class CalendarStackScreen extends Component {
    render() {
        return (
            <CalendarStack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                <CalendarStack.Screen name="CalendarScreen" component={CalendarScreen} />
                <CalendarStack.Screen name="Match statistics" component={GameStatsScreen} />
            </CalendarStack.Navigator>
        )
    }
}
export default CalendarStackScreen;