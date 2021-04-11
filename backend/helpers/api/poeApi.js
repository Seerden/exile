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
        .catch(err => err)
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
        .then(res => {
            return res.data
        })
        .catch(err => err)
}

export function getAndExtractItemsFromTab(options) {
    return getTabFromPoeApi(options)
        .then(data => {
            if (data.items) {
                return data.items
            } else { return null }
        })
        .catch(err => console.log(err));
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
            if (items.length > 0) {
                items = items.map(({ typeLine, stackSize, icon }) => ({ typeLine, stackSize, icon }))
                items = appendValueToItems(items)
                return items
            }
        })
        .catch(err => err)
}

export function extractTotalChaosValue(tabContents) {
    return +tabContents.reduce((acc, cur) => acc + cur.totalChaosValue, 0).toFixed(0) || 0
}

export function makeStackedContents(tabContents) {
    let stacked = {};

    for (let item of tabContents) {
        // console.log(item.typeLine);
        if (!stacked[item.typeLine]) {
            stacked[item.typeLine] = {
                stackSize: item.stackSize || 1,
                icon: item.icon,
                chaosValue: item.chaosValue,
            }
        } else {
            stacked[item.typeLine].stackSize += (item.stackSize || 1)
        }
    }

    return stacked;
}

export function makeStackedArray(stacked) {
    return Object.keys(stacked).map(item => ({
        typeLine: item,
        stackSize: stacked[item].stackSize,
        chaosValue: stacked[item].chaosValue,
        icon: stacked[item].icon
    }))
}

export async function grabTabs(tabIndices, { accountName, POESESSID, league }) {
    let tabContents = [];
    let err = false;

    for (let tabIndex of tabIndices) {
        const options = { accountName, POESESSID, league, tabIndex }

        try {
            let tab = await getTabAndExtractPropsFromItems(options)
            if (tab && tab.length > 0) {
                tabContents.push(tab)
            }
        } catch (error) {
            err = true;
            console.log(error);
        }
    }

    tabContents = tabContents.flat();
    let stackedObject = makeStackedContents(tabContents);
    let stacked = makeStackedArray(stackedObject)

    return [tabContents, stacked, err]
}