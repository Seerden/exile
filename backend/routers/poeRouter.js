import express from 'express';
import bodyParser from 'body-parser';
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';

import { 
    getAndParseTabOverview,
    getTabAndExtractPropsFromItems
} from '../helpers/api/poeApi.js';
import { itemObj, currencyObj } from '../helpers/api/ninjaPages';
import { getAndParseAllItemPagesToChaos, getItemPageAndParseToChaos } from '../helpers/api/ninjaApi';

export const poeRouter = express.Router({ mergeParams: true });
poeRouter.use(bodyParser.urlencoded({ extended: true }));
poeRouter.use(bodyParser.json());

poeRouter.get('/', (req, res) => {
    
})

poeRouter.get('/tab', (req, res) => {
    const { accountName, POESESSID, league, indices } = req.body.options;
    
    const options = {
        tabIndex: indices[0],
        accountName,
        POESESSID,
        league
    }

    getTabAndExtractPropsFromItems(options)
        .then(parsedItems => res.send(parsedItems))

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