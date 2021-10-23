import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetListOfTeams } from '../data/listOfTeams';

const settingsKey = "settingsKey"

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
            settings = JSON.parse(await AsyncStorage.getItem(settingsKey))
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
            AsyncStorage.setItem(settingsKey, JSON.stringify(settings))
        } catch (e) {
            console.warn(e)
        }
    }

    render() {
        return (
            <ScrollView >
                <Text>Settings</Text>
                <Text>Välj liga som ska vara standard</Text>
                <Picker
                    selectedValue={this.state.league}
                    style={pickerStyle}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ league: itemValue })
                    }}>
                    <Picker.Item label={'Men'} value={'Men'} />
                    <Picker.Item label={'Women'} value={'Women'} />
                </Picker>
                <Text>Visa endast herrar</Text>
                <CheckBox
                    disabled={false}
                    value={this.state.showMen}
                    onValueChange={(value) => this.setState({ showMen: value })}
                />
                <Text>Visa endast damer</Text>
                <CheckBox
                    disabled={false}
                    value={this.state.showWomen}
                    onValueChange={(value) => this.setState({ showWomen: value })}
                />
                <Text>Välj standardlag</Text>
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
    marginTop: Platform.OS === 'ios' ? -87 : 40
});
export default SettingsScreen;