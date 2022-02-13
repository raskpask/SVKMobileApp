import { GetTeamFromLogo } from '../teamHelper';

export function ExtractMatches(data) {
    let matches = []
    let matchesStringList = data.split('$HF_WonSetHome')
    for (let i = 1; i < matchesStringList.length; i++) {
        matches.push(extractMatch(matchesStringList[i], i))
    }
    return matches
}
function extractMatch(matchString) {
    const statsLinkStringList = matchString.split('onclick="javascript:window.location=')[1].split('>')[0].split('&')
    let statsLink = ''
    for (let i = 1; i < statsLinkStringList.length - 1; i++) {
        statsLink += statsLinkStringList[i].split(';')[1]
        if (i != statsLinkStringList.length - 1) {
            statsLink += '&';
        }
    }
    let streamLink
    if (matchString.split('onclick="f_OpenInPlayer')[1]?.length == undefined) {
        if (matchString.split('onclick="f_OpenStreaming')[1]?.length == undefined) {
            streamLink = undefined
        } else {
            streamLink = 'http://svbf-web.dataproject.com/' + matchString.split('onclick="f_OpenStreaming')[1].split('&quot;')[1].split('&quot;')[0]
        }
    } else {
        streamLink = 'http://svbf-web.dataproject.com/' + matchString.split('onclick="f_OpenInPlayer')[1].split('&quot;')[1].split('&quot;')[0]
    }

    const homeLogo = matchString.split('Home" class="Calendar_DIV_TeamLogo DIV_TeamLogo_Box" style="background-image:url(&quot;')[1].split('&quot;')[0]
    const guestLogo = matchString.split('Guest" class="Calendar_DIV_TeamLogo DIV_TeamLogo_Box" style="background-image:url(&quot;')[1].split('&quot;')[0]
    const homeTeam = GetTeamFromLogo(homeLogo.split('_')[1].split('.')[0])
    const guestTeam = GetTeamFromLogo(guestLogo.split('_')[1].split('.')[0])
    const matchData = {
        homeSets: matchString.split('WonSetHome" value="')[1].split('"')[0],
        guestSets: matchString.split('WonSetGuest" value="')[1].split('"')[0],
        statsLink: 'http://svbf-web.dataproject.com/' + statsLink,
        streamLink: streamLink,

        date: matchString.split('DataOra"')[1].split('>')[1].split(' -')[0],
        time: matchString.split('DataOra"')[1].split('>')[1].split(' - ')[1].split('<')[0],
        arena: matchString.split('Palasport">')[1].split('</span>')[0],

        homeTeam: homeTeam,
        homeLogo: homeLogo,
        guestTeam: guestTeam,
        guestLogo: guestLogo,

        ref1: matchString.split('Arbitro1">')[1].split('</span>')[0],
        ref2: matchString.split('Arbitro2">')[1].split('</span>')[0],
    }
    return matchData
}