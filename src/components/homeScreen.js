import React, { Component } from 'react';
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