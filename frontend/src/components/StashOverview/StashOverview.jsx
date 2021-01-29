import React, { useState, useEffect, useMemo } from "react";
import { useRecoilValue } from 'recoil';
import { stashOverviewState } from "state/stateAtoms";
import './style/StashOverview.scss';
import OverviewItem from './OverviewItem';

const StashOverview = (props) => {
    const stashOverviewAtomState = useRecoilValue(stashOverviewState);
    const overviewItemElements = useMemo(() => {
        if (stashOverviewAtomState) {
            return stashOverviewAtomState.map((tab, i) => {
                return <OverviewItem key={`overviewItem-${i}`} props={tab}/>
            })
        }
    }, [stashOverviewAtomState])

    return (
        <div className="StashOverview">
            TabOverview.jsx
            <header>
                <h3>
                    Tab overview
                </h3>
            </header>
            {overviewItemElements && overviewItemElements}
        </div>
    )
}

export default StashOverview