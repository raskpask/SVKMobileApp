import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class WebPage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let source
        let userAgent

        if (this.props.mobileVersion != 'false' || !this.props.html) {
            source = 'uri: this.props.uri'
        } else if (this.props.html) {
            source = this.props.html
        } else {
            userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36"
        }
        return <WebView
            originWhitelist={['*']}
            source={{html: this.props.html}}
            userAgent={userAgent}
        />
    }
}

export default WebPage;