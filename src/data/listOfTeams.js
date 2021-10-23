export function GetListOfTeams(gender, addAllTeams) {
    const allTeamsM = ['All Teams', 'Sollentuna VK', 'Falkenberg VBK', 'Habo WK', 'Lunds VK', 'Örkelljung VK', 'RIG Falköping', 'Södertälje VK', 'Uppsala VBS', 'Vingåkers VK', 'Hylte/Halmstad', 'Floby VK']
    const allTeamsW = ['All Teams', 'Sollentuna VK ', 'Engelholm VBS', 'Örebro Volley', 'Lunds VK ', 'Värnamo VBA', 'RIG Falköping ', 'Gislaved VK', 'Linköping VC', 'IKSU Volleyboll', 'Lindesberg Volley', 'Hylte/Halmstad ']
    let listOfTeamsM = ['Sollentuna VK (M)', 'Falkenberg VBK (M)', 'Habo WK (M)', 'Lunds VK (M)', 'Örkelljung VK (M)', 'RIG Falköping (M)', 'Södertälje VK (M)', 'Uppsala VBS (M)', 'Vingåkers VK (M)', 'Hylte/Halmstad (M)', 'Floby VK (M)']
    let listOfTeamsW = ['Sollentuna VK (W)', 'Engelholm VBS (W)', 'Örebro Volley (W)', 'Lunds VK (W)', 'Värnamo VBA (W)', 'RIG Falköping (W)', 'Gislaved VK (W)', 'Linköping VC (W)', 'IKSU Volleyboll (W)', 'Lindesberg Volley (W)', 'Hylte/Halmstad (W)']
    const allTeams = ['Sollentuna VK (M)', 'Falkenberg VBK (M)', 'Habo WK (M)', 'Lunds VK (M)', 'Örkelljung VK (M)', 'RIG Falköping (M)', 'Södertälje VK (M)', 'Uppsala VBS (M)', 'Vingåkers VK (M)', 'Hylte/Halmstad (M)', 'Floby VK (M)', 'Sollentuna VK (W)', 'Engelholm VBS (W)', 'Örebro Volley (W)', 'Lunds VK (W)', 'Värnamo VBA (W)', 'RIG Falköping (W)', 'Gislaved VK (W)', 'Linköping VC (W)', 'IKSU Volleyboll (W)', 'Lindesberg Volley (W)', 'Hylte/Halmstad (W)']
    if (gender == 'Men' && addAllTeams) {
        return allTeamsM
    } else if (gender == 'Women' && addAllTeams) {
        return allTeamsW
    } else if (gender == 'Men') {
        return listOfTeamsM
    } else if (gender == 'Women') {
        return listOfTeamsW
    } else {
        return allTeams
    }
}