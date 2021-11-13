import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

const Tab = createBottomTabNavigator();
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsChangedHome: false
    };
}

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            children={() => 
            <HomeStack.Navigator>
              <HomeStack.Screen name="Home" children={() => <HomeScreen />} />
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
              <HomeStack.Screen name="Calendar" children={() => <CalendarScreen/>} />
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
              <HomeStack.Screen name="Stats" children={() => <StatsScreen/>} />
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
              <HomeStack.Screen name="Standings" children={() => <StandingsScreen/>} />
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
              <HomeStack.Screen name="Settings" children={() => <SettingsScreen/>} />
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