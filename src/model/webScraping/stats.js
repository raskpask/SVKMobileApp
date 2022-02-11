import { formatName } from '../formatName'
export function ExtractNameAndStats(data) {
    return {
        name: formatName(data.Name, data.Surname),
        team: data.Team,
        totalPoints: data.PointsTot_ForAllPlayerStats,
        totalKills: data.SpikeWin,
        totalBlocks: data.BlockWin,
        totalAces: data.ServeWin,
    }
}
export function ExtractData(data) {
    const totalServ = data.ServeErr + data.ServeWin + data.ServeMinus + data.ServePlus + data.ServeHP + data.ServeEx
    const totalRec = data.RecErr + data.RecWin + data.RecMinus + data.RecPlus + data.RecHP + data.RecEx
    const totalAtt = data.SpikeErr + data.SpikeWin + data.SpikeMinus + data.SpikePlus + data.SpikeHP + data.SpikeEx
    const totalBlock = data.BlockErr + data.BlockWin + data.BlockMinus + data.BlockPlus + data.BlockHP + data.BlockEx
    return {
        name: data.Name + ' ' + data.Surname,
        data: [
            data.Number,
            data.Team.split(' ')[0],
            data.PlayedMatches,
            data.PlayedSets,
            data.PointsTot_ForAllPlayerStats,
            data.Points,
            data.PointsW_P,
            totalServ,
            data.ServeErr,
            data.ServeEx,
            data.ServeMinus,
            data.ServePlus,
            data.ServeHP,
            data.ServeWin,
            totalServ > 20 ? Math.round((data.ServeWin * 2 + data.ServePlus + data.ServeHP * 2 - data.ServeMinus - data.ServeErr * 2) / totalServ * 100) + ' %' : '-',
            totalRec,
            data.RecErr,
            data.RecHP,
            data.RecMinus,
            data.RecEx,
            (data.RecPlus + data.RecWin) / totalRec * 100 ? Math.round((data.RecPlus + data.RecWin) / totalRec * 100) + ' %' : '-',
            (data.RecWin) / totalRec * 100 ? Math.round((data.RecWin) / totalRec * 100) + ' %' : '-',
            totalRec > 20 ? Math.round((data.RecWin * 2 + data.RecPlus - data.RecMinus - data.RecErr * 2 - data.RecHP * 2) / totalRec * 100) + ' %' : '-',
            totalAtt,
            data.SpikeErr,
            data.SpikeHP,
            data.SpikeWin,
            Math.round((data.SpikeWin) / totalAtt * 100) ? Math.round((data.SpikeWin) / totalAtt * 100) + ' %' : '-',
            Math.round((data.SpikeWin - data.SpikeErr - data.SpikeHP) / totalAtt * 100) ? Math.round((data.SpikeWin - data.SpikeErr - data.SpikeHP) / totalAtt * 100) + ' %' : '-',
            totalBlock,
            data.BlockErr,
            Math.round((data.BlockWin) / totalBlock * 100) ? Math.round((data.BlockWin) / totalBlock * 100) + ' %' : '-',
            data.BlockWin,
        ]
    }
}
export function ExtractTotalrow(playerList){
    let totPoints = 0, bp = 0, wl = 0, serTot = 0, serErr = 0, serMedium = 0, serMinus = 0, serPlus = 0, serOVP = 0, serAce = 0, recTot = 0, recErr = 0, recOVP = 0, recMed = 0, recMin = 0, recPos = 0, recPerf = 0, attTot = 0, attErr = 0, attBlo = 0, attPerf = 0, bloTot = 0, bloErr = 0, bloPerf = 0
    playerList.map((player, i) => {
        totPoints += player.data[4]
        bp += player.data[5]
        wl += player.data[6]
        serTot += player.data[7]
        serErr += player.data[8]
        serMedium += player.data[9]
        serMinus += player.data[10]
        serPlus += player.data[11]
        serOVP += player.data[12]
        serAce += player.data[13]
        recTot += player.data[15]
        recErr += player.data[16]
        recOVP += player.data[17]
        recMin += player.data[18]
        recMed += player.data[19]
        recPos += player.data[20] === '-' ? 0 : Math.round(parseInt(player.data[20].split(' ')[0]) / 100 * player.data[15])
        recPerf += player.data[21] === '-' ? 0 : Math.round(parseInt(player.data[21].split(' ')[0]) / 100 * player.data[15])
        attTot += player.data[23]
        attErr += player.data[24]
        attBlo += player.data[25]
        attPerf += player.data[26]
        bloTot += player.data[29]
        bloErr += player.data[30]
        bloPerf += player.data[32]
    })
    return ['-', '-', '-', '-', totPoints, bp, wl, serTot, serErr, serMedium, serMinus, serPlus, serOVP, serAce, (serTot > 20) ? Math.round((serAce * 2 + serOVP * 2 + serPlus - serMinus - serErr * 2) / serTot * 100) + ' %' : '-',
        recTot, recErr, recOVP, recMin, recMed, Math.round(recPos / recTot * 100) + ' %', Math.round(recPerf / recTot * 100) + ' %', (recTot > 20) ? Math.round((recPerf + recPos - recMin - recOVP * 2 - recErr * 2) / recTot * 100) + ' %' : '-',
        attTot, attErr, attBlo, attPerf, Math.round(attPerf / attTot * 100) + ' %', Math.round((attPerf - attBlo - attErr) / attTot * 100) + ' %',
        bloTot, bloErr, Math.round(bloPerf / bloTot * 100) + ' %', bloPerf
    ]
}