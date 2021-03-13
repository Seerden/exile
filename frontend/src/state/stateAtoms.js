import { atom } from 'recoil';

export const accountInfoState = atom({
    key: "accountInfoState",
    default: JSON.parse(localStorage.getItem("accountInfo")) || {
        accountName: "",
        league: "Ritual",
        POESESSID: ""
    }
})

export const trackedTabsState = atom({
    key: "trackedTabsState",
    default: JSON.parse(localStorage.getItem("trackedTabs")) || [],
    effects_UNSTABLE: [
        ({ onSet }) => {
            onSet(state => console.log(state))
        }
    ]
})

export const tabContentState = atom({
    key: "tabContentState",
    default: [],
})