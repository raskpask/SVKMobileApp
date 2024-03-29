import * as React from 'react';
import { NavigationContainer, StackActions, NavigationActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import RunAtStartup from './src/model/startup';
const HomeStack = createStackNavigator();
import { createStackNavigator } from '@react-navigation/stack';

import HomeStackScreen from './src/stackScreens/homeStackScreen';
import CalendarStackScreen from './src/stackScreens/calendarStackScreen'
import StatsStackScreen from './src/stackScreens/statsStackScreen';
import StandingsStackScreen from './src/stackScreens/standingsStackScreen';
import SettingsStackScreen from './src/stackScreens/settingsStackScreen';

RunAtStartup();

const Tab = createBottomTabNavigator();
class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            children={() =>
              <HomeStackScreen />
            }
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Calendar"
            children={() =>
              <CalendarStackScreen />
            }
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="calendar" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Stats"
            children={() =>
              <StatsStackScreen />
            }
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="volleyball" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Standings"
            children={() =>
              <StandingsStackScreen />
            }
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="podium" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            children={() =>
              <SettingsStackScreen />
            }
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="cog" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
export default App