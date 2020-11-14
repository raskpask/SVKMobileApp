import React, { Component } from 'react';
import { View, Text, Button, Image } from 'react-native';
import axios from 'react-native-axios';

class GameStats extends Component {
    constructor(props) {
        super(props);
    }
    async componentDidMount() {
        await axios.get('http://svbf-web.dataproject.com/MatchStatistics.aspx?mID=10306&ID=174&CID=234&PID=266&type=LegList')
            .then(function (response) {
                this.extractGameStats(response.data)
            }.bind(this));
    }
    extractGameStats(data) {
        let playersHome = []
        let playesGuest = []
        let playerHomeStringList = data.split('MatchDetails_PlayerNumber')
        let playerGuestStringList = data.split('<input id="RG_GuestTeam_ClientState" name="RG_GuestTeam_ClientState"')[1].split('<span id="PlayerNumber">')
        console.log("START!!!!!")
        playersHome.push(this.extractPlayer(playerHomeStringList[1]))
        for (let i = 2; i < playerHomeStringList.length; i++) {
        }
    }
    extractPlayer(playerString) {
        const spikeKills = playerString.split('SpikeWin')[1].split('>')[1].split('<')[0]
        const spikesInBlock = playerString.split('SpikeHP')[1].split('>')[1].split('<')[0]
        const spikeErrors = playerString.split('SpikeErr')[1].split('>')[1].split('<')[0]
        const totalSpikes = playerString.split('SpikeTot')[1].split('>')[1].split('<')[0]
        const efficiency = (parseInt(spikeKills) - (parseInt(spikeErrors) + parseInt(spikesInBlock))) / parseInt(totalSpikes) * 100

        const playerData = {
            playerNumber: playerString.split('PlayerNumber')[1].split('>')[1].split('<')[0],
            playerName: playerString.split('PlayerName')[1].split('>')[1].split('<')[0],

            startingPosSet1: playerString.split('Set1')[1].split('>')[1].split('<')[0],
            startingPosSet2: playerString.split('Set2')[1].split('>')[1].split('<')[0],
            startingPosSet3: playerString.split('Set3')[1].split('>')[1].split('<')[0],
            startingPosSet4: playerString.split('Set4')[1].split('>')[1].split('<')[0],
            startingPosSet5: playerString.split('Set5')[1].split('>')[1].split('<')[0],

            totalPoints: playerString.split('"PointsTot"')[1].split('>')[1].split('<')[0],
            breakPoints: playerString.split('"Points"')[1].split('>')[1].split('<')[0],
            winLossPoints: playerString.split('L_VP')[1].split('>')[1].split('<')[0],

            totalServes: playerString.split('ServeTot')[1].split('>')[1].split('<')[0],
            errorsServe: playerString.split('ServeErr')[1].split('>')[1].split('<')[0],
            aceServe: playerString.split('ServeAce')[1].split('>')[1].split('<')[0],

            totalReceptions: playerString.split('RecTot')[1].split('>')[1].split('<')[0],
            errorReceptions: playerString.split('RecErr')[1].split('>')[1].split('<')[0],
            positiveReceptions: playerString.split('RecPos')[1].split('>')[1].split('<')[0],
            perfectReceptions: playerString.split('RecPerf')[1].split('>')[1].split('<')[0],

            totalSpikes: totalSpikes,
            spikeErrors: spikeErrors,
            spikesInBlock: spikesInBlock,
            spikeKills: spikeKills,
            killProcentage: playerString.split('SpikePos')[1].split('>')[1].split('<')[0],
            efficiency: efficiency,

            blockPoints: playerString.split('BlockWin')[1].split('>')[1].split('<')[0],
        }
        console.log(playerData)
    }
    render() {
        return (
            <View>
                <Text>This is the homepage</Text>
                <Button
                    title="Go to Stats"
                    onPress={() => this.props.navigation.navigate('Calendar')}
                />
            </View>
        )
    }
}
export default GameStats;