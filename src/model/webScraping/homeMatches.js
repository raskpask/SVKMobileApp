import { useDispatch, useSelector } from 'react-redux'
import { setCurrentMatches, setCurrentMatchesWomen, setCurrentMatchesMen, setIsMatchTodayHome, setLiveBackgroundColorHome } from '../../../js/actions/index';

const liveBackgroundColor = useSelector((state) => state.liveBackgroundColorHome.value)
const isMatchToday = useSelector((state) => state.isMatchTodayHome.value)
const dispatch = useDispatch()

export async function getAndSetCurrentMatches() {
    let currentMatchesM = []
    let currentMatchesW = []
    await axios.get(urlMen)
        .then(function (response) {
            currentMatchesM = extractCurrentMatches(response.data, 'men')
        }.bind(this));
    await axios.get(urlWomen)
        .then(function (response) {
            currentMatchesW = extractCurrentMatches(response.data, 'women')
        }.bind(this));

    if (isMatchToday) {
        this.interval = setInterval(() => dispatch(setLiveBackgroundColorHome(liveBackgroundColor === 'white' ? 'yellow' : 'white')), 1000);
    }
    const currentMatches = concatMatches(currentMatchesW, currentMatchesM)
    AsyncStorage.setItem(GetKey('currentMatchesHomeM'), JSON.stringify(currentMatchesM))
    AsyncStorage.setItem(GetKey('currentMatchesHomeW'), JSON.stringify(currentMatchesW))
    dispatch(setCurrentMatches(currentMatches))
    dispatch(setCurrentMatchesWomen(currentMatchesW))
    dispatch(setCurrentMatchesMen(currentMatchesM))
}
function concatMatches(currentMatchesW, currentMatchesM) {
    const settings = useSelector((state) => state.settings.value)
    let currentMatches = []
    let matchesToday = []
    let matcherOtherDAys = []
    if (settings.showMen && settings.showWomen) {
        currentMatches = currentMatchesW.concat(currentMatchesM).sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0)).sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
    } else if (settings.showWomen) {
        currentMatches = currentMatchesW.sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0)).sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
    } else if (settings.showMen) {
        currentMatches = currentMatchesM.sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0)).sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
    }
    currentMatches.forEach(match => {
        if (match.date === dateNow)
            matchesToday.push(match)
        else
            matcherOtherDAys.push(match)
    })
    return matchesToday.concat(matcherOtherDAys)
}
function extractCurrentMatches(data, gender) {
    const listOfGames = data.split('"DIV_Match_Main"')
    let matches = []
    for (let i = 1; i < listOfGames.length; i++) {
        matches.push(extractOneMatch(listOfGames[i], gender))
    }
    return matches
}
function extractOneMatch(matchString, gender) {
    let date
    let time
    if (matchString.split('"LB_DataOra"').length < 2) {
        time = matchString.split('"LB_Ora_Today"')[1].split('>')[1].split('<')[0]
        date = new Date().toISOString().slice(0, 10)
        const currentTime = new Date()
        const minutes = currentTime.getMinutes()
        if (time < currentTime.getHours() + ':' + (minutes > 5 ? minutes - 5 : minutes) && time > currentTime.getHours() - 3 + ':' + minutes) {
            dispatch(setIsMatchTodayHome(true))
        }
    } else {
        const dateAndTime = matchString.split('"LB_DataOra"')[1].split('>')[1].split('<')[0]
        date = dateAndTime.split(' - ')[0]
        time = dateAndTime.split(' - ')[1]
    }
    let streamLink
    if (matchString.split('"DIV_Stream"')[1]?.length == undefined) {
        streamLink = undefined
    } else {
        streamLink = 'http://svbf-web.dataproject.com/' + matchString.split('"DIV_Stream"')[1].split('&quot;')[1].split('&quot;')
    }
    let statsLink = ''
    const statsLinkList = matchString.split('window.location=&#39;')[1].split('&#39;;')[0].split('amp;')
    if (statsLink != undefined && statsLink != null) {
        statsLink = 'http://svbf-web.dataproject.com/'
        statsLinkList.forEach(element => {
            statsLink += element;
        });
    }
    let livescoreLink = matchString.split('onclick="window.open(')[1]?.split('&#39;')[1].split('&#39;')[0]
    if (livescoreLink !== undefined) {
        livescoreLink = 'http://svbf-web.dataproject.com' + livescoreLink;
    }
    const matchData = {
        gender: gender,
        date: date,
        time: time,
        streamLink: streamLink,
        statsLink: statsLink,
        homeLogo: matchString.split('"IMG_Home"')[1].split('src="')[1].split('"')[0],
        guestLogo: matchString.split('"IMG_Guest"')[1].split('src="')[1].split('"')[0],
        homeTeam: matchString.split('"Label1"')[1].split('>')[1].split('<')[0],
        guestTeam: matchString.split('"Label2"')[1].split('>')[1].split('<')[0],
        homeSets: matchString.split('"Label3"')[1]?.split('>')[1].split('<')[0] ?? 0,
        guestSets: matchString.split('"Label4"')[1]?.split('>')[1].split('<')[0] ?? 0,
        set1: matchString.split('"Label5"')[1]?.split('>')[1].split('<')[0],
        set2: matchString.split('"Label7"')[1]?.split('>')[1].split('<')[0],
        set3: matchString.split('"Label9"')[1]?.split('>')[1].split('<')[0],
        set4: matchString.split('"Label11"')[1]?.split('>')[1].split('<')[0],
        set5: matchString.split('"Label13"')[1]?.split('>')[1].split('<')[0],
        livescoreLink: livescoreLink,
    }
    return (matchData)
}