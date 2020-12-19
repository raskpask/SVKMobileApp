import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../components/homeScreen';
import News from '../components/newsScreen';

const News = createStackNavigator();

class NewsStackScreen extends Component {
    render() {
        return (
            <News.Navigator>
                <News.Screen name="News" component={News} />
                <News.Screen name="Home" component={HomeScreen} />
            </News.Navigator>
        )
    }
}
export default NewsStackScreen;