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