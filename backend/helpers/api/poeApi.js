import axios from 'axios';

const tabBaseUrl = 'https://www.pathofexile.com/character-window/get-stash-items'

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
            {
                headers: {
                    cookie: `POESESSID=${POESESSID}`
                }
            }
        )
        .then(res => res.data);
}

export function getItemsFromTab(options) {
    return getTabFromPoeApi(options)
        .then(data => data.items)
}