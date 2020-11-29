import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../components/homeScreen';
import Livescore from '../components/livescoreScreen';
import LiveTV from '../components/liveTVScreen';
import LivestreamScreen from '../components/livestreamScreen';
const Livestream = createStackNavigator();

class LiveStreamStackScreen extends Component {
    render() {
        return (
            <Livestream.Navigator>
                <Livestream.Screen name="Livestream" component={LivestreamScreen} />
                <Livestream.Screen name="Livescore" component={Livescore} />
                <Livestream.Screen name="Home" component={HomeScreen} />
            </Livestream.Navigator>
        )
    }
}
export default LiveStreamStackScreen;