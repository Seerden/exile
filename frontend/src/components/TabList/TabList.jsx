import React, { useState, useEffect, useMemo, useCallback } from "react";
import TabListItem from './TabListItem';
import './style/TabList.scss';
import { useRecoilState } from 'recoil';
import { trackedTabsState } from 'state/stateAtoms'
import useExpandToggle from "helpers/hooks/useExpandToggle";

const TabList = (props) => {
    const defaultTabOverview = {
        date: null,
        tabOverview: []
    }
    const { date, tabOverview } = JSON.parse(localStorage.getItem("tabOverview")) || defaultTabOverview;
    const [trackedTabsAtom, setTrackedTabsAtom] = useRecoilState(trackedTabsState);
    const [isExpanded, toggleExpand] = useExpandToggle();
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
        <div className="TabList">
            <header className="TabList__header">
                <h3>
                    Pick tabs to track (max. {maxTrackedTabCount})
                </h3>

                <button
                    className="TabList__expand"
                    onClick={toggleExpand}
                >
                    {isExpanded ? 'Close' : 'Expand'}
                </button>

                {trackedTabsAtom.length > 0 &&
                    <input
                        onClick={handleTabSelectClick}
                        className="TabList__button"
                        type="button"
                        value="Confirm"
                    />
                }
            </header>

            <p className="TabList__info">
                Make sure to re-submit your account info whenever you change your stash tab order in-game.
            </p>



            { isExpanded &&
                <div className="TabList__tabs">
                    {overviewItemElements?.length > 0 && overviewItemElements}
                </div>
            }
        </div>
    )
}

export default TabList