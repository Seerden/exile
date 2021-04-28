import express, { Request, Response } from 'express';

import '../db/db.js';

import { getAndParseTabOverview, grabTabs } from '../helpers/api/poeApi.js';
import { addStashValueEntry, addStashSnapshotEntry } from '../helpers/db/dbHelpers.js';
import { getAndParseAllItemPagesToChaos } from '../helpers/api/ninjaApi.js';
import { storeNinjaValueSnapshot } from '../helpers/storage/storageHelpers.js';

import { NinjaSnapshot } from '../db/db.js';

/**
 * Router for all endpoints that interact directly with POE API and the poe.ninja API
 */
export const poeRouter = express.Router({ mergeParams: true });
poeRouter.use(express.urlencoded({ extended: true }));
poeRouter.use(express.json());

function logRequest(req: Request, res: Response, next: Function | null): void {
    console.log(`${req.originalUrl} - ${JSON.stringify(req.body)}`);
    next();
}

poeRouter.use(logRequest);

poeRouter.post('/tabs', async (req, res) => {
    const { accountName, POESESSID, league, indices } = req.body;
    const [tabContents, stacked, err] = await grabTabs(indices, { accountName, POESESSID, league });

    if (!err) {
        await addStashValueEntry(accountName, league, tabContents);
        await addStashSnapshotEntry(accountName, league, stacked);
        // console.log('stacked', stacked);
        res.send(stacked)
    } else {
        res.status(502).send('Error fetching from POE API')
    }
})

poeRouter.post('/tabs/overview', (req, res) => {
    const { accountName, league, POESESSID } = req.body;

    getAndParseTabOverview(req.body)
        .then(tabs => {
            if (tabs) {
                res.send(tabs)
            }
        })
        .catch(err => console.log(err))
})

poeRouter.get('/ninja', async (req, res) => {
    const league = req.query.league;
    const chaosValues = await getAndParseAllItemPagesToChaos(league);

    if (chaosValues) {
        const chaosValuesWithDate = {
            date: new Date(),
            chaosValues
        };
        storeNinjaValueSnapshot(chaosValuesWithDate);

        const newNinjaSnapshot = new NinjaSnapshot({
            date: new Date(),
            league,
            values: chaosValues
        });

        const savedNinjaSnapshot = await newNinjaSnapshot.save();
        if (savedNinjaSnapshot) {
            res.send(chaosValues)
            console.log(`Ninja snapshot saved for ${league} league`);
        } else {
            res.status(502).send('Error saving poe.ninja snapshot')
        }

    } else {
        res.status(502).send('Error fetching poe.ninja pages.')
    }
})