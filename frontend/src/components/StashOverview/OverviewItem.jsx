import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRequest } from "helpers/hooks/requestHooks";
import { useRecoilValue, useRecoilState } from "recoil";
import { accountInfoState, trackedTabsState } from "state/stateAtoms";
import './style/OverviewItem.scss';
import StashTabContent from 'components/StashTabContent/StashTabContent';

const OverviewItem = ({ tabProps }) => {
    const { n, colour, type, index } = tabProps;
    const { r, g, b } = colour;
    const accountInfo = useRecoilValue(accountInfoState);
    const [trackedTabsAtom, setTrackedTabsAtom] = useRecoilState(trackedTabsState)

    const [tracked, setTracked] = useState([])

    useEffect(() => {
        tracked.length > 0 && console.log(tracked);
    }, [tracked])

    const tabInTrackedTabs = useMemo(() => trackedTabsAtom.filter(tab => tab.index === tabProps.index).length > 0, [trackedTabsAtom])

    const toggleTabSelection = useCallback(() => {
        if (!tabInTrackedTabs && trackedTabsAtom.length < 10){
            setTrackedTabsAtom([...trackedTabsAtom, tabProps])
        } else if (tabInTrackedTabs) {
            setTrackedTabsAtom(cur => cur.filter(tab => tab.index !== tabProps.index))
        }
    }, [trackedTabsAtom])

    function handleTabClick(e) {  // add tab to list of tracked tabs, if list not too long yet and tab isn't yet in there
        e.preventDefault()
        toggleTabSelection()
    }

    return (
        <>
            <input
                type="button" 
                className="OverviewItem"
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

export default OverviewItem