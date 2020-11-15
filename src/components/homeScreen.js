import React, { Component } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { WebView } from 'react-native-webview';

class Home extends Component {
    render() {
        return (
            <WebView
                source={{
                    uri: 'http://sollentuna-vk.se/'
                }}
                style={{ marginTop: 20 }}
            />
        )
    }
}
export default Home;