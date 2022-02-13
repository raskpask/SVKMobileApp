const now = new Date()
const dateNow = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0')

export function ExtractOneMatch(matchString, gender) {
    let date
    let time
    if (matchString.split('"LB_DataOra"').length < 2) {
        time = matchString.split('"LB_Ora_Today"')[1].split('>')[1].split('<')[0]
        date = new Date().toISOString().slice(0, 10)
        const currentTime = new Date()
        const minutes = currentTime.getMinutes()
        if (time < currentTime.getHours() + ':' + (minutes > 5 ? minutes - 5 : minutes) && time > currentTime.getHours() - 3 + ':' + minutes) {
            this.setState({ isMatchToday: true })
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
    return matchData
}
export function ExtractCurrentMatches(data, gender) {
    const listOfGames = data.split('"DIV_Match_Main"')
    let matches = []
    for (let i = 1; i < listOfGames.length; i++) {
        matches.push(ExtractOneMatch(listOfGames[i], gender))
    }
    return matches
}
export function ExtractNews(data) {
    let listOfNews = []
    const listOfNewsString = data.split('"Content_Main_RP_Competitions_sm_HyperLink')
    for (let i = 1; i < listOfNewsString.length - 1; i++) {
        listOfNews.push(ExtractSingleNews(listOfNewsString[i]))
    }
    return listOfNews
}
export function ConcatMatches(currentMatchesW, currentMatchesM, settings) {
    let currentMatches = []
    let matchesToday = []
    let matcherOtherDAys = []
    if (settings !== null && settings.showMen && settings.showWomen) {
        currentMatches = currentMatchesW.concat(currentMatchesM).sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0)).sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
    } else if (settings !== null && settings.showWomen) {
        currentMatches = currentMatchesW.sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0)).sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
    } else if (settings !== null && settings.showMen) {
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
function ExtractSingleNews(newsString) {
    return {
        title: newsString.split('TileTitle')[1].split('>')[1].split('<')[0].split('  ').join('').split('\n').join(''),
        newsLink: 'http://svbf-web.dataproject.com/' + newsString.split('href=')[1].split('"')[1].split('&amp;')[0],
        image: newsString.split('background-image:url')[1].split('&quot;')[1].split('&quot;')[0].split(' ').join('%20'),
    }
}