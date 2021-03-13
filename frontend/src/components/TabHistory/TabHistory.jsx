import React, { useState } from "react";
import './style/TabHistory.scss'
import dayjs from 'dayjs';
import ExpandButton from "components/_shared/ExpandButton";
import useExpandToggle from "helpers/hooks/useExpandToggle";
import { getProgressOverInterval } from 'helpers/tabHistory';

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