import React, { useEffect, useCallback } from "react";
import { useRecoilState, useRecoilValue } from 'recoil';
import { accountInfoState } from 'state/stateAtoms'
import { useRequest } from 'helpers/hooks/requestHooks'
import StashTabContent from "components/StashTabContent/StashTabContent";
import './style/TrackedTabs.scss'

const TrackedTabs = (props) => {
    const accountInfoAtom = useRecoilValue(accountInfoState);
    const { accountName, league, POESESSID } = accountInfoAtom

    const [makeRequest, response, error, loading] = useRequest({ url: '/poe/tabs' })
    const trackedTabIndices = JSON.parse(localStorage.getItem("trackedTabs")).map(tab => tab.index);

    const requestTrackedTabContents = useCallback(() => {
        makeRequest({
            method: "post",
            data: { accountName, league, POESESSID, indices: trackedTabIndices }
        })
    }, [trackedTabIndices])


    useEffect(() => {
        if(response) {
            console.log(response);
        }
    }, [response])


    return (
        <div className="TrackedTabs">
            <header>
                TrackedTabs.jsx
            </header>
            <input 
                type="button" 
                value="Request tabs"
                onClick={requestTrackedTabContents}
            />

            { response && 
                <StashTabContent tabContent={response} />
            }
        </div>
    )
}

export default TrackedTabs