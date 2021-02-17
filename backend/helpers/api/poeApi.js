import axios from 'axios';
import { readFileSync } from 'fs';
import path from 'path';

const tabBaseUrl = 'https://www.pathofexile.com/character-window/get-stash-items'

// get latest poe.ninja chaos values from json file
function getLatestNinjaValuesFromJson() {
    const loc = path.resolve('./helpers/api/ninjaChaosValues.json');
    const ninjaChaosValues = JSON.parse(readFileSync(loc))
    const latestChaosValues = ninjaChaosValues[ninjaChaosValues.length - 1]

    return latestChaosValues
}

// #---- TAB OVERVIEW HELPERS
// step 1: get complete overview of tabs from POE API
export function getTabOverviewFromPoeApi(options) {
    const { accountName, league, POESESSID } = options;

    return axios
        .get(`${tabBaseUrl}?accountName=${accountName}&realm=pc&league=${league}&tabs=1&tabIndex=-1`, {
            headers: { cookie: `POESESSID=${POESESSID}` }
        })
        .then(res => res.data)
        .catch(console.log)
}

// step 2: take complete tab overview and extract name, colour, type
export function parseTabOverview(tabOverviewData) {
    const { numTabs, tabs } = tabOverviewData;

    return tabs.map(tab => {
        const { n, colour, type } = tab;
        return { n, colour, type }
    })
}

// get tab overview and call tab parse function
export function getAndParseTabOverview(options) {
    return getTabOverviewFromPoeApi(options)
        .then(data => parseTabOverview(data))
}

// #---- SINGLE TAB HELPERS
export function getTabFromPoeApi(options) {
    const {
        accountName,
        POESESSID,
        league,
        tabIndex,
    } = options;

    return axios
        .get(`${tabBaseUrl}?accountName=${accountName}&realm=pc&league=${league}&tabs=0&tabIndex=${tabIndex}`,
            { headers: { cookie: `POESESSID=${POESESSID}` } }
        )
        .then(res => res.data)
        .catch(err => err)
}

export function getAndExtractItemsFromTab(options) {
    return getTabFromPoeApi(options)
        .then(data => data.items)
        .catch(err => err);
}

function appendValueToItems(items) {
    const latestChaosValues = getLatestNinjaValuesFromJson().chaosValues

    return items.map(item => {
        let entry = latestChaosValues.filter(entry => entry.name === item.typeLine);
        let chaosValue = entry.length > 0 ? entry[0].chaosValue : 0;
        const totalChaosValue = item.stackSize ? chaosValue * item.stackSize : chaosValue;

        return {
            ...item,
            chaosValue,
            totalChaosValue
        }
    })
}

export function getTabAndExtractPropsFromItems(options) {
    return getAndExtractItemsFromTab(options)
        .then(items => {
            items = items.map(({ typeLine, stackSize, icon }) => ({ typeLine, stackSize, icon }))
            items = appendValueToItems(items)
            return items
        })
        .catch(err => err)
}