import React, { useState, useEffect, useMemo, useCallback } from "react";
import TabListItem from './TabListItem';
import './style/TabList.scss';
import { useRecoilState } from 'recoil';
import { trackedTabsState } from 'state/stateAtoms'

const defaultTabOverview = {
    date: null,
    tabOverview: []
}

const TabList = (props) => {
    const { date, tabOverview } = JSON.parse(localStorage.getItem("tabOverview")) || defaultTabOverview;
    const [trackedTabsAtom, setTrackedTabsAtom] = useRecoilState(trackedTabsState);

    const [isOpen, setIsOpen] = useState(true);
    function toggleOpen(){
        setIsOpen(cur => !cur)
    }

    const maxTrackedTabCount = 15;

    const trackedTabsElement = trackedTabsAtom.map(tab => <span className="TabList__tracked--tab">{tab.n}</span>)

    function makeOverviewItemElements() {
        if (tabOverview?.length > 0) {
            return tabOverview.map((tab, i) => {
                return <TabListItem key={`overviewItem-${Date.now()}-${i}`} tabProps={{ ...tab, index: i }} />
            })
        }
    }

    const overviewItemElements = makeOverviewItemElements();

    const handleTabSelectClick = useCallback(() => {
        localStorage.setItem("trackedTabs", JSON.stringify(trackedTabsAtom))
        alert('Tab selection updated')
    }, [trackedTabsAtom])

    return (
        <div 
            className="TabList"
            style={{display: !isOpen && 'none'}}   // @note: VERY WIP. Toggle rendering of the component from outside. hiding it is a quick workaround
        >
            <header className="TabList__header">
                <h3>
                    Pick tabs to track (max. {maxTrackedTabCount})
                </h3>

                <button 
                    onClick={toggleOpen}
                    className="TabList__close"
                >
                    Close
                </button>
            </header>

            <p className="TabList__info">
                Make sure to re-submit your account info whenever you change your stash tab order in-game.
            </p>

            <div className="TabList__tabs">
                {overviewItemElements?.length > 0 && overviewItemElements}
            </div>

            {trackedTabsAtom.length > 0 &&
                    <input
                        onClick={handleTabSelectClick}
                        className="TabList__button"
                        type="button"
                        value="Confirm"
                    />
                }
        </div>
    )
}

export default TabList