import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetListOfTeams } from '../data/listOfTeams';
import { GetKey } from '../model/storageKeys';

class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            league: 'Men',
            showMen: true,
            showWomen: true,
            standardTeam: 'None',
            allTeams: ['None']
        }
    }
    async componentDidMount() {
        listOfTeams = GetListOfTeams();
        this.setState({allTeams: listOfTeams})
        try {
            settings = JSON.parse(await AsyncStorage.getItem(GetKey('settings')))
            if(settings)
                this.setState({ league: settings.league, showMen: settings.showMen, showWomen: settings.showWomen, standardTeam: settings.standardTeam })
        } catch (e) {
            console.warn(e)
        }
    }
    async componentDidUpdate() {
        settings = {
            league: this.state.league,
            showMen: this.state.showMen,
            showWomen: this.state.showWomen,
            standardTeam: this.state.standardTeam
        }
        try {
            AsyncStorage.setItem(GetKey('settings'), JSON.stringify(settings))
        } catch (e) {
            console.warn(e)
        }
    }

    render() {
        return (
            <ScrollView >
                <Text>Choose standard league</Text>
                <Picker
                    selectedValue={this.state.league}
                    style={pickerStyle}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ league: itemValue })
                    }}>
                    <Picker.Item label={'Men'} value={'Men'} />
                    <Picker.Item label={'Women'} value={'Women'} />
                </Picker>
                <Text>Show men</Text>
                <CheckBox
                    disabled={false}
                    value={this.state.showMen}
                    onValueChange={(value) => this.setState({ showMen: value })}
                />
                <Text>Show women</Text>
                <CheckBox
                    disabled={false}
                    value={this.state.showWomen}
                    onValueChange={(value) => this.setState({ showWomen: value })}
                />
                <Text>Pick home team</Text>
                <Picker
                    selectedValue={this.state.standardTeam}
                    style={pickerStyle}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ standardTeam: itemValue })
                    }}>
                    {this.state.allTeams.map((value, index) => {
                        return (
                            <Picker.Item key={index} label={value} value={value} />
                        )
                    })}
                </Picker>
            </ScrollView>
        )
    }
}
const pickerStyle = StyleSheet.create({
    bottom: 0,
    marginTop: Platform.OS === 'ios' ? -47 : 0
});
export default SettingsScreen;