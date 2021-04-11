import express from 'express';
import bodyParser from 'body-parser';
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';

import { UserModel as User, StashSnapshotModel as StashSnapshot, StashValueModel as StashValue } from '../db/db.js'
import { getAndParseTabOverview, getTabAndExtractPropsFromItems, extractTotalChaosValue, makeStackedContents, makeStackedArray, grabTabs } from '../helpers/api/poeApi.js';
import { stashValueEntryExists, addStashValueEntry } from '../helpers/db/dbHelpers.js';
import { itemObj, currencyObj } from '../helpers/api/ninjaPages';
import { getAndParseAllItemPagesToChaos, getItemPageAndParseToChaos } from '../helpers/api/ninjaApi';
import { storeNinjaValueSnapshot } from '../helpers/storage/storageHelpers';

export const poeRouter = express.Router({ mergeParams: true });
poeRouter.use(bodyParser.urlencoded({ extended: true }));
poeRouter.use(bodyParser.json());

function logRequest(req, res, next) {
    console.log(`${req.originalUrl} - ${JSON.stringify(req.body)}`);
    next();
}

poeRouter.use(logRequest);

poeRouter.get('/', (req, res) => {

})

poeRouter.post('/tabs', async (req, res) => {
    const { accountName, POESESSID, league, indices } = req.body;

    const [tabContents, stacked, err] = await grabTabs(indices, { accountName, POESESSID, league });

    if (!err) {
        await addStashValueEntry(accountName, league, tabContents)
        res.send(stacked)
    } else {
        res.status(502).send('Error fetching from POE API')
    }

})

poeRouter.post('/tabs/overview', (req, res) => {
    getAndParseTabOverview(req.body)
        .then(tabs => res.send(tabs))
        .catch(err => console.log(err))
})

poeRouter.get('/ninja', async (req, res) => {
    const chaosValues = await getAndParseAllItemPagesToChaos("Ritual");

    if (chaosValues) {
        const chaosValueEntry = {
            date: new Date(),
            chaosValues
        }
    
        storeNinjaValueSnapshot(chaosValueEntry);
    
        res.send(chaosValues)
    } else {
        res.status(502).send('Error fetching poe.ninja pages.')
    }
})