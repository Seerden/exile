import React from "react";

import AccountInfo from 'components/AccountInfo/AccountInfo';
import TabList from 'components/TabList/TabList';
import TrackedTabs from "components/TrackedTabs/TrackedTabs";
import TabHistory from "components/TabHistory/TabHistory";

import './style/Main.scss';
import ValueGraph from "components/TabHistory/ValueGraph";

const Main = (props) => {
    
    return (
        <div className="Main">
            <div className="Main__header">
                <AccountInfo />
                <TabList />
            </div>

            <div className="Main__body">
                <TrackedTabs />
                {/* <TabHistory /> */}
                <ValueGraph width={300} height={150} margin={{x: 10, y: 10}} hoursToPlot={3} startFromZero={false} />
            </div>
        </div>
    )
}

export default Main