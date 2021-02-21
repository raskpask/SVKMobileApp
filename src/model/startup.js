import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'react-native-axios';
export default function RunAtStartup() {
    findNumberOfPlayersW(153)
    findNumberOfPlayersM(160)
}


function findNumberOfPlayersM(numberOfPlayers) {
    axios.post('http://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData', { "startIndex": 0, "maximumRows": parseInt(numberOfPlayers), "sortExpressions": "PointsTot_ForAllPlayerStats DESC", "filterExpressions": [], "compID": "174", "phaseID": "266", "playerSearchByName": "" })
        .then(() => {
            findNumberOfPlayersM(numberOfPlayers + 1)
        })
        .catch(() => {
            try {
                AsyncStorage.setItem("numberOfPlayersM", JSON.stringify(numberOfPlayers - 1))
            } catch (e) {
                console.warn(e)
            }
        });
}
function findNumberOfPlayersW(numberOfPlayers) {
    axios.post('http://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData', { "startIndex": 0, "maximumRows": parseInt(numberOfPlayers), "sortExpressions": "PointsTot_ForAllPlayerStats DESC", "filterExpressions": [], "compID": "175", "phaseID": "247", "playerSearchByName": "" })
        .then(() => {
            findNumberOfPlayersW(numberOfPlayers + 1)
        })
        .catch(() => {
            try {
                AsyncStorage.setItem("numberOfPlayersW", JSON.stringify(numberOfPlayers - 1))
            } catch (e) {
                console.warn(e)
            }
        });
}