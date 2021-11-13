import { SET_CURRENTMATCHESWOMEN, SET_CURRENTMATCHES, SET_CURRENTMATCHESMEN, SET_ISMATCHTODAYHOME,SET_LIVEBACKGROUDCOLORHOME, SET_SETTINGS } from "../constants/action-types";

export function setCurrentMatches(payload) {
    return { type: SET_CURRENTMATCHES, payload }
};
export function setCurrentMatchesWomen(payload) {
    return { type: SET_CURRENTMATCHESWOMEN, payload }
};
export function setCurrentMatchesMen(payload) {
    return { type: SET_CURRENTMATCHESMEN, payload }
};
export function setIsMatchTodayHome(payload) {
    return { type: SET_ISMATCHTODAYHOME, payload }
};
export function setLiveBackgroundColorHome(payload) {
    return { type: SET_LIVEBACKGROUDCOLORHOME, payload }
};
export function setSettings(payload) {
    return { type: SET_SETTINGS, payload }
};
