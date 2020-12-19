import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../components/homeScreen';
import StatsScreen from '../components/statsScreen';

const StatsStack = createStackNavigator();

class StatsStackScreen extends Component {
    render() {
        return (
            <StatsStack.Navigator>
                <StatsStack.Screen name="Stats" component={StatsScreen} />
                <StatsStack.Screen name="Home" component={HomeScreen} />
            </StatsStack.Navigator>
        )
    }
}
export default StatsStackScreen;