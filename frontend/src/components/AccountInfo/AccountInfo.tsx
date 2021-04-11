import { useState, useEffect, useMemo } from "react";
import { AxiosResponse } from "axios";
import { useRequest } from "helpers/hooks/requestHooks";
import './style/AccountInfo.scss';
import { AccountInfoInterface } from "./types";
import AccountInfoForm from './AccountInfoForm';

const leagueNameEnum = {  // @todo: now I'm using TypeScript, turn into an actual ENUM
    "hardcore-ritual": "Hardcore Ritual",
    "hardcore-standard": "Hardcore Standard",
    "standard": "Standard",
    "ritual": "Ritual"
}

const defaultAccountInfo = {
    accountName: "",
    league: "Ritual",
    POESESSID: ""
}

function makeTabOverviewObjectForLocalStorage(tabOverviewResponse: AxiosResponse): string {
    return JSON.stringify({
        date: new Date(),
        tabOverview: tabOverviewResponse
    })
}

const AccountInfo = (props) => {
    const [accountInfo, setAccountInfo] = useState<AccountInfoInterface>(JSON.parse(localStorage.getItem("accountInfo")!) || defaultAccountInfo)
    const [buildAndMakeRequest, tabOverviewResponse, error, loading] = useRequest({ url: 'poe/tabs/overview' })

    const accountInfoProps = useMemo(() => ({ accountInfo, handleAccountInfoFormFieldChange, handleAccountInfoFormSubmit }), [accountInfo, handleAccountInfoFormFieldChange, handleAccountInfoFormSubmit])

    useEffect(() => {  // if stash tab overview was grabbed from API successfully, update local storage
        if (tabOverviewResponse) {
            localStorage.setItem("accountInfo", JSON.stringify(accountInfo))
            localStorage.setItem("tabOverview", makeTabOverviewObjectForLocalStorage(tabOverviewResponse))
        }
    }, [tabOverviewResponse])

    function handleAccountInfoFormFieldChange(e): void {  // update accountInfo state on form field change
        const { name, value } = e.currentTarget;
        const newValue = name === 'league' ? leagueNameEnum[value] : value;
        setAccountInfo(state => ({
            ...state,
            [name]: newValue,
        }))
    }

    function handleAccountInfoFormSubmit(e): void {  // grab stash tab overview
        e.preventDefault();

        buildAndMakeRequest({
            method: "POST",
            data: accountInfo
        })
    }

    return (
        <>
            <div className="AccountInfo">
                <AccountInfoForm {...accountInfoProps} />

                {loading && <div>Checking account info...</div>}
                {tabOverviewResponse && <div>Account info saved.</div>}
                {error && <div>Incorrect account info, or POE servers are having trouble.</div>}

            </div>
        </>
    )
}


export default AccountInfo