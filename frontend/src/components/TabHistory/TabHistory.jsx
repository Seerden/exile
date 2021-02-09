import React, { useState } from "react";
import './style/TabHistory.scss'
import dayjs from 'dayjs';
import ExpandButton from "components/_shared/ExpandButton";
import useExpandToggle from "helpers/hooks/useExpandToggle";

// grab tabContentHistory from localStorage 
function getTabHistory() {
    return JSON.parse(localStorage.getItem("tabContentHistory"));
}

// compute total value difference between first and last ping in interval
// and compute item progress (items gained/lost between pings)
function getProgressOverInterval(timeInterval) {
    const pingsWithinInterval = getLatestPings(timeInterval);  // extract all pings within timeInterval from latest ping (includes latest ping)

    if (pingsWithinInterval.length > 1) {
        return computeProgressOverInterval(pingsWithinInterval[0], pingsWithinInterval[pingsWithinInterval.length-1])
    }

    return 'There are fewer than two pings in the specified time interval'
}

function computeProgressOverInterval(firstPing, lastPing) {
    firstPing = firstPing.items;
    lastPing = lastPing.items;

    const currencyDelta = getPingTotalValue(lastPing) - getPingTotalValue(firstPing);
    const itemDelta = computePingDifference(firstPing, lastPing);

    return { currencyDelta, itemDelta }
}


// reduce totalChaosValue of tabContentHistory entry 'ping'
function getPingTotalValue(ping) {
    return ping.reduce((acc, cur) => {
        return acc + cur.totalChaosValue
    }, 0)
}

function computePingDifference(firstPing, secondPing) {
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

// get all the pings within timeInterval (in ms) from the latest ping (NOT within timeInterval from current datetime)
function getLatestPings(timeInterval) {
    const tabHistory = getTabHistory();

    const length = tabHistory.length;

    if (length > 0) {
        const latestPingDate = tabHistory[length-1].date;
        const pingsInInterval = tabHistory.filter(historyEntry => new Date(latestPingDate) - new Date(historyEntry.date) < timeInterval )
        return pingsInInterval
    }
}

const TabHistory = (props) => {
    const interval = 1000*60*60*24;
    const parsedInterval = interval/36e5;
    const { currencyDelta, itemDelta } = getProgressOverInterval(interval)
    const [isExpanded, toggleExpand] = useExpandToggle();

    const itemDeltaElement = Object.entries(itemDelta)
        .filter(([k, v]) => +v !== 0)
        .map(([k, v]) => <li 
            className="TabHistory__diff--list--item"
            style={{color: v > 0 ? 'seagreen' : 'orangered'}}
        >
            <span className="TabHistory__entry--count">
                {v}
            </span>
            <span className="TabHistory__entry--name">
                {k}
            </span>
        </li>)

    return (
        <div className="TabHistory">
            <header className="TabHistory__header">
                <h3>
                    Change
                </h3>
            </header>
            <ExpandButton isExpanded={isExpanded} toggleExpand={toggleExpand} />

            { isExpanded && 
                <section>
                    <div>
                        Currency change over the past { parsedInterval } hours: { currencyDelta.toFixed(1) }c.
                    </div>
                    <div className="TabHistory__diff">
                        <header>
                            Item change
                        </header>
                        <ul className="TabHistory__diff--list">
                            {itemDeltaElement}
                        </ul>
                    </div>
                </section>
            }
        </div>
    )
}

export default TabHistory