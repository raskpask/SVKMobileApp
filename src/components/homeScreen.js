import React, { Component } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { WebView } from 'react-native-webview';

class Home extends Component {
    render() {
        return (
            <WebView
            style={{ marginTop: 20 }}
                source={{
                    uri: 'http://sollentuna-vk.se/'
                }}
            />
        )
    }
}
export default Home;