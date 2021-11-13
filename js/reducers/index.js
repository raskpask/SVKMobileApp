import { SET_CURRENTMATCHES, SET_CURRENTMATCHESWOMEN, SET_CURRENTMATCHESMEN, SET_ISMATCHTODAYHOME, SET_LIVEBACKGROUDCOLORHOME, SET_SETTINGS } from "../constants/action-types";

const initialState = {
    currentMatches: {},
    currentMatchesWomen: {},
    currentMatchesMen: {},
    isMatchTodayHome: false,
    liveBackgroundColorHome: 'white',
    settings: {
        league: 'Men',
        showMen: true,
        showWomen: true,
        standardTeam: 'None'
    }
};

function rootReducer(state = initialState, action) {
    if (action.type === SET_CURRENTMATCHES) {
        return Object.assign({}, state, {
            currentMatches: action.payload
        });
    } else if (action.type === SET_CURRENTMATCHESWOMEN) {
        return Object.assign({}, state, {
            currentMatchesWomen: action.payload
        });
    } else if (action.type === SET_CURRENTMATCHESMEN) {
        return Object.assign({}, state, {
            currentMatchesMen: action.payload
        });
    } else if (action.type === SET_ISMATCHTODAYHOME) {
        return Object.assign({}, state, {
            isMatchTodayHome: action.payload
        });
    } else if (action.type === SET_LIVEBACKGROUDCOLORHOME) {
        return Object.assign({}, state, {
            isMatchTodayHome: action.payload
        });
    } else if (action.type === SET_SETTINGS) {
        return Object.assign({}, state, {
            settings: action.payload
        });
    }
    return state;
}

export default rootReducer; {

}