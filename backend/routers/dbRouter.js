import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import 'dotenv/config.js';
import axios from 'axios';

import { 
    StashModel as Stash,
    StashValueModel as StashValue
} from '../db/db.js'

/**
 * Express router for /db routes, used as API endpoints for frontend interaction with the database.
 */
export const dbRouter = express.Router();
dbRouter.use(bodyParser.urlencoded({ limit: '5mb', parameterLimit: 10000, extended: true }));
dbRouter.use(bodyParser.json());

dbRouter.get('/', (req, res) => {
    res.send('/db/ GET successful')
})

// Stash Content interaction
//  note that POSTing stash state is handled in poeRouter, since that's where we grab the data from the POE API
dbRouter.get('/stashvalue', (req, res) => {
    StashValue.findOne({ accountName: req.query.accountName }, (err, doc) => {
        res.send(doc)
    })
})

