import React, { Component } from 'react';
import { View, Text, Switch } from 'react-native';

class LiveTVScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            league: 'Men',
            isEnabled: false
        }
    }
    toggleSwitch() {
        this.setState({ isEnabled: !this.state.isEnabled })
    }
    render() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <Text>{this.props.screen}</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={this.state.isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => this.toggleSwitch()}
                    value={this.state.isEnabled}
                />
            </View >
        )
    }
}

export default LiveTVScreen;