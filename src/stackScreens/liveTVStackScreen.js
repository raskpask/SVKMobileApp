import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../components/homeScreen';
import Livescore from '../components/livescoreScreen';
import LiveTV from '../components/liveTVScreen';

const LiveTV = createStackNavigator();

class LiveTVStackScreen extends Component {
    render() {
        return (
            <LiveTV.Navigator>
                <LiveTV.Screen name="Live TV" component={LiveTV} />
                <LiveTV.Screen name="Livescore" component={Livescore} />
                <LiveTV.Screen name="Home" component={HomeScreen} />
            </LiveTV.Navigator>
        )
    }
}
export default LiveTVStackScreen;