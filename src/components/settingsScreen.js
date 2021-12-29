import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetListOfTeams } from '../data/listOfTeams';
import { GetKey } from '../model/storageKeys';
import { Button } from 'react-native';

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
        this.setState({ allTeams: listOfTeams })
        try {
            settings = JSON.parse(await AsyncStorage.getItem(GetKey('settings')))
            if (settings)
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
                <Text>Show men</Text>
                <Switch
                    onValueChange={(value) => this.setState({ showMen: value })}
                    value={this.state.showMen}
                />
                <Text>Show women</Text>
                <Switch
                    onValueChange={(value) => this.setState({ showWomen: value })}
                    value={this.state.showWomen}
                />
                <Text>Pick home team</Text>
                <Picker
                    selectedValue={this.state.standardTeam}
                    style={pickerStyle}
                    onValueChange={(itemValue) => {
                        this.setState({ standardTeam: itemValue })
                        if(itemValue.split('(M)').length > 1)
                            this.setState({league: 'Men'})
                        else
                            this.setState({league: 'Women'})
                    }}>
                    {this.state.allTeams.map((value, index) => {
                        return (
                            <Picker.Item key={index} label={value} value={value} />
                        )
                    })}
                </Picker>
                <Button title="Spara" onPress={() => this.props.restartApp()}/>
            </ScrollView>
        )
    }
}
const pickerStyle = StyleSheet.create({
    bottom: 0,
    marginTop: Platform.OS === 'ios' ? -47 : 0
});
export default SettingsScreen;