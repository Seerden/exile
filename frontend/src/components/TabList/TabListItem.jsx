import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRequest } from "helpers/hooks/requestHooks";
import { useRecoilValue, useRecoilState } from "recoil";
import { accountInfoState, trackedTabsState } from "state/stateAtoms";
import './style/TabListItem.scss';
import StashTabContent from 'components/StashTabContent/StashTabContent';

const TabListItem = ({ tabProps }) => {
    const { n, colour, type, index } = tabProps;
    const { r, g, b } = colour;
    const accountInfo = useRecoilValue(accountInfoState);
    const [trackedTabsAtom, setTrackedTabsAtom] = useRecoilState(trackedTabsState);

    const tabInTrackedTabs = useMemo(() => trackedTabsAtom.filter(tab => tab.index === tabProps.index).length > 0, [trackedTabsAtom]);

    const toggleTabSelection = useCallback(() => {
        // toggle tab selection (add if there aren't 10 tracked tabs yet, remove if tab is already being tracked)
        if (!tabInTrackedTabs && trackedTabsAtom.length < 15) {
            setTrackedTabsAtom([...trackedTabsAtom, tabProps])
        } else if (tabInTrackedTabs) {
            setTrackedTabsAtom(cur => cur.filter(tab => tab.index !== tabProps.index))
        }
    }, [trackedTabsAtom])

    function handleTabClick(e) {
        // add or remove tab from list of tabs to track
        e.preventDefault()
        toggleTabSelection()
    }

    return (
        <>
            <input
                type="button"
                className="TabListItem"
                onClick={handleTabClick}
                style={{
                    border: `2px solid rgb(${r}, ${g}, ${b})`,
                    backgroundColor: tabInTrackedTabs && 'deepskyblue'
                }}
                value={n}
            />
        </>
    )
}

export default TabListItem