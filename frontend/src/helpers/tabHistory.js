// grab tabContentHistory from localStorage 
export function getTabHistory() {
    return JSON.parse(localStorage.getItem("tabContentHistory"));
}

// get all the pings within timeInterval (in ms) from the latest ping (NOT within timeInterval from current datetime)
export function getLatestPings(timeInterval) {
    const tabHistory = getTabHistory();

    const length = tabHistory.length;

    if (length > 0) {
        const latestPingDate = tabHistory[length-1].date;
        const pingsInInterval = tabHistory.filter(historyEntry => new Date(latestPingDate) - new Date(historyEntry.date) < timeInterval )
        return pingsInInterval
    }
}

// reduce totalChaosValue of tabContentHistory entry 'ping'
export function getPingTotalValue(ping) {
    return ping.reduce((acc, cur) => {
        return acc + cur.totalChaosValue
    }, 0)
}

export function computePingDifference(firstPing, secondPing) {
    // loop over second ping, add every (unique) entry to 'difference' as typeLine/stackSize k/v pair
    // then loop over first ping. if a key exists in second ping, subtract first ping's stackSize from that key's value
    // else, add key's value with flipped sign (since if key doesn't exist in second ping, we lost all those items that were present in the first)
    const difference = {};

    for (const item of secondPing) {
        if (difference[item.typeLine] > 0) {
            difference[item.typeLine] += (item.stackSize || 1)
        } else {
            difference[item.typeLine] = (item.stackSize || 1);
        }
    }

    for (const item of firstPing) {
        if (difference.hasOwnProperty(item.typeLine)) {
            difference[item.typeLine] -= (item.stackSize || 1)
        } else {
            difference[item.typeLine] = -1*(item.stackSize || 1)
        }
    }

    return difference
}

export function computeProgressOverInterval(firstPing, lastPing) {
    firstPing = firstPing.items;
    lastPing = lastPing.items;

    const currencyDelta = getPingTotalValue(lastPing) - getPingTotalValue(firstPing);
    const itemDelta = computePingDifference(firstPing, lastPing);

    return { currencyDelta, itemDelta }
}


// compute total value difference between first and last ping in interval
// and compute item progress (items gained/lost between pings)
export function getProgressOverInterval(timeInterval) {
    const pingsWithinInterval = getLatestPings(timeInterval);  // extract all pings within timeInterval from latest ping (includes latest ping)

    if (pingsWithinInterval.length > 1) {
        return computeProgressOverInterval(pingsWithinInterval[0], pingsWithinInterval[pingsWithinInterval.length-1])
    }

    return 'There are fewer than two pings in the specified time interval'
}