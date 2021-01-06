import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Restart} from 'fiction-expo-restart';

import HomeStackScreen from './src/stackScreens/homeStackScreen';
import CalendarStackScreen from './src/stackScreens/calendarStackScreen';
import StandingsStackScreen from './src/stackScreens/standingsStackScreen';
import StatsStackScreen from './src/stackScreens/statsStackScreen';

const Tab = createBottomTabNavigator();
export default function App() {
  try{
    if(JSON.parse(AsyncStorage.getItem('isFirstLaunch'))){
        AsyncStorage.setItem('isFirstLaunch', JSON.stringify(false))
        Restart();
    }
} catch {
}
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="calendar" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="volleyball" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Standings"
          component={StandingsStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="podium" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}