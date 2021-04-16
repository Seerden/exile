
import { UserTabsInterface } from '../../db/schemas/userSchema.js';
import { StashSnapshot, StashValue, User } from '../../db/db.js';

import { extractTotalChaosValue } from '../api/poeApi.js'

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