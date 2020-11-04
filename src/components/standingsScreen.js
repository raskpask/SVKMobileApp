import React, { Component } from 'react';
import WebPage from './webPage';
import axios from 'react-native-axios';

class StandingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            standings: "<div>Loading...</div>"
        }
    }
    componentDidMount() {
        console.log("ComponentdidMount")
        axios.get('http://svbf-web.dataproject.com/CompetitionStandings.aspx?ID=174&PID=266')
            .then(function (response) {
                let test = response.data.split('Standing</span>')[1].split('<input')[0]
                this.setState({standings: response.data.split('Standing</span>')[1].split('<input id="RG')[0]})
                console.log(test)
            }.bind(this));

    }
    render() {
        { console.log(this.state.standings) }
        return (
            <WebPage html={this.state.standings} />
        )
    }
}
export default StandingsScreen;