import React from "react";
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AccountInfo from "components/AccountInfo/AccountInfo";
import TabList from "components/TabList/TabList";
import Home from "components/Home/Home"
import TrackedTabs from "components/TrackedTabs/TrackedTabs";
import TabHistory from "components/TabHistory/TabHistory";
import ValueGraph from 'components/TabHistory/ValueGraph';
import Compare from "components/StashTabContent/Compare";

import TrackedView from 'views/Tracked';
import Menu from "components/Menu/Menu";

const App = (props) => {

    return (
        <RecoilRoot>
            <div className="App">

                <Router>
                    <Routes>
                        <Route path="/" element={
                            <>
                                <TrackedTabs />
                                {/* <ValueGraph width={500} height={250} margin={{x: 100, y: 50}} startFromZero={false} hoursToPlot={0} /> */}
                            </>
                        }
                        />
                    </Routes>
                </Router>
            </div>
        </RecoilRoot>
    )
}

export default App