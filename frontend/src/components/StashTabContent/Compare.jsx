import React, { useMemo } from "react";
import { getTabHistory, computePingDifference } from 'helpers/tabHistory';

import './style/Compare.scss';

const Compare = (props) => {
    // select two Stash snapshots and compare their contents
    const tabHistory = useMemo(() => getTabHistory(), []);  // @todo: update whenever tabHistory updates? OR implement tabHisotry as state instead of only localstorage
    const historyLength = tabHistory.length;
    const [previous, latest] = tabHistory.slice(historyLength-2);
    const differenceObj = computePingDifference(previous.items, latest.items);
    const difference = Object.entries(differenceObj)
        .map(([k, v]) => ({typeLine: k, stackSize: v}))
        .filter(item => item.stackSize !== 0)
        .sort((a, b) => b.stackSize - a.stackSize);

    const differenceList = difference.map(item => <li>
        <span className="Compare__count">{item.stackSize}</span>
        <span className="Compare__name">{item.typeLine}</span>
    </li>);

    const totalCount = difference.reduce((acc, cur) => {
        if (cur.stackSize > 0) {
            return acc + cur.stackSize
        }

        return acc
    }, 0)

    return (
        <div className="Compare">
            <ul>
                {differenceList}
            </ul>
        </div>
    )
}

export default Compare