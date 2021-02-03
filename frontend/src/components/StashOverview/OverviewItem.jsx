import { useRequest } from "helpers/hooks/requestHooks";
import React, { useEffect, useState, useCallback } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { accountInfoState, trackedTabsState } from "state/stateAtoms";
import './style/OverviewItem.scss';
import StashTabContent from 'components/StashTabContent/StashTabContent';

const OverviewItem = ({ tabProps }) => {
    const { n, colour, type, index } = tabProps;
    const { r, g, b } = colour;
    // const [buildAndMakeRequest, response, error] = useRequest({ url: '/poe/tab' })
    const accountInfo = useRecoilValue(accountInfoState);
    const [trackedTabsAtom, setTrackedTabsAtom] = useRecoilState(trackedTabsState)

    const [tracked, setTracked] = useState([])

    useEffect(() => {
        tracked.length > 0 && console.log(tracked);
    }, [tracked])

    // function handleOverviewItemClick(e) {
    //     buildAndMakeRequest({  // grab tab content from API and store in state
    //         method: 'post',
    //         data: {...accountInfo, tabIndex: index}
    //     })
    // }

    const tabInTrackedTabs = trackedTabsAtom.filter(tab => tab.index === tabProps.index).length > 0

    const maybeTrackTab = useCallback(() => {
        if (!tabInTrackedTabs && trackedTabsAtom.length < 10){
            setTrackedTabsAtom([...trackedTabsAtom, tabProps])
        } 
    }, [trackedTabsAtom])

    function handleTabClick(e) {  // add tab to list of tracked tabs, if list not too long yet and tab isn't yet in there
        e.preventDefault()
        maybeTrackTab()
    }

    return (
        <>
            <input
                type="button" 
                className="OverviewItem"
                onClick={handleTabClick}
                // onClick={handleOverviewItemClick}
                style={{
                    border: `2px solid rgb(${r}, ${g}, ${b})`,
                    backgroundColor: tabInTrackedTabs && 'deepskyblue'
                }}
                value={n}
            />
            {/* {response && <StashTabContent tabContent={response} />} */}
        </>
    )
}

export default OverviewItem