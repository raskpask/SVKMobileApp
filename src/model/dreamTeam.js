export function GetDreamTeamSeason(playerList) {
    const filteredPlayers = filterPlayers(playerList)
    console.log(getScores(filteredPlayers))
}
// Removes players with less than 3 games played
function filterPlayers(playerList) {
    let newList = []
    playerList.forEach((player, i) => {
        if (player.data[2] > 2) {
            newList.push(player)
        }
    });
    return newList
}
function getScores(playerList) {
    let outsidePlayerList = []
    let oppositePlayerList = []
    let setterPlayerList = []
    let liberoPlayerList = []
    let middlePlayerList = []
    playerList.forEach(player => {
        const scoreOutside = getScore(player, 40, 15, 35, 10)
        const scoreOpposite = getScore(player, 65, 25, 0, 10)
        const scoreSetter = getScore(player, 0, 40, 0, 60)
        const scoreLibero = getScore(player, 0, 0, 100, 0)
        // console.log(scoreLibero)
        // console.log(player.name)
        const scoreMiddles = getScore(player, 30, 20, 0, 50)

        if (scoreOutside > 1000)
            outsidePlayerList.push({ name: player.name, score: scoreOutside, club: player.data[1] })
        if (scoreOpposite > 1000)
            oppositePlayerList.push({ name: player.name, score: scoreOpposite, club: player.data[1] })
        if (scoreSetter > 1000)
            setterPlayerList.push({ name: player.name, score: scoreSetter, club: player.data[1] })
        if (scoreLibero > 1000)
            liberoPlayerList.push({ name: player.name, score: scoreLibero, club: player.data[1] })
        if (scoreMiddles > 1000)
            middlePlayerList.push({ name: player.name, score: scoreMiddles, club: player.data[1] })
    })
    return {
        outsides: outsidePlayerList.sort((a, b) => b.score - a.score),
        opposites: oppositePlayerList.sort((a, b) => b.score - a.score),
        setters: setterPlayerList.sort((a, b) => b.score - a.score),
        liberos: liberoPlayerList.sort((a, b) => b.score - a.score),
        middles: middlePlayerList.sort((a, b) => b.score - a.score)
    }
}

function getScore(player, attackEffProcent, serveEffProcent, receptionEffProcent, blockEffProcent) {
    const attackEff = player.data[28] == '-' || parseFloat(player.data[28]) == NaN ? 0 : parseFloat(player.data[28])
    const serveEff = player.data[14] == '-' || parseFloat(player.data[14]) == NaN ? 0 : parseFloat(player.data[14])
    const receptionEff = player.data[22] == '-' || parseFloat(player.data[22]) == NaN ? 0 : parseFloat(player.data[22])
    const blockEff = player.data[31] == '-' || parseFloat(player.data[31]) == NaN ? 0 : parseFloat(player.data[31])
    return (attackEff * attackEffProcent) + (serveEff * serveEffProcent) + (receptionEff * receptionEffProcent) + (blockEff * blockEffProcent)

}