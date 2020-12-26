import React, { Component } from 'react';
import { View, Text,TouchableOpacity,Image } from 'react-native';
import { Card } from 'react-native-elements'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class MatchCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        // console.log(this.props.match)
        return (
            <Card >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    {
                        this.props.match.streamLink != undefined ?
                            <Icon name="youtube-tv" size={30}
                                onPress={() => this.props.navigation.navigate('Livestream', { link: this.props.match.streamLink })}
                            /> : <Text></Text>
                    }
                    <Text style={{ maxWidth: 80, textAlign: 'center' }}>{this.props.match.date}{this.props.isCalendar !== true ? this.props.match.gender === 'men' ? 'Men' : 'Women' : ''} </Text>
                    <Text style={{ maxWidth: 80, textAlign: 'center' }}>{this.props.match.time}</Text>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: 200
                        }}
                        disabled={this.props.isdisabled}
                        onPress={() => this.props.navigation.navigate('Match statistics', { tempMatch: this.props.match })}
                    >
                        <Image source={{ uri: this.props.match.homeLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                        <View
                            style={{
                                flexDirection: 'column',

                            }}>
                            <Text style={{ textAlign: 'center', fontWeight: "bold" }}>{this.props.match.homeSets} - {this.props.match.guestSets} </Text>
                            <Text style={{ maxWidth: 80, textAlign: 'center', fontSize: 10 }}>{this.props.match.set1 ? '(' + this.props.match.set1 + ', ' + this.props.match.set2 + ', ' + this.props.match.set3 + (this.props.match.set4 ? ', ' + this.props.match.set4 : '') + (this.props.match.set5 ? ',' + this.props.match.set5 + ')' : ')') : ''}</Text>
                        </View>
                        <Image source={{ uri: this.props.match.guestLogo }} style={{ width: 50, height: 40, resizeMode: 'contain' }} />
                    </TouchableOpacity>
                </View>
            </Card>
        )
    }
}

export default MatchCard;