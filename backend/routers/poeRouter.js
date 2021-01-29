import express from 'express';
import bodyParser from 'body-parser';

import { 
    getTabFromPoeApi, 
    getTabOverviewFromPoeApi,
    getItemsFromTab,
    getAndParseTabOverview 
} from '../helpers/api/poeApi.js';

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

    getItemsFromTab(options)
        .then(items => res.send(items.map(item => item.typeLine)))

})

poeRouter.post('/tabs/overview', (req, res) => {
    getAndParseTabOverview(req.body)
        .then(tabs => res.send(tabs))
        .catch(err => console.log(err))
})