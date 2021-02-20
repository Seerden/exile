import React, { useState, useEffect, useMemo, useCallback } from "react";
import OverviewItem from './OverviewItem';
import './style/StashOverview.scss';
import { useRecoilState } from 'recoil';
import { trackedTabsState } from 'state/stateAtoms'
import useExpandToggle from "helpers/hooks/useExpandToggle";

const StashOverview = (props) => {
    const { date, tabOverview } = JSON.parse(localStorage.getItem("tabOverview"));
    const [trackedTabsAtom, setTrackedTabsAtom] = useRecoilState(trackedTabsState);
    const [isExpanded, toggleExpand] = useExpandToggle();

    const trackedTabsElement = trackedTabsAtom.map(tab => <span className="StashOverview__tracked--tab">{tab.n}</span>)

    function makeOverviewItemElements() {
        if (tabOverview.length > 0) {
            return tabOverview.map((tab, i) => {
                return <OverviewItem key={`overviewItem-${Date.now()}-${i}`} tabProps={{ ...tab, index: i }} />
            })
        }
    }

    const overviewItemElements = makeOverviewItemElements();

    const handleTabSelectClick = useCallback(() => {
        localStorage.setItem("trackedTabs", JSON.stringify(trackedTabsAtom))
        alert('Tab selection updated')
    }, [trackedTabsAtom])

    return (
        <div className="StashOverview">
            <header className="StashOverview__header">
                <h3>
                    Pick tabs to track (max. 10)
                </h3>

                <button
                    className="StashOverview__expand"
                    onClick={toggleExpand}
                >
                    {isExpanded ? 'Close' : 'Expand'}
                </button>

                {trackedTabsAtom.length > 0 &&
                    <input
                        onClick={handleTabSelectClick}
                        className="StashOverview__button"
                        type="button"
                        value="Confirm"
                    />
                }
            </header>

            <p className="StashOverview__info">
                Make sure to re-submit your account info whenever you change your stash tab order in-game.
            </p>



            { isExpanded &&
                <div className="StashOverview__tabs">
                    {overviewItemElements?.length > 0 && overviewItemElements}
                </div>
            }
        </div>
    )
}

export default StashOverview