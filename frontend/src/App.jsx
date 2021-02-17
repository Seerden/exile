import React from "react";
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AccountInfo from "components/AccountInfo/AccountInfo";
import StashOverview from "components/StashOverview/StashOverview";
import Home from "components/Home/Home"
import TrackedTabs from "components/TrackedTabs/TrackedTabs";
import TabHistory from "components/TabHistory/TabHistory";

import Main from "views/Main";
import AccountView from 'views/Account';
import TrackedView from 'views/Tracked';

const App = (props) => {
    
    return (
        <RecoilRoot>
            <div className="App">
                
                <Router>
                    <Routes>
                        <Route path="/" element={
                            <>
                                <AccountView />
                                <TrackedView />
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