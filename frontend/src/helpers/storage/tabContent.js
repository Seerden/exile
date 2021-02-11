// in development, keep all this state in localStorage
// might eventually implement a database

// tabContentHistory localStorage entry is an array of objects

// get tabContent from API
function getTabContentHistoryFromLocalStorage() {
    const tabContentHistory = JSON.parse(localStorage.getItem("tabContentHistory"));
    return tabContentHistory
}

function parseTabPing(tabContentPing) {
    // @TODO: implement

    // while not implemented, just extract typeLine, totalChaosValue and stackSize
    const parsedPing = tabContentPing.map(item => ({
        typeLine: item.typeLine, 
        stackSize: item.stackSize || 1,
        totalChaosValue: item.totalChaosValue
    }))

    return parsedPing
}

// append newly obtained tabContent state to storage
export function appendToTabContent(tabContentPing) {
    // extract current state
    const tabContentHistory = getTabContentHistoryFromLocalStorage() || [];

    // parse new entry and append to object
    const parsedTabContentPing = parseTabPing(tabContentPing);
    tabContentHistory.push({
        date: new Date(),
        items: parsedTabContentPing
    });

    // stringify and save to localStorage
    const stringifiedTabHistory = JSON.stringify(tabContentHistory);
    localStorage.setItem("tabContentHistory", stringifiedTabHistory);
}