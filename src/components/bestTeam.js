import React, { Component } from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import axios from 'react-native-axios';
import { Card, Avatar } from 'react-native-elements'
import { Col, Row } from 'react-native-table-component';

class BestTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortedListOfTeams: []
        }
    }
    componentDidMount() {
    }
    renderPersonCard(name, pos, team) {
        return (
            <View style={{ borderWidth: 0.3, padding: 10, margin: 10, justifyContent: 'center' }}>
                <Text style={{ fontSize: 14 }}>{name}</Text>
                <Image source={{ uri: 'https://images.dataproject.com/svbf/TeamPlayer/100/200/TeamPlayer_1597_904.jpg' }} style={{ width: 40, height: 50, borderRadius: 30, marginLeft: 20 }} />
                <Text style={{ textAlign: 'center' }}>{pos}</Text>
                <Text style={{ textAlign: 'center' }}>{team}</Text>
            </View>
        )
    }
    render() {
        return (
            <Card>
                <Card.Title>{this.props.name}</Card.Title>
                <Card.Divider />
                <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center' }}>
                    {this.renderPersonCard('Jakob Molin', 'Outside', 'SVK')}
                    {this.renderPersonCard('Jakob Molin', 'Outside', 'SVK')}
                    {this.renderPersonCard('Jakob Molin', 'Outside', 'SVK')}
                </View>
                <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center' }}>
                    {this.renderPersonCard('Jakob Molin', 'Outside', 'SVK')}
                    {this.renderPersonCard('Jakob Molin', 'Outside', 'SVK')}
                    {this.renderPersonCard('Jakob Molin', 'Outside', 'SVK')}
                </View>
                <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center' }}>
                    {this.renderPersonCard('Jakob Molin', 'Outside', 'SVK')}

                </View>
            </Card >
        )
    }
}

export default BestTeam;

