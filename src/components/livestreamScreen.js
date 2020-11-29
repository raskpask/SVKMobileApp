import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

class LivestreamScreen extends Component {
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
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContentContainer: {
        alignItems: "center",
        paddingBottom: 60
    },
    box: {
        height: 100,
        width: 100,
        borderRadius: 5,
        marginVertical: 40,
        backgroundColor: "#61dafb",
        alignItems: "center",
        justifyContent: "center"
    }
});


export default LivestreamScreen;