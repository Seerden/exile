import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue } from 'recoil';
import { accountInfoState } from 'state/stateAtoms'
import { useRequest } from 'helpers/hooks/requestHooks'
import { trackedTabsState, tabContentState } from 'state/stateAtoms'
import { appendToTabContent } from "helpers/storage/tabContent";

import StashTabContent from "components/StashTabContent/StashTabContent";
import SectionInfo from 'components/_shared/SectionInfo';
import './style/TrackedTabs.scss'

const TrackedTabs = (props) => {
    const accountInfoAtom = useRecoilValue(accountInfoState);
    const trackedTabsAtom = useRecoilValue(trackedTabsState);
    const [tabContentAtom, setTabContentAtom] = useRecoilState(tabContentState);
    const { accountName, league, POESESSID } = accountInfoAtom;
    const [makeRequest, response, error, loading] = useRequest({ url: '/poe/tabs' });
    const trackedTabIndices = useMemo(() => trackedTabsAtom.map(tab => tab.index), [trackedTabsAtom]);
    const [autoFetch, setAutoFetch] = useState(false);
    const intervals = useRef([]);

    const requestTrackedTabContents = useCallback(() => {
        makeRequest({
            method: "post",
            data: { accountName, league, POESESSID, indices: trackedTabIndices }
        })
    }, [trackedTabIndices, accountInfoAtom])

    const toggleAutoFetch = useCallback(() => {
        setAutoFetch(cur => !cur)
    }, [autoFetch])

    useEffect(() => {
        // temporary DEV fix: 
        //      on liveserver reload, requestTrackedTabContents() will fire if a request had previously been made
        //      this effect ensures that initial request doesn't fire
        makeRequest(null);

        return () => makeRequest(null)
    }, [])

    useEffect(() => {
        if (response) {
            setTabContentAtom(response);
        }
    }, [response])

    useEffect(() => {
        // if autoFetch is true, periodically fetch contents of tracked tabs
        // if autoFetch is false, clear any possibly remaining tab fetching intervals
        if (autoFetch) {
            let interval = 1000 * 60 * 4 // static interval for now. might eventually want to implement POE client.txt tracking instead
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
                <h3 className="TrackedTabs__header--title">
                    Stash Snapshot
                </h3>

                {loading &&
                    <div
                        className="TrackedTabs__fetching"
                    >
                        Fetching tab contents...
                    </div>
                }


            </header>
            {trackedTabsAtom.length > 0 &&
                <div>
                    <span>
                        <input
                            type="button"
                            className={`TrackedTabs__button ${autoFetch ? 'TrackedTabs__button--on' : ''}`}
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

            <SectionInfo className="TrackedTabs__description">
                Here, you'll find the contents of the most recent snapshot of your Stash.
                You can choose to either periodically automatically grab a new snapshot, or manually grab a snapshot whenever you wish (with a slight cooldown for rate limiting purposes).
            </SectionInfo>

            {response &&
                <StashTabContent />
            }

            {error &&
                <div>
                    Error fetching from API
                </div>
            }
        </div>
    )
}

export default TrackedTabs