
import { UserInterface, UserTabsInterface } from '../../db/schemas/userSchema.js';
import { StashSnapshot, StashValue, User } from '../../db/db.js';

import { extractTotalChaosValue } from '../api/poeApi.js'
import { StashSnapshotInterface } from '../../db/schemas/stashSnapshotSchema.js';

export async function stashValueEntryExists ({ league, accountName }) {
    const stashValueEntry = await StashValue.findOne({ league, accountName });
    if(!stashValueEntry) { return false };

    return true;
}

export async function addStashValueEntry(accountName, league, tabContents) {
    StashValue.findOne({ accountName, league: league.toLowerCase() }, (err, doc) => {
        if (!doc) {
            const newEntry = new StashValue({ league: league.toLowerCase(), accountName, value: [{ date: new Date, totalChaosValue: extractTotalChaosValue(tabContents) }] })
            newEntry.save((err, saved) => {
                saved && console.log('StashValue entry saved');
            });
        } else {
            if (doc.value.length > 0) {
                doc.value.push({ date: new Date(), totalChaosValue: extractTotalChaosValue(tabContents) })
                doc.save();
            } else {
                doc.value = [{ date: new Date(), totalChaosValue: extractTotalChaosValue(tabContents) }]
                doc.save();
            }
        }

        console.log('StashValue entry created or updated');
    })
}

export async function addStashSnapshotEntry(accountName, league, items) {
    const newStashSnapshot = new StashSnapshot({
        accountName,
        league,
        items,
        date: new Date()
    })

    try {
        await newStashSnapshot.save();
        console.log('Stash snapshot successfully saved to database.');
    } catch (error) {
        console.error(error);
    }
}

export async function findOrCreateUser(accountName: string, tabs: UserTabsInterface) {
    const doc = await User.findOne({ accountName, tabs })
    if (!doc) {
        const newUser = new User({ accountName, tabs })
        return await newUser.save();
    }
}

export async function updateUserTabsEntry(options) {
    const { accountName, league, tabs, tabIndices } = options;

    User.findOne({accountName}, async (err, doc: UserInterface) => {
        
        const currentTabs = doc.tabs;

        if (typeof userHasLeague(currentTabs, league) === 'number') {
            const leagueIndex = leagueIndexInUserTabs(currentTabs, league);

            const newTabEntry = {
                league,
                tabIndices,
                tabProps: tabs,
                lastUpdated: new Date()
            }

            currentTabs[leagueIndex] = newTabEntry;

            doc.tabs = currentTabs;
            await doc.save();
        }

    })

}

function userHasLeague(tabs: UserTabsInterface[], league): number | false {
    return tabs.filter(entry => entry.league === league).length === 1 
        ? leagueIndexInUserTabs(tabs, league) 
        : false
}

function leagueIndexInUserTabs (tabs: UserTabsInterface[], league: UserTabsInterface['league']) {
    return tabs.findIndex(entry => entry.league === league)
}

export async function stashSnapshotValues(accountName: any, league: any): Promise<object[]> | null {
    const snapshots = await StashSnapshot.find({accountName, league}).lean();

    if (snapshots) {
        const data = snapshots.map(snapshot => ({
            date: snapshot.date,
            totalValue: snapshot.items.reduce((acc, cur) => {
                if (cur.chaosValue > 0) {
                    const newSum = acc + cur.chaosValue*(cur.stackSize || 1)
                    return newSum
                }
                return acc
            }, 0)
        }));

        return data.filter(entry => entry.totalValue > 0);
    }
}