import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import axios from 'react-native-axios';
import { Card } from 'react-native-elements'
const windowWidth = Dimensions.get('window').width;

class BaggerWar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortedListOfTeams: []
        }
    }
    componentDidMount() {
        this.getBaggerWars()
    }
    getBaggerWars() {
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQr_dyUhB-9BmKiLPfxX2ykzewlquMewwWmbpNH7tPUO4Hb5oL3mnpr4HK-p9xnZxCXonXwrf3R1A5A/pub?output=csv')
            .then(function (response) {
                this.setState({ sortedListOfTeams: this.extractData(response.data) })
            }.bind(this));
    }
    extractData(data) {
        let sortedListOfTeams = []
        data.split('\n').forEach((element) => {
            sortedListOfTeams.push({
                name: element.split(',')[0],
                gender: element.split(',')[1],
                team1: element.split(',')[2],
                team2: element.split(',')[3],
                score1: element.split(',')[4],
                score2: element.split(',')[5],
            })
        });
        return sortedListOfTeams
    }
    renderBaggerCard(team,i) {
        return (
            <Card key={i}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <Text style={{ maxWidth: windowWidth / 4, textAlign: 'center' }}>{team.name} {team.gender}</Text>
                    <Text>{team.team1}</Text>
                    <Text style={{ textAlign: 'center', fontWeight: "bold" }}>{team.score1} - {team.score2} </Text>
                    <Text>{team.team2}</Text>
                </View>
            </Card>
        )
    }
    render() {
        return (
            <View>
                {this.state.sortedListOfTeams.map((team, i) =>
                    this.renderBaggerCard(team,i)
                )
                }
            </View >
        )
    }
}

export default BaggerWar;