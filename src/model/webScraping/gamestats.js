import { FormatName } from '../formatName';

export function ExtractPlayer(playerString) {
    const spikeKills = playerString.split('SpikeWin')[1].split('>')[1].split('<')[0]
    const spikesInBlock = playerString.split('SpikeHP')[1].split('>')[1].split('<')[0]
    const spikeErrors = playerString.split('SpikeErr')[1].split('>')[1].split('<')[0]
    const totalSpikes = playerString.split('SpikeTot')[1].split('>')[1].split('<')[0]
    const efficiency = totalSpikes == '-' ? '.' : Math.round((parseInt(spikeKills == '-' ? 0 : spikeKills) - (parseInt(spikeErrors == '-' ? 0 : spikeErrors) + parseInt(spikesInBlock == '-' ? 0 : spikesInBlock))) / parseInt(totalSpikes == '-' ? 0 : totalSpikes) * 100)
    const serveErrors = playerString.split('ServeErr')[1].split('>')[1].split('<')[0]
    const serveAces = playerString.split('ServeAce')[1].split('>')[1].split('<')[0]
    const blockWins = playerString.split('BlockWin')[1].split('>')[1].split('<')[0]
    const totalPoints = playerString.split('"PointsTot"')[1].split('>')[1].split('<')[0]
    const totalPointsInt = parseInt(totalPoints === '-' ? 0 : totalPoints)
    let negativePoints = parseInt(spikesInBlock === '-' ? 0 : spikesInBlock) + parseInt(spikeErrors === '-' ? 0 : spikeErrors) + parseInt(serveErrors === '-' ? 0 : serveErrors)
    if(negativePoints === 0)
        negativePoints = 1

    const mindfulMeter = Math.round(totalPointsInt / negativePoints * 100) / 100

    const playerNumber = playerString.split('PlayerNumber')[1] ? playerString.split('PlayerNumber')[1].split('>')[1].split('<')[0] : ''

    const playerData = [
        playerNumber,
        playerString.split('Set1')[1].split('>')[1].split('<')[0],
        playerString.split('Set2')[1].split('>')[1].split('<')[0],
        playerString.split('Set3')[1].split('>')[1].split('<')[0],
        playerString.split('Set4')[1].split('>')[1].split('<')[0],
        playerString.split('Set5')[1].split('>')[1].split('<')[0],

        totalPoints,
        playerString.split('"Points"')[1].split('>')[1].split('<')[0],
        playerString.split('L_VP')[1].split('>')[1].split('<')[0],
        mindfulMeter,

        playerString.split('ServeTot')[1].split('>')[1].split('<')[0],
        serveErrors,
        serveAces,

        playerString.split('RecTot')[1].split('>')[1].split('<')[0],
        playerString.split('RecErr')[1].split('>')[1].split('<')[0],
        playerString.split('RecPos')[1].split('>')[1].split('<')[0],
        playerString.split('RecPerf')[1].split('>')[1].split('<')[0],

        totalSpikes,
        spikeErrors,
        spikesInBlock,
        spikeKills,
        playerString.split('SpikePos')[1].split('>')[1].split('<')[0],
        efficiency + ' %',

        blockWins
    ]

    return playerData
}

export function ExtractNameAndNumber(playerString) {
    let playerName = playerString.split('"PlayerName"')[1].split('b>')[1].split('<')[0]
    return ([
        FormatName(playerName.split(' ')[1], playerName.split(' ')[0])
    ])

}
export function ExtractHomeTeam(data) {
    let playerHomeStringList = data.split('</colgroup>')[1].split('MatchDetails_PlayerNumber')
    let nameHomeTeam = []
    let playersHome = []
    let totalHome = []

    for (let i = 1; i < playerHomeStringList.length; i++) {
        if (i != playerHomeStringList.length - 1) {
            playersHome.push(ExtractPlayer(playerHomeStringList[i]))
            nameHomeTeam.push(ExtractNameAndNumber(playerHomeStringList[i]))
        } else {
            totalHome = ExtractPlayer(playerHomeStringList[i])
        }
    }
    nameHomeTeam.push(['Total'])

    return { 'nameHomeTeam': nameHomeTeam, 'playersHome': playersHome, 'totalHome': totalHome }
}
export function ExtractGuestTeam(data) {
    let playerGuestStringList = data.split('</colgroup>')[2].split('MatchDetails_PlayerNumber')
    let nameGuestTeam = []
    let playersGuest = []
    let totalGuest = []

    for (let i = 1; i < playerGuestStringList.length; i++) {
        if (i != playerGuestStringList.length - 1) {
            playersGuest.push(ExtractPlayer(playerGuestStringList[i]))
            nameGuestTeam.push(ExtractNameAndNumber(playerGuestStringList[i]))
        } else {
            totalGuest = ExtractPlayer(playerGuestStringList[i])
        }
    }
    nameGuestTeam.push(['Total'])

    return { 'nameGuestTeam': nameGuestTeam, 'playersGuest': playersGuest, 'totalGuest': totalGuest }
}
export function ExtractSets(data) {
    return data.split('WonSetHome')[1].split('>')[1].split('<')[0] + ' - ' + data.split('WonSetGuest')[1].split('>')[1].split('<')[0]
}
export function ExtractPointsInSets(data) {
    const rawResultPoints = data.split('SetsPartials')[1].split('>')[1].split('<')[0]
    const listOfSets = rawResultPoints.split('/')
    let resultPoints =
        '(' + listOfSets[0] + '-' + listOfSets[1].split(' ')[0] + ', ' +
        listOfSets[1].split(' ')[1] + '-' + listOfSets[2].split(' ')[0] + ', '
    if (listOfSets.length == 4)
        resultPoints += listOfSets[2].split(' ')[1] + '-' + listOfSets[3] + ')'
    else
        resultPoints += listOfSets[2].split(' ')[1] + '-' + listOfSets[3].split(' ')[0] + ', '

    if (listOfSets.length == 5)
        resultPoints += listOfSets[3].split(' ')[1] + '-' + listOfSets[4] + ')'
    else if (listOfSets.length == 6)
        resultPoints += listOfSets[3].split(' ')[1] + '-' + listOfSets[4].split(' ')[0] + ', '

    if (listOfSets.length == 6)
        resultPoints += listOfSets[4].split(' ')[1] + '-' + listOfSets[5] + ')'
    return resultPoints
}