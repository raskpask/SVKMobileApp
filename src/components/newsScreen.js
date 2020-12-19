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
                // this.setState({ news: '<h1>Hello world</h1>' })
            }.bind(this));
    }
    // extractNews(data) {
    //     console.log(data)
    //     const listOfTextString = data.split('<p style="text-align: left;">')
    //     let listOfText = []
    //     for (let i = 1; i < listOfTextString.length - 1; i++) {
    //         listOfText.push(this.extractParagraph(listOfTextString[i]))
    //     }
    //     return {
    //         date: data.split('Date')[1].split('>')[1].split('<')[0],
    //         title: data.split('Title')[1].split('>')[1].split('<')[0],
    //         subtitle: data.split('SubTitle')[1].split('>')[1].split('<')[0],
    //         mainImage: data.split('MainImage')[1].split('src="')[1].split('"')[0],
    //     }
    // }
    // extractParagraph(string) {
    //     const containsStrong = string.contains('<strong>')
    //     const containsItalic = string.contains('<em>')
    //     return {
    //         text: string
    //             .replace('&aring;', 'å').replace('&auml;', 'ä').replace('&ouml;', 'ö').replace('&Aring;', 'Å').replace('&Auml;', 'Ä').replace('&Ouml;', 'Ö')
    //             .replace('<strong>', '').replace('</strong>', '').replace('<em>', '').replace('</em>', '')
    //             .split('</p>')[0],
    //         bold: containsStrong,
    //         italic: containsItalic,
    //         link: containsLink
    //     }
    // }
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