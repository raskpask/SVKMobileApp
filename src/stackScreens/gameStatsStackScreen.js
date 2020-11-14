import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../components/homeScreen';
import CalendarScreen from '../components/calendarScreen';
import StandingsScreen from '../components/standingsScreen';
import GameStatsScreen from '../components/gameStats';

const GameStack = createStackNavigator();

class GameStatsStackScreen extends Component {
    render() {
        return (
            <GameStack.Navigator>
                <GameStack.Screen name="Match statistics" component={GameStatsScreen} />
                <GameStack.Screen name="Home" component={HomeScreen} />
                <GameStack.Screen name="Calendar" component={CalendarScreen} />
                <GameStack.Screen name="Standings" component={StandingsScreen} />
            </GameStack.Navigator>
        )
    }
}
export default GameStatsStackScreen;