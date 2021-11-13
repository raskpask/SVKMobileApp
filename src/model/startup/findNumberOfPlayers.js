import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'react-native-axios';

export function findNumberOfPlayers(){
    date = new Date()
    if(date.getMonth() > 8 || date.getMonth() < 5){
        findNumberOfPlayersW(100)
        findNumberOfPlayersM(100)
    } else {
        findNumberOfPlayersW(20)
        findNumberOfPlayersM(20)
    }
}
function findNumberOfPlayersM(numberOfPlayers) {
    axios.post("https://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData", { "startIndex": 0, "maximumRows": numberOfPlayers, "sortExpressions": "PointsTot_ForAllPlayerStats DESC", "filterExpressions": [], "compID": "264", "phaseID": "0", "playerSearchByName": "" })
    .then((res) => {
        if (res.data.d.length == 0) {
            try {
                AsyncStorage.setItem("numberOfPlayersM", JSON.stringify(numberOfPlayers - 1))
            } catch (e) {
                console.warn(e)
            }
        }
        else {
            findNumberOfPlayersM(numberOfPlayers + 1)
        }
    }).catch(() => {
            AsyncStorage.setItem("numberOfPlayersM", JSON.stringify(numberOfPlayers - 1))
        });
}
function findNumberOfPlayersW(numberOfPlayers) {
    axios.post("https://svbf-web.dataproject.com/Statistics_AllPlayers.aspx/GetData", { "startIndex": 0, "maximumRows": numberOfPlayers, "sortExpressions": "PointsTot_ForAllPlayerStats DESC", "filterExpressions": [], "compID": "263", "phaseID": "0", "playerSearchByName": "" })
        .then((res) => {
            if (res.data.d.length == 0) {
                try {
                    AsyncStorage.setItem("numberOfPlayersW", JSON.stringify(numberOfPlayers - 1))
                } catch (e) {
                    console.warn(e)
                }
            }
            else {
                findNumberOfPlayersW(numberOfPlayers + 1)
            }
        }).catch(() => {
            AsyncStorage.setItem("numberOfPlayersW", JSON.stringify(numberOfPlayers - 1))
        });
}