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

    const contentElement = useMemo(() => [...tabContent]
        .sort((a, b) => {
            let aValue = a.chaosValue * (a.stackSize || 1);
            let bValue = b.chaosValue * (b.stackSize || 1);

            return aValue > bValue ? -1 : aValue === bValue ? 0 : 1
        })
        .map((item, index) => {
            return {
                element: <StashTabItem key={`tab-entry-${index}`} item={item} />,
                typeLine: item.typeLine
            }
        }), [tabContent]
    )

    const filteredTabContent = useMemo(() => {
        let filteredElement;
        if (filter?.length > 0) {
            filteredElement = contentElement.filter(entry => entry.typeLine?.toLowerCase().includes(filter.toLowerCase()));
        } else {
            filteredElement = contentElement;
        }

        return filteredElement.map(entry => entry.element)
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

            Filter by name:
            <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />

            {showItems &&
                <ul className="StashTabContent__items">
                    {filteredTabContent}
                </ul>
            }
        </div>
    )
}

export default StashTabContent