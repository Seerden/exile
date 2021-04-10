import React, { useMemo, useState, useEffect } from "react";
import { useRecoilValue } from 'recoil';
import { tabContentState } from 'state/stateAtoms';
import StashTabItem from './StashTabItem';
import { extractTotalChaosValue } from 'helpers/storage/tabContent'
import './style/StashTabContent.scss';

const StashTabContent = (props) => {
    const [showItems, setShowItems] = useState(true);
    const tabContent = useRecoilValue(tabContentState);
    const [filter, setFilter] = useState('');
    const totalTabValue = extractTotalChaosValue(tabContent);

    const stashContentElement = useMemo(() => [...tabContent]
        .filter(entry => entry.chaosValue > 0)
        .sort((a, b) => {
            let aValue = a.chaosValue * (a.stackSize || 1);
            let bValue = b.chaosValue * (b.stackSize || 1);

            return aValue > bValue ? -1 : aValue === bValue ? 0 : 1
        })
        .map((item, index) => {
            return {
                element: <StashTabItem key={`tab-entry-${index}-${item.typeLine}`} item={item} />,
                typeLine: item.typeLine
            }
        }),
        [tabContent]
    )

    const filteredStashContentElement = useMemo(() => {
        let filteredElement;
        if (filter?.length > 0) {
            filteredElement = stashContentElement.filter(entry => entry.typeLine?.toLowerCase().includes(filter.toLowerCase()));
        } else {
            filteredElement = stashContentElement;
        }

        return filteredElement
            .map(entry => entry.element)
    }, [filter, tabContent])

    return (
        <div className="StashTabContent">
            <section>
                <header className="StashTabContent__header">
                    <span>Total tab value: {totalTabValue}<em>c</em></span>
                    <input
                        type="button"
                        className="StashTabContent__toggle"
                        value={showItems ? 'Hide items' : 'Show items'}
                        onClick={() => setShowItems(cur => !cur)}
                    />
                </header>
            </section>

            <div className="StashTabContent__filter">
                <label 
                    htmlFor="StashTabContent__filter"
                    className="StashTabContent__filter--label">
                        Filter by name:
                    </label>
                <input
                    name="StashTabContent__filter"
                    className="StashTabContent__filter--input"
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {showItems &&
                <ul className="StashTabContent__items">
                    {filteredStashContentElement}
                </ul>
            }
        </div>
    )
}

export default StashTabContent