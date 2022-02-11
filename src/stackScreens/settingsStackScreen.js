import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../components/homeScreen';
import SettingsScreen from '../components/settingsScreen';

const StatsStack = createStackNavigator();

class SettingsStackScreen extends Component {
    render() {
        return (
            <StatsStack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                <StatsStack.Screen name="SettingsScreen" component={SettingsScreen} />
            </StatsStack.Navigator>
        )
    }
}
export default SettingsStackScreen;