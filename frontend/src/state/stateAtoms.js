import { atom } from 'recoil';

export const accountInfoState = atom({
    key: "accountInfoState",
    default: {
        accountName: "",
        league: "ritual",
        POESESSID: ""
    }
})

export const stashOverviewState = atom({
    key: "stashOverviewState",
    default: null,
})