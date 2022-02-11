import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class LivescoreScreen extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <WebView 
                allowsFullscreenVideo={true}
                scrollEnabled={false}
                source={{ uri: this.props.route.params.link }}
            />
        )
    }
}

export default LivescoreScreen;