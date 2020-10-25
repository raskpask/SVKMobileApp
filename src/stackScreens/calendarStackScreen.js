import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../components/homeScreen';
import CalendarScreen from '../components/calendarScreen';

const CalendarStack = createStackNavigator();

class CalendarStackScreen extends Component {
    render() {
        return (
            <CalendarStack.Navigator>
                <CalendarStack.Screen name="Home" component={HomeScreen} />
                <CalendarStack.Screen name="Calendar" component={CalendarScreen} />
            </CalendarStack.Navigator>
        )
    }
}
export default CalendarStackScreen;