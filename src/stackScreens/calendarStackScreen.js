import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image } from 'react-native';

import HomeScreen from '../components/homeScreen';
import CalendarScreen from '../components/calendarScreen';

const CalendarStack = createStackNavigator();

class CalendarStackScreen extends Component {
    render() {
        return (
            <CalendarStack.Navigator>
            <CalendarStack.Screen name="Calendar" component={CalendarScreen} options={{
                    headerTitle: () => (
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:20,fontWeight:"bold",marginTop:5,alignItems:'flex-start'}}>Calendar  </Text>
                            <Image
                                style={{ width: 200, height: 35,alignItems:'flex-end',marginStart:165}}
                                source={require('../img/SVKLogo.png')}
                                resizeMode='contain'
                            />
                        </View>
                    ),
                }} />
            <CalendarStack.Screen name="Home" component={HomeScreen} />
          </CalendarStack.Navigator>
        )
    }
}
export default CalendarStackScreen;