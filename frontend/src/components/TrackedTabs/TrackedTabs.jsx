import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue } from 'recoil';
import { accountInfoState } from 'state/stateAtoms'
import { useRequest } from 'helpers/hooks/requestHooks'
import { trackedTabsState } from 'state/stateAtoms'
import StashTabContent from "components/StashTabContent/StashTabContent";
import './style/TrackedTabs.scss'
import { appendToTabContent } from "helpers/storage/tabContent";

const TrackedTabs = (props) => {
    const accountInfoAtom = useRecoilValue(accountInfoState);
    const trackedTabsAtom = useRecoilValue(trackedTabsState)
    const { accountName, league, POESESSID } = accountInfoAtom
    const [makeRequest, response, error, loading] = useRequest({ url: '/poe/tabs' })
    const trackedTabIndices = useMemo(() => trackedTabsAtom.map(tab => tab.index), [trackedTabsAtom]);
    const [autoFetch, setAutoFetch] = useState(false);
    const intervals = useRef([]);

    const requestTrackedTabContents = useCallback(() => {
        makeRequest({
            method: "post",
            data: { accountName, league, POESESSID, indices: trackedTabIndices }
        })
    }, [trackedTabIndices])

    const toggleAutoFetch = useCallback(() => {
        setAutoFetch(cur => !cur)
    }, [autoFetch])

    useEffect(() => {
        if (response) {
            appendToTabContent(response);
        }
    }, [response])

    useEffect(() => {  // if autoFetch is true, periodically fetch contents of tracked tabs
        if (autoFetch) {
            console.log('triggering interval');
            let interval = 1000*60*5 // static 5 minute interval for now. might eventually want to implement client.txt tracking instead
            intervals.current.push(setInterval(() => {
                requestTrackedTabContents();
            }, interval))
        } else {
            for (let interval of intervals.current) {
                clearInterval(interval);
                intervals.current = [];
            }
        }
    }, [autoFetch])

    return (
        <div className="TrackedTabs">
            <header className="TrackedTabs__header">
                <h3>
                    Tracked tabs
                </h3>
                
                { loading &&
                    <div className="TrackedTabs__fetching">Fetching tab contents...</div>
                }

                { trackedTabsAtom.length > 0 && 
                    <div>
                        <span>
                            <input 
                                type="button" 
                                className="TrackedTabs__button"
                                value={autoFetch ? 'Turn off auto fetch' : 'Turn on auto fetch'}
                                onClick={toggleAutoFetch}
                            />
                        </span>

                        <input 
                            type="button" 
                            className="TrackedTabs__button"
                            value="Fetch manually"
                            onClick={requestTrackedTabContents}
                        />
                        
                    </div>
                }
            </header>

            { response && 
                <StashTabContent tabContent={response} />
            }

            { error && 
                <div>Error fetching from API</div>
            }
        </div>
    )
}

export default TrackedTabs