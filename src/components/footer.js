import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as RootNavigation from '../navigate/rootNavigation';

import footerStyle from '../style/footerStyle.js';

class Footer extends Component {
    
    render() {
        return (
            <View style={footerStyle.container}>
                <Icon style={footerStyle.icon} name='home' size ={50} onPress={()=> RootNavigation.navigate('Home')}></Icon>
                <Icon style={footerStyle.icon} name='calendar' size ={50} onPress={()=> RootNavigation.navigate('Calendar')}></Icon>
            </View>
        )
    }
}
export default Footer;