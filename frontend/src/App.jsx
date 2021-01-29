import React from "react";
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AccountInfo from "components/AccountInfo/AccountInfo";
import StashOverview from "components/StashOverview/StashOverview";
import Home from "components/Home/Home"

const App = (props) => {
    
    return (
        <RecoilRoot>
            <div className="App">
                
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />

                        <Route path="/overview" element={ 
                            <>
                                <AccountInfo /> 
                                <StashOverview />
                            </>
                        }/>
                    </Routes>
                </Router>
            </div>
        </RecoilRoot>
    )
}

export default App