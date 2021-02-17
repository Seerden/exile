import React from "react";
import AccountInfo from 'components/AccountInfo/AccountInfo';
import StashOverview from 'components/StashOverview/StashOverview';
import './style/Account.scss';

const Account = (props) => {
    
    return (
        <div className="Account">
            <AccountInfo />
            <StashOverview />
        </div>
    )
}

export default Account