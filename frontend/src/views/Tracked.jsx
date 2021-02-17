import React from "react";
import TrackedTabs from 'components/TrackedTabs/TrackedTabs';
import ValueGraph from 'components/TabHistory/ValueGraph';
import './style/Tracked.scss';
const Tracked = (props) => {
    
    return (
        <div className="Tracked">
            <TrackedTabs />
            <ValueGraph width={300} height={150} margin={{x: 10, y: 10}} hoursToPlot={3} startFromZero={false} />
        </div>
    )
}

export default Tracked