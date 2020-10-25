import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import HomeScreen from './src/components/homeScreen';
import CalendarScreen from './src/components/calendarScreen';
import Footer from './src/components/footer';
import navigationRef from './src/navigation/rootNavigation';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" ref={navigationRef}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
      </Stack.Navigator>
      <Footer/>
    </NavigationContainer>
  );
}

export default App;
