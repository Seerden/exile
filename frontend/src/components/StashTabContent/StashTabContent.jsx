import React, { useState, useEffect } from "react";
import StashTabItem from './StashTabItem';
import './style/StashTabContent.scss';

const StashTabContent = ({ tabContent }) => {
    const [showItems, setShowItems] = useState(true);

    const totalTabValue = +tabContent.reduce((acc, cur) => acc + cur.totalChaosValue, 0).toFixed(1)

    const contentElement = tabContent
        .sort((a, b) => {
            return a.totalChaosValue > b.totalChaosValue ? -1 : a.totalChaosValue === b.totalChaosValue ? 0 : 1
        })
        .map((item, index) => <StashTabItem key={`tab-entry-${index}`} item={item} />)

    return (
        <div className="StashTabContent">
            <section>
                <header>
                    <h3>Total tab value: {totalTabValue}<em>c</em></h3>
                </header>
            </section>

            <input 
                type="button" 
                value={showItems ? 'Hide items' : 'Show items'}
                onClick={() => setShowItems(cur => !cur)}
            />
                {showItems &&
                    <ul>
                        {contentElement}
                    </ul>
                }
        </div>
    )
}

export default StashTabContent