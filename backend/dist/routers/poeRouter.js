import express from 'express';
import bodyParser from 'body-parser';
import { getAndParseTabOverview, grabTabs } from '../helpers/api/poeApi.js';
import { addStashValueEntry, addStashSnapshotEntry } from '../helpers/db/dbHelpers.js';
import { getAndParseAllItemPagesToChaos } from '../helpers/api/ninjaApi.js';
import { storeNinjaValueSnapshot } from '../helpers/storage/storageHelpers.js';
export const poeRouter = express.Router({ mergeParams: true });
poeRouter.use(bodyParser.urlencoded({ extended: true }));
poeRouter.use(bodyParser.json());
function logRequest(req, res, next) {
    console.log(`${req.originalUrl} - ${JSON.stringify(req.body)}`);
    next();
}
poeRouter.use(logRequest);
poeRouter.get('/', (req, res) => {
});
poeRouter.post('/tabs', async (req, res) => {
    const { accountName, POESESSID, league, indices } = req.body;
    const [tabContents, stacked, err] = await grabTabs(indices, { accountName, POESESSID, league });
    if (!err) {
        await addStashValueEntry(accountName, league, tabContents);
        await addStashSnapshotEntry(accountName, league, stacked);
        res.send(stacked);
    }
    else {
        res.status(502).send('Error fetching from POE API');
    }
});
poeRouter.post('/tabs/overview', (req, res) => {
    getAndParseTabOverview(req.body)
        .then(tabs => res.send(tabs))
        .catch(err => console.log(err));
});
poeRouter.get('/ninja', async (req, res) => {
    const chaosValues = await getAndParseAllItemPagesToChaos("Ritual");
    if (chaosValues) {
        const chaosValueEntry = {
            date: new Date(),
            chaosValues
        };
        storeNinjaValueSnapshot(chaosValueEntry);
        res.send(chaosValues);
    }
    else {
        res.status(502).send('Error fetching poe.ninja pages.');
    }
});
//# sourceMappingURL=poeRouter.js.map