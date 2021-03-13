import { 
    StashValueModel as StashValue 
} from '../../db/db.js';

export async function stashValueEntryExists ({ league, accountName }) {
    const stashValueEntry = await StashValue.findOne({ league, accountName });
    if(!stashValueEntry) { return false };

    return true;
}