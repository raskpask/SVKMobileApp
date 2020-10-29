import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image } from 'react-native';

import HomeScreen from '../components/homeScreen';
import CalendarScreen from '../components/calendarScreen';

const HomeStack = createStackNavigator();

class HomeStackScreen extends Component {
    render() {
        return (
            <HomeStack.Navigator>
                <HomeStack.Screen name="Home" component={HomeScreen} />
                <HomeStack.Screen name="Calendar" component={CalendarScreen} options={{
                    headerTitle: () => (
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:20,fontWeight:"bold",marginTop:5,alignItems:'flex-start'}}>Calendar  </Text>
                            <Image
                                style={{ width: 200, height: 35,alignItems:'flex-end',marginStart:110}}
                                source={require('../img/SVKLogo.png')}
                                resizeMode='contain'
                            />
                        </View>
                    ),
                }} />
            </HomeStack.Navigator>
        )
    }
}
export default HomeStackScreen;