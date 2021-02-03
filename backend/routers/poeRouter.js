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

poeRouter.post('/tab', (req, res) => {
    console.log(req.body);
    // const { accountName, POESESSID, league, tabIndex } = req.body;
    const options = req.body;

    getTabAndExtractPropsFromItems(options)
        .then(parsedItems => res.send(parsedItems))

})

poeRouter.post('/tabs', async (req, res) => {
    const { accountName, POESESSID, league, indices } = req.body;

    const tabContents = [];

    for (let tabIndex of indices) {
        const options = { accountName, POESESSID, league, tabIndex }
        try {
            let tab = await getTabAndExtractPropsFromItems(options)
            tabContents.push(tab)
        } catch (err) {
            res.status(500).send('Error fetching tab content')
        }
    }

    res.send(tabContents.flat())

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