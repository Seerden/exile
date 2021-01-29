import { useRequest } from "helpers/hooks/requestHooks";
import { useSetRecoilState } from 'recoil';
import { stashOverviewState } from 'state/stateAtoms';
import React, { useState, useEffect } from "react";
import './style/AccountInfo.scss';

const leagueNameEnum = {
    "hardcore-ritual": "Hardcore Ritual",
    "hardcore-standard": "Hardcore Standard",
    "standard": "standard",
    "ritual": "ritual"
}

const AccountInfo = (props) => {
    const [accountInfo, setAccountInfo] = useState(JSON.parse(localStorage.getItem("accountInfo")) || {
        accountName: "",
        league: "ritual",
        POESESSID: "",
    })
    const [setRequestOptionsAndMakeRequest, tabOverviewResponse, error] = useRequest({
        url: 'poe/tabs/overview',
    })
    const setStashOverviewAtom = useSetRecoilState(stashOverviewState);

    useEffect(() => {
        console.log(accountInfo);
    }, [accountInfo])

    useEffect(() => {
        if (tabOverviewResponse) {
            setStashOverviewAtom(tabOverviewResponse)

            localStorage.setItem("accountInfo", JSON.stringify(accountInfo))
        }
    }, [tabOverviewResponse])

    function handleAccountInfoFormFieldChange(e) {
        const { name, value } = e.currentTarget;
        const newValue = name === 'league' ? leagueNameEnum[value] : value;
        setAccountInfo(state => ({
            ...state,
            [name]: newValue,
        }))
    }

    function handleAccountInfoFormSubmit(e) {
        e.preventDefault();

        setRequestOptionsAndMakeRequest({  // trigger stash overview API grab with (hopefully) current accountInfo state
            method: 'post',
            data: accountInfo
        })
    }

    return (
        <div className="AccountInfo">
            AccountInfo.jsx

            <form>
                <header>
                    <h3>
                        Account Information
                    </h3>
                </header>

                <div>
                    <label htmlFor="accountName">Account name:</label>
                    <input onChange={handleAccountInfoFormFieldChange} type="text" name="accountName" value={accountInfo.accountName} />
                </div>

                <label htmlFor="league">League:</label>
                <select
                    onChange={handleAccountInfoFormFieldChange}
                    name="league"
                >
                    <option value="ritual">Ritual</option>
                    <option value="hardcore-ritual">Hardcore Ritual</option>
                    <option value="standard">Standard</option>
                    <option value="hardcore-standard">Hardcore Standard</option>
                </select>

                <div>
                    <label htmlFor="POESESSID">
                        POESESSID:
                    </label>
                    <input onChange={handleAccountInfoFormFieldChange} type="text" name="POESESSID" value={accountInfo.POESESSID} />
                </div>

                <button onClick={handleAccountInfoFormSubmit} type="submit">Request stash overview</button>
            </form>
        </div>
    )
}


export default AccountInfo