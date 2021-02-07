import React, { useState, useEffect, useMemo, useCallback } from "react";
import OverviewItem from './OverviewItem';
import './style/StashOverview.scss';
import { useRecoilState } from 'recoil';
import { trackedTabsState } from 'state/stateAtoms'

const StashOverview = (props) => {
    const { date, tabOverview } = JSON.parse(localStorage.getItem("tabOverview"));
    const [trackedTabsAtom, setTrackedTabsAtom] = useRecoilState(trackedTabsState);

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
    }, [trackedTabsAtom])

    return (
        <div className="StashOverview">
            <header className="StashOverview__header">
                <h3>
                    Pick tabs to track (max. 10)
                </h3>
                { trackedTabsAtom.length > 0 && 
                    <input 
                        onClick={handleTabSelectClick}
                        className="StashOverview__button" 
                        type="button" 
                        value="Confirm"
                    /> 
                }
            </header>


            <div className="StashOverview__tabs">
                {overviewItemElements?.length > 0 && overviewItemElements}
            </div>
        </div>
    )
}

export default StashOverview