import * as React from 'react';
import { NavigationContainer, StackActions, NavigationActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import RunAtStartup from './src/model/startup';
const HomeStack = createStackNavigator();
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/components/homeScreen';
import CalendarScreen from './src/components/calendarScreen';
import StandingsScreen from './src/components/standingsScreen';
import StatsScreen from './src/components/statsScreen';
import SettingsScreen from './src/components/settingsScreen';

RunAtStartup();
let homeScreen = {}
let calendarScreen = {}
let statsScreen = {}
let standingsScreen = {}

const Tab = createBottomTabNavigator();
class App extends React.Component {

  restartApp() {
    homeScreen.updateSettings()
    console.log(calendarScreen)
    if (Object.keys(calendarScreen).length !== 0)
      calendarScreen.setContent()
    if (Object.keys(statsScreen).length !== 0)
      statsScreen.setContent()
    if (Object.keys(standingsScreen).length !== 0)
      standingsScreen.setContent()
  }
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            children={() =>
              <HomeStack.Navigator>
                <HomeStack.Screen name="Home" children={() => <HomeScreen onRef={ref => homeScreen = ref} />} />
              </HomeStack.Navigator>}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Calendar"
            children={() =>
              <HomeStack.Navigator>
                <HomeStack.Screen name="Calendar" children={() => <CalendarScreen onRef={ref => calendarScreen = ref} />} />
              </HomeStack.Navigator>}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="calendar" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Stats"
            children={() =>
              <HomeStack.Navigator>
                <HomeStack.Screen name="Stats" children={() => <StatsScreen onRef={ref => statsScreen = ref} />} />
              </HomeStack.Navigator>}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="volleyball" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Standings"
            children={() =>
              <HomeStack.Navigator>
                <HomeStack.Screen name="Standings" children={() => <StandingsScreen onRef={ref => standingsScreen = ref} />} />
              </HomeStack.Navigator>}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="podium" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            children={() =>
              <HomeStack.Navigator>
                <HomeStack.Screen name="Settings" children={() => <SettingsScreen restartApp={this.restartApp} />} />
              </HomeStack.Navigator>}
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