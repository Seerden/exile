import express from 'express';
import bodyParser from 'body-parser';
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';

import { UserModel as User, StashModel as Stash, StashValueModel as StashValue } from '../db/db.js'
import { getAndParseTabOverview, getTabAndExtractPropsFromItems, extractTotalChaosValue, makeStackedContents } from '../helpers/api/poeApi.js';
import { stashValueEntryExists } from '../helpers/db/dbHelpers.js';
import { itemObj, currencyObj } from '../helpers/api/ninjaPages';
import { getAndParseAllItemPagesToChaos, getItemPageAndParseToChaos } from '../helpers/api/ninjaApi';

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

    let tabContents = [];
    let err;

    for (let tabIndex of indices) {
        const options = { accountName, POESESSID, league, tabIndex }
        try {
            let tab = await getTabAndExtractPropsFromItems(options)
            tabContents.push(tab)
        } catch (error) {
            err = true;
            res.status(520).send('Error fetching tab content from POE API.')
        }
    }

    let stacked = makeStackedContents(tabContents.flat())

    if (!err) {
        StashValue.findOne({accountName, league: league.toLowerCase()}, (err, doc) => {
            if (!doc) {
                const newEntry = new StashValue({league: league.toLowerCase(), accountName, value: [{date: new Date, totalChaosValue: extractTotalChaosValue(tabContents)}]})
                newEntry.save((err, saved) => {
                    saved && console.log('StashValue entry saved');
                });
            } else {
                if(doc.value.length > 0) {
                    doc.value.push({date: new Date(), totalChaosValue: extractTotalChaosValue(tabContents)})
                    doc.save();
                } else {
                    doc.value = [{date: new Date(), totalChaosValue: extractTotalChaosValue(tabContents)}]
                    doc.save();
                }
            }

            console.log('StashValue entry created or updated');
        })
        res.send(stacked)
    } else {
        console.log('Error fetching tab content from POE API.');
    }

})

poeRouter.post('/tabs/overview', (req, res) => {
    getAndParseTabOverview(req.body)
        .then(tabs => res.send(tabs))
        .catch(err => console.log(err))
})

poeRouter.get('/ninja', async (req, res) => {
    const chaosValues = await getAndParseAllItemPagesToChaos("Ritual");

    const chaosValueEntry = {
        date: new Date(),
        chaosValues
    }

    const loc = path.join(path.resolve(), '/helpers/api/ninjaChaosValues.json');
    const ninjaChaosValues = JSON.parse(readFileSync(loc));
    ninjaChaosValues.push(chaosValueEntry);
    writeFileSync(loc, JSON.stringify(ninjaChaosValues))

    res.send(chaosValues)
})