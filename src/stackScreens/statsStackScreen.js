import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StatsScreen from '../components/statsScreen';

const StatsStack = createStackNavigator();

class StatsStackScreen extends Component {
    render() {
        return (
            <StatsStack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                <StatsStack.Screen name="StatsScreen" component={StatsScreen} />
            </StatsStack.Navigator>
        )
    }
}
export default StatsStackScreen;