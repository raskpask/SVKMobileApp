import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class Home extends Component {
    render() {
        return (
            <WebView
            style={{ marginTop: 20}}
                source={{
                    uri: 'http://elitserienvolleyboll.se/'
                }}
            />
        )
    }
}
export default Home;