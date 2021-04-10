import { useState, useEffect } from "react";
import { useRequest } from "helpers/hooks/requestHooks";
import './style/AccountInfo.scss';

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

function makeTabOverviewObjectForLocalStorage(tabOverviewResponse) {
    return JSON.stringify({
        date: new Date(),
        tabOverview: tabOverviewResponse
    })
}

const AccountInfo = (props) => {
    const [accountInfo, setAccountInfo] = useState(JSON.parse(localStorage.getItem("accountInfo")!) || defaultAccountInfo)
    const [buildAndMakeRequest, tabOverviewResponse, error, loading] = useRequest({ url: 'poe/tabs/overview' })

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
            method: 'POST',
            data: accountInfo
        })
    }

    return (
        <>
            <div className="AccountInfo">
                <form className="AccountInfo__form">
                    <header className="AccountInfo__header AccountInfo__form--field">
                        <h3>
                            Account Information
                        </h3>
                    </header>

                    <div className="AccountInfo__form--field">
                        <label className="AccountInfo__form--label" htmlFor="accountName">Account Name:</label>
                        <input className="AccountInfo__form--input" onChange={e => handleAccountInfoFormFieldChange(e)} type="text" name="accountName" value={accountInfo.accountName} />
                    </div>

                    <div className="AccountInfo__form--field">
                        <label className="AccountInfo__form--label" htmlFor="league">League:</label>
                        <select
                            className="AccountInfo__form--input"
                            onChange={e => handleAccountInfoFormFieldChange(e)}
                            name="league"
                        >
                            <option selected value="ritual">Ritual</option>
                            <option value="hardcore-ritual">Hardcore Ritual</option>
                            <option value="standard">Standard</option>
                            <option value="hardcore-standard">Hardcore Standard</option>
                        </select>
                    </div>

                    <div className="AccountInfo__form--field">
                        <label className="AccountInfo__form--label" htmlFor="POESESSID">POESESSID:</label>
                        <input className="AccountInfo__form--input" onChange={e => handleAccountInfoFormFieldChange(e)} type="text" name="POESESSID" value={accountInfo.POESESSID} />
                    </div>

                    <button
                        onClick={e => handleAccountInfoFormSubmit(e)}
                        type="submit"
                        className="AccountInfo__form--submit"
                    >
                        Confirm and verify
                    </button>
                </form>
                {loading && <div>Checking account info...</div>}
                {tabOverviewResponse && <div>Account info saved.</div>}
                {error && <div>Incorrect account info, or POE servers are having trouble.</div>}

            </div>
        </>
    )
}


export default AccountInfo