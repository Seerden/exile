import React from "react";
import AccountInfo from 'components/AccountInfo/AccountInfo';
import TabList from 'components/TabList/TabList';
import './style/Account.scss';

const Account = (props) => {
    
    return (
        <div className="Account">
            <AccountInfo />
            <TabList />
        </div>
    )
}

export default Account