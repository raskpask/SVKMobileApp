import React, { Component } from 'react';
import { View, Text, Linking } from 'react-native';
import axios from 'react-native-axios';
import { WebView } from 'react-native-webview';

class NewsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            news: '<h1>Loading...</h1>'
        }
    }
    componentDidMount() {
        this.getNews()
    }
    getNews() {
        axios.get(this.props.route.params.newsLink)
            .then(function (response) {
                const news = response.data.split('<div id="Content_Main_NewsDetail_News_Details"')[1].split('<div id="DIV_Footer" class="footer-wide row">')[0]
                this.setState({ news: '<div id="Content_Main_NewsDetail_News_Details"' + news })
            }.bind(this));
    }
    render() {
        return (
            <WebView
                originWhitelist={['*']}
                ref={(ref) => { this.webview = ref; }}
                source={{ html: this.state.news }}
                onNavigationStateChange={(event) => {
                    if (event.url !== 'about:blank') {
                        this.webview.stopLoading();
                        Linking.openURL(event.url);
                    }
                }}
            />
        )
    }
}
export default NewsScreen;