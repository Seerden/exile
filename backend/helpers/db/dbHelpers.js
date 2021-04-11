import { 
    StashValueModel as StashValue 
} from '../../db/db.js';

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