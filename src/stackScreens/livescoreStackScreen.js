import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../components/homeScreen';
import Livescore from '../components/livescoreScreen';
import LiveTV from '../components/liveTVScreen';

const Livescore = createStackNavigator();

class LivescoreStackScreen extends Component {
    render() {
        return (
            <Livescore.Navigator>
                <Livescore.Screen name="Livescore" component={Livescore} />
                <Livescore.Screen name="Live TV" component={LiveTV} />
                <Livescore.Screen name="Home" component={HomeScreen} />
            </Livescore.Navigator>
        )
    }
}
export default LivescoreStackScreen;