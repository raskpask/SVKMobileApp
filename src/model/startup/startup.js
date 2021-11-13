import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetKey } from '../storageKeys';

import { findNumberOfPlayers } from './findNumberOfPlayers';
import { getAndSetCurrentMatches } from './../webScraping/homeMatches';

export default function RunAtStartup() {
    findNumberOfPlayers()
    setStandardSettings()
    getAndSetCurrentMatches()
}

async function setStandardSettings() {
    try {
        settings = JSON.parse(await AsyncStorage.getItem(GetKey('settings')))
        if (!settings) {
            settings = {
                league: 'Men',
                showMen: true,
                showWomen: true,
                standardTeam: 'None'
            }
            AsyncStorage.setItem(GetKey('settings'), JSON.stringify(settings))
        }

    } catch (e) {
        console.warn(e)
    }
}