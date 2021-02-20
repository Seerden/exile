import React from "react";
import TrackedTabs from 'components/TrackedTabs/TrackedTabs';
import ValueGraph from 'components/TabHistory/ValueGraph';
import './style/Tracked.scss';

const Tracked = (props) => {
    
    return (
        <div className="Tracked">
            <TrackedTabs />
            <ValueGraph width={400} height={200} margin={{x: 100, y: 50}} hoursToPlot={6} startFromZero={false} />
        </div>
    )
}

export default Tracked