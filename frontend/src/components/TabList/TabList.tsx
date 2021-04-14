import React, { useState, useCallback, useMemo } from "react";
import TabListItem from './TabListItem';
import { TabOverview } from './TabList.types';
import SectionInfo from 'components/_shared/SectionInfo';
import './style/TabList.scss';
import { useRecoilValue } from 'recoil';
import { trackedTabsState } from 'state/stateAtoms'

const defaultTabOverview: TabOverview = {
    date: null,
    tabOverview: []
}

interface TabListElement {
    name: String,
    element: JSX.Element
}

const TabList = (props) => {
    const { tabOverview } = JSON.parse(localStorage.getItem("tabOverview")!) || defaultTabOverview;
    const trackedTabsAtom = useRecoilValue(trackedTabsState);
    const [showRemoveOnly, setShowRemoveOnly] = useState<boolean>(false);

    const maxTrackedTabCount: number = 15;

    const makeOverviewItemElements = useCallback((): (TabListElement[] | []) => {
        if (tabOverview?.length > 0) {
            return tabOverview.map((tab, i) => {
                return {
                    name: tab.n,
                    element: <TabListItem key={`overviewItem-${Date.now()}-${i}`} tabProps={{ ...tab, index: i }} />
                }
            })
        }
        return []
    }, [trackedTabsAtom, tabOverview])

    const overviewItemElements: TabListElement[] | [] = useMemo(() => {
        let elements = makeOverviewItemElements();
        if (!showRemoveOnly) {
            elements = elements.filter(entry => !entry.name.includes("(Remove-only)"))
        }

        return elements;
    }, [showRemoveOnly]);

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
            </header>

            <SectionInfo className="TabList__info">
                Make sure to re-submit your account info whenever you change your stash tab order in-game.
            </SectionInfo>

            <div className="TabList__tabs">
                {overviewItemElements?.length > 0 && overviewItemElements.map(entry => entry.element)}
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